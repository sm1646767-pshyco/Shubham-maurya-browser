// ═══════════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER v5.0 — COMPLETE RENDERER
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════════

document.title = 'Universal Browser';

// ═══════════════════════════════════════════════════════════════════
//   SEARCH ENGINE INTEGRATION
// ═══════════════════════════════════════════════════════════════════

let searchEngine = null;
try {
  if (window.UniversalSearch) {
    searchEngine = window.UniversalSearch;
    console.log('✅ Search engine loaded');
  }
} catch (e) {
  console.warn('⚠️ Search engine not available');
}

// ═══════════════════════════════════════════════════════════════════
//   STATE
// ═══════════════════════════════════════════════════════════════════

let tabs = [];
let activeTabId = null;
let tabCounter = 0;
let incognitoCounter = 0;
let bookmarks = JSON.parse(localStorage.getItem('ub_bookmarks') || '[]');
let history = JSON.parse(localStorage.getItem('ub_history') || '[]');
let passwords = JSON.parse(localStorage.getItem('ub_passwords') || '[]');
let notes = JSON.parse(localStorage.getItem('ub_notes') || '[]');
let activeDownloads = [];
let settings = JSON.parse(localStorage.getItem('ub_settings') || JSON.stringify({
  theme: 'dark',
  searchEngine: 'google',
  accentColor: '#89b4fa',
  torEnabled: false
}));
let zoomLevel = 0;
let currentPanelTitle = '';
let torEnabled = settings.torEnabled || false;
let readerFontSize = 18;
let splitActive = false;

// ═══════════════════════════════════════════════════════════════════
//   DOM
// ═══════════════════════════════════════════════════════════════════

const $ = (id) => document.getElementById(id);
const contentEl = $('content');
const startPage = $('startPage');
const tabsList = $('tabsList');
const tabSearch = $('tabSearch');
const sidebar = $('sidebar');
const panel = $('panel');
const panelTitle = $('panelTitle');
const panelBody = $('panelBody');
const urlInput = $('urlInput');
const lockIcon = $('lockIcon');
const blockedCountEl = $('blockedCount');
const zoomLabel = $('zoomLabel');
const toastContainer = $('toastContainer');
const readerOverlay = $('readerOverlay');
const readerContent = $('readerContent');
const cmdOverlay = $('cmdOverlay');
const cmdInput = $('cmdInput');
const cmdResults = $('cmdResults');
const findOverlay = $('findOverlay');
const findInput = $('findInput');
const findCounter = $('findCounter');
const suggestionsPopup = $('suggestionsPopup');
const suggestionsList = $('suggestionsList');
const torIndicator = $('torIndicator');
const downloadsFloat = $('downloadsFloat');
const downloadsFloatBody = $('downloadsFloatBody');
const aiChatOverlay = $('aiChatOverlay');
const aiChatBody = $('aiChatBody');
const aiChatInput = $('aiChatInput');
const splitContainer = $('splitContainer');
const splitPaneLeft = $('splitPaneLeft');
const splitPaneRight = $('splitPaneRight');

// ═══════════════════════════════════════════════════════════════════
//   THEME
// ═══════════════════════════════════════════════════════════════════

function applyTheme(theme) {
  if (!document.body) return;
  document.body.classList.toggle('light', theme === 'light');
  if (settings.accentColor) {
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  }
}

// Apply theme only when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  applyTheme(settings.theme);
});

// ═══════════════════════════════════════════════════════════════════
//   PERSISTENCE
// ═══════════════════════════════════════════════════════════════════

function saveBookmarks() { localStorage.setItem('ub_bookmarks', JSON.stringify(bookmarks)); }
function saveHistory()   { localStorage.setItem('ub_history', JSON.stringify(history.slice(0, 500))); }
function savePasswords() { localStorage.setItem('ub_passwords', JSON.stringify(passwords)); }
function saveNotes()     { localStorage.setItem('ub_notes', JSON.stringify(notes)); }
function saveSettings()  { localStorage.setItem('ub_settings', JSON.stringify(settings)); }

function addToHistory(title, url) {
  if (!url || url.startsWith('about:') || url.startsWith('file:')) return;
  history.unshift({ title: title || url, url, time: Date.now() });
  saveHistory();
}

// ═══════════════════════════════════════════════════════════════════
//   HELPERS
// ═══════════════════════════════════════════════════════════════════

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return bytes.toFixed(1) + ' ' + units[i];
}

function normalizeUrl(input) {
  input = (input || '').trim();
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  if (/\.onion(\/|$|\?)/i.test(input)) return 'http://' + input;
  if (/^[\w-]+(\.[\w-]+)+(\/|$|\?|:)/.test(input) && !input.includes(' ')) return 'https://' + input;
  return buildSearchUrl(input);
}

function buildSearchUrl(query) {
  const engines = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q=',
    brave: 'https://search.brave.com/search?q=',
    startpage: 'https://www.startpage.com/sp/search?query=',
    ecosia: 'https://www.ecosia.org/search?q=',
    chatgpt: 'https://chatgpt.com/?q=',
    perplexity: 'https://www.perplexity.ai/search?q=',
    youtube: 'https://www.youtube.com/results?search_query='
  };
  const base = engines[settings.searchEngine] || engines.google;
  return base + encodeURIComponent(query);
}

// ═══════════════════════════════════════════════════════════════════
//   TOAST
// ═══════════════════════════════════════════════════════════════════

function showToast(message, type = 'info', duration = 3500) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-content">${escapeHtml(message)}</div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ═══════════════════════════════════════════════════════════════════
//   CREATE TAB
// ═══════════════════════════════════════════════════════════════════

