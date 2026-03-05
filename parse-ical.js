#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read command line arguments
const icalFile = process.argv[2];
const outputFile = process.argv[3];
const calendarColor = process.argv[4] || '#4285F4'; // Default Google blue
const calendarName = process.argv[5] || 'Google Calendar';

if (!icalFile || !outputFile) {
    console.error('Usage: node parse-ical.js <input.ics> <output.json> [color] [name]');
    process.exit(1);
}

// Read iCal file
const icalData = fs.readFileSync(icalFile, 'utf8');

// Parse iCal format
function parseICalDate(dateStr) {
    // Handle both date and datetime formats
    // Format: YYYYMMDD or YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ

    if (!dateStr) return null;

    // Remove TZID parameter if present
    dateStr = dateStr.replace(/^[^:]*:/, '');

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    if (dateStr.length === 8) {
        // All-day event
        return `${year}-${month}-${day}T00:00:00`;
    }

    const hour = dateStr.substring(9, 11);
    const minute = dateStr.substring(11, 13);
    const second = dateStr.substring(13, 15);

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function unescapeICalText(text) {
    if (!text) return '';
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');
}

// Parse events
const events = [];
const lines = icalData.split(/\r?\n/);
let currentEvent = null;
let currentField = null;
let currentValue = '';

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle line continuation (lines starting with space or tab)
    if (line.match(/^[ \t]/) && currentField) {
        currentValue += line.substring(1);
        continue;
    }

    // Process previous field if exists
    if (currentField && currentEvent) {
        currentEvent[currentField] = currentValue;
    }
    currentField = null;
    currentValue = '';

    if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent && currentEvent.DTSTART) {
            // Calculate if all-day event
            const isAllDay = currentEvent.DTSTART.length <= 8 || currentEvent.DTSTART.includes('VALUE=DATE');

            // Parse dates
            const startDate = parseICalDate(currentEvent.DTSTART);
            let endDate = parseICalDate(currentEvent.DTEND || currentEvent.DTSTART);

            // For all-day events, adjust end date
            if (isAllDay && endDate) {
                // iCal all-day events have exclusive end dates, so we need to subtract a day
                const endDateObj = new Date(endDate);
                endDateObj.setDate(endDateObj.getDate() - 1);
                endDate = endDateObj.toISOString().substring(0, 10) + 'T23:59:59';
            }

            events.push({
                title: unescapeICalText(currentEvent.SUMMARY || 'Untitled Event'),
                start: startDate,
                end: endDate,
                location: unescapeICalText(currentEvent.LOCATION || ''),
                allDay: isAllDay,
                calendar: calendarName,
                color: calendarColor
            });
        }
        currentEvent = null;
    } else if (currentEvent) {
        const colonIndex = line.indexOf(':');
        const semicolonIndex = line.indexOf(';');

        let fieldEnd = colonIndex;
        if (semicolonIndex !== -1 && semicolonIndex < colonIndex) {
            fieldEnd = semicolonIndex;
        }

        if (fieldEnd !== -1) {
            const field = line.substring(0, fieldEnd);
            currentValue = line.substring(colonIndex + 1);

            if (['DTSTART', 'DTEND', 'SUMMARY', 'LOCATION', 'DESCRIPTION'].includes(field)) {
                currentField = field;
            } else if (field.startsWith('DTSTART') || field.startsWith('DTEND')) {
                currentField = field.split(';')[0];
            }
        }
    }
}

// Filter events to only include upcoming events (next 180 days)
const now = new Date();
const futureLimit = new Date();
futureLimit.setDate(futureLimit.getDate() + 180);

const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= now && eventDate <= futureLimit;
});

// Sort events by start date
filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

// Write JSON file
fs.writeFileSync(outputFile, JSON.stringify(filteredEvents, null, 0));

console.log(`Parsed ${filteredEvents.length} upcoming events`);
