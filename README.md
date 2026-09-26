# 🌐 Universal Browser

> **Ad-free · Fast · Private · AI-Native · Crafted with ❤️ by Shubham Maurya**

Universal Browser is a next-generation browser built on Electron that combines ad-blocking, AI assistance, privacy protection, and productivity tools in one place.

![Version](https://img.shields.io/badge/version-6.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)

---

## ✨ Features

### 🛡️ Ad-Free Browsing
- **250+ ad domains** blocked at network level
- **YouTube ad auto-skip** (pre-roll, mid-roll, overlay)
- **SponsorBlock** integration
- **Anti-adblock bypass**
- Live shield counter

### 🤖 AI-Native
- **AI Assistant panel** (ChatGPT-powered)
- **Page summarization** — one click
- **Ask This Page** — Q&A with page context
- **Translation** — 19 languages
- **Voice input** (Web Speech API)
- **Text-to-speech** — read AI responses

### 🔒 Privacy-First
- **Anti-fingerprinting** (Canvas, WebGL, Audio)
- **DNS-over-HTTPS** (Cloudflare 1.1.1.1)
- **HTTPS auto-upgrade**
- **Third-party cookie blocking**
- **DNT + GPC headers**
- **Privacy dashboard** with score

### 📁 Workspaces
- **Multiple workspaces** for different projects
- **Tab auto-save** per workspace
- **Color-coded** workspaces
- **Quick switching**

### 📑 Advanced Tabs
- **Vertical sidebar tabs**
- **Tab search** (Ctrl+Shift+A)
- **Recently closed** (Ctrl+Shift+T)
- **Tab groups** with colors
- **Pinned tabs**
- **Sleeping tabs** (auto-freeze)

### 📝 Notes System
- **Save pages** to notes
- **Save selected text**
- **Tags** and **search**
- **Export** to JSON
- **Pin important** notes

### 📊 Performance
- **Live dashboard** (CPU, RAM, tabs)
- **Focus mode** (distraction-free)
- **Tab sleeping** (10 min idle)
- **Memory cleanup**
- **CPU history chart**

### 💾 Backup & Restore
- **Export all data** (JSON)
- **Encrypted backup** (.ubk)
- **Import from file**
- **Clear all data**

### 🧩 Extensions
- **Load Chrome extensions** from folder
- **Manifest V3** support
- **Extension list** with info
- **Enable/remove**

### 🎯 More
- **10 search engines** (Google, DDG, Bing, Brave, Yandex, Baidu, Yahoo, Ecosia, Startpage, Perplexity)
- **Reading Mode** — clean articles
- **Screenshot tool**
- **Picture-in-Picture**
- **Download manager**
- **Password manager** (local)
- **Command palette** (Ctrl+K)
- **Onboarding tour**
- **Help panel** (F1)
- **Dark/Light theme**
- **Custom accent color**

---

## 📥 Download

| Platform | Link |
|----------|------|
| 🍎 **Mac (Apple Silicon)** | [Download .dmg](https://github.com/sm1646767-pshyco/Shubham-maurya-browser/releases) |
| 🍎 **Mac (Intel)** | [Download .dmg](https://github.com/sm1646767-pshyco/Shubham-maurya-browser/releases) |
| 🪟 **Windows** | [Download .exe](https://github.com/sm1646767-pshyco/Shubham-maurya-browser/releases) |
| 🐧 **Linux** | [Download AppImage](https://github.com/sm1646767-pshyco/Shubham-maurya-browser/releases) |

🌐 **Website:** [sm1646767-pshyco.github.io/Shubham-maurya-browser](https://sm1646767-pshyco.github.io/Shubham-maurya-browser/)

---

## ⌨️ Keyboard Shortcuts

### Navigation
| Shortcut | Action |
|----------|--------|
| `Ctrl+T` | New Tab |
| `Ctrl+W` | Close Tab |
| `Ctrl+L` | Focus URL Bar |
| `Ctrl+R` | Reload |
| `Alt+←/→` | Back/Forward |

### Tabs
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+A` | Tab Search |
| `Ctrl+Shift+T` | Recently Closed |
| `Ctrl+Shift+E` | Extensions |

### AI & Tools
| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Command Palette |
| `Ctrl+F` | Find in Page |
| `Ctrl+Shift+N` | Notes Panel |
| `Ctrl+Shift+B` | Backup & Restore |
| `Ctrl+Shift+R` | Reading Mode |
| `Ctrl+Shift+S` | Screenshot |
| `Ctrl+Shift+V` | Voice Input |
| `Ctrl+Shift+P` | Performance |
| `Ctrl+Shift+I` | Privacy Dashboard |
| `Ctrl+Shift+F` | Focus Mode |
| `F1` | Help |
| `F11` | Fullscreen |
| `F12` | DevTools |

---

## 🛠️ Tech Stack

- **Electron 31** — Desktop framework
- **Chromium** — Rendering engine
- **Vanilla JavaScript** — No framework overhead
- **OpenAI GPT-4o-mini** — AI features
- **Web Speech API** — Voice
- **Custom Ad Blocker** — 250+ domains

---

## 🚀 Build From Source

```bash
# Clone
git clone https://github.com/sm1646767-pshyco/Shubham-maurya-browser.git
cd Shubham-maurya-browser

# Install
npm install

# Setup API key
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# Run in development
npm start

# Build for production
npm run build:mac   # Mac
npm run build:win   # Windows
npm run build:linux # Linux 
🍎 macOS
App unsigned hai, isliye macOS pehli baar warning dega. Ye normal hai.

Fix (Terminal):
sudo xattr -cr /Applications/Universal\ Browser.app