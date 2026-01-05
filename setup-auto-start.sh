#!/bin/bash

# Setup Auto-Start for Jenna's Dashboard on Login

DASHBOARD_DIR="/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"
PLIST_FILE="com.jenna.dashboard.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

echo "🎀 Setting up Jenna's Dashboard Auto-Start"
echo "========================================"

# Make scripts executable
echo "📝 Making scripts executable..."
chmod +x "$DASHBOARD_DIR/auto-start-dashboard.sh"
chmod +x "$DASHBOARD_DIR/stop-dashboard.sh"
chmod +x "$DASHBOARD_DIR/sync-calendar.sh"

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Copy plist to LaunchAgents
echo "📋 Installing LaunchAgent..."
cp "$DASHBOARD_DIR/$PLIST_FILE" "$LAUNCH_AGENTS_DIR/$PLIST_FILE"

# Unload if already loaded
launchctl unload "$LAUNCH_AGENTS_DIR/$PLIST_FILE" 2>/dev/null

# Load the LaunchAgent
echo "🚀 Loading LaunchAgent..."
launchctl load "$LAUNCH_AGENTS_DIR/$PLIST_FILE"

echo "========================================"
echo "✅ Auto-start setup complete!"
echo ""
echo "📌 Your dashboard will now:"
echo "   • Start automatically when you log in"
echo "   • Run on http://localhost:8888"
echo "   • Sync calendar every 5 minutes"
echo ""
echo "🎮 Management commands:"
echo "   • Start now: ./auto-start-dashboard.sh"
echo "   • Stop: ./stop-dashboard.sh"
echo "   • Disable auto-start: launchctl unload ~/Library/LaunchAgents/$PLIST_FILE"
echo "   • Enable auto-start: launchctl load ~/Library/LaunchAgents/$PLIST_FILE"
echo ""
echo "📊 Logs location:"
echo "   • Startup: $DASHBOARD_DIR/dashboard-launch.log"
echo "   • Runtime: $DASHBOARD_DIR/dashboard-auto-start.log"
echo "========================================"
