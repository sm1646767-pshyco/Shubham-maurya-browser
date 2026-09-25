const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserAPI', {
  // Ad blocker
  getBlockedCount: () => ipcRenderer.invoke('get-blocked-count'),
  resetBlockedCount: () => ipcRenderer.invoke('reset-blocked-count'),
  getStats: () => ipcRenderer.invoke('get-stats'),
  incrementSites: () => ipcRenderer.invoke('increment-sites'),
  onBlockedCount: (cb) => ipcRenderer.on('blocked-count', (e, n) => cb(n)),
  onOpenNewTab: (cb) => ipcRenderer.on('open-new-tab', (e, url) => cb(url)),
  notifyWebviewReady: (id) => ipcRenderer.send('webview-ready', id),

  // Window
  toggleFullscreen: () => ipcRenderer.invoke('window-toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('window-is-fullscreen'),

  // Screenshot + Reading
  saveScreenshot: (dataURL) => ipcRenderer.invoke('save-screenshot', dataURL),
  extractArticle: () => ipcRenderer.invoke('extract-article'),

  // ═══ AI FEATURES ═══
  aiChat: (messages) => ipcRenderer.invoke('ai-chat', messages),
  aiSummarize: (content) => ipcRenderer.invoke('ai-summarize', content),
  aiGetPageContent: () => ipcRenderer.invoke('ai-page-content'),
  aiAskPage: (question) => ipcRenderer.invoke('ai-ask-page', question),
  aiTranslate: (text, lang) => ipcRenderer.invoke('ai-translate', text, lang),
  aiTranslatePage: (lang) => ipcRenderer.invoke('ai-translate-page', lang),
  aiDetectLanguage: () => ipcRenderer.invoke('ai-detect-language'),
  aiGetSelection: () => ipcRenderer.invoke('ai-get-selection'),

  // ═══ VOICE ═══
  voiceSaveSettings: (settings) => ipcRenderer.invoke('voice-save-settings', settings),
  voiceLoadSettings: () => ipcRenderer.invoke('voice-load-settings'),
});