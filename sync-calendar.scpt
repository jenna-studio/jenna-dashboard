-- Export Apple Calendar Events to JSON (Only Visible Calendars)
-- This script exports events from the next 90 days, avoiding duplicates

set dashboardPath to (path to home folder as text) & "Develop:Sourcetree:jenna-dashboard:"
set outputFile to dashboardPath & "calendar-events.json"

-- Get current date and date 90 days from now
set startDate to current date
set endDate to startDate + (90 * days)

set eventsList to {}
set uniqueEventKeys to {} -- Track unique events to avoid duplicates

tell application "Calendar"
	-- Get all calendars
	set allCalendars to every calendar

	repeat with aCalendar in allCalendars
		try
			-- Check if calendar is writable (active) - this filters out disabled calendars
			set calendarName to name of aCalendar

			-- Get events in date range from this calendar
			set calendarEvents to (every event of aCalendar whose start date ≥ startDate and start date ≤ endDate)

			repeat with anEvent in calendarEvents
				try
					set eventStart to start date of anEvent
					set eventEnd to end date of anEvent
					set eventTitle to summary of anEvent
					set eventLocation to location of anEvent
					set isAllDay to allday event of anEvent

					-- Create unique key to detect duplicates (title + start + end)
					set startKey to (year of eventStart as text) & "-" & my zeroPad(month of eventStart as integer) & "-" & my zeroPad(day of eventStart as integer) & " " & my zeroPad(hours of eventStart as integer) & ":" & my zeroPad(minutes of eventStart as integer)
					set endKey to (year of eventEnd as text) & "-" & my zeroPad(month of eventEnd as integer) & "-" & my zeroPad(day of eventEnd as integer) & " " & my zeroPad(hours of eventEnd as integer) & ":" & my zeroPad(minutes of eventEnd as integer)
					set eventKey to eventTitle & "|" & startKey & "|" & endKey

					-- Only add if not already added (avoid duplicates)
					if eventKey is not in uniqueEventKeys then
						-- Format dates as ISO 8601
						set startISO to my dateToISO(eventStart)
						set endISO to my dateToISO(eventEnd)

						-- Build JSON object (as text)
						set eventJSON to "{\"title\":\"" & my escapeJSON(eventTitle) & "\",\"start\":\"" & startISO & "\",\"end\":\"" & endISO & "\",\"location\":\"" & my escapeJSON(eventLocation) & "\",\"allDay\":" & my boolToJSON(isAllDay) & "}"

						set end of eventsList to eventJSON
						set end of uniqueEventKeys to eventKey
					end if
				on error errMsg
					-- Skip events that cause errors
				end try
			end repeat
		on error
			-- Skip calendars that cause errors
		end try
	end repeat
end tell

-- Build final JSON array
set jsonOutput to "[" & my joinList(eventsList, ",") & "]"

-- Write to file
try
	set fileRef to open for access file outputFile with write permission
	set eof fileRef to 0
	write jsonOutput to fileRef as «class utf8»
	close access fileRef

	display notification "Synced " & (count of eventsList) & " unique events" with title "Calendar Sync Complete"
on error errMsg
	try
		close access file outputFile
	end try
	display alert "Error writing calendar data" message errMsg
end try

-- Helper: Convert date to ISO 8601 format
on dateToISO(theDate)
	set y to year of theDate as integer
	set m to month of theDate as integer
	set d to day of theDate as integer
	set h to hours of theDate as integer
	set min to minutes of theDate as integer
	set s to seconds of theDate as integer

	return (y as text) & "-" & my zeroPad(m) & "-" & my zeroPad(d) & "T" & my zeroPad(h) & ":" & my zeroPad(min) & ":" & my zeroPad(s)
end dateToISO

-- Helper: Zero pad numbers
on zeroPad(n)
	if n < 10 then
		return "0" & (n as text)
	else
		return n as text
	end if
end zeroPad

-- Helper: Escape JSON strings
on escapeJSON(txt)
	if txt is missing value then return ""
	set txt to txt as text
	-- Replace backslash and quotes
	set AppleScript's text item delimiters to "\\"
	set txt to text items of txt
	set AppleScript's text item delimiters to "\\\\"
	set txt to txt as text

	set AppleScript's text item delimiters to "\""
	set txt to text items of txt
	set AppleScript's text item delimiters to "\\\""
	set txt to txt as text

	set AppleScript's text item delimiters to ""
	return txt
end escapeJSON

-- Helper: Convert boolean to JSON
on boolToJSON(b)
	if b then
		return "true"
	else
		return "false"
	end if
end boolToJSON

-- Helper: Join list with delimiter
on joinList(theList, theDelimiter)
	set oldDelimiters to AppleScript's text item delimiters
	set AppleScript's text item delimiters to theDelimiter
	set theString to theList as text
	set AppleScript's text item delimiters to oldDelimiters
	return theString
end joinList
