#!/bin/bash

# Jenna's Dashboard Local Server
cd "/Users/yoojinseon/Develop/Sourcetree/jenna-dashboard"

echo "🎀 Starting Jenna's Dashboard..."
echo "📍 Opening: http://localhost:8888"
echo ""
echo "✨ Your dashboard will open in Chrome in 2 seconds..."
echo "💡 Press Ctrl+C to stop the server when done"
echo ""

# Open Chrome after a short delay
sleep 2 && open -a "Google Chrome" "http://localhost:8888" &

# Start Python web server
python3 -m http.server 8888
