# 📋 Changelog — Universal Browser

All notable changes to Universal Browser will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/).

---

## [6.0.0] — 2026-09-26

### 🎉 Major Release — AI-Native Browser

#### ✨ Added
- **AI Assistant Panel** — ChatGPT-powered sidebar
  - Page summarization
  - Ask This Page (Q&A with context)
  - Translation to 19 languages
  - Voice input via Web Speech API
  - Text-to-speech for AI responses
- **Workspaces** — Multiple projects with auto-saved tabs
- **Tab Search** (Ctrl+Shift+A) + **Recently Closed** (Ctrl+Shift+T)
- **Tab Groups** with color coding
- **Notes System** — Save pages, text, tags, search, export
- **Backup & Restore** — Plain JSON + Encrypted (.ubk)
- **Onboarding Tour** — 7-step welcome guide
- **Help Panel** (F1) — Shortcuts, tips, about
- **Performance Dashboard** (Ctrl+Shift+P)
  - CPU, RAM, tabs monitor
  - CPU history chart
  - Memory cleanup
  - Tab sleeping (10 min idle)
- **Focus Mode** (Ctrl+Shift+F) — Distraction-free
- **Privacy & Security Center** (Ctrl+Shift+I)
  - Anti-fingerprinting (Canvas, WebGL, Audio)
  - DNS-over-HTTPS (Cloudflare)
  - HTTPS auto-upgrade
  - Third-party cookie blocking
  - DNT + GPC headers
  - Privacy score dashboard
- **Extensions System** — Load Chrome extensions
- **10 Search Engines** — Google, DDG, Bing, Brave, Yandex, Baidu, Yahoo, Ecosia, Startpage, Perplexity

#### 🔧 Changed
- Complete UI redesign (Catppuccin theme)
- Improved ad blocker (250+ domains)
- Better YouTube ad skip
- Smoother animations
- Better error messages
- New sidebar layout

#### 🐛 Fixed
- Sidebar panel buttons (bulletproof event attachment)
- Copy/paste on Mac (Edit menu)
- DevTools accessibility (F12)
- Modal overlap issues
- Toast notifications

---

## [5.0.0] — 2026-09-25

### Added
- Rebranded to "Universal Browser"
- Adhoc signing for macOS
- Entitlements configuration
- Install instructions in landing page

---

## [4.0.0] — 2026-09-24

### Added
- Advanced ad blocker
- YouTube SponsorBlock
- Password manager
- Statistics dashboard
- 6 search engines
- Picture-in-Picture
- Accent color picker

---

## [3.0.0] — 2026-09-22

### Added
- Command Palette (Ctrl+K)
- Reading Mode
- Screenshot tool
- Find in Page
- Downloads tracker
- Incognito mode
- Pinned tabs
- Dark/Light theme

---

## [2.0.0] — 2026-09-18

### Added
- Vertical sidebar tabs
- Multiple tabs
- URL bar
- Back/Forward/Reload
- Bookmarks
- History
- Ad blocker (200+ domains)
- YouTube ad skip

---

## [1.0.0] — 2026-09-15

### Initial Release
- Basic Electron browser
- Start page
- Shortcuts
- Landing page
- GitHub Pages
- Windows/Mac builds