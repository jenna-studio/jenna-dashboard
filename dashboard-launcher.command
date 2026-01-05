#!/bin/bash

# Jenna's Dashboard Launcher
# Double-click this file to open your dashboard

DASHBOARD_PATH="/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard/index.html"

# Open in Chrome app mode (no tabs, looks like a native app)
if [ -d "/Applications/Google Chrome.app" ]; then
    open -a "Google Chrome" --args --app="file://${DASHBOARD_PATH}"
else
    # Fallback to default browser if Chrome not installed
    open "${DASHBOARD_PATH}"
fi
