const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserAPI', {
  getBlockedCount: () => ipcRenderer.invoke('get-blocked-count'),
  resetBlockedCount: () => ipcRenderer.invoke('reset-blocked-count'),
  getStats: () => ipcRenderer.invoke('get-stats'),
  incrementSites: () => ipcRenderer.invoke('increment-sites'),
  onBlockedCount: (cb) => ipcRenderer.on('blocked-count', (e, n) => cb(n)),
  onOpenNewTab: (cb) => ipcRenderer.on('open-new-tab', (e, url) => cb(url)),
  notifyWebviewReady: (id) => ipcRenderer.send('webview-ready', id),
  toggleFullscreen: () => ipcRenderer.invoke('window-toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('window-is-fullscreen'),
  toggleTor: (enable) => ipcRenderer.invoke('tor-toggle', enable),
  saveScreenshot: (dataURL) => ipcRenderer.invoke('save-screenshot', dataURL),
  extractArticle: () => ipcRenderer.invoke('extract-article'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  openDownloadedFile: (path) => ipcRenderer.send('open-downloaded-file', path),
  showInFolder: (path) => ipcRenderer.send('show-in-folder', path),
});