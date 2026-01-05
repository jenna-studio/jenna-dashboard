# 🚀 Complete Guide to Opening Apps from Dashboard

This guide shows you how to open **any macOS app** directly from your Pixel Dashboard!

## 📱 Quick Start: Built-in Apps (Works Immediately!)

These apps have native URL schemes and work right away:

| App | URL Scheme | Example Shortcut |
|-----|------------|------------------|
| **Mail** | `mailto:` | Name: `MAIL APP`, URL: `mailto:`, Icon: `📧` |
| **Calendar** | `x-apple-calevent://` | Name: `CALENDAR`, URL: `x-apple-calevent://`, Icon: `📅` |
| **Music** | `music://` | Name: `MUSIC`, URL: `music://`, Icon: `🎵` |
| **Notes** | `mobilenotes://` | Name: `NOTES`, URL: `mobilenotes://`, Icon: `📝` |
| **Reminders** | `x-apple-reminder://` | Name: `REMINDERS`, URL: `x-apple-reminder://`, Icon: `✅` |
| **Messages** | `sms://` | Name: `MESSAGES`, URL: `sms://`, Icon: `💬` |
| **FaceTime** | `facetime://` | Name: `FACETIME`, URL: `facetime://`, Icon: `📞` |
| **Safari** | `x-safari://` | Name: `SAFARI`, URL: `x-safari://`, Icon: `🧭` |
| **Maps** | `maps://` | Name: `MAPS`, URL: `maps://`, Icon: `🗺️` |
| **Photos** | `photos-redirect://` | Name: `PHOTOS`, URL: `photos-redirect://`, Icon: `📷` |
| **App Store** | `macappstore://` | Name: `APP STORE`, URL: `macappstore://`, Icon: `🛍️` |
| **Settings** | `x-apple.systempreferences://` | Name: `SETTINGS`, URL: `x-apple.systempreferences://`, Icon: `⚙️` |

## 🤖 AI Apps & Third-Party Apps

For AI apps and other third-party apps, you have **3 options**:

### Option 1: Use Shortcuts (Recommended) ⭐

This method works for **any installed app**!

#### Step-by-Step Setup:

1. **Open the Shortcuts app** (Applications > Shortcuts)

2. **Create a new shortcut** for each app:
   - Click the "+" button
   - Search for "Open App" in the actions
   - Drag "Open App" to the workflow
   - Select the app you want to open (e.g., "Claude", "ChatGPT", etc.)
   - Click the shortcut name and rename it to something like "OpenClaude"

3. **Get the URL scheme**:
   - After creating the shortcut, the URL will be:
   ```
   shortcuts://run-shortcut?name=OpenClaude
   ```

4. **Add to your dashboard**:
   - In your dashboard, click "+ ADD SHORTCUT" or "+ ADD AI TOOL"
   - Name: `CLAUDE`
   - URL: `shortcuts://run-shortcut?name=OpenClaude`
   - Icon: `🤖` or image URL

#### Example Shortcuts to Create:

| App Name | Shortcut Name | Dashboard URL |
|----------|---------------|---------------|
| Claude | `OpenClaude` | `shortcuts://run-shortcut?name=OpenClaude` |
| ChatGPT | `OpenChatGPT` | `shortcuts://run-shortcut?name=OpenChatGPT` |
| Chrome | `OpenChrome` | `shortcuts://run-shortcut?name=OpenChrome` |
| VSCode | `OpenVSCode` | `shortcuts://run-shortcut?name=OpenVSCode` |
| Spotify | `OpenSpotify` | `shortcuts://run-shortcut?name=OpenSpotify` |

### Option 2: Install Desktop Apps

Some AI services have desktop apps:

- **Claude Desktop**: Download from https://claude.ai/download
- **ChatGPT Desktop**: Download from https://openai.com/chatgpt/desktop/
- **Cursor (AI Code Editor)**: Download from https://cursor.sh

Once installed, create Shortcuts for them (Option 1).

### Option 3: Use Web URLs (Fallback)

If an app doesn't have a desktop version, just use the website URL:

- **Claude**: `https://claude.ai`
- **ChatGPT**: `https://chatgpt.com`
- **Gemini**: `https://gemini.google.com`
- **NotebookLM**: `https://notebooklm.google.com`
- **Perplexity**: `https://perplexity.ai`
- **Copilot**: `https://copilot.microsoft.com`

## 🎯 Recommended Setup

Here's my recommended setup for your dashboard:

### 🚀 Shortcuts Widget (Productivity Apps):
```
📧 MAIL     → mailto:
📅 CALENDAR → x-apple-calevent://
📝 NOTES    → mobilenotes://
💾 DRIVE    → https://drive.google.com
🐙 GITHUB   → https://github.com
🎵 MUSIC    → music://
```

### 🤖 AI Tools Widget:

**If you have desktop apps installed:**
```
🤖 CLAUDE      → shortcuts://run-shortcut?name=OpenClaude
💬 CHATGPT     → shortcuts://run-shortcut?name=OpenChatGPT
✨ GEMINI      → https://gemini.google.com (web only)
📚 NOTEBOOKLM  → https://notebooklm.google.com (web only)
🔍 PERPLEXITY  → https://perplexity.ai (web only)
🧠 COPILOT     → https://copilot.microsoft.com (web only)
```

**If using web versions:**
```
🤖 CLAUDE      → https://claude.ai
💬 CHATGPT     → https://chatgpt.com
✨ GEMINI      → https://gemini.google.com
📚 NOTEBOOKLM  → https://notebooklm.google.com
🔍 PERPLEXITY  → https://perplexity.ai
🧠 COPILOT     → https://copilot.microsoft.com
```

## 🎨 Pro Tips

### Tip 1: Use App Icons
For a cleaner look, use actual app icons instead of emojis:
```
https://www.google.com/s2/favicons?sz=64&domain=claude.ai
```

### Tip 2: Quick Shortcut Creation
To quickly create shortcuts for multiple apps:
1. Create one shortcut
2. Duplicate it (Right-click > Duplicate)
3. Change the app in the duplicated shortcut
4. Rename the shortcut

### Tip 3: Organize by Category
Use the two widgets to separate:
- **Shortcuts**: Productivity & System apps
- **AI Tools**: All AI-related apps

### Tip 4: Test Your Shortcuts
After adding a shortcut, click it to make sure it works!

## ❓ Troubleshooting

### "App not found" error
- Make sure the app is installed
- Check the app name is correct in the Shortcut
- Try using the web URL instead

### Shortcut doesn't open
- Open the Shortcuts app and run the shortcut manually
- Make sure the shortcut name in the URL matches exactly (case-sensitive)
- URL format: `shortcuts://run-shortcut?name=YourShortcutName` (no spaces in URL)

### Want to open a specific page in an app?
Some apps support deeper URL schemes:
- **Mail**: `mailto:email@example.com` - Opens compose window
- **Maps**: `maps://?q=coffee` - Search for coffee
- **FaceTime**: `facetime://user@example.com` - Call specific person

## 🌐 Additional Resources

- [Apple URL Schemes Documentation](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app)
- [Shortcuts User Guide](https://support.apple.com/guide/shortcuts-mac/welcome/mac)

---

**Need help?** Check which apps you have installed and I can help you set up the perfect shortcuts! 🚀
