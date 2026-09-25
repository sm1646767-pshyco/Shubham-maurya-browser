// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER v5.0.0 — renderer.js
//   Author: Shubham Maurya
//   Complete browser logic with working sidebar panels
// ═══════════════════════════════════════════════════════════════

document.title = 'Universal Browser';

// ═══════════════════════════════════════════════════════════════
//   GLOBAL STATE
// ═══════════════════════════════════════════════════════════════
let tabs = [];
let activeTabId = null;
let tabCounter = 0;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
let history = JSON.parse(localStorage.getItem('history') || '[]');
let passwords = JSON.parse(localStorage.getItem('passwords') || '[]');
let settings = JSON.parse(localStorage.getItem('settings') || JSON.stringify({
  theme: 'dark',
  searchEngine: 'google',
  accentColor: '#89b4fa',
  enableSponsorBlock: true,
  enablePiP: true,
  enablePasswordManager: true
}));
let zoomLevel = 0;
let currentPanelTitle = '';
let activeDownloads = [];
let currentSearchEngine = settings.searchEngine || 'google';

// ═══════════════════════════════════════════════════════════════
//   DOM REFERENCES
// ═══════════════════════════════════════════════════════════════
function $(id) { return document.getElementById(id); }

const tabsList = $('tabsList');
const contentEl = $('content');
const urlInput = $('urlInput');
const startPage = $('startPage');
const backBtn = $('backBtn');
const forwardBtn = $('forwardBtn');
const reloadBtn = $('reloadBtn');
const homeBtn = $('homeBtn');
const goBtn = $('goBtn');
const blockedCountEl = $('blockedCount');
const newTabBtn = $('newTabBtn');
const sidebar = $('sidebar');
const panel = $('panel');
const panelTitle = $('panelTitle');
const panelBody = $('panelBody');
const bmItems = $('bmItems');
const tabSearch = $('tabSearch');
const zoomLabel = $('zoomLabel');
const toastContainer = $('toastContainer');
const readerOverlay = $('readerOverlay');
const readerContent = $('readerContent');

// ═══════════════════════════════════════════════════════════════
//   THEME
// ═══════════════════════════════════════════════════════════════
function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  if (settings.accentColor) {
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  }
}
applyTheme(settings.theme);

// ═══════════════════════════════════════════════════════════════
//   STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════
function saveBookmarks() { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); }
function saveHistory()   { localStorage.setItem('history', JSON.stringify(history.slice(0, 500))); }
function savePasswords() { localStorage.setItem('passwords', JSON.stringify(passwords)); }
function saveSettings()  { localStorage.setItem('settings', JSON.stringify(settings)); }

function addToHistory(title, url) {
  if (!url || url.startsWith('about:') || url.startsWith('file:')) return;
  history.unshift({ title: title || url, url: url, time: Date.now() });
  saveHistory();
}

// ═══════════════════════════════════════════════════════════════
//   UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  var units = ['B', 'KB', 'MB', 'GB'];
  var i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return bytes.toFixed(1) + ' ' + units[i];
}

function normalizeUrl(input) {
  input = (input || '').trim();
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  if (/^[\w-]+\.[\w.-]+/.test(input) && input.indexOf(' ') === -1) {
    return 'https://' + input;
  }
  var engines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q=',
    brave: 'https://search.brave.com/search?q=',
    chatgpt: 'https://chatgpt.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query='
  };
  var base = engines[settings.searchEngine] || engines.google;
  return base + encodeURIComponent(input);
}