function createTab(url = null, activate = true, incognito = false) {
  const id = ++tabCounter;
  const partition = incognito ? `temp:incog-${++incognitoCounter}-${Date.now()}` : 'persist:browser';

  const tabEl = document.createElement('div');
  tabEl.className = 'tab' + (incognito ? ' incognito' : '');
  tabEl.dataset.id = id;
  tabEl.innerHTML = `
    <span class="tab-favicon">🌐</span>
    <span class="tab-title">New Tab</span>
    <button class="tab-close" title="Close">×</button>
  `;
  tabEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-close')) closeTab(id);
    else switchTab(id);
  });
  tabsList.appendChild(tabEl);

  const wv = document.createElement('webview');
  wv.setAttribute('partition', partition);
  wv.setAttribute('allowpopups', 'false');
  wv.setAttribute('enablescrollbars', 'true');
  wv.setAttribute('useragent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );
  wv.style.display = 'none';
  wv.style.width = '100%';
  wv.style.height = '100%';
  contentEl.appendChild(wv);

  const tab = { id, title: 'New Tab', url: '', webview: wv, el: tabEl, incognito, pinned: false };
  tabs.push(tab);

  wv.addEventListener('dom-ready', () => {
    if (window.browserAPI && wv.getWebContentsId) {
      try { window.browserAPI.notifyWebviewReady(wv.getWebContentsId()); } catch (e) {}
    }
  });

  wv.addEventListener('page-title-updated', (e) => {
    tab.title = e.title || 'Untitled';
    tabEl.querySelector('.tab-title').textContent = tab.title;
    if (activeTabId === id) document.title = tab.title + ' — Universal Browser';
  });

  wv.addEventListener('page-favicon-updated', (e) => {
    if (e.favicons && e.favicons.length) {
      const iconEl = tabEl.querySelector('.tab-favicon');
      if (iconEl) iconEl.innerHTML = `<img src="${e.favicons[0]}" style="width:100%;height:100%;border-radius:4px;" onerror="this.parentElement.textContent='🌐'">`;
    }
  });

  wv.addEventListener('did-navigate', (e) => {
    tab.url = e.url;
    if (activeTabId === id) {
      urlInput.value = e.url;
      startPage.classList.add('hidden');
      updateNavButtons();
    }
    addToHistory(tab.title, e.url);
    if (window.browserAPI) window.browserAPI.incrementSites().catch(() => {});
  });

  wv.addEventListener('did-navigate-in-page', (e) => {
    if (e.isMainFrame && activeTabId === id) urlInput.value = e.url;
  });

  wv.addEventListener('did-start-loading', () => {
    if (activeTabId === id) {
      urlInput.classList.add('loading');
      $('reloadBtn').classList.add('loading');
    }
  });

  wv.addEventListener('did-stop-loading', () => {
    if (activeTabId === id) {
      urlInput.classList.remove('loading');
      $('reloadBtn').classList.remove('loading');
    }
    updateNavButtons();
  });

  wv.addEventListener('new-window', (e) => {
    e.preventDefault();
    if (e.url) createTab(e.url, true);
  });

  wv.addEventListener('found-in-page', (e) => {
    if (e.result && findCounter) {
      findCounter.textContent = `${e.result.activeMatchOrdinal || 0}/${e.result.matches || 0}`;
    }
  });

  if (url) {
    try { wv.src = url; } catch (e) { wv.loadURL(url); }
    tab.url = url;
    setTimeout(() => startPage.classList.add('hidden'), 100);
  } else {
    setTimeout(() => startPage.classList.remove('hidden'), 100);
  }

  if (activate) switchTab(id);
  return tab;
}

// ═══════════════════════════════════════════════════════════════════
//   SWITCH / CLOSE / PIN
// ═══════════════════════════════════════════════════════════════════

function switchTab(id) {
  const tab = tabs.find(t => t.id === id);
  if (!tab) return;
  activeTabId = id;
  tabs.forEach(t => {
    const isActive = t.id === id;
    t.el.classList.toggle('active', isActive);
    t.webview.classList.toggle('active', isActive);
    t.webview.style.display = isActive ? 'flex' : 'none';
  });
  let url = '';
  try { url = tab.webview.getURL() || tab.url; } catch { url = tab.url; }
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
  const idx = tabs.findIndex(t => t.id === id);
  if (idx === -1) return;
  const tab = tabs[idx];
  try { tab.webview.remove(); } catch (e) {}
  try { tab.el.remove(); } catch (e) {}
  tabs.splice(idx, 1);
  if (tabs.length === 0) { createTab(null, true); return; }
  if (activeTabId === id) switchTab(tabs[Math.max(0, idx - 1)].id);
}

function togglePinTab(tabId) {
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;
  tab.pinned = !tab.pinned;
  tab.el.classList.toggle('pinned', tab.pinned);
  const sorted = [...tabs].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.id - b.id;
  });
  tabsList.innerHTML = '';
  sorted.forEach(t => tabsList.appendChild(t.el));
  tabs = sorted;
  showToast(tab.pinned ? 'Tab pinned 📌' : 'Tab unpinned', 'success');
}

// ═══════════════════════════════════════════════════════════════════
//   NAV
// ═══════════════════════════════════════════════════════════════════

function updateNavButtons() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) { $('backBtn').disabled = true; $('forwardBtn').disabled = true; return; }
  try {
    $('backBtn').disabled = !tab.webview.canGoBack();
    $('forwardBtn').disabled = !tab.webview.canGoForward();
  } catch (e) {}
}

$('backBtn').addEventListener('click', () => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab && tab.webview.canGoBack()) tab.webview.goBack();
});
$('forwardBtn').addEventListener('click', () => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab && tab.webview.canGoForward()) tab.webview.goForward();
});
$('reloadBtn').addEventListener('click', () => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab) tab.webview.reload();
});
$('homeBtn').addEventListener('click', () => {
  startPage.classList.remove('hidden');
  urlInput.value = '';
  urlInput.focus();
  document.title = 'Universal Browser';
});

function navigate(input) {
  const url = normalizeUrl(input);
  if (!url) return;
  let tab = tabs.find(t => t.id === activeTabId);
  if (!tab) { tab = createTab(url, true); return; }
  try { tab.webview.src = url; } catch (e) { tab.webview.loadURL(url); }
  tab.url = url;
  startPage.classList.add('hidden');
}

urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); navigate(urlInput.value); hideSuggestions(); }
  if (e.key === 'Escape') { urlInput.blur(); hideSuggestions(); }
});
urlInput.addEventListener('focus', () => { urlInput.select(); showSuggestions(urlInput.value); });
urlInput.addEventListener('input', () => showSuggestions(urlInput.value));
urlInput.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
$('goBtn').addEventListener('click', () => navigate(urlInput.value));

// ═══════════════════════════════════════════════════════════════════
//   SUGGESTIONS
// ═══════════════════════════════════════════════════════════════════

function showSuggestions(query) {
  if (!query || query.length < 1) { hideSuggestions(); return; }
  const q = query.toLowerCase();
  const matches = [];
  history.slice(0, 50).forEach(h => {
    if (matches.length >= 8) return;
    if (h.url.toLowerCase().includes(q) || (h.title || '').toLowerCase().includes(q))
      matches.push({ icon: '🕐', title: h.title || h.url, url: h.url });
  });
  bookmarks.forEach(b => {
    if (matches.length >= 10) return;
    if (b.url.toLowerCase().includes(q) || (b.title || '').toLowerCase().includes(q))
      matches.push({ icon: '⭐', title: b.title || b.url, url: b.url });
  });
  matches.push({ icon: '🔍', title: `Search for "${query}"`, url: buildSearchUrl(query) });
  renderSuggestions(matches);
}

function renderSuggestions(matches) {
  if (!suggestionsList) return;
  suggestionsList.innerHTML = '';
  matches.forEach(m => {
    const el = document.createElement('div');
    el.className = 'suggestion-item';
    el.innerHTML = `
      <span class="suggestion-icon">${m.icon}</span>
      <div class="suggestion-content">
        <div class="suggestion-title">${escapeHtml(m.title)}</div>
        <div class="suggestion-url">${escapeHtml(m.url)}</div>
      </div>
    `;
    el.addEventListener('click', () => { navigate(m.url); hideSuggestions(); });
    suggestionsList.appendChild(el);
  });
  suggestionsPopup.style.display = 'block';
}
function hideSuggestions() { if (suggestionsPopup) suggestionsPopup.style.display = 'none'; }

// ═══════════════════════════════════════════════════════════════════
//   START PAGE
// ═══════════════════════════════════════════════════════════════════

const startSearch = $('startSearch');
if (startSearch) startSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') navigate(startSearch.value);
});

