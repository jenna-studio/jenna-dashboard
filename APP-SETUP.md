# 🎀 Jenna's Dashboard App Setup

Your dashboard is now a standalone macOS app! Here's how to use it:

## 🚀 Quick Start

1. **Find the app**: Look for **"Jenna's Dashboard.app"** in this folder
2. **Double-click** to open your dashboard
3. The dashboard will open in Chrome app mode (looks like a native app!)

## 📍 Adding to Applications

To make it easier to access:

1. **Drag** `Jenna's Dashboard.app` to your `/Applications` folder
2. Now you can find it in Spotlight (Cmd+Space) by typing "Jenna"
3. You can also add it to your Dock by right-clicking and selecting "Keep in Dock"

## 🎨 Customizing the App Icon

Want a custom icon for your app? Here's how:

### Method 1: Using an Image
1. Find a PNG or ICNS icon you like (512x512 or larger)
2. Right-click **"Jenna's Dashboard.app"** → **Get Info**
3. Drag your icon image onto the small icon in the top-left corner
4. Done! Your app now has a custom icon

### Method 2: Create Your Own Icon
1. Take a screenshot of your dashboard or create an image
2. Use **Preview** to resize it to 512x512 pixels
3. Follow the steps in Method 1

## 🔑 Keyboard Shortcut (Optional)

Create a keyboard shortcut to open your dashboard:

1. Open **System Settings** → **Keyboard** → **Keyboard Shortcuts**
2. Click **App Shortcuts** → **+** button
3. Select **"Jenna's Dashboard"** as the application
4. Set your shortcut (e.g., `Cmd+Shift+D`)
5. Now press your shortcut to open the dashboard instantly!

## 🌟 How It Works

The app opens your dashboard in Chrome's app mode, which:
- ✅ Removes browser tabs and address bar
- ✅ Makes it look like a native macOS app
- ✅ Keeps it separate from your regular Chrome windows
- ✅ Works even if Safari is your default browser

If Chrome isn't installed, it will open in Safari instead.

## 🔧 Updating the Dashboard

When you update the dashboard files (HTML, CSS, JS):
1. The app automatically uses the latest version
2. Just refresh the page (Cmd+R) to see changes
3. No need to rebuild the app!

## 📦 Distributing to Other Macs

Want to use this on another Mac?

1. Copy the entire `jenna-dashboard` folder
2. The app will work on any Mac (no installation needed!)
3. Just double-click to open

## ❓ Troubleshooting

### App won't open
- Right-click the app → **Open** (bypasses security warning for first launch)
- Check that `index.html` is in the same folder as the app

### Opens in browser instead of app mode
- Install Google Chrome for the best experience
- Or the app will use Safari as a fallback

### Want to open in a specific browser?
Edit `open-dashboard.scpt` and change the browser name in line 14

## 🎯 Pro Tips

1. **Add to Menu Bar**: Use apps like "Bartender" to add a menu bar shortcut
2. **Launch on Startup**: System Settings → Users & Groups → Login Items → Add the app
3. **Multiple Monitors**: Open on your secondary monitor for quick access
4. **Fullscreen Mode**: Press `Fn+F` or click the green button to go fullscreen

---

Enjoy your beautiful pixel dashboard! ✨
