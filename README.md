# ✨ Pixel Dashboard ✨

A cute retro-pixelated productivity dashboard with kawaii aesthetics inspired by 90s pixel art games and early computing!

## 🎮 Features

### 📝 Daily Tasks
- Add, complete, and delete tasks
- Track total vs completed tasks
- Earn XP for creating and completing tasks
- Tasks persist in local storage

### 📅 Calendar with Apple Calendar Integration
- Monthly calendar view with real calendar events
- Syncs with Apple Calendar (includes Google Calendar if synced)
- Navigate between months
- See today highlighted
- Visual indicators: Green dots for tasks, Yellow dots for events
- Click any day to view event details (time, location, title)
- Easy sync with one click or automated with macOS Shortcuts
- See [CALENDAR-SETUP.md](CALENDAR-SETUP.md) for setup instructions

### 🚀 Shortcuts
- Quick access to your favorite apps and websites
- Customizable with names, URLs, and emojis
- Pre-loaded with common productivity apps
- Easy add/delete functionality

### 📊 Productivity Stats
- Weekly task completion chart
- Day streak counter
- Weekly task summary
- Visual bar chart with retro styling

### ✉️ Messages (Email Widget)
- Manual entry message tracker
- Subject and sender fields
- Unread/read status toggle
- Note: For display only (not connected to real email)

### 💚 Motivational Quotes
- Random inspirational quotes
- Pixel-perfect styling
- Click to generate new quotes

### ⭐ Level & XP System
- Gamified productivity
- Earn XP for completing tasks
- Level up as you progress
- Visual XP progress bar

### ⏰ Pomodoro Timer
- Focus timer with presets (5, 15, 25 minutes)
- Start, pause, and reset controls
- Earn bonus XP when timer completes
- Perfect for time-boxing work

## 🎨 Design Features

### Retro Pixel Art Aesthetic
- **Fonts**: Press Start 2P (pixel font) and DotGothic16
- **Colors**: Pastel rainbow palette
  - Pink: #FFB3D9
  - Mint: #B3F5E8
  - Purple: #D4B3FF
  - Sky Blue: #B3D9FF
  - Green: #C8F5B3
  - Yellow: #FFF5B3

### Visual Effects
- Pixelated borders and shadows
- Twinkling star background
- Smooth animations and transitions
- Hover effects on all interactive elements
- Satisfying completion animations
- Level-up celebration effects

## 🚀 How to Use

1. **Open the Dashboard**
   - Simply open `index.html` in your web browser
   - Works best in modern browsers (Chrome, Firefox, Safari, Edge)

2. **Add Tasks**
   - Type in the task input field
   - Click `+` or press Enter
   - Check boxes to mark complete
   - Click `×` to delete

3. **Sync & View Calendar**
   - Run `./sync-calendar.sh` to sync your Apple Calendar events
   - Click `🔄 SYNC` button in the calendar widget to reload events
   - Use `◄` `►` arrows to change months
   - Today is highlighted in pink
   - Green dots = tasks, Yellow dots = calendar events
   - Click any day with dots to view details
   - See [CALENDAR-SETUP.md](CALENDAR-SETUP.md) for detailed setup

4. **Create Shortcuts**
   - Click `+ ADD SHORTCUT`
   - Enter name, URL, and emoji
   - Click existing shortcuts to open in new tab
   - Hover and click `×` to delete

5. **Track Progress**
   - View weekly task chart
   - Check your streak
   - Watch your level increase
   - See XP bar fill up

6. **Add Messages**
   - Enter subject and sender
   - Click `+` to add
   - Click messages to mark as read/unread

7. **Use Timer**
   - Click preset buttons (5, 15, 25 min)
   - Press `▶` to start
   - Press `❚❚` to pause
   - Press `⟲` to reset

## 💾 Data Persistence

All your data is saved automatically:
- Tasks and their completion status
- Shortcuts you create
- Productivity stats and levels
- Timer preferences
- Message list

Data is stored in your browser's local storage and persists between sessions.

## 🎯 XP System

Earn experience points by:
- Creating a task: **+5 XP**
- Completing a task: **+10 XP**
- Finishing a timer session: **+25 XP**

Level up to unlock... well, just feel proud! 🌟

## 🎨 Customization Ideas

Want to personalize further?

1. **Change Colors**: Edit the CSS variables in `style.css` (lines 9-17)
2. **Add More Quotes**: Add to the quotes array in `script.js` (around line 464)
3. **Modify Widgets**: Comment out widgets you don't need in `index.html`
4. **Adjust XP Values**: Change XP rewards in `script.js` (search for `addXP`)

## 🐛 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Internet Explorer (Not supported)

## 🎮 Easter Egg

Try entering the Konami Code for a colorful surprise!
**⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ B A**

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- 🖥️ Desktop computers
- 💻 Laptops
- 📱 Tablets
- 📱 Mobile phones

Widgets automatically adjust to fit your screen size!

## 🔒 Privacy

All data is stored locally in your browser. Nothing is sent to any server. Your tasks, shortcuts, and stats stay on your device.

## 🎨 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom animations, grid layout, flexbox
- **Vanilla JavaScript**: No frameworks needed!
- **Google Fonts**: Press Start 2P, DotGothic16
- **Local Storage API**: Data persistence

## 💖 Made with Love

Created with pixel-perfect attention to detail and a love for retro gaming aesthetics.

Enjoy your productive pixel journey! ✨

---

**Have fun and stay productive! 🎮💖✨**
