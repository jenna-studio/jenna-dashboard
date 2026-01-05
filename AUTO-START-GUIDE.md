# 🎀 Jenna's Dashboard - Auto-Start Guide

## ✨ Quick Setup (One-Time)

Run the setup script to enable auto-start on login:

```bash
./setup-auto-start.sh
```

This will:
- ✅ Install a LaunchAgent that runs on login
- ✅ Start the web server automatically
- ✅ Open your dashboard in Chrome
- ✅ Sync calendar events every 5 minutes

---

## 🎮 Manual Controls

### Start Dashboard Now
```bash
./auto-start-dashboard.sh
```

### Stop Dashboard
```bash
./stop-dashboard.sh
```

### Check if Running
```bash
lsof -i :8888
```

---

## 🔧 Managing Auto-Start

### Disable Auto-Start on Login
```bash
launchctl unload ~/Library/LaunchAgents/com.jenna.dashboard.plist
```

### Enable Auto-Start on Login
```bash
launchctl load ~/Library/LaunchAgents/com.jenna.dashboard.plist
```

### Remove Auto-Start Completely
```bash
launchctl unload ~/Library/LaunchAgents/com.jenna.dashboard.plist
rm ~/Library/LaunchAgents/com.jenna.dashboard.plist
```

---

## 📊 Features

### Auto-Sync Calendar
- 📅 Syncs calendar events every 5 minutes
- 🔄 Updates `calendar-events.json` automatically
- ⚡ No manual sync needed!

### Persistent Server
- 🌐 Server runs on `http://localhost:8888`
- 💻 Starts automatically on login
- 🔒 Only accessible locally (secure)

### Smart Management
- 🧠 Detects if server is already running
- 🚫 Won't start duplicate servers
- 📝 Logs all activity for debugging

---

## 📂 Log Files

- **Startup Log**: `dashboard-launch.log`
- **Runtime Log**: `dashboard-auto-start.log`
- **Error Log**: `dashboard-launch-error.log`

View logs:
```bash
tail -f dashboard-auto-start.log
```

---

## 🆘 Troubleshooting

### Dashboard Won't Open
```bash
# Check if server is running
lsof -i :8888

# If not, start manually
./auto-start-dashboard.sh
```

### Port Already in Use
```bash
# Stop everything
./stop-dashboard.sh

# Start again
./auto-start-dashboard.sh
```

### Calendar Not Syncing
```bash
# Run sync manually
./sync-calendar.sh

# Check sync script permissions
chmod +x sync-calendar.sh
```

### Reset Everything
```bash
# Stop dashboard
./stop-dashboard.sh

# Kill any processes on port 8888
lsof -ti:8888 | xargs kill -9

# Remove PIDs
rm .server.pid .sync.pid

# Start fresh
./auto-start-dashboard.sh
```

---

## 🎯 Usage Workflow

### First Time Setup
1. Run `./setup-auto-start.sh`
2. Restart your Mac (or wait for next login)
3. Dashboard opens automatically!

### Daily Use
- 🌅 Login to your Mac → Dashboard opens automatically
- 📅 Calendar syncs every 5 minutes
- ✨ Always fresh and up-to-date
- 🌙 Close browser when done (server keeps running)

### When Finished for the Day
- Option 1: Leave it running (uses minimal resources)
- Option 2: Run `./stop-dashboard.sh` to shut down

---

## ⚙️ Advanced Configuration

### Change Sync Interval
Edit `auto-start-dashboard.sh` line 49:
```bash
sleep 300  # Change 300 to desired seconds
```

### Change Port
Edit `auto-start-dashboard.sh` and change all instances of `8888` to your desired port.

### Auto-Open on Different Browser
Edit `auto-start-dashboard.sh` line 33-38 and change "Google Chrome" to your preferred browser.

---

## 🎨 What's Running

When auto-start is enabled:
1. 🐍 Python HTTP Server (port 8888)
2. 🔄 Calendar Sync Loop (every 5 minutes)
3. 🌐 Chrome with Dashboard (http://localhost:8888)

---

## 💡 Pro Tips

1. **Bookmark the dashboard**: `http://localhost:8888`
2. **Add to Dock**: Drag Chrome window to Dock for quick access
3. **Multiple Monitors**: Leave dashboard on second monitor
4. **Mobile Access**: Use same WiFi + your Mac's local IP
5. **Quick Restart**: `./stop-dashboard.sh && ./auto-start-dashboard.sh`

---

## 🎀 Enjoy Your Always-Live Dashboard!

Your dashboard is now:
- ✅ Always running
- ✅ Always synced
- ✅ Always ready
- ✅ Always awesome! 🌟