document.querySelectorAll('.shortcut').forEach(el => {
  el.addEventListener('click', () => {
    const url = el.dataset.url;
    if (url) navigate(url);
  });
});

const searchEngines = $('searchEngines');
if (searchEngines) {
  searchEngines.querySelectorAll('.se-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      searchEngines.querySelectorAll('.se-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.searchEngine = btn.dataset.engine;
      saveSettings();
      showToast(`Search: ${btn.dataset.engine}`, 'success', 1500);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//   NEW TAB / SIDEBAR
// ═══════════════════════════════════════════════════════════════════

$('newTabBtn').addEventListener('click', () => createTab(null, true));
$('collapseSidebar').addEventListener('click', () => {
  sidebar.classList.add('collapsed');
  $('expandSidebar').style.display = 'flex';
});
$('expandSidebar').addEventListener('click', () => {
  sidebar.classList.remove('collapsed');
  $('expandSidebar').style.display = 'none';
});

tabSearch.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.tab').forEach(el => {
    const title = el.querySelector('.tab-title').textContent.toLowerCase();
    el.style.display = title.includes(q) ? '' : 'none';
  });
});

// ═══════════════════════════════════════════════════════════════════
//   BOOKMARKS
// ═══════════════════════════════════════════════════════════════════

function renderBookmarks() {
  const bmItems = $('bmItems');
  if (!bmItems) return;
  bmItems.innerHTML = '';
  bookmarks.forEach(bm => {
    const el = document.createElement('div');
    el.className = 'bm-item';
    el.innerHTML = `⭐ <span>${escapeHtml(bm.title || bm.url)}</span>`;
    el.title = bm.url;
    el.addEventListener('click', () => navigate(bm.url));
    bmItems.appendChild(el);
  });
}

function addBookmark() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return;
  let url = '';
  try { url = tab.webview.getURL(); } catch (e) {}
  if (!url) return;
  const title = tab.title || url;
  if (bookmarks.some(b => b.url === url)) {
    bookmarks = bookmarks.filter(b => b.url !== url);
    showToast('Bookmark removed', 'info');
  } else {
    bookmarks.push({ title, url, time: Date.now() });
    showToast('Bookmark added ⭐', 'success');
  }
  saveBookmarks();
  renderBookmarks();
  updateBookmarkStar();
}

$('addBookmarkBtn').addEventListener('click', addBookmark);
const bookmarkStar = $('bookmarkStar');
if (bookmarkStar) bookmarkStar.addEventListener('click', addBookmark);

function updateBookmarkStar() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab || !bookmarkStar) return;
  let url = '';
  try { url = tab.webview.getURL(); } catch (e) {}
  const saved = bookmarks.some(b => b.url === url);
  bookmarkStar.textContent = saved ? '★' : '☆';
  bookmarkStar.style.color = saved ? '#f9e2af' : '';
}

// ═══════════════════════════════════════════════════════════════════
//   PANELS
// ═══════════════════════════════════════════════════════════════════

function openPanel(title) {
  currentPanelTitle = title;
  panelTitle.textContent = title;
  panel.classList.add('open');
  renderPanelContent(title);
}
function closePanel() {
  panel.classList.remove('open');
  currentPanelTitle = '';
}
$('panelClose').addEventListener('click', closePanel);
$('panelRefresh').addEventListener('click', () => renderPanelContent(currentPanelTitle));

$('bookmarksBtn').addEventListener('click', () => openPanel('Bookmarks'));
$('historyBtn').addEventListener('click', () => openPanel('History'));
$('passwordsBtn').addEventListener('click', () => openPanel('Passwords'));
$('downloadsBtn').addEventListener('click', () => openPanel('Downloads'));
$('statsBtn').addEventListener('click', () => openPanel('Statistics'));
$('notesBtn').addEventListener('click', () => openPanel('Notes'));
$('settingsBtn').addEventListener('click', () => openPanel('Settings'));

