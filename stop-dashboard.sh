#!/bin/bash

# Stop Jenna's Dashboard Server and Auto-Sync

DASHBOARD_DIR="/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"
cd "$DASHBOARD_DIR"

echo "🛑 Stopping Jenna's Dashboard..."

# Stop server
if [ -f "$DASHBOARD_DIR/.server.pid" ]; then
    SERVER_PID=$(cat "$DASHBOARD_DIR/.server.pid")
    if kill -0 $SERVER_PID 2>/dev/null; then
        kill $SERVER_PID
        echo "✅ Server stopped (PID: $SERVER_PID)"
    fi
    rm "$DASHBOARD_DIR/.server.pid"
fi

# Stop auto-sync
if [ -f "$DASHBOARD_DIR/.sync.pid" ]; then
    SYNC_PID=$(cat "$DASHBOARD_DIR/.sync.pid")
    if kill -0 $SYNC_PID 2>/dev/null; then
        kill $SYNC_PID
        echo "✅ Auto-sync stopped (PID: $SYNC_PID)"
    fi
    rm "$DASHBOARD_DIR/.sync.pid"
fi

# Kill any remaining python servers on port 8888
if lsof -Pi :8888 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "🔧 Cleaning up any remaining processes on port 8888..."
    lsof -ti:8888 | xargs kill -9 2>/dev/null
fi

echo "✅ Dashboard stopped!"