// ═══════════════════════════════════════════════════════════════
//   TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
function showToast(message, type, duration) {
  type = type || 'info';
  duration = duration || 3500;
  if (!toastContainer) return;
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  var icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  toast.innerHTML = '<span class="toast-icon">' + (icons[type] || 'ℹ️') + '</span>' +
    '<div class="toast-content">' + escapeHtml(message) + '</div>';
  toastContainer.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('removing');
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

// ═══════════════════════════════════════════════════════════════
//   SIDEBAR PANELS — BULLETPROOF
// ═══════════════════════════════════════════════════════════════
function openPanel(title) {
  console.log('[Panel] Opening:', title);
  var panelEl = document.getElementById('panel');
  var panelTitleEl = document.getElementById('panelTitle');
  var panelBodyEl = document.getElementById('panelBody');
  
  if (!panelEl) {
    console.error('[Panel] Panel element missing');
    return;
  }
  if (!panelBodyEl) {
    console.error('[Panel] Panel body missing');
    return;
  }
  
  currentPanelTitle = title;
  if (panelTitleEl) panelTitleEl.textContent = title;
  panelEl.classList.add('open');
  
  try {
    renderPanelContent(title);
    console.log('[Panel] Rendered:', title);
  } catch (err) {
    console.error('[Panel] Error:', err);
    panelBodyEl.innerHTML = '<div class="panel-empty" style="color: #f38ba8;">Error: ' + err.message + '</div>';
  }
}

function closePanel() {
  var panelEl = document.getElementById('panel');
  if (panelEl) panelEl.classList.remove('open');
  currentPanelTitle = '';
}

function renderPanelContent(title) {
  var body = document.getElementById('panelBody');
  if (!body) return;
  body.innerHTML = '';

  // ═══ BOOKMARKS ═══
  if (title === 'Bookmarks') {
    if (!bookmarks || !bookmarks.length) {
      body.innerHTML = '<div class="panel-empty">No bookmarks yet.<br><br>Click ☆ in URL bar to save a bookmark.</div>';
      return;
    }
    bookmarks.forEach(function(bm, i) {
      var el = document.createElement('div');
      el.className = 'panel-item';
      el.innerHTML =
        '<div class="panel-item-favicon">⭐</div>' +
        '<div class="panel-item-info">' +
        '<div class="panel-item-title">' + escapeHtml(bm.title || bm.url) + '</div>' +
        '<div class="panel-item-url">' + escapeHtml(bm.url) + '</div>' +
        '</div>' +
        '<button class="panel-item-del" title="Delete">✕</button>';
      el.querySelector('.panel-item-info').addEventListener('click', function() {
        navigate(bm.url);
        closePanel();
      });
      el.querySelector('.panel-item-del').addEventListener('click', function(e) {
        e.stopPropagation();
        bookmarks.splice(i, 1);
        saveBookmarks();
        renderBookmarks();
        renderPanelContent('Bookmarks');
        showToast('Bookmark removed', 'info');
      });
      body.appendChild(el);
    });
  }

  // ═══ HISTORY ═══
  else if (title === 'History') {
    if (!history || !history.length) {
      body.innerHTML = '<div class="panel-empty">No history yet.<br><br>Start browsing and your history will appear here.</div>';
      return;
    }
    var clearBtn = document.createElement('button');
    clearBtn.className = 'download-action-btn';
    clearBtn.style.marginBottom = '12px';
    clearBtn.style.width = '100%';
    clearBtn.style.cursor = 'pointer';
    clearBtn.textContent = '🗑️ Clear All History';
    clearBtn.addEventListener('click', function() {
      if (confirm('Clear all history?')) {
        history = [];
        saveHistory();
        renderPanelContent('History');
        showToast('History cleared', 'success');
      }
    });
    body.appendChild(clearBtn);

    history.slice(0, 100).forEach(function(h) {
      var el = document.createElement('div');
      el.className = 'panel-item';
      var time = new Date(h.time).toLocaleString();
      el.innerHTML =
        '<div class="panel-item-favicon">🕐</div>' +
        '<div class="panel-item-info">' +
        '<div class="panel-item-title">' + escapeHtml(h.title || h.url) + '</div>' +
        '<div class="panel-item-url">' + time + '</div>' +
        '</div>';
      el.addEventListener('click', function() {
        navigate(h.url);
        closePanel();
      });
      body.appendChild(el);
    });
  }

  // ═══ DOWNLOADS ═══
  else if (title === 'Downloads') {
    if (!activeDownloads || !activeDownloads.length) {
      body.innerHTML = '<div class="panel-empty">No downloads yet.<br><br>Files you download will appear here.</div>';
      return;
    }
    var clearDl = document.createElement('button');
    clearDl.className = 'download-action-btn';
    clearDl.style.marginBottom = '12px';
    clearDl.style.width = '100%';
    clearDl.style.cursor = 'pointer';
    clearDl.textContent = '🗑️ Clear All Downloads';
    clearDl.addEventListener('click', function() {
      if (window.browserAPI) {
        window.browserAPI.clearDownloads();
      }
      activeDownloads = [];
      renderPanelContent('Downloads');
      showToast('Downloads cleared', 'success');
    });
    body.appendChild(clearDl);

    activeDownloads.slice().reverse().forEach(function(dl) {
      var el = document.createElement('div');
      el.className = 'download-item';
      var pct = dl.totalBytes > 0 ? Math.round((dl.receivedBytes / dl.totalBytes) * 100) : 0;
      var icon = dl.state === 'completed' ? '✅' : dl.state === 'cancelled' ? '❌' : dl.state === 'interrupted' ? '⚠️' : '⬇️';
      var meta = dl.state === 'completed' ? 'Completed · ' + formatBytes(dl.totalBytes) :
                 dl.state === 'progressing' ? formatBytes(dl.receivedBytes) + ' / ' + formatBytes(dl.totalBytes) + ' · ' + pct + '%' :
                 dl.state;
      el.innerHTML =
        '<div class="download-header">' +
        '<div class="download-icon">' + icon + '</div>' +
        '<div class="download-info">' +
        '<div class="download-name">' + escapeHtml(dl.filename) + '</div>' +
        '<div class="download-meta">' + meta + '</div>' +
        '</div>' +
        '</div>' +
        (dl.state === 'progressing' ? '<div class="download-progress-bar"><div class="download-progress-fill" style="width:' + pct + '%"></div></div>' : '') +
        (dl.state === 'completed' && dl.path ?
          '<div class="download-actions">' +
          '<button class="download-action-btn" data-action="open">Open</button>' +
          '<button class="download-action-btn" data-action="folder">Show in Folder</button>' +
          '</div>' : '');
      
      el.querySelectorAll('[data-action]').forEach(function(btn) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function() {
          if (!dl.path || !window.browserAPI) return;
          if (btn.dataset.action === 'open') window.browserAPI.openDownloadedFile(dl.path);
          if (btn.dataset.action === 'folder') window.browserAPI.showInFolder(dl.path);
        });
      });
      body.appendChild(el);
    });
  }

  // ═══ PASSWORDS ═══
  else if (title === 'Passwords') {
    var info = document.createElement('div');
    info.style.cssText = 'padding: 12px; background: var(--bg-3); border-radius: 8px; margin-bottom: 12px; font-size: 12px; color: var(--fg-2); line-height: 1.6;';
    info.innerHTML = '🔐 Passwords saved <strong>locally</strong>. Never shared.';
    body.appendChild(info);

    var addBtn = document.createElement('button');
    addBtn.className = 'download-action-btn';
    addBtn.style.marginBottom = '12px';
    addBtn.style.width = '100%';
    addBtn.style.cursor = 'pointer';
    addBtn.textContent = '➕ Add New Password';
    addBtn.addEventListener('click', function() {
      var domain = prompt('Website (e.g. google.com):');
      if (!domain) return;
      var username = prompt('Username / Email:');
      if (!username) return;
      var password = prompt('Password:');
      if (!password) return;
      passwords.push({ domain: domain, username: username, password: password, time: Date.now() });
      savePasswords();
      renderPanelContent('Passwords');
      showToast('Password saved 🔐', 'success');
    });
    body.appendChild(addBtn);

    if (!passwords || !passwords.length) {
      var empty = document.createElement('div');
      empty.className = 'panel-empty';
      empty.textContent = 'No passwords saved yet. Click "Add New Password" to save one.';
      body.appendChild(empty);
    } else {
      passwords.forEach(function(p, i) {
        var el = document.createElement('div');
        el.className = 'panel-item';
        el.innerHTML =
          '<div class="panel-item-favicon">🔐</div>' +
          '<div class="panel-item-info">' +
          '<div class="panel-item-title">' + escapeHtml(p.domain) + '</div>' +
          '<div class="panel-item-url">' + escapeHtml(p.username) + '</div>' +
          '</div>' +
          '<button class="panel-item-del" title="Delete">✕</button>';
        el.querySelector('.panel-item-info').addEventListener('click', function() {
          navigator.clipboard.writeText(p.password);
          showToast('Password copied 📋', 'success');
        });
        el.querySelector('.panel-item-del').addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm('Delete password for ' + p.domain + '?')) {
            passwords.splice(i, 1);
            savePasswords();
            renderPanelContent('Passwords');
          }
        });
        body.appendChild(el);
      });
    }
  }

  // ═══ STATISTICS ═══
  else if (title === 'Statistics') {
    var renderStats = function(stats) {
      var timeSaved = Math.round((stats.timeSaved || 0) / 60);
      var dataSaved = ((stats.dataSaved || 0) / 1024).toFixed(1);
      body.innerHTML =
        '<div class="stats-grid">' +
        '<div class="stat-card">' +
        '<div class="stat-icon">🛡️</div>' +
        '<div class="stat-value">' + (stats.blocked || 0) + '</div>' +
        '<div class="stat-label">Ads Blocked</div>' +
        '</div>' +
        '<div class="stat-card">' +
        '<div class="stat-icon">⏱️</div>' +
        '<div class="stat-value">' + timeSaved + 'm</div>' +
        '<div class="stat-label">Time Saved</div>' +
        '</div>' +
        '<div class="stat-card">' +
        '<div class="stat-icon">📉</div>' +
        '<div class="stat-value">' + dataSaved + 'KB</div>' +
        '<div class="stat-label">Data Saved</div>' +
        '</div>' +
        '<div class="stat-card">' +
        '<div class="stat-icon">📑</div>' +
        '<div class="stat-value">' + tabs.length + '</div>' +
        '<div class="stat-label">Open Tabs</div>' +
        '</div>' +
        '<div class="stat-card">' +
        '<div class="stat-icon">⭐</div>' +
        '<div class="stat-value">' + bookmarks.length + '</div>' +
        '<div class="stat-label">Bookmarks</div>' +
        '</div>' +
        '<div class="stat-card">' +
        '<div class="stat-icon">🕐</div>' +
        '<div class="stat-value">' + history.length + '</div>' +
        '<div class="stat-label">History</div>' +
        '</div>' +
        '</div>' +
        '<div style="margin-top: 16px; padding: 12px; background: var(--bg-3); border-radius: 8px; font-size: 12px; color: var(--fg-2); line-height: 1.6;">' +
        '📊 Stats update live as you browse. Reset counter by clicking 🛡️ in the toolbar.' +
        '</div>';
    };
    
    if (window.browserAPI && window.browserAPI.getStats) {
      window.browserAPI.getStats().then(renderStats).catch(function() { renderStats({}); });
    } else {
      renderStats({});
    }
  }

  // ═══ SETTINGS ═══
  else if (title === 'Settings') {
    body.innerHTML =
      '<div class="settings-group">' +
      '<h3>Appearance</h3>' +
      '<div class="settings-row">' +
      '<span>Theme</span>' +
      '<select id="settingTheme">' +
      '<option value="dark"' + (settings.theme === 'dark' ? ' selected' : '') + '>Dark</option>' +
      '<option value="light"' + (settings.theme === 'light' ? ' selected' : '') + '>Light</option>' +
      '</select>' +
      '</div>' +
      '<div class="settings-row">' +
      '<span>Accent Color</span>' +
      '<input type="color" id="settingAccent" value="' + (settings.accentColor || '#89b4fa') + '" style="width: 60px; height: 30px; border: none; background: transparent; cursor: pointer;" />' +
      '</div>' +
      '</div>' +
      
      '<div class="settings-group">' +
      '<h3>Search Engine</h3>' +
      '<div class="settings-row">' +
      '<span>Default Search</span>' +
      '<select id="settingEngine">' +
      '<option value="google"' + (settings.searchEngine === 'google' ? ' selected' : '') + '>Google</option>' +
      '<option value="duckduckgo"' + (settings.searchEngine === 'duckduckgo' ? ' selected' : '') + '>DuckDuckGo</option>' +
      '<option value="bing"' + (settings.searchEngine === 'bing' ? ' selected' : '') + '>Bing</option>' +
      '<option value="brave"' + (settings.searchEngine === 'brave' ? ' selected' : '') + '>Brave</option>' +
      '<option value="chatgpt"' + (settings.searchEngine === 'chatgpt' ? ' selected' : '') + '>ChatGPT</option>' +
      '<option value="youtube"' + (settings.searchEngine === 'youtube' ? ' selected' : '') + '>YouTube</option>' +
      '</select>' +
      '</div>' +
      '</div>' +
      
      '<div class="settings-group">' +
      '<h3>Advanced Features</h3>' +
      '<div class="settings-row">' +
      '<span>SponsorBlock</span>' +
      '<div class="toggle ' + (settings.enableSponsorBlock ? 'on' : '') + '" id="toggleSB"></div>' +
      '</div>' +
      '<div class="settings-row">' +
      '<span>Picture-in-Picture</span>' +
      '<div class="toggle ' + (settings.enablePiP ? 'on' : '') + '" id="togglePiP"></div>' +
      '</div>' +
      '<div class="settings-row">' +
      '<span>Password Manager</span>' +
      '<div class="toggle ' + (settings.enablePasswordManager ? 'on' : '') + '" id="togglePwd"></div>' +
      '</div>' +
      '</div>' +
      
      '<div class="settings-group">' +
      '<h3>About</h3>' +
      '<div class="about-card">' +
      '<div class="about-badge">UB</div>' +
      '<div class="about-name">Universal Browser</div>' +
      '<div class="about-role">by Shubham Maurya</div>' +
      '<div class="about-version">Version 5.0.0</div>' +
      '</div>' +
      '</div>';

    var tSel = document.getElementById('settingTheme');
    if (tSel) tSel.addEventListener('change', function(e) {
      settings.theme = e.target.value;
      applyTheme(settings.theme);
      saveSettings();
    });
    var aSel = document.getElementById('settingAccent');
    if (aSel) aSel.addEventListener('input', function(e) {
      settings.accentColor = e.target.value;
      applyTheme(settings.theme);
      saveSettings();
    });
    var eSel = document.getElementById('settingEngine');
    if (eSel) eSel.addEventListener('change', function(e) {
      settings.searchEngine = e.target.value;
      saveSettings();
      showToast('Search engine: ' + e.target.value, 'success');
    });
    var tSB = document.getElementById('toggleSB');
    if (tSB) tSB.addEventListener('click', function() {
      settings.enableSponsorBlock = !settings.enableSponsorBlock;
      tSB.classList.toggle('on', settings.enableSponsorBlock);
      saveSettings();
    });
    var tPiP = document.getElementById('togglePiP');
    if (tPiP) tPiP.addEventListener('click', function() {
      settings.enablePiP = !settings.enablePiP;
      tPiP.classList.toggle('on', settings.enablePiP);
      saveSettings();
    });
    var tPwd = document.getElementById('togglePwd');
    if (tPwd) tPwd.addEventListener('click', function() {
      settings.enablePasswordManager = !settings.enablePasswordManager;
      tPwd.classList.toggle('on', settings.enablePasswordManager);
      saveSettings();
    });
  }
}