function renderPanelContent(title) {
  panelBody.innerHTML = '';

  if (title === 'Bookmarks') {
    if (!bookmarks.length) {
      panelBody.innerHTML = '<div class="panel-empty">No bookmarks yet.<br>Click ☆ in URL bar to save.</div>';
      return;
    }
    bookmarks.forEach((bm, i) => {
      const el = document.createElement('div');
      el.className = 'panel-item';
      el.innerHTML = `
        <div class="panel-item-favicon">⭐</div>
        <div class="panel-item-info">
          <div class="panel-item-title">${escapeHtml(bm.title || bm.url)}</div>
          <div class="panel-item-url">${escapeHtml(bm.url)}</div>
        </div>
        <button class="panel-item-del">✕</button>
      `;
      el.querySelector('.panel-item-info').addEventListener('click', () => { navigate(bm.url); closePanel(); });
      el.querySelector('.panel-item-del').addEventListener('click', (e) => {
        e.stopPropagation();
        bookmarks.splice(i, 1);
        saveBookmarks();
        renderBookmarks();
        renderPanelContent('Bookmarks');
      });
      panelBody.appendChild(el);
    });
  }
  else if (title === 'History') {
    if (!history.length) {
      panelBody.innerHTML = '<div class="panel-empty">No history yet.</div>';
      return;
    }
    const clearBtn = document.createElement('button');
    clearBtn.className = 'download-action-btn';
    clearBtn.style.marginBottom = '12px';
    clearBtn.textContent = 'Clear History';
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all history?')) {
        history = [];
        saveHistory();
        renderPanelContent('History');
        showToast('History cleared', 'success');
      }
    });
    panelBody.appendChild(clearBtn);
    history.slice(0, 100).forEach((h) => {
      const el = document.createElement('div');
      el.className = 'panel-item';
      const time = new Date(h.time).toLocaleString();
      el.innerHTML = `
        <div class="panel-item-favicon">🕐</div>
        <div class="panel-item-info">
          <div class="panel-item-title">${escapeHtml(h.title || h.url)}</div>
          <div class="panel-item-url">${time}</div>
        </div>
      `;
      el.addEventListener('click', () => { navigate(h.url); closePanel(); });
      panelBody.appendChild(el);
    });
  }
  else if (title === 'Passwords') {
    panelBody.innerHTML = `
      <div style="padding: 12px; background: var(--bg-3); border-radius: 8px; margin-bottom: 12px; font-size: 12px; color: var(--fg-2); line-height: 1.6;">
        🔐 Passwords are saved locally. Never shared.
      </div>
    `;
    const addBtn = document.createElement('button');
    addBtn.className = 'download-action-btn';
    addBtn.style.marginBottom = '12px';
    addBtn.textContent = '+ Add Password';
    addBtn.addEventListener('click', () => {
      const domain = prompt('Website (e.g. google.com):');
      if (!domain) return;
      const username = prompt('Username/Email:');
      if (!username) return;
      const password = prompt('Password:');
      if (!password) return;
      passwords.push({ domain, username, password, time: Date.now() });
      savePasswords();
      renderPanelContent('Passwords');
      showToast('Password saved', 'success');
    });
    panelBody.appendChild(addBtn);
    if (!passwords.length) {
      const empty = document.createElement('div');
      empty.className = 'panel-empty';
      empty.textContent = 'No passwords saved yet.';
      panelBody.appendChild(empty);
    } else {
      passwords.forEach((p, i) => {
        const el = document.createElement('div');
        el.className = 'panel-item';
        el.innerHTML = `
          <div class="panel-item-favicon">🔐</div>
          <div class="panel-item-info">
            <div class="panel-item-title">${escapeHtml(p.domain)}</div>
            <div class="panel-item-url">${escapeHtml(p.username)}</div>
          </div>
          <button class="panel-item-del">✕</button>
        `;
        el.querySelector('.panel-item-info').addEventListener('click', () => {
          navigator.clipboard.writeText(p.password);
          showToast('Password copied', 'success');
        });
        el.querySelector('.panel-item-del').addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Delete password for ${p.domain}?`)) {
            passwords.splice(i, 1);
            savePasswords();
            renderPanelContent('Passwords');
          }
        });
        panelBody.appendChild(el);
      });
    }
  }
  else if (title === 'Downloads') {
    if (!activeDownloads.length) {
      panelBody.innerHTML = '<div class="panel-empty">No downloads yet.</div>';
      return;
    }
    activeDownloads.slice().reverse().forEach(dl => {
      const el = document.createElement('div');
      el.className = 'download-item';
      const percent = dl.totalBytes > 0 ? Math.round((dl.receivedBytes / dl.totalBytes) * 100) : 0;
      const stateIcon = dl.state === 'completed' ? '✅' : dl.state === 'cancelled' ? '❌' : dl.state === 'interrupted' ? '⚠️' : '⬇️';
      const metaText = dl.state === 'completed'
        ? `Completed · ${formatBytes(dl.totalBytes)}`
        : dl.state === 'progressing'
        ? `${formatBytes(dl.receivedBytes)} / ${formatBytes(dl.totalBytes)} · ${percent}%`
        : dl.state;
      el.innerHTML = `
        <div class="download-header">
          <div class="download-icon">${stateIcon}</div>
          <div class="download-info">
            <div class="download-name">${escapeHtml(dl.filename)}</div>
            <div class="download-meta">${metaText}</div>
          </div>
        </div>
        ${dl.state === 'progressing' ? `<div class="download-progress-bar"><div class="download-progress-fill" style="width:${percent}%"></div></div>` : ''}
        <div class="download-actions">
          ${dl.state === 'completed' && dl.path ? `
            <button class="download-action-btn" data-action="open">Open</button>
            <button class="download-action-btn" data-action="folder">Show in Folder</button>
          ` : ''}
        </div>
      `;
      el.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          if (!dl.path || !window.browserAPI) return;
          if (action === 'open') window.browserAPI.openDownloadedFile(dl.path);
          if (action === 'folder') window.browserAPI.showInFolder(dl.path);
        });
      });
      panelBody.appendChild(el);
    });
  }
  else if (title === 'Statistics') {
    if (window.browserAPI) {
      window.browserAPI.getStats().then((stats) => {
        const timeSaved = Math.round(stats.timeSaved / 60);
        const dataSaved = (stats.dataSaved / 1024).toFixed(1);
        panelBody.innerHTML = `
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">🛡️</div><div class="stat-value">${stats.blocked}</div><div class="stat-label">Ads Blocked</div></div>
            <div class="stat-card"><div class="stat-icon">⏱️</div><div class="stat-value">${timeSaved}m</div><div class="stat-label">Time Saved</div></div>
            <div class="stat-card"><div class="stat-icon">📉</div><div class="stat-value">${dataSaved}KB</div><div class="stat-label">Data Saved</div></div>
            <div class="stat-card"><div class="stat-icon">📑</div><div class="stat-value">${tabs.length}</div><div class="stat-label">Open Tabs</div></div>
            <div class="stat-card"><div class="stat-icon">🌐</div><div class="stat-value">${stats.sitesVisited || 0}</div><div class="stat-label">Sites Visited</div></div>
            <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${bookmarks.length}</div><div class="stat-label">Bookmarks</div></div>
          </div>
        `;
      });
    }
  }
  else if (title === 'Notes') {
    panelBody.innerHTML = `
      <div style="padding: 12px; background: var(--bg-3); border-radius: 8px; margin-bottom: 12px; font-size: 12px; color: var(--fg-2);">
        📝 Quick notes. Saved locally.
      </div>
    `;
    const addBtn = document.createElement('button');
    addBtn.className = 'download-action-btn';
    addBtn.style.marginBottom = '12px';
    addBtn.textContent = '+ Add Note';
    addBtn.addEventListener('click', () => {
      const title = prompt('Note title:');
      if (!title) return;
      const content = prompt('Note content:');
      if (!content) return;
      notes.push({ title, content, time: Date.now() });
      saveNotes();
      renderPanelContent('Notes');
      showToast('Note saved', 'success');
    });
    panelBody.appendChild(addBtn);
    if (!notes.length) {
      const empty = document.createElement('div');
      empty.className = 'panel-empty';
      empty.textContent = 'No notes yet.';
      panelBody.appendChild(empty);
    } else {
      notes.forEach((n, i) => {
        const el = document.createElement('div');
        el.className = 'panel-item';
        el.style.flexDirection = 'column';
        el.style.alignItems = 'flex-start';
        el.innerHTML = `
          <div style="font-weight: 600; color: var(--fg-1); margin-bottom: 4px;">${escapeHtml(n.title)}</div>
          <div style="font-size: 12px; color: var(--fg-2); line-height: 1.5;">${escapeHtml(n.content)}</div>
          <button class="panel-item-del" style="align-self: flex-end; margin-top: 8px;">✕</button>
        `;
        el.querySelector('.panel-item-del').addEventListener('click', (e) => {
          e.stopPropagation();
          notes.splice(i, 1);
          saveNotes();
          renderPanelContent('Notes');
        });
        panelBody.appendChild(el);
      });
    }
  }
  else if (title === 'Settings') {
    panelBody.innerHTML = `
      <div class="settings-group">
        <h3>Appearance</h3>
        <div class="settings-row">
          <span>Theme</span>
          <select id="settingTheme">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
          </select>
        </div>
        <div class="settings-row">
          <span>Accent Color</span>
          <input type="color" id="settingAccent" value="${settings.accentColor}" style="width: 60px; height: 30px; border: none; background: transparent; cursor: pointer;" />
        </div>
      </div>

      <div class="settings-group">
        <h3>Search Engine</h3>
        <div class="settings-row">
          <span>Default Search</span>
          <select id="settingEngine">
            <option value="google" ${settings.searchEngine === 'google' ? 'selected' : ''}>Google</option>
            <option value="duckduckgo" ${settings.searchEngine === 'duckduckgo' ? 'selected' : ''}>DuckDuckGo</option>
            <option value="bing" ${settings.searchEngine === 'bing' ? 'selected' : ''}>Bing</option>
            <option value="brave" ${settings.searchEngine === 'brave' ? 'selected' : ''}>Brave</option>
            <option value="startpage" ${settings.searchEngine === 'startpage' ? 'selected' : ''}>Startpage</option>
            <option value="ecosia" ${settings.searchEngine === 'ecosia' ? 'selected' : ''}>Ecosia</option>
            <option value="chatgpt" ${settings.searchEngine === 'chatgpt' ? 'selected' : ''}>ChatGPT</option>
            <option value="perplexity" ${settings.searchEngine === 'perplexity' ? 'selected' : ''}>Perplexity</option>
            <option value="youtube" ${settings.searchEngine === 'youtube' ? 'selected' : ''}>YouTube</option>
          </select>
        </div>
      </div>

      <div class="settings-group">
        <h3>🧅 Dark Web (Tor)</h3>
        <div class="settings-row">
          <span>Enable Tor Proxy</span>
          <div class="toggle ${settings.torEnabled ? 'on' : ''}" id="toggleTor"></div>
        </div>
        <div style="padding: 12px; background: var(--bg-3); border-radius: 8px; font-size: 11px; color: var(--fg-3); line-height: 1.6; margin-top: 8px;">
          ⚠️ Tor daemon chahiye (port 9050). macOS: <code>brew services start tor</code>
        </div>
      </div>

      <div class="settings-group">
        <h3>About</h3>
        <div class="about-card">
          <div class="about-badge">UB</div>
          <div class="about-name">Universal Browser</div>
          <div class="about-role">by Shubham Maurya</div>
          <div class="about-version">v5.0.0</div>
        </div>
      </div>
    `;
    const themeSel = $('settingTheme');
    if (themeSel) themeSel.addEventListener('change', (e) => {
      settings.theme = e.target.value;
      applyTheme(settings.theme);
      saveSettings();
    });
    const accentInput = $('settingAccent');
    if (accentInput) accentInput.addEventListener('input', (e) => {
      settings.accentColor = e.target.value;
      applyTheme(settings.theme);
      saveSettings();
    });
    const engineSel = $('settingEngine');
    if (engineSel) engineSel.addEventListener('change', (e) => {
      settings.searchEngine = e.target.value;
      saveSettings();
    });
    const tTor = $('toggleTor');
    if (tTor) tTor.addEventListener('click', () => toggleTor());
  }
}

// ═══════════════════════════════════════════════════════════════════
//   ZOOM
// ═══════════════════════════════════════════════════════════════════

function applyZoom() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return;
  const factor = Math.pow(1.2, zoomLevel);
  try { tab.webview.setZoomFactor(factor); } catch (e) {}
  if (zoomLabel) zoomLabel.textContent = Math.round(factor * 100) + '%';
}
$('zoomInBtn').addEventListener('click', () => { zoomLevel = Math.min(zoomLevel + 1, 8); applyZoom(); });
$('zoomOutBtn').addEventListener('click', () => { zoomLevel = Math.max(zoomLevel - 1, -5); applyZoom(); });

// ═══════════════════════════════════════════════════════════════════
//   INCOGNITO
// ═══════════════════════════════════════════════════════════════════

$('incognitoBtn').addEventListener('click', () => {
  createTab('https://www.google.com', true, true);
  showToast('🕶️ Incognito tab', 'info');
});

// ═══════════════════════════════════════════════════════════════════
//   TOR
// ═══════════════════════════════════════════════════════════════════

async function toggleTor() {
  torEnabled = !torEnabled;
  settings.torEnabled = torEnabled;
  saveSettings();
  if (window.browserAPI) {
    await window.browserAPI.toggleTor(torEnabled);
  }
  const torBtn = $('torBtn');
  if (torEnabled) {
    torBtn.style.color = '#a6e3a1';
    torIndicator.style.display = 'flex';
    showToast('🧅 Tor enabled — dark web ready', 'success');
  } else {
    torBtn.style.color = '';
    torIndicator.style.display = 'none';
    showToast('Tor disabled', 'info');
  }
}

$('torBtn').addEventListener('click', toggleTor);

// ═══════════════════════════════════════════════════════════════════
//   FULLSCREEN
// ═══════════════════════════════════════════════════════════════════

const fullscreenBtn = $('fullscreenBtn');
if (fullscreenBtn && window.browserAPI) {
  fullscreenBtn.addEventListener('click', () => window.browserAPI.toggleFullscreen());
  window.browserAPI.onFullscreenChange((isFs) => {
    fullscreenBtn.textContent = isFs ? '⛉' : '⛶';
  });
}

// ═══════════════════════════════════════════════════════════════════
//   SCREENSHOT
// ═══════════════════════════════════════════════════════════════════

const screenshotBtn = $('screenshotBtn');
if (screenshotBtn) {
  screenshotBtn.addEventListener('click', async () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab || !window.browserAPI) return;
    try {
      const image = await tab.webview.capturePage();
      const result = await window.browserAPI.saveScreenshot(image.toDataURL());
      if (result.success) showToast(`📸 Saved: ${result.path.split('/').pop()}`, 'success', 5000);
      else showToast('Screenshot failed', 'error');
    } catch (err) { showToast('Screenshot failed', 'error'); }
  });
}

// ═══════════════════════════════════════════════════════════════════
//   PIP
// ═══════════════════════════════════════════════════════════════════

const pipBtn = $('pipBtn');
if (pipBtn) {
  pipBtn.addEventListener('click', async () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    try {
      const result = await tab.webview.executeJavaScript(`
        (function() {
          const videos = document.querySelectorAll('video');
          if (!videos.length) return { success: false, msg: 'No video found' };
          const video = videos[0];
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            return { success: true, msg: 'PiP exited' };
          } else {
            video.requestPictureInPicture();
            return { success: true, msg: 'PiP activated' };
          }
        })();
      `, true);
      if (result && result.msg) showToast(result.msg, result.success ? 'success' : 'warning');
    } catch (err) { showToast('PiP not available', 'warning'); }
  });
}

// ═══════════════════════════════════════════════════════════════════
//   READING MODE
// ═══════════════════════════════════════════════════════════════════

const readingBtn = $('readingBtn');

async function openReadingMode() {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab || !window.browserAPI) return;
  try {
    const result = await window.browserAPI.extractArticle();
    if (!result.success || !result.data) { showToast('Could not extract', 'error'); return; }
    const { title, author, date, blocks } = result.data;
    let html = `<h1>${escapeHtml(title)}</h1>`;
    if (author || date) {
      html += `<div class="reader-meta">`;
      if (author) html += `By ${escapeHtml(author)}`;
      if (author && date) html += ` · `;
      if (date) html += escapeHtml(date);
      html += `</div>`;
    }
    blocks.forEach(b => {
      if (b.type === 'img') html += `<img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}" />`;
      else if (b.type === 'pre') html += `<pre>${escapeHtml(b.text)}</pre>`;
      else html += `<${b.type}>${escapeHtml(b.text)}</${b.type}>`;
    });
    readerContent.innerHTML = html;
    readerContent.style.fontSize = readerFontSize + 'px';
    readerOverlay.classList.add('show');
    readerOverlay.scrollTop = 0;
  } catch (err) { showToast('Reading mode failed', 'error'); }
}
function closeReadingMode() { readerOverlay.classList.remove('show'); }
if (readingBtn) readingBtn.addEventListener('click', openReadingMode);
if ($('readerCloseBtn')) $('readerCloseBtn').addEventListener('click', closeReadingMode);
if ($('readerThemeBtn')) $('readerThemeBtn').addEventListener('click', () => {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(settings.theme);
  saveSettings();
});
if ($('readerFontIncrease')) $('readerFontIncrease').addEventListener('click', () => {
  readerFontSize = Math.min(readerFontSize + 2, 32);
  readerContent.style.fontSize = readerFontSize + 'px';
});
if ($('readerFontDecrease')) $('readerFontDecrease').addEventListener('click', () => {
  readerFontSize = Math.max(readerFontSize - 2, 12);
  readerContent.style.fontSize = readerFontSize + 'px';
});

