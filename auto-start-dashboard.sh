#!/bin/bash

# Jenna's Dashboard Auto-Start Script
# Starts server, syncs calendar, and opens dashboard

DASHBOARD_DIR="/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"
cd "$DASHBOARD_DIR"

# Log file for debugging
LOG_FILE="$DASHBOARD_DIR/dashboard-auto-start.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "========================================"
echo "🎀 Jenna's Dashboard Auto-Start"
echo "📅 $(date)"
echo "========================================"

# Check if server is already running
if lsof -Pi :8888 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Server already running on port 8888"
    SERVER_RUNNING=true
else
    echo "🚀 Starting Python web server on port 8888..."
    SERVER_RUNNING=false
fi

# Sync calendar events first
echo "📅 Syncing calendar events..."
./sync-calendar.sh

# Start server in background if not running
if [ "$SERVER_RUNNING" = false ]; then
    python3 -m http.server 8888 > /dev/null 2>&1 &
    SERVER_PID=$!
    echo "✅ Server started (PID: $SERVER_PID)"

    # Save PID for later management
    echo $SERVER_PID > "$DASHBOARD_DIR/.server.pid"

    # Wait a moment for server to start
    sleep 2
fi

# Open dashboard in Chrome
echo "🌐 Opening dashboard in Chrome..."
if [ -d "/Applications/Google Chrome.app" ]; then
    # Check if dashboard is already open
    if ! osascript -e 'tell application "Google Chrome" to return URL of active tab of window 1' 2>/dev/null | grep -q "localhost:8888"; then
        open -a "Google Chrome" "http://localhost:8888"
        echo "✅ Dashboard opened in Chrome"
    else
        echo "✅ Dashboard already open in Chrome"
    fi
else
    open "http://localhost:8888"
    echo "✅ Dashboard opened in default browser"
fi

# Setup automatic calendar sync every 5 minutes
echo "⏰ Setting up auto-sync (every 5 minutes)..."

# Create sync loop script
cat > "$DASHBOARD_DIR/.auto-sync-loop.sh" << 'EOF'
#!/bin/bash
DASHBOARD_DIR="/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"
while true; do
    sleep 300  # 5 minutes
    cd "$DASHBOARD_DIR"
    ./sync-calendar.sh >> "$DASHBOARD_DIR/dashboard-auto-start.log" 2>&1
    echo "🔄 Auto-synced at $(date)" >> "$DASHBOARD_DIR/dashboard-auto-start.log"
done
EOF

chmod +x "$DASHBOARD_DIR/.auto-sync-loop.sh"

# Start auto-sync in background
"$DASHBOARD_DIR/.auto-sync-loop.sh" &
SYNC_PID=$!
echo $SYNC_PID > "$DASHBOARD_DIR/.sync.pid"

echo "✅ Auto-sync started (PID: $SYNC_PID)"
echo "========================================"
echo "✨ Dashboard is now live and synced!"
echo "📍 URL: http://localhost:8888"
echo "📊 Calendar syncs every 5 minutes"
echo "🛑 To stop: ./stop-dashboard.sh"
echo "========================================"
