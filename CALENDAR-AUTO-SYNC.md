# 📅 Automatic Calendar Sync Setup

Your dashboard now has **automatic background calendar syncing**! This means your Apple Calendar events are always up-to-date, even when using the dashboard as a standalone app.

## ✨ How It Works

1. **Background Service**: A macOS LaunchAgent runs in the background
2. **Auto-Sync**: Every 5 minutes, it fetches your latest calendar events
3. **Seamless Updates**: Your dashboard shows fresh events without manual refresh
4. **Always Running**: Starts automatically when you log in

## 🎯 Service Status

### Check if it's running:
```bash
launchctl list | grep calendar-sync
```

If you see output like `81687	0	com.jenna.calendar-sync`, it's running! ✅

### Check last sync time:
```bash
ls -lh ~/Develop/Sourcetree/jenna-dashboard/calendar-events.json
```

The timestamp shows when events were last updated.

### View sync logs:
```bash
tail -20 /tmp/calendar-sync.log
```

Shows recent sync activity.

## 🔧 Managing the Service

### Stop the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
```

### Start the service:
```bash
launchctl load ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
```

### Restart the service:
```bash
launchctl unload ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
launchctl load ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
```

### Run sync manually (instant update):
```bash
~/Develop/Sourcetree/jenna-dashboard/sync-calendar.sh
```

## ⚙️ Configuration

**Service file location:**
`~/Library/LaunchAgents/com.jenna.calendar-sync.plist`

**Current settings:**
- **Sync interval**: 5 minutes (300 seconds)
- **Auto-start**: Yes (runs on login)
- **Log location**: `/tmp/calendar-sync.log`

### Change sync frequency:

1. Edit the plist file:
   ```bash
   nano ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
   ```

2. Change the `<integer>300</integer>` line to:
   - `60` = 1 minute (more frequent)
   - `600` = 10 minutes (less frequent)
   - `1800` = 30 minutes (very infrequent)

3. Restart the service:
   ```bash
   launchctl unload ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
   launchctl load ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
   ```

## 🎀 Dashboard Usage

With auto-sync running, your dashboard works perfectly as:

1. **Standalone App**: Open `Jenna's Dashboard.app` anytime
2. **Plash Wallpaper**: Set it as interactive wallpaper
3. **Chrome Bookmark**: Save it as a Chrome app

**All methods now sync automatically!** 🎉

## 🔍 Troubleshooting

### Calendar events not updating?

1. **Check service is running:**
   ```bash
   launchctl list | grep calendar-sync
   ```

2. **Check for errors:**
   ```bash
   cat /tmp/calendar-sync-error.log
   ```

3. **Test manual sync:**
   ```bash
   ~/Develop/Sourcetree/jenna-dashboard/sync-calendar.sh
   ```

4. **Restart the service:**
   ```bash
   launchctl unload ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
   launchctl load ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
   ```

### Remove the service completely:

```bash
launchctl unload ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
rm ~/Library/LaunchAgents/com.jenna.calendar-sync.plist
```

## 🌟 Benefits

- ✅ Dashboard works as standalone app
- ✅ No manual sync button needed
- ✅ Always shows latest events
- ✅ Works offline (shows last synced data)
- ✅ Lightweight (runs in background)
- ✅ Auto-starts on Mac startup

## 📝 Notes

- The service runs even when dashboard is closed
- Uses minimal system resources
- Respects your Apple Calendar permissions
- Events are stored in `calendar-events.json` (gitignored for privacy)
- If you move the dashboard folder, update the path in the plist file

---

Enjoy your always-synced dashboard! 🎀✨
