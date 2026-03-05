#!/bin/bash

# Google Calendar iCal Sync Script for Pixel Dashboard
# This script fetches calendar events from multiple Google Calendar iCal URLs

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
OUTPUT_FILE="$SCRIPT_DIR/calendar-events.json"
TEMP_JSON_DIR="$SCRIPT_DIR/temp-json"
TEMP_ICS_DIR="$SCRIPT_DIR/temp-ics"

# Create temp directories
mkdir -p "$TEMP_JSON_DIR" "$TEMP_ICS_DIR"

# iCal URLs with their corresponding colors and names
declare -a CALENDARS=(
    "https://calendar.google.com/calendar/ical/jinseony0622%40gmail.com/private-2edcd5d4e13833889ad240302fd07533/basic.ics|#ff69b4|Events"
    "https://calendar.google.com/calendar/ical/db3ddc29147ee562ba10b6741e53fae0cedbce5bcfb0c2b575b9e2becd3de5e0%40group.calendar.google.com/private-f1759cedf9afff7bd03f440ff29a7088/basic.ics|#4285F4|Other"
    "https://calendar.google.com/calendar/ical/6e4caeb7924b2688c8e4b86ef49a146b3c41bc70ffcf19d3a789e513cfd596f5%40group.calendar.google.com/private-657af178d3f3cabf6d9d76c71f77bc29/basic.ics|#32cd32|Hospital"
    "https://calendar.google.com/calendar/ical/572038151b7ad7bfdfe28d3ed0b4c95fdac29a4ad0da8a8d7d4a8657d1686d08%40group.calendar.google.com/private-393325a0f6944fc5c4910f78ac29da23/basic.ics|#4169e1|Exam"
    "https://calendar.google.com/calendar/ical/428c55dddcaf4126ab7b27d4f7510afe6be4775928b56a84723063c1be79717f%40group.calendar.google.com/private-3e969c9c2bc21ff11d381bfdb2b37b42/basic.ics|#4CAAB3|Travel"
    "https://calendar.google.com/calendar/ical/df8adce0c2d846931a58a96b46bce98790ae1ad67fa7fe674b03c964b9495253%40group.calendar.google.com/private-8f5128f38eca3378b6c80b238b181c1a/basic.ics|#9D7AB8|Work"
    "https://calendar.google.com/calendar/ical/jinseony0622%40kookmin.ac.kr/private-fcf9768fa2fea2f657d2fee040d1bfbb/basic.ics|#49A5C8|University"
    "https://calendar.google.com/calendar/ical/ko.south_korea%23holiday%40group.v.calendar.google.com/public/basic.ics|#7F8285|대한민국의 휴일"
)

echo "Fetching ${#CALENDARS[@]} calendars from Google..."

# Fetch and parse each calendar separately
INDEX=0
for CAL_DATA in "${CALENDARS[@]}"; do
    IFS='|' read -r URL COLOR NAME <<< "$CAL_DATA"
    TEMP_ICS="$TEMP_ICS_DIR/calendar-$INDEX.ics"
    TEMP_JSON="$TEMP_JSON_DIR/calendar-$INDEX.json"

    echo "Fetching: $NAME ($COLOR)"
    curl -s "$URL" -o "$TEMP_ICS"

    if [ -f "$TEMP_ICS" ]; then
        # Parse this calendar with its specific color
        node "$SCRIPT_DIR/parse-ical.js" "$TEMP_ICS" "$TEMP_JSON" "$COLOR" "$NAME"
    fi

    INDEX=$((INDEX + 1))
done

# Combine all JSON files into one
echo "Combining calendars..."
echo "[" > "$OUTPUT_FILE"

FIRST=true
for JSON_FILE in "$TEMP_JSON_DIR"/*.json; do
    if [ -f "$JSON_FILE" ]; then
        CONTENT=$(cat "$JSON_FILE")
        # Remove outer brackets
        CONTENT=${CONTENT#[}
        CONTENT=${CONTENT%]}

        if [ "$FIRST" = true ]; then
            echo "$CONTENT" >> "$OUTPUT_FILE"
            FIRST=false
        else
            if [ -n "$CONTENT" ]; then
                echo ",$CONTENT" >> "$OUTPUT_FILE"
            fi
        fi
    fi
done

echo "]" >> "$OUTPUT_FILE"

# Clean up temp files
rm -rf "$TEMP_ICS_DIR" "$TEMP_JSON_DIR"

# Count events
EVENT_COUNT=$(grep -o '"title"' "$OUTPUT_FILE" | wc -l | xargs)
echo "Calendar sync complete! $EVENT_COUNT events saved to calendar-events.json"
