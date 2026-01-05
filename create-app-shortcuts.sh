#!/bin/bash

# Create macOS Shortcuts for opening apps via URL schemes
# This allows you to open any macOS app from your dashboard

echo "🚀 Creating macOS Shortcuts for Dashboard Apps..."
echo ""

# Array of apps to create shortcuts for
# Format: "AppName|DisplayName"
APPS=(
    "Claude|Claude"
    "ChatGPT|ChatGPT"
    "Google Chrome|Chrome"
    "Safari|Safari"
    "Mail|Mail"
    "Calendar|Calendar"
    "Notes|Notes"
    "Music|Music"
    "Spotify|Spotify"
    "Visual Studio Code|VSCode"
    "Xcode|Xcode"
    "Finder|Finder"
)

# Create shortcuts directory if it doesn't exist
SHORTCUTS_DIR="$HOME/Library/Mobile Documents/iCloud~is~workflow~my~workflows/Documents"

echo "Creating shortcuts..."
echo ""

for app_info in "${APPS[@]}"; do
    IFS='|' read -r app_name display_name <<< "$app_info"

    # Create the shortcut using shortcuts CLI
    # The URL scheme will be: shortcuts://run-shortcut?name=Open[AppName]

    cat > "/tmp/open-${display_name}.shortcut" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>WFWorkflowActions</key>
    <array>
        <dict>
            <key>WFWorkflowActionIdentifier</key>
            <string>is.workflow.actions.open.app</string>
            <key>WFWorkflowActionParameters</key>
            <dict>
                <key>WFAppIdentifier</key>
                <string>${app_name}</string>
            </dict>
        </dict>
    </array>
    <key>WFWorkflowClientVersion</key>
    <string>2605.0.5</string>
    <key>WFWorkflowIcon</key>
    <dict>
        <key>WFWorkflowIconStartColor</key>
        <integer>4282601983</integer>
    </dict>
    <key>WFWorkflowName</key>
    <string>Open${display_name}</string>
</dict>
</plist>
EOF

    echo "✅ Created shortcut for: ${display_name}"
done

echo ""
echo "📋 Installation Instructions:"
echo ""
echo "1. Open the Shortcuts app on your Mac"
echo "2. For each app you want to add, create a new shortcut:"
echo "   - Click '+' to create a new shortcut"
echo "   - Search for 'Open App' action"
echo "   - Select the app you want to open"
echo "   - Name it 'OpenAppName' (e.g., 'OpenClaude')"
echo ""
echo "3. Use these URL schemes in your dashboard:"
echo "   shortcuts://run-shortcut?name=OpenClaude"
echo "   shortcuts://run-shortcut?name=OpenChatGPT"
echo "   shortcuts://run-shortcut?name=OpenChrome"
echo ""
echo "📝 For apps not installed yet:"
echo ""
echo "Common AI Desktop Apps:"
echo "  - Claude Desktop: Download from claude.ai"
echo "  - ChatGPT Desktop: Download from openai.com"
echo "  - Cursor (AI Code Editor): Download from cursor.sh"
echo ""
echo "If an app doesn't exist, the shortcut will open it if installed,"
echo "or you can modify to open the website instead."