// ═══════════════════════════════════════════════════════════════
//   SIDEBAR BUTTON EVENTS — BULLETPROOF ATTACHMENT
// ═══════════════════════════════════════════════════════════════
function attachSidebarEvents() {
  console.log('[Sidebar] Attaching events...');
  
  var buttons = {
    bookmarksBtn: 'Bookmarks',
    historyBtn: 'History',
    downloadsBtn: 'Downloads',
    passwordsBtn: 'Passwords',
    statsBtn: 'Statistics',
    settingsBtn: 'Settings'
  };
  
  Object.keys(buttons).forEach(function(btnId) {
    var btn = document.getElementById(btnId);
    if (btn) {
      var newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[Sidebar] Clicked:', buttons[btnId]);
        openPanel(buttons[btnId]);
      });
      console.log('[Sidebar] Attached:', btnId);
    } else {
      console.warn('[Sidebar] Button not found:', btnId);
    }
  });
  
  var closeBtn = document.getElementById('panelClose');
  if (closeBtn) {
    var newClose = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newClose, closeBtn);
    newClose.addEventListener('click', closePanel);
    console.log('[Sidebar] Attached: panelClose');
  }
  
  console.log('[Sidebar] All events attached ✅');
}

// ═══════════════════════════════════════════════════════════════
//   TAB CREATION
// ═══════════════════════════════════════════════════════════════
function createTab(url, activate, incognito) {
  url = url || null;
  activate = activate === undefined ? true : activate;
  incognito = incognito || false;
  
  var id = ++tabCounter;
  var partition = incognito ? ('temp:incog-' + id + '-' + Date.now()) : 'persist:browser';

  var tabEl = document.createElement('div');
  tabEl.className = 'tab' + (incognito ? ' incognito' : '');
  tabEl.dataset.id = id;
  tabEl.innerHTML =
    '<span class="tab-favicon">🌐</span>' +
    '<span class="tab-title">New Tab</span>' +
    '<button class="tab-close" title="Close">×</button>';
  
  tabEl.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab-close')) closeTab(id);
    else switchTab(id);
  });
  tabsList.appendChild(tabEl);

  var wv = document.createElement('webview');
  wv.setAttribute('partition', partition);
  wv.setAttribute('allowpopups', 'false');
  wv.setAttribute('useragent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );
  wv.style.display = 'none';
  wv.style.width = '100%';
  wv.style.height = '100%';
  contentEl.appendChild(wv);

  var tab = {
    id: id,
    title: 'New Tab',
    url: '',
    webview: wv,
    el: tabEl,
    incognito: incognito,
    pinned: false
  };
  tabs.push(tab);

  // Event: dom-ready
  wv.addEventListener('dom-ready', function() {
    if (window.browserAPI && wv.getWebContentsId) {
      try { window.browserAPI.notifyWebviewReady(wv.getWebContentsId()); } catch (e) {}
    }
  });

  // Event: title updated
  wv.addEventListener('page-title-updated', function(e) {
    tab.title = e.title || 'Untitled';
    tabEl.querySelector('.tab-title').textContent = tab.title;
    if (activeTabId === id) {
      document.title = tab.title + ' — Universal Browser';
    }
  });

  // Event: favicon updated
  wv.addEventListener('page-favicon-updated', function(e) {
    if (e.favicons && e.favicons.length) {
      var iconEl = tabEl.querySelector('.tab-favicon');
      if (iconEl) {
        iconEl.innerHTML = '<img src="' + e.favicons[0] + '" style="width:100%;height:100%;border-radius:4px;" onerror="this.parentElement.textContent=\'🌐\'">';
      }
    }
  });

  // Event: navigated
  wv.addEventListener('did-navigate', function(e) {
    tab.url = e.url;
    if (activeTabId === id) {
      urlInput.value = e.url;
      startPage.classList.add('hidden');
      updateNavButtons();
    }
    addToHistory(tab.title, e.url);
  });

  // Event: in-page navigation
  wv.addEventListener('did-navigate-in-page', function(e) {
    if (e.isMainFrame && activeTabId === id) {
      urlInput.value = e.url;
    }
  });

  // Event: loading start
  wv.addEventListener('did-start-loading', function() {
    if (activeTabId === id) {
      urlInput.classList.add('loading');
      reloadBtn.classList.add('loading');
    }
  });

  // Event: loading stop
  wv.addEventListener('did-stop-loading', function() {
    if (activeTabId === id) {
      urlInput.classList.remove('loading');
      reloadBtn.classList.remove('loading');
    }
    updateNavButtons();
  });

  // Event: new window
  wv.addEventListener('new-window', function(e) {
    e.preventDefault();
    if (e.url) createTab(e.url, true);
  });

  // Event: find in page
  wv.addEventListener('found-in-page', function(e) {
    var result = e.result;
    var findCounter = document.getElementById('findCounter');
    if (result && findCounter) {
      findCounter.textContent = (result.activeMatchOrdinal || 0) + '/' + (result.matches || 0);
    }
  });

  // Load URL or show start page
  if (url) {
    try { wv.src = url; } catch (e) { wv.loadURL(url); }
    tab.url = url;
    setTimeout(function() { startPage.classList.add('hidden'); }, 100);
  } else {
    setTimeout(function() { startPage.classList.remove('hidden'); }, 100);
  }

  if (activate) switchTab(id);
  return tab;
}

