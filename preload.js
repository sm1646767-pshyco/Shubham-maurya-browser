const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserAPI', {
  // ═══════════════════════════════════════════════
  //   AD BLOCKER
  // ═══════════════════════════════════════════════
  getBlockedCount: () => ipcRenderer.invoke('get-blocked-count'),
  resetBlockedCount: () => ipcRenderer.invoke('reset-blocked-count'),
  getStats: () => ipcRenderer.invoke('get-stats'),
  incrementSites: () => ipcRenderer.invoke('increment-sites'),
  onBlockedCount: (cb) => ipcRenderer.on('blocked-count', (e, n) => cb(n)),
  onOpenNewTab: (cb) => ipcRenderer.on('open-new-tab', (e, url) => cb(url)),
  notifyWebviewReady: (id) => ipcRenderer.send('webview-ready', id),

  // ═══════════════════════════════════════════════
  //   WINDOW CONTROLS
  // ═══════════════════════════════════════════════
  toggleFullscreen: () => ipcRenderer.invoke('window-toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('window-is-fullscreen'),

  // ═══════════════════════════════════════════════
  //   SCREENSHOT + READING MODE
  // ═══════════════════════════════════════════════
  saveScreenshot: (dataURL) => ipcRenderer.invoke('save-screenshot', dataURL),
  extractArticle: () => ipcRenderer.invoke('extract-article'),

  // ═══════════════════════════════════════════════
  //   AI FEATURES (Day 1-4)
  // ═══════════════════════════════════════════════
  aiChat: (messages) => ipcRenderer.invoke('ai-chat', messages),
  aiSummarize: (content) => ipcRenderer.invoke('ai-summarize', content),
  aiGetPageContent: () => ipcRenderer.invoke('ai-page-content'),
  aiAskPage: (question) => ipcRenderer.invoke('ai-ask-page', question),
  aiTranslate: (text, lang) => ipcRenderer.invoke('ai-translate', text, lang),
  aiTranslatePage: (lang) => ipcRenderer.invoke('ai-translate-page', lang),
  aiDetectLanguage: () => ipcRenderer.invoke('ai-detect-language'),
  aiGetSelection: () => ipcRenderer.invoke('ai-get-selection'),

  // ═══════════════════════════════════════════════
  //   VOICE (Day 4)
  // ═══════════════════════════════════════════════
  voiceSaveSettings: (settings) => ipcRenderer.invoke('voice-save-settings', settings),
  voiceLoadSettings: () => ipcRenderer.invoke('voice-load-settings'),

  // ═══════════════════════════════════════════════
  //   RECENTLY CLOSED TABS (Day 6) — NEW
  // ═══════════════════════════════════════════════
  getRecentlyClosed: () => ipcRenderer.invoke('get-recently-closed'),
  clearRecentlyClosed: () => ipcRenderer.invoke('clear-recently-closed'),
    // ═══ PERFORMANCE (Day 10) ═══
  getPerformanceStats: () => ipcRenderer.invoke('get-performance-stats'),
  getPerformanceHistory: () => ipcRenderer.invoke('get-performance-history'),
  cleanupMemory: () => ipcRenderer.invoke('cleanup-memory'),
    // ═══ PRIVACY (Day 11) ═══
  getPrivacyStats: () => ipcRenderer.invoke('get-privacy-stats'),
  resetPrivacyStats: () => ipcRenderer.invoke('reset-privacy-stats'),
  clearAllCookies: () => ipcRenderer.invoke('clear-all-cookies'),
  clearCache: () => ipcRenderer.invoke('clear-cache'),
  setPrivacySetting: (key, value) => ipcRenderer.invoke('set-privacy-setting', key, value),
});