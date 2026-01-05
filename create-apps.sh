#!/bin/bash

# Create macOS Applications from AppleScripts

DASHBOARD_DIR="/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"
cd "$DASHBOARD_DIR"

echo "🎀 Creating Dashboard Applications..."
echo "========================================"

# Create Dashboard Launcher App
echo "📱 Creating Dashboard Launcher.app..."
osacompile -o "Dashboard Launcher.app" Dashboard-Launcher.scpt

# Create Dashboard Stopper App
echo "🛑 Creating Dashboard Stopper.app..."
osacompile -o "Dashboard Stopper.app" Dashboard-Stopper.scpt

# Make scripts executable
chmod +x sync-calendar.sh

echo "========================================"
echo "✅ Applications created successfully!"
echo ""
echo "📱 Dashboard Launcher.app - Double-click to start"
echo "🛑 Dashboard Stopper.app - Double-click to stop"
echo ""
echo "📌 To add auto-start on login:"
echo "   1. Open System Settings"
echo "   2. Go to General → Login Items"
echo "   3. Click '+' button"
echo "   4. Add 'Dashboard Launcher.app'"
echo ""
echo "💡 Pro tip: Drag apps to Dock for quick access!"
echo "========================================"
