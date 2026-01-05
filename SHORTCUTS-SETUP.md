# macOS Shortcuts Setup for Dev Tools

To make the dev tools work properly, you need to create shortcuts in the macOS Shortcuts app.

## How to Create Shortcuts

1. Open the **Shortcuts** app on your Mac
2. Click the **+** button to create a new shortcut
3. Search for "Open App" action
4. Add the "Open App" action
5. Select the app you want to open from the dropdown
6. Name the shortcut (use exact names below)
7. Repeat for each tool

## Required Shortcuts

Create these shortcuts with **EXACT** names:

### 1. Open Script Editor
- **Name**: `Open Script Editor`
- **Action**: Open App → Script Editor

### 2. Open Sublime Text
- **Name**: `Open Sublime Text`
- **Action**: Open App → Sublime Text

### 3. Open Terminal
- **Name**: `Open Terminal`
- **Action**: Open App → Terminal

### 4. Open Sourcetree
- **Name**: `Open Sourcetree`
- **Action**: Open App → Sourcetree

## Step-by-Step Example (Terminal)

1. Open Shortcuts app
2. Click **+** (New Shortcut)
3. In the search bar, type "Open App"
4. Drag "Open App" action to the right panel
5. Click on "App" and select **Terminal**
6. Click on "Untitled Shortcut" at the top
7. Rename to: **Open Terminal** (exact name!)
8. Close the shortcut (it saves automatically)

## Testing

After creating all shortcuts, test them by:
1. Opening Terminal
2. Running: `shortcuts run "Open Terminal"`
3. Terminal should activate

## How It Works

When you click a dev tool in the dashboard:
- The browser opens a URL like: `shortcuts://run-shortcut?name=Open%20Terminal`
- macOS launches the Shortcuts app
- The shortcut runs and opens the application

## Troubleshooting

**Shortcut doesn't work?**
- Check the shortcut name matches exactly (case-sensitive)
- Make sure the app is installed in /Applications
- Try running the shortcut manually in Shortcuts app first

**VS Code works but others don't?**
- VS Code uses `vscode://` URL scheme which is built-in
- Other apps need shortcuts created in Shortcuts app

**Alternative: Use AppleScript Files**
If shortcuts don't work, you can double-click the `.scpt` files in the dashboard folder:
- `open-script-editor.scpt`
- `open-sublime.scpt`
- `open-terminal.scpt`
- `open-sourcetree.scpt`
