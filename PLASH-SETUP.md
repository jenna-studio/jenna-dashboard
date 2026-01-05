# 🎨 Jenna's Dashboard as Interactive Wallpaper with Plash

Turn your dashboard into a beautiful, interactive desktop wallpaper! Your widgets will be right on your desktop.

## ⚡ Quick Fix: Not Interactive?

If your dashboard isn't clickable or scrollable:
1. Click the **Plash icon** in your menu bar
2. **Enable "Browsing Mode"** ✅
3. Done! Now it's fully interactive

## 🚀 Quick Setup

### Step 1: Install Plash

1. **Download Plash**: https://sindresorhus.com/plash
2. Or install via Homebrew:
   ```bash
   brew install --cask plash
   ```

### Step 2: Configure Plash

1. **Open Plash** from Applications
2. Click the Plash icon in your menu bar
3. Click **"Open URL"**
4. Enter the **full file path** to your dashboard:

   ```text
   file:///Users/yoojinseon/Develop/Sourcetree/jenna-dashboard/index.html
   ```

5. **Initial settings** (you'll adjust these in Step 3):
   - **Reload Interval**: 5 minutes (to keep calendar updated)
   - **Opacity**: 100% for full visibility

### Step 3: Enable Browsing Mode (IMPORTANT!)

1. Click the **Plash menu bar icon**
2. **Check "Browsing Mode"** ✅
3. Without this, the dashboard won't be interactive or scrollable!

### Step 4: Position Your Dashboard

1. Plash will show your dashboard on the desktop
2. Use **Cmd+Drag** to reposition it
3. Resize the window to fit your screen perfectly
4. **Cmd+Scroll** or use trackpad to scroll through widgets

## 🎯 Recommended Settings

For the best experience:

### Plash Settings (Menu Bar Icon)
- ✅ **Launch at Login** - Dashboard loads on startup
- ✅ **Show on All Spaces** - Available on all desktops
- ✅ **Reload Interval**: 5 minutes - Keep calendar synced
- ✅ **Opacity**: 100% - Fully visible
- ✅ **Browsing Mode**: ON - **MUST be enabled for interactivity!**

**Important**: With Browsing Mode ON, the dashboard will cover your desktop icons. See "Desktop Arrangement" below for the best setup.

### Desktop Arrangement
- Move your desktop icons to the right side
- Let the dashboard occupy the left/center area
- Or use a second monitor for the full dashboard

## 🌟 Benefits of Using Plash

1. **Always Visible**: Your dashboard is literally your wallpaper
2. **Fully Interactive**: Click widgets, add tasks, check calendar
3. **Auto-Updates**: Refreshes automatically to show calendar changes
4. **Persistent**: Never accidentally closes like an app
5. **Beautiful**: Turns your desktop into a productivity center

## 🎨 Optimization Tips

### 1. Adjust Dashboard Size for Desktop
If you want the dashboard optimized for desktop wallpaper use, you can:
- Increase font sizes for better visibility
- Adjust widget layout for your screen resolution
- Make widgets more spread out

### 2. Transparency Effects
In Plash settings, try different opacity levels:
- **100%**: Full visibility (recommended)
- **90%**: Slight transparency (aesthetic)
- **80%**: More subtle, icons more visible

### 3. Multiple Monitors
If you have multiple monitors:
- Use Plash on your secondary monitor for full dashboard view
- Keep your main monitor for work windows
- Perfect setup for productivity!

### 4. Desktop Icon Management
Since the dashboard will be behind icons:
- Keep your desktop clean
- Use folders to organize desktop files
- Or move all icons to the right side of the screen

## 🔧 Updating the Dashboard

When you update any files:
1. Plash will auto-reload based on your interval
2. Or manually reload: Click Plash menu → **Reload**
3. Changes appear immediately on your desktop!

## 🔄 Auto-Sync with Calendar

Your calendar will automatically update because:
1. The `sync-calendar.sh` script runs periodically
2. Plash reloads every 5 minutes
3. Your events are always current!

## ⚡ Performance Tips

To keep your Mac running smoothly:
- Set reload interval to 5-10 minutes (not every second)
- Close the Plash window if you need maximum performance
- Plash is very lightweight, won't slow down your Mac

## 📱 Alternative: Use Both!

You can use BOTH the app and Plash:
- **Plash**: For when you're at your desk, always-on display
- **App**: For quick access when you're away from desktop
- They both use the same files, so data syncs!

## 🎮 Desktop Interactions

With Plash, everything still works:
- ✅ Add and complete tasks
- ✅ Check calendar events
- ✅ Open shortcuts and dev tools
- ✅ Take notes
- ✅ Use timer and HSK words
- ✅ All widgets are fully interactive!

## ❓ Troubleshooting

### Dashboard is NOT interactive or scrollable ⚠️
**This is the most common issue!**
- Click Plash menu bar icon
- **Enable "Browsing Mode"** (check the box)
- Now you can click buttons, scroll, and interact with everything
- Note: With Browsing Mode ON, desktop icons behind the dashboard won't be clickable

### Dashboard doesn't appear
- Make sure the file path is correct
- Use `file:///` (three slashes) at the start
- Check Plash is running in menu bar

### Dashboard is too small/large
- In Plash: Cmd+Plus/Minus to zoom
- Or adjust in Plash settings → Web View Scale
- Set to fit your screen perfectly

### Can't scroll through widgets
- Enable "Browsing Mode" in Plash
- Use trackpad two-finger scroll
- Or use Cmd+Scroll with mouse

### Want desktop icons to be clickable too
**Problem**: With Browsing Mode ON, desktop icons are blocked
**Solutions**:
1. **Best**: Arrange icons to the side, dashboard on the other side
2. **Alternative**: Use the standalone app instead (double-click `Jenna's Dashboard.app`)
3. **Hybrid**: Resize Plash window to only cover part of your screen

### Want to temporarily hide dashboard
- Click Plash icon → **Hide**
- Or set a keyboard shortcut in Plash settings

## 🌈 Final Result

Your desktop becomes a beautiful, functional workspace with:
- 🎨 Aesthetic pastel background
- 📝 Interactive task manager
- 📅 Live calendar
- 🚀 Quick-launch shortcuts
- 🤖 AI tools at your fingertips
- ⏰ Pomodoro timer
- 🇨🇳 HSK vocabulary practice

All right on your desktop wallpaper! ✨

---

**Pro Tip**: Take a screenshot of your desktop and share your aesthetic setup! 📸
