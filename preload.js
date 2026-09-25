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

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  toggleFullscreen: () => ipcRenderer.invoke('window-toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('window-is-fullscreen'),
  onFullscreenChange: (cb) => ipcRenderer.on('fullscreen-changed', (e, isFs) => cb(isFs)),

  // Downloads
  onDownloadStarted: (cb) => ipcRenderer.on('download-started', (e, data) => cb(data)),
  onDownloadProgress: (cb) => ipcRenderer.on('download-progress', (e, data) => cb(data)),
  onDownloadDone: (cb) => ipcRenderer.on('download-done', (e, data) => cb(data)),
  openDownloadedFile: (path) => ipcRenderer.send('open-downloaded-file', path),
  showInFolder: (path) => ipcRenderer.send('show-in-folder', path),
  getDownloads: () => ipcRenderer.invoke('get-downloads'),
  clearDownloads: () => ipcRenderer.invoke('clear-downloads'),

  // Screenshot
  saveScreenshot: (dataURL) => ipcRenderer.invoke('save-screenshot', dataURL),

  // Reading Mode
  extractArticle: () => ipcRenderer.invoke('extract-article'),

  // External
  openExternal: (url) => ipcRenderer.send('open-external', url),
  // AI Features
  aiChat: (messages) => ipcRenderer.invoke('ai-chat', messages),
  aiSummarize: (content) => ipcRenderer.invoke('ai-summarize', content),
  aiTranslate: (text, lang) => ipcRenderer.invoke('ai-translate', text, lang),
  aiGetPageContent: () => ipcRenderer.invoke('ai-page-content'),
});