// ═══════════════════════════════════════════════════════════════
//   TAB SWITCH / CLOSE
// ═══════════════════════════════════════════════════════════════
function switchTab(id) {
  var tab = tabs.find(function(t) { return t.id === id; });
  if (!tab) return;
  activeTabId = id;

  tabs.forEach(function(t) {
    t.el.classList.toggle('active', t.id === id);
    t.webview.classList.toggle('active', t.id === id);
    t.webview.style.display = t.id === id ? 'flex' : 'none';
  });

  var url = '';
  try { url = tab.webview.getURL() || tab.url; } catch (e) { url = tab.url; }
  urlInput.value = url || '';

  if (!url) {
    startPage.classList.remove('hidden');
    document.title = 'Universal Browser';
  } else {
    startPage.classList.add('hidden');
    document.title = (tab.title || 'Universal Browser') + ' — Universal Browser';
  }

  updateNavButtons();
  updateBookmarkStar();
  applyZoom();
}

function closeTab(id) {
  var idx = tabs.findIndex(function(t) { return t.id === id; });
  if (idx === -1) return;
  var tab = tabs[idx];
  try { tab.webview.remove(); } catch (e) {}
  try { tab.el.remove(); } catch (e) {}
  tabs.splice(idx, 1);

  if (tabs.length === 0) {
    createTab(null, true);
    return;
  }
  if (activeTabId === id) {
    var newIdx = Math.max(0, idx - 1);
    switchTab(tabs[newIdx].id);
  }
}

// ═══════════════════════════════════════════════════════════════
//   PINNED TABS
// ═══════════════════════════════════════════════════════════════
function togglePinTab(tabId) {
  var tab = tabs.find(function(t) { return t.id === tabId; });
  if (!tab) return;
  tab.pinned = !tab.pinned;
  tab.el.classList.toggle('pinned', tab.pinned);

  var sorted = tabs.slice().sort(function(a, b) {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.id - b.id;
  });

  tabsList.innerHTML = '';
  sorted.forEach(function(t) { tabsList.appendChild(t.el); });
  tabs = sorted;
  showToast(tab.pinned ? 'Tab pinned 📌' : 'Tab unpinned', 'success');
}

// ═══════════════════════════════════════════════════════════════
//   NAVIGATION CONTROLS
// ═══════════════════════════════════════════════════════════════
function updateNavButtons() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab) {
    if (backBtn) backBtn.disabled = true;
    if (forwardBtn) forwardBtn.disabled = true;
    return;
  }
  try {
    if (backBtn) backBtn.disabled = !tab.webview.canGoBack();
    if (forwardBtn) forwardBtn.disabled = !tab.webview.canGoForward();
  } catch (e) {}
}

if (backBtn) backBtn.addEventListener('click', function() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (tab && tab.webview.canGoBack()) tab.webview.goBack();
});
if (forwardBtn) forwardBtn.addEventListener('click', function() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (tab && tab.webview.canGoForward()) tab.webview.goForward();
});
if (reloadBtn) reloadBtn.addEventListener('click', function() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (tab) tab.webview.reload();
});
if (homeBtn) homeBtn.addEventListener('click', function() {
  startPage.classList.remove('hidden');
  urlInput.value = '';
  urlInput.focus();
  document.title = 'Universal Browser';
});

// ═══════════════════════════════════════════════════════════════
//   NAVIGATE
// ═══════════════════════════════════════════════════════════════
function navigate(input) {
  var url = normalizeUrl(input);
  if (!url) return;
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab) { tab = createTab(url, true); return; }
  try { tab.webview.src = url; } catch (e) { tab.webview.loadURL(url); }
  tab.url = url;
  startPage.classList.add('hidden');
}

if (urlInput) {
  urlInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); navigate(urlInput.value); }
  });
  urlInput.addEventListener('focus', function() { urlInput.select(); });
}
if (goBtn) goBtn.addEventListener('click', function() { navigate(urlInput.value); });

// ═══════════════════════════════════════════════════════════════
//   START PAGE
// ═══════════════════════════════════════════════════════════════
var startSearch = document.getElementById('startSearch');
if (startSearch) {
  startSearch.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') navigate(e.target.value);
  });
}
document.querySelectorAll('.shortcut').forEach(function(el) {
  el.addEventListener('click', function() {
    var url = el.dataset.url;
    if (url) navigate(url);
  });
});

// ═══════════════════════════════════════════════════════════════
//   NEW TAB / SIDEBAR TOGGLE
// ═══════════════════════════════════════════════════════════════
if (newTabBtn) newTabBtn.addEventListener('click', function() { createTab(null, true); });
var collapseBtn = document.getElementById('collapseSidebar');
if (collapseBtn) collapseBtn.addEventListener('click', function() {
  sidebar.classList.add('collapsed');
  var expandBtn = document.getElementById('expandSidebar');
  if (expandBtn) expandBtn.style.display = 'flex';
});
var expandBtn = document.getElementById('expandSidebar');
if (expandBtn) expandBtn.addEventListener('click', function() {
  sidebar.classList.remove('collapsed');
  expandBtn.style.display = 'none';
});

