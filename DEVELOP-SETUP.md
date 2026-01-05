# Develop Dashboard Setup

## Opening macOS Applications from the Browser

Due to browser security restrictions, opening native macOS applications requires one of these approaches:

### Option 1: Use Terminal (Recommended)
Run these scripts from Terminal to open each app:

```bash
# Script Editor
osascript open-script-editor.scpt

# Sublime Text
osascript open-sublime.scpt

# Terminal
osascript open-terminal.scpt

# Sourcetree
osascript open-sourcetree.scpt
```

### Option 2: Create Shortcuts (macOS Shortcuts App)
1. Open the Shortcuts app on macOS
2. Create new shortcuts that open each application
3. Name them: "Open VSCode", "Open Terminal", etc.
4. In the develop dashboard, click on apps to trigger the shortcuts

### Option 3: Double-click .scpt files
1. Navigate to the jenna-dashboard folder in Finder
2. Double-click any of the `.scpt` files to open the corresponding app

## App URLs

- **VSCode**: `vscode://` (click to open if VSCode is installed)
- **Monaco Editor Web**: Direct web URL - works from browser
- **Others**: Use the AppleScript files provided

## Quick Launch from Terminal

You can also use the helper script:
```bash
./open-app.sh "Script Editor"
./open-app.sh "Sublime Text"
./open-app.sh "Terminal"
./open-app.sh "Sourcetree"
```
