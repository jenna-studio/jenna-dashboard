#!/bin/bash

# Apple Calendar Sync Script for Pixel Dashboard
# This script exports calendar events from Apple Calendar to a JSON file

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the AppleScript
osascript "$SCRIPT_DIR/sync-calendar.scpt"

echo "Calendar sync complete! Events saved to calendar-events.json"