// ═══════════════════════════════════════════════════════════════
//   TAB SEARCH
// ═══════════════════════════════════════════════════════════════
if (tabSearch) tabSearch.addEventListener('input', function(e) {
  var q = e.target.value.toLowerCase();
  document.querySelectorAll('.tab').forEach(function(el) {
    var title = el.querySelector('.tab-title').textContent.toLowerCase();
    el.style.display = title.indexOf(q) !== -1 ? '' : 'none';
  });
});

// ═══════════════════════════════════════════════════════════════
//   BOOKMARKS
// ═══════════════════════════════════════════════════════════════
function renderBookmarks() {
  if (!bmItems) return;
  bmItems.innerHTML = '';
  bookmarks.forEach(function(bm) {
    var el = document.createElement('div');
    el.className = 'bm-item';
    el.innerHTML = '⭐ <span>' + escapeHtml(bm.title || bm.url) + '</span>';
    el.title = bm.url;
    el.addEventListener('click', function() { navigate(bm.url); });
    bmItems.appendChild(el);
  });
}

function addBookmark() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab) return;
  var url = '';
  try { url = tab.webview.getURL(); } catch (e) {}
  if (!url) return;
  var title = tab.title || url;
  var exists = bookmarks.some(function(b) { return b.url === url; });
  if (exists) {
    bookmarks = bookmarks.filter(function(b) { return b.url !== url; });
    showToast('Bookmark removed', 'info');
  } else {
    bookmarks.push({ title: title, url: url, time: Date.now() });
    showToast('Bookmark added ⭐', 'success');
  }
  saveBookmarks();
  renderBookmarks();
  updateBookmarkStar();
}

if (document.getElementById('addBookmarkBtn')) {
  document.getElementById('addBookmarkBtn').addEventListener('click', addBookmark);
}
var bookmarkStar = document.getElementById('bookmarkStar');
if (bookmarkStar) bookmarkStar.addEventListener('click', addBookmark);

function updateBookmarkStar() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab || !bookmarkStar) return;
  var url = '';
  try { url = tab.webview.getURL(); } catch (e) {}
  var saved = bookmarks.some(function(b) { return b.url === url; });
  bookmarkStar.textContent = saved ? '★' : '☆';
  bookmarkStar.style.color = saved ? '#f9e2af' : '';
}

// ═══════════════════════════════════════════════════════════════
//   ZOOM
// ═══════════════════════════════════════════════════════════════
function applyZoom() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab) return;
  var factor = Math.pow(1.2, zoomLevel);
  try { tab.webview.setZoomFactor(factor); } catch (e) {}
  if (zoomLabel) zoomLabel.textContent = Math.round(factor * 100) + '%';
}

if (document.getElementById('zoomInBtn')) {
  document.getElementById('zoomInBtn').addEventListener('click', function() {
    zoomLevel = Math.min(zoomLevel + 1, 8);
    applyZoom();
  });
}
if (document.getElementById('zoomOutBtn')) {
  document.getElementById('zoomOutBtn').addEventListener('click', function() {
    zoomLevel = Math.max(zoomLevel - 1, -5);
    applyZoom();
  });
}

// ═══════════════════════════════════════════════════════════════
//   INCOGNITO
// ═══════════════════════════════════════════════════════════════
if (document.getElementById('incognitoBtn')) {
  document.getElementById('incognitoBtn').addEventListener('click', function() {
    createTab('https://www.google.com', true, true);
    showToast('Incognito tab opened 🕶️', 'info');
  });
}

// ═══════════════════════════════════════════════════════════════
//   FULLSCREEN
// ═══════════════════════════════════════════════════════════════
var fullscreenBtn = document.getElementById('fullscreenBtn');
if (fullscreenBtn && window.browserAPI) {
  fullscreenBtn.addEventListener('click', function() { window.browserAPI.toggleFullscreen(); });
  window.browserAPI.onFullscreenChange(function(isFs) {
    fullscreenBtn.textContent = isFs ? '⛉' : '⛶';
  });
}