// ═══════════════════════════════════════════════════════════════════
//   SPLIT SCREEN
// ═══════════════════════════════════════════════════════════════════

function toggleSplitScreen() {
  splitActive = !splitActive;
  const splitBtn = $('splitBtn');
  if (splitActive) {
    splitContainer.style.display = 'flex';
    contentEl.style.display = 'none';
    splitBtn.style.color = 'var(--accent)';
    showToast('⚏ Split screen activated', 'info');
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
      tab.webview.style.display = 'flex';
      tab.webview.style.width = '100%';
      tab.webview.style.height = '100%';
      splitPaneLeft.innerHTML = '';
      splitPaneLeft.appendChild(tab.webview);
    }
  } else {
    splitContainer.style.display = 'none';
    contentEl.style.display = '';
    splitBtn.style.color = '';
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
      splitPaneLeft.innerHTML = '';
      contentEl.appendChild(tab.webview);
      tab.webview.style.display = 'flex';
    }
    showToast('Split screen off', 'info');
  }
}

$('splitBtn').addEventListener('click', toggleSplitScreen);

// ═══════════════════════════════════════════════════════════════════
//   AI CHAT
// ═══════════════════════════════════════════════════════════════════

function openAIChat() {
  if (aiChatOverlay.style.display === 'flex') {
    aiChatOverlay.style.display = 'none';
    return;
  }
  aiChatOverlay.style.display = 'flex';
  if (aiChatBody.innerHTML === '') {
    aiChatBody.innerHTML = `
      <div class="ai-chat-welcome">
        <div style="font-size: 32px; margin-bottom: 12px;">🤖</div>
        <div style="font-weight: 600; margin-bottom: 8px;">AI Assistant</div>
        <div style="font-size: 12px; color: var(--fg-2); line-height: 1.6;">
          Ask questions, get summaries, or search with AI.
        </div>
      </div>
    `;
  }
  aiChatInput.focus();
}

