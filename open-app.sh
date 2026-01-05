#!/bin/bash
# Helper script to open macOS applications

APP_NAME="$1"

if [ -z "$APP_NAME" ]; then
    echo "Usage: ./open-app.sh <Application Name>"
    exit 1
fi

# Open the application
open -a "$APP_NAME"