// ═══════════════════════════════════════════════════════════════
//   SCREENSHOT
// ═══════════════════════════════════════════════════════════════
var screenshotBtn = document.getElementById('screenshotBtn');
if (screenshotBtn) {
  screenshotBtn.addEventListener('click', async function() {
    var tab = tabs.find(function(t) { return t.id === activeTabId; });
    if (!tab || !window.browserAPI) return;
    try {
      var image = await tab.webview.capturePage();
      var result = await window.browserAPI.saveScreenshot(image.toDataURL());
      if (result.success) {
        showToast('Screenshot saved: ' + result.path.split('/').pop(), 'success', 5000);
      } else {
        showToast('Screenshot failed', 'error');
      }
    } catch (err) {
      showToast('Screenshot failed', 'error');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//   PIP
// ═══════════════════════════════════════════════════════════════
var pipBtn = document.getElementById('pipBtn');
if (pipBtn) {
  pipBtn.addEventListener('click', async function() {
    var tab = tabs.find(function(t) { return t.id === activeTabId; });
    if (!tab) return;
    try {
      var result = await tab.webview.executeJavaScript(
        '(function(){var v=document.querySelector("video");if(!v)return{success:false,msg:"No video"};if(document.pictureInPictureElement){document.exitPictureInPicture();return{success:true,msg:"PiP exited"}}else{v.requestPictureInPicture();return{success:true,msg:"PiP activated"}}})();',
        true
      );
      if (result && result.msg) showToast(result.msg, result.success ? 'success' : 'warning');
    } catch (err) {
      showToast('PiP not available', 'warning');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//   READING MODE
// ═══════════════════════════════════════════════════════════════
var readerCloseBtn = document.getElementById('readerCloseBtn');
var readingBtn = document.getElementById('readingBtn');

async function openReadingMode() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab || !window.browserAPI) return;
  try {
    var result = await window.browserAPI.extractArticle();
    if (!result.success || !result.data) {
      showToast('Could not extract article', 'error');
      return;
    }
    var d = result.data;
    var html = '<h1>' + escapeHtml(d.title) + '</h1>';
    if (d.author || d.date) {
      html += '<div class="reader-meta">';
      if (d.author) html += 'By ' + escapeHtml(d.author);
      if (d.author && d.date) html += ' · ';
      if (d.date) html += escapeHtml(d.date);
      html += '</div>';
    }
    d.blocks.forEach(function(b) {
      if (b.type === 'img') html += '<img src="' + escapeHtml(b.src) + '" alt="' + escapeHtml(b.alt) + '" />';
      else if (b.type === 'pre') html += '<pre>' + escapeHtml(b.text) + '</pre>';
      else html += '<' + b.type + '>' + escapeHtml(b.text) + '</' + b.type + '>';
    });
    readerContent.innerHTML = html;
    readerOverlay.classList.add('show');
    readerOverlay.scrollTop = 0;
  } catch (err) {
    showToast('Reading mode failed', 'error');
  }
}

function closeReadingMode() { if (readerOverlay) readerOverlay.classList.remove('show'); }
if (readingBtn) readingBtn.addEventListener('click', openReadingMode);
if (readerCloseBtn) readerCloseBtn.addEventListener('click', closeReadingMode);

var readerThemeBtn = document.getElementById('readerThemeBtn');
if (readerThemeBtn) readerThemeBtn.addEventListener('click', function() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(settings.theme);
  saveSettings();
});

// ═══════════════════════════════════════════════════════════════
//   COMMAND PALETTE
// ═══════════════════════════════════════════════════════════════
var cmdOverlay = document.getElementById('cmdOverlay');
var cmdInput = document.getElementById('cmdInput');
var cmdResults = document.getElementById('cmdResults');
var cmdSelectedIndex = 0;
var cmdItems = [];

function openCommandPalette() {
  if (!cmdOverlay) return;
  cmdOverlay.classList.add('show');
  cmdInput.value = '';
  cmdInput.focus();
  buildCommands('');
}

function closeCommandPalette() {
  if (!cmdOverlay) return;
  cmdOverlay.classList.remove('show');
  cmdSelectedIndex = 0;
}

function buildCommands(query) {
  var q = query.toLowerCase().trim();
  cmdItems = [];
  
  var commands = [
    { icon: '＋', text: 'New Tab', hint: 'Ctrl+T', action: function() { createTab(null, true); } },
    { icon: '✕', text: 'Close Current Tab', hint: 'Ctrl+W', action: function() { closeTab(activeTabId); } },
    { icon: '🕶️', text: 'New Incognito Tab', action: function() { createTab('https://www.google.com', true, true); } },
    { icon: '🔄', text: 'Reload Page', hint: 'Ctrl+R', action: function() { var t = tabs.find(function(x) { return x.id === activeTabId; }); if (t) t.webview.reload(); } },
    { icon: '☆', text: 'Bookmark This Page', hint: 'Ctrl+D', action: addBookmark },
    { icon: '⭐', text: 'Show Bookmarks', action: function() { openPanel('Bookmarks'); } },
    { icon: '🕐', text: 'Show History', action: function() { openPanel('History'); } },
    { icon: '⬇️', text: 'Show Downloads', action: function() { openPanel('Downloads'); } },
    { icon: '🔐', text: 'Show Passwords', action: function() { openPanel('Passwords'); } },
    { icon: '📊', text: 'Show Statistics', action: function() { openPanel('Statistics'); } },
    { icon: '⚙️', text: 'Settings', action: function() { openPanel('Settings'); } },
    { icon: '🌓', text: 'Toggle Theme', action: function() {
      settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
      applyTheme(settings.theme); saveSettings();
    } },
    { icon: '⛶', text: 'Toggle Fullscreen', hint: 'F11', action: function() { if (window.browserAPI) window.browserAPI.toggleFullscreen(); } },
    { icon: '🔍', text: 'Find in Page', hint: 'Ctrl+F', action: openFindBar },
    { icon: '📸', text: 'Screenshot', hint: 'Ctrl+Shift+S', action: function() { if (screenshotBtn) screenshotBtn.click(); } },
    { icon: '📖', text: 'Reading Mode', hint: 'Ctrl+Shift+R', action: openReadingMode },
    { icon: '🎬', text: 'Picture-in-Picture', action: function() { if (pipBtn) pipBtn.click(); } },
    { icon: '📌', text: 'Pin Current Tab', action: function() { togglePinTab(activeTabId); } }
  ];
  
  if (!q) {
    commands.forEach(function(c) { cmdItems.push(Object.assign({}, c, { section: 'Commands' })); });
  } else {
    commands.filter(function(c) { return c.text.toLowerCase().indexOf(q) !== -1; })
      .forEach(function(c) { cmdItems.push(Object.assign({}, c, { section: 'Commands' })); });
  }

  tabs.forEach(function(t) {
    if (!t.url) return;
    if (!q || t.title.toLowerCase().indexOf(q) !== -1 || t.url.toLowerCase().indexOf(q) !== -1) {
      cmdItems.push({ icon: '🌐', text: t.title || t.url, hint: 'Tab', section: 'Open Tabs', action: function() { switchTab(t.id); } });
    }
  });

  bookmarks.forEach(function(bm) {
    if (!q || (bm.title || '').toLowerCase().indexOf(q) !== -1 || bm.url.toLowerCase().indexOf(q) !== -1) {
      cmdItems.push({ icon: '⭐', text: bm.title || bm.url, hint: 'Bookmark', section: 'Bookmarks', action: function() { navigate(bm.url); } });
    }
  });

  if (q) {
    history.slice(0, 20).forEach(function(h) {
      if ((h.title || '').toLowerCase().indexOf(q) !== -1 || h.url.toLowerCase().indexOf(q) !== -1) {
        cmdItems.push({ icon: '🕐', text: h.title || h.url, hint: 'History', section: 'History', action: function() { navigate(h.url); } });
      }
    });
  }

  if (q && /^[\w-]+\.[\w.-]+/.test(q) && q.indexOf(' ') === -1) {
    cmdItems.unshift({ icon: '🚀', text: 'Go to: ' + query, hint: 'Enter', section: 'Navigate', action: function() { navigate(query); } });
  } else if (q) {
    cmdItems.unshift({ icon: '🔎', text: 'Search: ' + query, hint: 'Enter', section: 'Navigate', action: function() { navigate(query); } });
  }

  cmdItems = cmdItems.slice(0, 30);
  cmdSelectedIndex = 0;
  renderCommandResults();
}

function renderCommandResults() {
  if (!cmdResults) return;
  cmdResults.innerHTML = '';
  if (cmdItems.length === 0) {
    cmdResults.innerHTML = '<div class="cmd-empty">No results found</div>';
    return;
  }
  
  var lastSection = '';
  cmdItems.forEach(function(item, i) {
    if (item.section && item.section !== lastSection) {
      lastSection = item.section;
      var sectionEl = document.createElement('div');
      sectionEl.className = 'cmd-section';
      sectionEl.textContent = item.section;
      cmdResults.appendChild(sectionEl);
    }
    
    var el = document.createElement('div');
    el.className = 'cmd-item' + (i === cmdSelectedIndex ? ' selected' : '');
    el.innerHTML = '<span class="cmd-item-icon">' + item.icon + '</span>' +
      '<span class="cmd-item-text">' + escapeHtml(item.text) + '</span>' +
      (item.hint ? '<span class="cmd-item-hint">' + item.hint + '</span>' : '');
    
    el.addEventListener('click', function() {
      closeCommandPalette();
      item.action();
    });
    el.addEventListener('mouseenter', function() {
      cmdSelectedIndex = i;
      document.querySelectorAll('.cmd-item').forEach(function(node, idx) {
        node.classList.toggle('selected', idx === i);
      });
    });
    cmdResults.appendChild(el);
  });
}

if (cmdInput) {
  cmdInput.addEventListener('input', function(e) { buildCommands(e.target.value); });
  cmdInput.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cmdSelectedIndex = Math.min(cmdSelectedIndex + 1, cmdItems.length - 1);
      renderCommandResults();
      var sel = cmdResults.querySelector('.cmd-item.selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      cmdSelectedIndex = Math.max(cmdSelectedIndex - 1, 0);
      renderCommandResults();
      var sel = cmdResults.querySelector('.cmd-item.selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      var item = cmdItems[cmdSelectedIndex];
      if (item) { closeCommandPalette(); item.action(); }
    }
    if (e.key === 'Escape') closeCommandPalette();
  });
}

if (cmdOverlay) {
  cmdOverlay.addEventListener('click', function(e) {
    if (e.target === cmdOverlay) closeCommandPalette();
  });
}

var cmdBtn = document.getElementById('cmdBtn');
if (cmdBtn) cmdBtn.addEventListener('click', openCommandPalette);

// ═══════════════════════════════════════════════════════════════
//   FIND IN PAGE
// ═══════════════════════════════════════════════════════════════
var findOverlay = document.getElementById('findOverlay');
var findInput = document.getElementById('findInput');
var findCounter = document.getElementById('findCounter');
var findPrevBtn = document.getElementById('findPrevBtn');
var findNextBtn = document.getElementById('findNextBtn');
var findCloseBtn = document.getElementById('findCloseBtn');

function openFindBar() {
  if (!findOverlay) return;
  findOverlay.classList.add('show');
  findInput.focus();
  findInput.select();
}

function closeFindBar() {
  if (!findOverlay) return;
  findOverlay.classList.remove('show');
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (tab) {
    try { tab.webview.stopFindInPage('clearSelection'); } catch (e) {}
  }
}

function doFind(forward, findNext) {
  forward = forward === undefined ? true : forward;
  findNext = findNext === undefined ? false : findNext;
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab) return;
  var query = findInput.value;
  if (!query) {
    try { tab.webview.stopFindInPage('clearSelection'); } catch (e) {}
    if (findCounter) findCounter.textContent = '0/0';
    return;
  }
  try { tab.webview.findInPage(query, { forward: forward, findNext: findNext }); } catch (e) {}
}

if (findInput) {
  findInput.addEventListener('input', function() {
    var tab = tabs.find(function(t) { return t.id === activeTabId; });
    if (!tab) return;
    try { tab.webview.findInPage(findInput.value); } catch (e) {}
  });
  findInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); doFind(!e.shiftKey, true); }
    if (e.key === 'Escape') closeFindBar();
  });
}
if (findNextBtn) findNextBtn.addEventListener('click', function() { doFind(true, true); });
if (findPrevBtn) findPrevBtn.addEventListener('click', function() { doFind(false, true); });
if (findCloseBtn) findCloseBtn.addEventListener('click', closeFindBar);