if ($('aiChatClose')) $('aiChatClose').addEventListener('click', () => {
  aiChatOverlay.style.display = 'none';
});

if (aiChatSend) aiChatSend.addEventListener('click', async () => {
  const query = aiChatInput.value.trim();
  if (!query) return;
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-chat-message user';
  userMsg.textContent = query;
  aiChatBody.appendChild(userMsg);
  aiChatInput.value = '';
  const url = `https://chatgpt.com/?q=${encodeURIComponent(query)}`;
  createTab(url, true);
  showToast('Opening ChatGPT...', 'info');
});

if (aiChatInput) aiChatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') aiChatSend.click();
});

// ═══════════════════════════════════════════════════════════════════
//   COMMAND PALETTE
// ═══════════════════════════════════════════════════════════════════

let cmdSelectedIndex = 0;
let cmdItems = [];

function openCommandPalette() {
  cmdOverlay.classList.add('show');
  cmdInput.value = '';
  cmdInput.focus();
  buildCommands('');
}
function closeCommandPalette() {
  cmdOverlay.classList.remove('show');
  cmdSelectedIndex = 0;
}

function buildCommands(query) {
  const q = query.toLowerCase().trim();
  cmdItems = [];
  const commands = [
    { icon: '＋', text: 'New Tab', hint: 'Ctrl+T', action: () => createTab(null, true) },
    { icon: '✕', text: 'Close Current Tab', hint: 'Ctrl+W', action: () => closeTab(activeTabId) },
    { icon: '🕶️', text: 'New Incognito Tab', action: () => createTab('https://www.google.com', true, true) },
    { icon: '🧅', text: torEnabled ? 'Disable Tor' : 'Enable Tor (Dark Web)', action: toggleTor },
    { icon: '🔄', text: 'Reload Page', hint: 'Ctrl+R', action: () => { const tab = tabs.find(t => t.id === activeTabId); if (tab) tab.webview.reload(); }},
    { icon: '☆', text: 'Bookmark This Page', hint: 'Ctrl+D', action: addBookmark },
    { icon: '⭐', text: 'Show Bookmarks', action: () => openPanel('Bookmarks') },
    { icon: '🕐', text: 'Show History', action: () => openPanel('History') },
    { icon: '🔐', text: 'Show Passwords', action: () => openPanel('Passwords') },
    { icon: '📥', text: 'Show Downloads', action: () => openPanel('Downloads') },
    { icon: '📊', text: 'Show Statistics', action: () => openPanel('Statistics') },
    { icon: '📝', text: 'Show Notes', action: () => openPanel('Notes') },
    { icon: '⚙️', text: 'Settings', action: () => openPanel('Settings') },
    { icon: '🌓', text: settings.theme === 'dark' ? 'Light Theme' : 'Dark Theme', action: () => {
      settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
      applyTheme(settings.theme); saveSettings();
      showToast(`Theme: ${settings.theme}`, 'success');
    }},
    { icon: '⛶', text: 'Toggle Fullscreen', hint: 'F11', action: () => window.browserAPI?.toggleFullscreen() },
    { icon: '🔍', text: 'Find in Page', hint: 'Ctrl+F', action: openFindBar },
    { icon: '📸', text: 'Take Screenshot', hint: 'Ctrl+Shift+S', action: () => screenshotBtn.click() },
    { icon: '📖', text: 'Reading Mode', hint: 'Ctrl+Shift+R', action: openReadingMode },
    { icon: '🎬', text: 'Picture-in-Picture', action: () => pipBtn.click() },
    { icon: '📌', text: 'Pin Current Tab', action: () => togglePinTab(activeTabId) },
    { icon: '⚏', text: 'Toggle Split Screen', action: toggleSplitScreen },
    { icon: '🤖', text: 'AI Assistant', action: openAIChat },
  ];
  if (!q) commands.forEach(c => cmdItems.push({ ...c, section: 'Commands' }));
  else commands.filter(c => c.text.toLowerCase().includes(q)).forEach(c => cmdItems.push({ ...c, section: 'Commands' }));

  tabs.forEach(t => {
    if (!t.url) return;
    if (!q || t.title.toLowerCase().includes(q) || t.url.toLowerCase().includes(q))
      cmdItems.push({ icon: '🌐', text: t.title || t.url, hint: 'Tab', section: 'Open Tabs', action: () => switchTab(t.id) });
  });
  bookmarks.forEach(bm => {
    if (!q || (bm.title || '').toLowerCase().includes(q) || bm.url.toLowerCase().includes(q))
      cmdItems.push({ icon: '⭐', text: bm.title || bm.url, hint: 'Bookmark', section: 'Bookmarks', action: () => navigate(bm.url) });
  });
  if (q) {
    history.slice(0, 20).forEach(h => {
      if ((h.title || '').toLowerCase().includes(q) || h.url.toLowerCase().includes(q))
        cmdItems.push({ icon: '🕐', text: h.title || h.url, hint: 'History', section: 'History', action: () => navigate(h.url) });
    });
  }
  if (q && /^[\w-]+\.[\w.-]+/.test(q) && !q.includes(' ')) {
    cmdItems.unshift({ icon: '🚀', text: 'Go to: ' + query, hint: 'Enter', section: 'Navigate', action: () => navigate(query) });
  } else if (q) {
    cmdItems.unshift({ icon: '🔎', text: 'Search: ' + query, hint: 'Enter', section: 'Navigate', action: () => navigate(query) });
  }
  cmdItems = cmdItems.slice(0, 40);
  cmdSelectedIndex = 0;
  renderCommandResults();
}

