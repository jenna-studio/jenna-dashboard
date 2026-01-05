# 📅 Apple Calendar Integration Setup Guide

This guide will help you sync your Apple Calendar (which includes your Google Calendar) with your Pixel Dashboard!

## 🎯 Overview

Since you've already synced Google Calendar with Apple Calendar, all your events are available in the macOS Calendar app. This setup will export those events to your dashboard.

## 🚀 Quick Setup (2 methods)

### Method 1: Using the Sync Script (Easiest!)

1. **Run the sync script**:
   ```bash
   cd /Users/yoojinseon/Develop/Sourcetree/jenna-dashboard
   ./sync-calendar.sh
   ```

2. **Grant permissions** when prompted:
   - macOS will ask for permission to access Calendar
   - Click "OK" to allow

3. **Refresh your dashboard** (F5 or Cmd+R)
   - Click the "🔄 SYNC" button in the calendar widget
   - Your events should now appear!

### Method 2: Using macOS Shortcuts (Automated!)

#### Creating the Shortcut

1. **Open Shortcuts app** (Applications > Shortcuts)

2. **Create a new shortcut**:
   - Click the "+" button to create a new shortcut
   - Name it "Sync Pixel Dashboard Calendar"

3. **Add actions**:
   - Search for "Run Shell Script" action
   - Add this script:
     ```bash
     cd /Users/yoojinseon/Develop/Sourcetree/jenna-dashboard && ./sync-calendar.sh
     ```
   - Make sure "Pass input" is set to "as arguments"

4. **Save the shortcut**

#### Running the Shortcut

You can now run this shortcut:
- From the Shortcuts app
- From the menu bar (if enabled)
- From Spotlight (Cmd+Space, type "Sync Pixel Dashboard Calendar")
- Schedule it to run automatically!

#### Automating the Sync (Optional)

To automatically sync every hour:

1. In Shortcuts app, click the info button (ⓘ) on your shortcut
2. Enable "Show in Menu Bar" for quick access
3. For automatic syncing:
   - Open **Automator** (Applications > Automator)
   - Create a new "Calendar Alarm"
   - Add action: "Run Shell Script"
   - Paste: `cd /Users/yoojinseon/Develop/Sourcetree/jenna-dashboard && ./sync-calendar.sh`
   - Save it
   - In Calendar app, add it to a recurring event (every hour)

## 📋 How It Works

1. **AppleScript exports events**:
   - The script reads events from your Calendar app
   - Exports events for the next 90 days
   - Saves them to `calendar-events.json`

2. **Dashboard reads the file**:
   - When you click "🔄 SYNC" or load the page
   - Dashboard reads `calendar-events.json`
   - Displays events on the calendar

3. **Visual indicators**:
   - **Green dot (●)**: Tasks you created
   - **Yellow dot (●)**: Calendar events
   - Click any day to see event details!

## 🔧 Troubleshooting

### "Calendar events file not found"

**Solution**: Run the sync script first:
```bash
./sync-calendar.sh
```

### Permission denied error

**Solution**: Make the script executable:
```bash
chmod +x sync-calendar.sh
```

### Events not showing up

1. Check if `calendar-events.json` exists in the dashboard folder
2. Check the file has content (open it in a text editor)
3. Make sure you granted Calendar access permissions
4. Click the "🔄 SYNC" button in the dashboard

### Want to sync different calendars?

The script syncs ALL calendars by default. To sync specific calendars:

1. Open `sync-calendar.scpt` in Script Editor
2. Find the line: `set allCalendars to every calendar`
3. Replace with specific calendar:
   ```applescript
   set allCalendars to {calendar "Work", calendar "Personal"}
   ```

## 🎮 Usage Tips

### Syncing Workflow

**Best practice**: Sync whenever you add/update events

1. Add events in Apple Calendar (or they sync from Google)
2. Run `./sync-calendar.sh` (or use your Shortcut)
3. Click "🔄 SYNC" in the dashboard
4. See your updated events!

### Keyboard Shortcuts

Create a custom macOS keyboard shortcut:

1. System Settings > Keyboard > Shortcuts
2. App Shortcuts > Add (+)
3. Application: "Shortcuts"
4. Menu Title: "Sync Pixel Dashboard Calendar"
5. Keyboard shortcut: ⌘⌥C (or your choice)

### Menu Bar Quick Access

For ultra-fast syncing:

1. In Shortcuts, enable "Pin in Menu Bar"
2. Your shortcut appears in the menu bar
3. One click to sync!

## 📱 What Gets Synced

The dashboard displays:
- ✅ Event title
- ✅ Start and end time
- ✅ Location (if set)
- ✅ All-day events
- ✅ Events from the next 90 days

## 🔒 Privacy & Data

- **All data stays local** - nothing is sent to any server
- Events are stored in `calendar-events.json` in your dashboard folder
- The file is plain text JSON - you can inspect it anytime
- No internet connection required after initial setup

## 💡 Pro Tips

1. **Set up auto-sync**: Use Automator to run the sync script hourly
2. **Quick refresh**: Bind the sync shortcut to a keyboard shortcut
3. **Check sync status**: The widget shows how many events are synced
4. **Color coding**: Green dots = your tasks, Yellow dots = calendar events
5. **Click to view**: Click any day with dots to see full event details

## 🐛 Still Having Issues?

1. Check Console app for AppleScript errors
2. Make sure Calendar app is open and accessible
3. Verify the path in `sync-calendar.scpt` matches your dashboard location
4. Try running the AppleScript directly:
   ```bash
   osascript sync-calendar.scpt
   ```

## 📚 Files Reference

- `sync-calendar.scpt` - AppleScript that exports events
- `sync-calendar.sh` - Shell script wrapper
- `calendar-events.json` - Generated JSON file with events (auto-created)
- `CALENDAR-SETUP.md` - This guide!

---

**Enjoy your synced calendar! 🎉**

If everything is working, you should see:
- ✅ Green status dot in the calendar widget
- ✅ "X events synced" message
- ✅ Yellow dots on days with events
- ✅ Event details when clicking days

Happy organizing! 📅✨