// ═══════════════════════════════════════════════════════════════
//   CONTEXT MENU
// ═══════════════════════════════════════════════════════════════
var ctxMenu = document.createElement('div');
ctxMenu.className = 'ctx-menu';
document.body.appendChild(ctxMenu);

function showContextMenu(x, y, items) {
  ctxMenu.innerHTML = '';
  items.forEach(function(item) {
    if (item === '---') {
      var sep = document.createElement('div');
      sep.className = 'ctx-sep';
      ctxMenu.appendChild(sep);
      return;
    }
    var el = document.createElement('div');
    el.className = 'ctx-item' + (item.disabled ? ' disabled' : '');
    el.innerHTML = '<span class="ctx-item-icon">' + (item.icon || '') + '</span>' +
      '<span>' + item.text + '</span>' +
      (item.hint ? '<span class="ctx-item-hint">' + item.hint + '</span>' : '');
    if (!item.disabled) {
      el.addEventListener('click', function() {
        ctxMenu.classList.remove('show');
        item.action();
      });
    }
    ctxMenu.appendChild(el);
  });
  
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top = y + 'px';
  ctxMenu.classList.add('show');
  
  var rect = ctxMenu.getBoundingClientRect();
  if (rect.right > window.innerWidth) ctxMenu.style.left = (window.innerWidth - rect.width - 8) + 'px';
  if (rect.bottom > window.innerHeight) ctxMenu.style.top = (window.innerHeight - rect.height - 8) + 'px';
}

function hideContextMenu() { ctxMenu.classList.remove('show'); }
document.addEventListener('click', hideContextMenu);

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  hideContextMenu();
  var target = e.target;
  if (target.tagName === 'WEBVIEW') {
    var tab = tabs.find(function(t) { return t.webview === target; });
    if (!tab) return;
    var items = [
      { icon: '◀', text: 'Back', disabled: !tab.webview.canGoBack(), action: function() { tab.webview.goBack(); } },
      { icon: '▶', text: 'Forward', disabled: !tab.webview.canGoForward(), action: function() { tab.webview.goForward(); } },
      { icon: '🔄', text: 'Reload', hint: 'Ctrl+R', action: function() { tab.webview.reload(); } },
      '---',
      { icon: '☆', text: 'Bookmark This Page', hint: 'Ctrl+D', action: addBookmark },
      { icon: '🔗', text: 'Copy Page URL', action: function() {
        try { navigator.clipboard.writeText(tab.webview.getURL()); showToast('URL copied', 'success'); } catch (err) {}
      } },
      '---',
      { icon: '🔍', text: 'Find in Page', hint: 'Ctrl+F', action: openFindBar },
      { icon: '📖', text: 'Reading Mode', hint: 'Ctrl+Shift+R', action: openReadingMode },
      { icon: '📸', text: 'Screenshot', hint: 'Ctrl+Shift+S', action: function() { if (screenshotBtn) screenshotBtn.click(); } },
      { icon: '🎬', text: 'Picture-in-Picture', action: function() { if (pipBtn) pipBtn.click(); } },
      '---',
      { icon: '🛠️', text: 'Inspect Element', action: function() {
        try { tab.webview.openDevTools(); } catch (err) {}
      } }
    ];
    showContextMenu(e.clientX, e.clientY, items);
  }
});

// Tab right-click
if (tabsList) tabsList.addEventListener('contextmenu', function(e) {
  var tabEl = e.target.closest('.tab');
  if (!tabEl) return;
  e.preventDefault();
  e.stopPropagation();
  var tabId = parseInt(tabEl.dataset.id);
  var tab = tabs.find(function(t) { return t.id === tabId; });
  if (!tab) return;
  showContextMenu(e.clientX, e.clientY, [
    { icon: tab.pinned ? '📍' : '📌', text: tab.pinned ? 'Unpin Tab' : 'Pin Tab', action: function() { togglePinTab(tabId); } },
    { icon: '🔄', text: 'Reload', action: function() { tab.webview.reload(); } },
    { icon: '🔇', text: 'Mute Tab', action: function() {
      try { tab.webview.setAudioMuted(!tab.webview.isAudioMuted()); } catch (err) {}
    } },
    { icon: '📋', text: 'Duplicate Tab', action: function() {
      var url = '';
      try { url = tab.webview.getURL(); } catch (err) {}
      createTab(url || tab.url, true);
    } },
    '---',
    { icon: '✕', text: 'Close Tab', hint: 'Ctrl+W', action: function() { closeTab(tabId); } },
    { icon: '✕', text: 'Close Other Tabs', action: function() {
      tabs.slice().forEach(function(t) { if (t.id !== tabId) closeTab(t.id); });
    } }
  ]);
});

// ═══════════════════════════════════════════════════════════════
//   SHIELD
// ═══════════════════════════════════════════════════════════════
if (window.browserAPI) {
  window.browserAPI.onBlockedCount(function(n) {
    if (blockedCountEl) blockedCountEl.textContent = n;
  });
  window.browserAPI.onOpenNewTab(function(url) { createTab(url, true); });
  setInterval(async function() {
    try {
      var n = await window.browserAPI.getBlockedCount();
      if (blockedCountEl) blockedCountEl.textContent = n;
    } catch (e) {}
  }, 2000);
}

if (document.getElementById('shield')) {
  document.getElementById('shield').addEventListener('click', async function() {
    if (window.browserAPI) {
      if (confirm('Reset ad-block counter to 0?')) {
        var n = await window.browserAPI.resetBlockedCount();
        if (blockedCountEl) blockedCountEl.textContent = n;
        showToast('Ad counter reset', 'success');
      }
    }
  });
}

if (document.getElementById('menuBtn')) {
  document.getElementById('menuBtn').addEventListener('click', function() { openPanel('Settings'); });
}