function renderCommandResults() {
  cmdResults.innerHTML = '';
  if (cmdItems.length === 0) {
    cmdResults.innerHTML = '<div class="cmd-empty">No results found</div>';
    return;
  }
  let lastSection = '';
  cmdItems.forEach((item, i) => {
    if (item.section && item.section !== lastSection) {
      lastSection = item.section;
      const sectionEl = document.createElement('div');
      sectionEl.className = 'cmd-section';
      sectionEl.textContent = item.section;
      cmdResults.appendChild(sectionEl);
    }
    const el = document.createElement('div');
    el.className = 'cmd-item' + (i === cmdSelectedIndex ? ' selected' : '');
    el.innerHTML = `
      <span class="cmd-item-icon">${item.icon}</span>
      <span class="cmd-item-text">${escapeHtml(item.text)}</span>
      ${item.hint ? `<span class="cmd-item-hint">${item.hint}</span>` : ''}
    `;
    el.addEventListener('click', () => { closeCommandPalette(); item.action(); });
    el.addEventListener('mouseenter', () => {
      cmdSelectedIndex = i;
      document.querySelectorAll('.cmd-item').forEach((node, idx) => {
        node.classList.toggle('selected', idx === i);
      });
    });
    cmdResults.appendChild(el);
  });
}

if (cmdInput) {
  cmdInput.addEventListener('input', (e) => buildCommands(e.target.value));
  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cmdSelectedIndex = Math.min(cmdSelectedIndex + 1, cmdItems.length - 1);
      renderCommandResults();
      const sel = cmdResults.querySelector('.cmd-item.selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      cmdSelectedIndex = Math.max(cmdSelectedIndex - 1, 0);
      renderCommandResults();
      const sel = cmdResults.querySelector('.cmd-item.selected');
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const item = cmdItems[cmdSelectedIndex];
      if (item) { closeCommandPalette(); item.action(); }
    }
    if (e.key === 'Escape') closeCommandPalette();
  });
}
if (cmdOverlay) cmdOverlay.addEventListener('click', (e) => {
  if (e.target === cmdOverlay) closeCommandPalette();
});
$('cmdBtn').addEventListener('click', openCommandPalette);

// ═══════════════════════════════════════════════════════════════════
//   FIND IN PAGE
// ═══════════════════════════════════════════════════════════════════

function openFindBar() {
  findOverlay.classList.add('show');
  findInput.focus();
  findInput.select();
}
function closeFindBar() {
  findOverlay.classList.remove('show');
  const tab = tabs.find(t => t.id === activeTabId);
  if (tab) { try { tab.webview.stopFindInPage('clearSelection'); } catch (e) {} }
}
function doFind(forward = true, findNext = false) {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab) return;
  const query = findInput.value;
  if (!query) {
    try { tab.webview.stopFindInPage('clearSelection'); } catch (e) {}
    findCounter.textContent = '0/0';
    return;
  }
  try { tab.webview.findInPage(query, { forward, findNext }); } catch (e) {}
}
if (findInput) {
  findInput.addEventListener('input', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;
    try { tab.webview.findInPage(findInput.value); } catch (e) {}
  });
  findInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doFind(!e.shiftKey, true); }
    if (e.key === 'Escape') closeFindBar();
  });
}
$('findNextBtn').addEventListener('click', () => doFind(true, true));
$('findPrevBtn').addEventListener('click', () => doFind(false, true));
$('findCloseBtn').addEventListener('click', closeFindBar);

// ═══════════════════════════════════════════════════════════════════
//   CONTEXT MENU
// ═══════════════════════════════════════════════════════════════════

const ctxMenu = document.createElement('div');
ctxMenu.className = 'ctx-menu';
document.body.appendChild(ctxMenu);

function showContextMenu(x, y, items) {
  ctxMenu.innerHTML = '';
  items.forEach(item => {
    if (item === '---') {
      const sep = document.createElement('div');
      sep.className = 'ctx-sep';
      ctxMenu.appendChild(sep);
      return;
    }
    const el = document.createElement('div');
    el.className = 'ctx-item' + (item.disabled ? ' disabled' : '');
    el.innerHTML = `
      <span class="ctx-item-icon">${item.icon || ''}</span>
      <span>${item.text}</span>
      ${item.hint ? `<span class="ctx-item-hint">${item.hint}</span>` : ''}
    `;
    if (!item.disabled) {
      el.addEventListener('click', () => { ctxMenu.classList.remove('show'); item.action(); });
    }
    ctxMenu.appendChild(el);
  });
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top = y + 'px';
  ctxMenu.classList.add('show');
  const rect = ctxMenu.getBoundingClientRect();
  if (rect.right > window.innerWidth) ctxMenu.style.left = (window.innerWidth - rect.width - 8) + 'px';
  if (rect.bottom > window.innerHeight) ctxMenu.style.top = (window.innerHeight - rect.height - 8) + 'px';
}
function hideContextMenu() { ctxMenu.classList.remove('show'); }
document.addEventListener('click', hideContextMenu);

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  hideContextMenu();
  const target = e.target;
  if (target.tagName === 'WEBVIEW') {
    const tab = tabs.find(t => t.webview === target);
    if (!tab) return;
    const items = [
      { icon: '◀', text: 'Back', disabled: !tab.webview.canGoBack(), action: () => tab.webview.goBack() },
      { icon: '▶', text: 'Forward', disabled: !tab.webview.canGoForward(), action: () => tab.webview.goForward() },
      { icon: '🔄', text: 'Reload', hint: 'Ctrl+R', action: () => tab.webview.reload() },
      '---',
      { icon: '☆', text: 'Bookmark This Page', hint: 'Ctrl+D', action: addBookmark },
      { icon: '🔗', text: 'Copy Page URL', action: () => { try { navigator.clipboard.writeText(tab.webview.getURL()); showToast('URL copied', 'success'); } catch (err) {} }},
      '---',
      { icon: '🔍', text: 'Find in Page', hint: 'Ctrl+F', action: openFindBar },
      { icon: '📖', text: 'Reading Mode', hint: 'Ctrl+Shift+R', action: openReadingMode },
      { icon: '📸', text: 'Screenshot', hint: 'Ctrl+Shift+S', action: () => screenshotBtn.click() },
      { icon: '🎬', text: 'Picture-in-Picture', action: () => pipBtn.click() },
      '---',
      { icon: '⛶', text: 'Toggle Fullscreen', hint: 'F11', action: () => window.browserAPI?.toggleFullscreen() },
      { icon: '🛠️', text: 'Inspect Element', action: () => { try { tab.webview.openDevTools(); } catch (err) {} }},
    ];
    showContextMenu(e.clientX, e.clientY, items);
  }
});