// ═══════════════════════════════════════════════════════════════
//   KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════
document.addEventListener('keydown', function(e) {
  var mod = e.ctrlKey || e.metaKey;

  if (mod && e.key === 't') { e.preventDefault(); createTab(null, true); }
  if (mod && e.key === 'w') { e.preventDefault(); closeTab(activeTabId); }
  if (mod && e.key === 'l') { e.preventDefault(); urlInput.focus(); urlInput.select(); }
  if (mod && e.key === 'r') {
    e.preventDefault();
    var tab = tabs.find(function(t) { return t.id === activeTabId; });
    if (tab) tab.webview.reload();
  }
  if (mod && e.key === 'b') {
    e.preventDefault();
    sidebar.classList.toggle('collapsed');
    var expandBtn = document.getElementById('expandSidebar');
    if (expandBtn) expandBtn.style.display = sidebar.classList.contains('collapsed') ? 'flex' : 'none';
  }
  if (mod && e.key === 'd') { e.preventDefault(); addBookmark(); }
  if (mod && e.key === '=') { e.preventDefault(); zoomLevel = Math.min(zoomLevel + 1, 8); applyZoom(); }
  if (mod && e.key === '-') { e.preventDefault(); zoomLevel = Math.max(zoomLevel - 1, -5); applyZoom(); }
  if (mod && e.key === '0') { e.preventDefault(); zoomLevel = 0; applyZoom(); }
  if (mod && e.key === 'k') { e.preventDefault(); openCommandPalette(); }
  if (mod && e.key === 'f') { e.preventDefault(); openFindBar(); }
  if (mod && e.shiftKey && (e.key === 'S' || e.key === 's')) {
    e.preventDefault();
    if (screenshotBtn) screenshotBtn.click();
  }
  if (mod && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
    e.preventDefault();
    openReadingMode();
  }
  if (e.key === 'F11') {
    e.preventDefault();
    if (window.browserAPI) window.browserAPI.toggleFullscreen();
  }
  if (e.key === 'Escape') {
    if (readerOverlay && readerOverlay.classList.contains('show')) { closeReadingMode(); return; }
    if (cmdOverlay && cmdOverlay.classList.contains('show')) { closeCommandPalette(); return; }
    if (window.browserAPI) {
      window.browserAPI.isFullscreen().then(function(isFs) {
        if (isFs) window.browserAPI.toggleFullscreen();
      });
    }
  }
  if (e.altKey && e.key === 'ArrowLeft') {
    var t = tabs.find(function(x) { return x.id === activeTabId; });
    if (t && t.webview.canGoBack()) t.webview.goBack();
  }
  if (e.altKey && e.key === 'ArrowRight') {
    var t2 = tabs.find(function(x) { return x.id === activeTabId; });
    if (t2 && t2.webview.canGoForward()) t2.webview.goForward();
  }
});

// ═══════════════════════════════════════════════════════════════
//   DOWNLOAD EVENTS
// ═══════════════════════════════════════════════════════════════
if (window.browserAPI) {
  window.browserAPI.onDownloadStarted(function(data) {
    activeDownloads.push({
      id: data.id, filename: data.filename, url: data.url,
      totalBytes: data.totalBytes, receivedBytes: 0, state: 'progressing'
    });
    showToast('Downloading: ' + data.filename, 'info');
    if (currentPanelTitle === 'Downloads') renderPanelContent('Downloads');
  });
  
  window.browserAPI.onDownloadProgress(function(data) {
    var dl = activeDownloads.find(function(d) { return d.id === data.id; });
    if (dl) {
      dl.receivedBytes = data.receivedBytes;
      dl.totalBytes = data.totalBytes;
      dl.state = data.state;
      if (currentPanelTitle === 'Downloads') renderPanelContent('Downloads');
    }
  });
  
  window.browserAPI.onDownloadDone(function(data) {
    var dl = activeDownloads.find(function(d) { return d.id === data.id; });
    if (dl) {
      dl.state = data.state;
      dl.path = data.path;
      showToast(data.state === 'completed' ? 'Downloaded: ' + data.filename : 'Download failed',
        data.state === 'completed' ? 'success' : 'error');
      if (currentPanelTitle === 'Downloads') renderPanelContent('Downloads');
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//   BOOT
// ═══════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Universal Browser v5.0.0 booting...');
  applyTheme(settings.theme);
  renderBookmarks();
  createTab(null, true);
  setTimeout(function() { startPage.classList.remove('hidden'); }, 200);
  attachSidebarEvents();
  console.log('✅ Boot complete');
});

// Fallback: attach events after 1 second if DOMContentLoaded already fired
setTimeout(attachSidebarEvents, 1000);
// ═══════════════════════════════════════════════
//   AI PANEL LOGIC
// ═══════════════════════════════════════════════
(function() {
  var aiPanel = document.getElementById('aiPanel');
  var aiBtn = document.getElementById('aiBtn');
  var aiPanelClose = document.getElementById('aiPanelClose');
  var aiInput = document.getElementById('aiInput');
  var aiSendBtn = document.getElementById('aiSendBtn');
  var aiChat = document.getElementById('aiChat');

  var conversationHistory = [
    { role: 'system', content: 'You are Universal Browser AI assistant. Help users understand webpages, answer questions, and be concise.' }
  ];

  function openAIPanel() {
    aiPanel.classList.add('open');
    setTimeout(function() { aiInput.focus(); }, 300);
  }

  function closeAIPanel() {
    aiPanel.classList.remove('open');
  }

  function addMessage(text, type) {
    var msg = document.createElement('div');
    msg.className = 'ai-message ' + type;
    msg.textContent = text;
    aiChat.appendChild(msg);
    aiChat.scrollTop = aiChat.scrollHeight;
    return msg;
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    var loading = addMessage('Thinking...', 'assistant loading');

    conversationHistory.push({ role: 'user', content: text });

    try {
      var result = await window.browserAPI.aiChat(conversationHistory);
      loading.remove();

      if (result.success) {
        addMessage(result.text, 'assistant');
        conversationHistory.push({ role: 'assistant', content: result.text });
      } else {
        addMessage('❌ Error: ' + result.error, 'assistant');
      }
    } catch (err) {
      loading.remove();
      addMessage('❌ ' + err.message, 'assistant');
    }
  }

  if (aiBtn) aiBtn.addEventListener('click', openAIPanel);
  if (aiPanelClose) aiPanelClose.addEventListener('click', closeAIPanel);
  if (aiSendBtn) aiSendBtn.addEventListener('click', function() {
    var q = aiInput.value.trim();
    if (q) { sendMessage(q); aiInput.value = ''; }
  });
  if (aiInput) aiInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var q = aiInput.value.trim();
      if (q) { sendMessage(q); aiInput.value = ''; }
    }
  });

  console.log('[AI] Initialized');
})();
async function summarizeCurrentPage() {
  var tab = tabs.find(function(t) { return t.id === activeTabId; });
  if (!tab) return;

  addMessage('📄 Summarizing page...', 'assistant loading');

  try {
    var contentResult = await window.browserAPI.aiGetPageContent();
    if (!contentResult.success) {
      addMessage('❌ Could not read page', 'assistant');
      return;
    }

    var summaryResult = await window.browserAPI.aiSummarize(contentResult.text);
    if (summaryResult.success) {
      addMessage(summaryResult.text, 'assistant');
    } else {
      addMessage('❌ ' + summaryResult.error, 'assistant');
    }
  } catch (err) {
    addMessage('❌ ' + err.message, 'assistant');
  }
}