tabsList.addEventListener('contextmenu', (e) => {
  const tabEl = e.target.closest('.tab');
  if (!tabEl) return;
  e.preventDefault();
  e.stopPropagation();
  const tabId = parseInt(tabEl.dataset.id);
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return;
  showContextMenu(e.clientX, e.clientY, [
    { icon: tab.pinned ? '📍' : '📌', text: tab.pinned ? 'Unpin Tab' : 'Pin Tab', action: () => togglePinTab(tabId) },
    { icon: '🔄', text: 'Reload', action: () => tab.webview.reload() },
    { icon: '🔇', text: 'Mute Tab', action: () => { try { tab.webview.setAudioMuted(!tab.webview.isAudioMuted()); } catch (e) {} }},
    { icon: '📋', text: 'Duplicate Tab', action: () => { let url = ''; try { url = tab.webview.getURL(); } catch (e) {} createTab(url || tab.url, true); }},
    '---',
    { icon: '✕', text: 'Close Tab', hint: 'Ctrl+W', action: () => closeTab(tabId) },
    { icon: '✕', text: 'Close Other Tabs', action: () => { [...tabs].forEach(t => { if (t.id !== tabId) closeTab(t.id); }); }},
  ]);
});

// ═══════════════════════════════════════════════════════════════════
//   DOWNLOAD EVENTS
// ═══════════════════════════════════════════════════════════════════

if (window.browserAPI) {
  window.browserAPI.onDownloadStarted((data) => {
    activeDownloads.push({
      id: data.id, filename: data.filename, url: data.url,
      totalBytes: data.totalBytes, receivedBytes: 0, state: 'progressing',
    });
    showToast(`⬇️ Downloading: ${data.filename}`, 'info');
    if (downloadsFloat) downloadsFloat.style.display = 'block';
    if (currentPanelTitle === 'Downloads') renderPanelContent('Downloads');
  });
  window.browserAPI.onDownloadProgress((data) => {
    const dl = activeDownloads.find(d => d.id === data.id);
    if (dl) {
      dl.receivedBytes = data.receivedBytes;
      dl.totalBytes = data.totalBytes;
      dl.state = data.state;
      if (currentPanelTitle === 'Downloads') renderPanelContent('Downloads');
    }
  });
  window.browserAPI.onDownloadDone((data) => {
    const dl = activeDownloads.find(d => d.id === data.id);
    if (dl) {
      dl.state = data.state;
      dl.path = data.path;
      showToast(data.state === 'completed' ? `✅ Downloaded: ${data.filename}` : `❌ Download failed`, data.state === 'completed' ? 'success' : 'error');
      if (currentPanelTitle === 'Downloads') renderPanelContent('Downloads');
    }
  });
}

const downloadsFloatClose = $('downloadsFloatClose');
if (downloadsFloatClose) {
  downloadsFloatClose.addEventListener('click', () => {
    downloadsFloat.style.display = 'none';
  });
}

// ═══════════════════════════════════════════════════════════════════
//   SHIELD COUNTER
// ═══════════════════════════════════════════════════════════════════

if (window.browserAPI) {
  window.browserAPI.onBlockedCount((n) => { if (blockedCountEl) blockedCountEl.textContent = n; });
  window.browserAPI.onOpenNewTab((url) => createTab(url, true));
  setInterval(async () => {
    try {
      const n = await window.browserAPI.getBlockedCount();
      if (blockedCountEl) blockedCountEl.textContent = n;
    } catch (e) {}
  }, 2000);
}

$('shield').addEventListener('click', async () => {
  if (window.browserAPI) {
    if (confirm('Reset ad-block counter to 0?')) {
      const n = await window.browserAPI.resetBlockedCount();
      if (blockedCountEl) blockedCountEl.textContent = n;
      showToast('Ad counter reset', 'success');
    }
  }
});

// ═══════════════════════════════════════════════════════════════════
//   MENU
// ═══════════════════════════════════════════════════════════════════

$('menuBtn').addEventListener('click', () => openPanel('Settings'));

// ═══════════════════════════════════════════════════════════════════
//   KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;

  if (mod && e.key === 't') { e.preventDefault(); createTab(null, true); }
  if (mod && e.key === 'w') { e.preventDefault(); closeTab(activeTabId); }
  if (mod && e.key === 'l') { e.preventDefault(); urlInput.focus(); urlInput.select(); }
  if (mod && e.key === 'r') { e.preventDefault(); const tab = tabs.find(t => t.id === activeTabId); if (tab) tab.webview.reload(); }
  if (mod && e.key === 'b') {
    e.preventDefault();
    sidebar.classList.toggle('collapsed');
    $('expandSidebar').style.display = sidebar.classList.contains('collapsed') ? 'flex' : 'none';
  }
  if (mod && e.key === 'd') { e.preventDefault(); addBookmark(); }
  if (mod && e.key === '=') { e.preventDefault(); zoomLevel = Math.min(zoomLevel + 1, 8); applyZoom(); }
  if (mod && e.key === '-') { e.preventDefault(); zoomLevel = Math.max(zoomLevel - 1, -5); applyZoom(); }
  if (mod && e.key === '0') { e.preventDefault(); zoomLevel = 0; applyZoom(); }
  if (mod && e.key === 'k') { e.preventDefault(); openCommandPalette(); }
  if (mod && e.key === 'f') { e.preventDefault(); openFindBar(); }
  if (mod && e.shiftKey && (e.key === 'S' || e.key === 's')) { e.preventDefault(); if (screenshotBtn) screenshotBtn.click(); }
  if (mod && e.shiftKey && (e.key === 'R' || e.key === 'r')) { e.preventDefault(); openReadingMode(); }
  if (mod && e.shiftKey && (e.key === 'N' || e.key === 'n')) { e.preventDefault(); createTab('https://www.google.com', true, true); }

  if (e.key === 'F11') { e.preventDefault(); if (window.browserAPI) window.browserAPI.toggleFullscreen(); }
  if (e.key === 'Escape') {
    if (readerOverlay && readerOverlay.classList.contains('show')) { closeReadingMode(); return; }
    if (cmdOverlay && cmdOverlay.classList.contains('show')) { closeCommandPalette(); return; }
    if (findOverlay && findOverlay.classList.contains('show')) { closeFindBar(); return; }
    if (window.browserAPI) {
      window.browserAPI.isFullscreen().then((isFs) => { if (isFs) window.browserAPI.toggleFullscreen(); });
    }
  }
  if (e.altKey && e.key === 'ArrowLeft') {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.webview.canGoBack()) tab.webview.goBack();
  }
  if (e.altKey && e.key === 'ArrowRight') {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.webview.canGoForward()) tab.webview.goForward();
  }
});

// ═══════════════════════════════════════════════════════════════════
//   BOOT
// ═══════════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Universal Browser v5.0 booting...');
  applyTheme(settings.theme);
  renderBookmarks();
  createTab(null, true);
  setTimeout(() => startPage.classList.remove('hidden'), 200);
  if (settings.torEnabled) {
    $('torBtn').style.color = '#a6e3a1';
    torIndicator.style.display = 'flex';
  }
  console.log('✅ Boot complete');
});