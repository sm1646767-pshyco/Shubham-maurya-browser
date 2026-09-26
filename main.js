// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER v6.0.0 — main.js
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════

const { app, BrowserWindow, ipcMain, session, Menu, shell, webContents } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

app.commandLine.appendSwitch('log-level', '3');
app.commandLine.appendSwitch('disable-logging');

// ═══════════════════════════════════════════════════════════════
//   PRIVACY + SECURITY FLAGS — DAY 11
// ═══════════════════════════════════════════════════════════════
app.commandLine.appendSwitch('enable-features', 'DnsOverHttps,UseDnsHttpsSvcbAlpn,PartitionedCookies,StoragePartitioning');
app.commandLine.appendSwitch('dns-over-https-templates', 'https://cloudflare-dns.com/dns-query');
app.commandLine.appendSwitch('force-fieldtrials', 'DnsOverHttps/Enabled');
app.commandLine.appendSwitch('disable-features', 'InterestCohortAPI,TrackingProtection');
app.commandLine.appendSwitch('block-new-web-contents');

// ═══════════════════════════════════════════════════════════════
//   ENV + OPENAI
// ═══════════════════════════════════════════════════════════════
require('dotenv').config();
let openai = null;
try {
  const OpenAI = require('openai');
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('[AI] OpenAI initialized ✅');
  } else {
    console.warn('[AI] OPENAI_API_KEY missing in .env');
  }
} catch (e) {
  console.warn('[AI] OpenAI package not installed:', e.message);
}

// ═══════════════════════════════════════════════════════════════
//   AD DOMAINS
// ═══════════════════════════════════════════════════════════════
const AD_DOMAINS = [
  'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
  'google-analytics.com', 'googletagmanager.com', 'googletagservices.com',
  'adservice.google.com', 'pagead2.googlesyndication.com',
  'analytics.google.com', 'ssl.google-analytics.com',
  'ads.yahoo.com', 'advertising.com', 'adnxs.com', 'adsrvr.org',
  'amazon-adsystem.com', 'criteo.com', 'criteo.net', 'taboola.com',
  'outbrain.com', 'pubmatic.com', 'rubiconproject.com', 'openx.net',
  'casalemedia.com', 'smartadserver.com', 'yieldmo.com', 'sharethrough.com',
  'teads.tv', 'spotxchange.com', 'springserve.com', 'tremorhub.com',
  'adcolony.com', 'applovin.com', 'unityads.unity3d.com', 'vungle.com',
  'chartboost.com', 'inmobi.com', 'mopub.com', 'smaato.net',
  'adform.net', 'adsafeprotected.com', 'bluekai.com', 'demdex.net',
  'krxd.net', 'mathtag.com', 'exelator.com', 'agkn.com', 'rlcdn.com',
  'tapad.com', 'bidswitch.net', 'contextweb.com', 'gumgum.com',
  'indexww.com', 'lijit.com', 'media.net', 'sovrn.com', 'sonobi.com',
  'tribalfusion.com', 'yieldbot.com', 'zemanta.com', 'adroll.com',
  'buysellads.com', 'carbonads.com', 'carbonads.net', 'propellerads.com',
  'popads.net', 'popcash.net', 'adf.ly', 'shorte.st', 'ouo.io', 'bc.vc',
  'linkvertise.com', 'adsterra.com', 'hilltopads.net', 'exoclick.com',
  'juicyads.com', 'trafficjunky.com', 'trafficfactory.biz', 'plugrush.com',
  'revcontent.com', 'mgid.com', 'zergnet.com', 'dable.io', 'adblade.com',
  'bidvertiser.com', 'infolinks.com', 'kontera.com', 'vibrantmedia.com',
  'yumenetworks.com', 'adnium.com', 'exponential.com', 'specificclick.net',
  'atwola.com', 'adsonar.com', 'pointroll.com', 'burstnet.com',
  'fastclick.net', 'adbrite.com', 'adknowledge.com', 'kanoodle.com',
  'looksmart.com', 'miva.com', 'quigo.com', 'realmedia.com',
  'tacoda.com', 'valueclick.com', 'yieldmanager.com', 'zedo.com',
  'adzerk.net', 'adsnative.com', 'adsupply.com', 'adswizz.com',
  'adtechus.com', 'anrtx.com', 'admob.com', 'adfox.ru', 'adriver.ru',
  'lentainform.com', 'smi2.ru', 'marketgid.com', 'luxup.ru',
  'mytarget.ru', 'ironsrc.com', 'supersonicads.com', 'adjust.com',
  'appsflyer.com', 'branch.io', 'kochava.com',
  'scorecardresearch.com', 'quantserve.com', 'moatads.com',
  'hotjar.com', 'mouseflow.com', 'crazyegg.com', 'luckyorange.com',
  'clarity.ms', 'fullstory.com', 'smartlook.com', 'logrocket.com',
  'connect.facebook.net', 'bat.bing.com', 'analytics.tiktok.com',
  'ads.pinterest.com', 'static.ads-twitter.com', 'analytics.twitter.com',
  'mediavine.com', 'adthrive.com', 'ezoic.net', 'ezoic.com',
  'monumetric.com', 'pubfuture.com', 'onesignal.com', 'pushcrew.com',
  'pushengage.com', 'izooto.com'
];

const AD_URL_PATTERNS = [
  /[\/\-_.]ads?[\/\-_.]/i, /\/advert/i, /\/banner/i, /\/popup/i,
  /\/popunder/i, /\/sponsor/i, /\/telemetry/i, /\/tracking/i,
  /\/track[\/\?]/i, /\/pixel/i, /\/beacon/i, /\/impression/i,
  /\/pagead/i, /\/adserver/i, /\/adframe/i, /\/prebid/i,
  /\/gpt\.js/i, /\/gtag\//i, /\/gtm\.js/i, /\/fbevents/i,
  /\/ga\.js/i, /\/analytics\.js/i, /\/adsbygoogle/i, /\/googletag/i,
  /\/doubleclick/i, /\/advertisement/i, /\/ad_banner/i,
  /\/ad-container/i, /\/adsystem/i, /\/adblock/i,
  /youtube\.com\/api\/stats\/ads/i, /youtube\.com\/pagead/i,
  /youtube\.com\/ptracking/i, /youtube\.com\/get_midroll/i,
  /googlevideo\.com\/.*\/ad/i, /\/csi_204/i
];

const WHITELIST = [
  'google.com/recaptcha', 'gstatic.com/recaptcha',
  'cloudflare.com/cdn-cgi', 'js.stripe.com', 'checkout.stripe.com',
  'paypal.com', 'accounts.google.com', 'login.microsoftonline.com',
  'apple.com', 'github.com', 'githubusercontent.com',
  'youtube.com/watch', 'youtube.com/embed', 'youtube.com/shorts',
  'ytimg.com', 'googlevideo.com/videoplayback',
  'googlevideo.com/initplayback', 'googleapis.com',
  'gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com',
  'cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com',
  'youtube.com/youtubei', 'youtube.com/generate_204',
  'chatgpt.com', 'chat.openai.com', 'openai.com', 'oaistatic.com',
  'oaiusercontent.com', 'claude.ai', 'anthropic.com',
  'gemini.google.com', 'bard.google.com',
  'wikipedia.org', 'wikimedia.org', 'stackoverflow.com',
  'reddit.com', 'redd.it', 'twitter.com', 'x.com',
  'instagram.com', 'facebook.com', 'linkedin.com'
];

let blockedCount = 0;
let stats = { blocked: 0, timeSaved: 0, dataSaved: 0, sitesVisited: 0, startTime: Date.now() };

// ═══════════════════════════════════════════════════════════════
//   PRIVACY STATS — DAY 11
// ═══════════════════════════════════════════════════════════════
let privacyStats = {
  trackersBlocked: 0,
  cookiesBlocked: 0,
  httpsUpgrades: 0,
  fingerprintBlocked: 0,
  permissionsDenied: 0
};

function shouldBlock(url) {
  try {
    const lower = url.toLowerCase();
    for (const w of WHITELIST) if (lower.includes(w)) return false;
    for (const d of AD_DOMAINS) if (lower.includes(d)) return true;
    for (const p of AD_URL_PATTERNS) if (p.test(url)) return true;
    return false;
  } catch { return false; }
}

// ═══════════════════════════════════════════════════════════════
//   AD HIDE CSS + JS
// ═══════════════════════════════════════════════════════════════
const AD_HIDE_CSS = `
  .ytp-ad-module, .ytp-ad-overlay-container, .ytp-ad-progress-list,
  .ytp-ad-image-overlay, .ytp-ad-text-overlay, .ytp-ad-player-overlay,
  ytd-promoted-sparkles-web-renderer, ytd-promoted-video-renderer,
  ytd-display-ad-renderer, ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer,
  #player-ads, #masthead-ad, .commercial-unit-desktop-top,
  #tads, #tadsb, #bottomads, #rhsads, [data-text-ad="1"],
  ins.adsbygoogle, iframe[id^="google_ads_iframe"],
  iframe[src*="doubleclick.net"], iframe[src*="googlesyndication.com"],
  div[id^="div-gpt-ad-"] { display: none !important; }
  #movie_player, .html5-video-player, video {
    display: revert !important; visibility: visible !important;
    opacity: 1 !important; pointer-events: auto !important;
  }
`;

const AD_KILLER_JS = `
(function() {
  if (window.__smAdKillerV6) return;
  window.__smAdKillerV6 = true;
  function isProtected(el) {
    if (!el) return true;
    if (el.id === 'movie_player') return true;
    if (el.closest && el.closest('#movie_player')) return true;
    if (el.closest && el.closest('.html5-video-player')) return true;
    if (el.tagName === 'VIDEO') return true;
    if (['HTML','BODY','HEAD','MAIN'].includes(el.tagName)) return true;
    return false;
  }
  const selectors = [
    '.ytp-ad-module', '.ytp-ad-overlay-container',
    'ytd-promoted-sparkles-web-renderer', 'ytd-display-ad-renderer',
    '#player-ads', '#masthead-ad', '#tads', '#tadsb',
    'ins.adsbygoogle', 'iframe[src*="doubleclick.net"]',
    'div[id^="div-gpt-ad-"]'
  ];
  function removeAds() {
    selectors.forEach(function(sel) {
      try {
        document.querySelectorAll(sel).forEach(function(el) {
          if (isProtected(el)) return;
          el.remove();
        });
      } catch(e) {}
    });
  }
  function youtubeAdSkip() {
    if (!location.hostname.includes('youtube.com')) return;
    var player = document.getElementById('movie_player');
    if (!player) return;
    var isAd = player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting');
    if (isAd) {
      var skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button');
      if (skipBtn) skipBtn.click();
      else {
        var video = player.querySelector('video');
        if (video && video.duration && isFinite(video.duration)) {
          try { video.currentTime = video.duration; video.playbackRate = 16; video.muted = true; } catch(e) {}
        }
      }
    }
  }
  setInterval(function() { removeAds(); youtubeAdSkip(); }, 1000);
  console.log('[AdKiller] ✅ Installed');
})();
`;

// ═══════════════════════════════════════════════════════════════
//   APPLY AD BLOCK + PRIVACY TO SESSION
// ═══════════════════════════════════════════════════════════════
function applyAdBlockToSession(sess) {
  if (sess.__adblockApplied) return;
  sess.__adblockApplied = true;

  // ═══ AD BLOCKING ═══
  sess.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    if (details.resourceType === 'mainFrame') return callback({ cancel: false });
    if (shouldBlock(details.url)) {
      blockedCount++;
      stats.blocked = blockedCount;
      stats.timeSaved += 0.5;
      stats.dataSaved += 50;
      privacyStats.trackersBlocked++;
      updateBadge();
      return callback({ cancel: true });
    }
    callback({ cancel: false });
  });

  // ═══ HTTPS UPGRADE (Day 11) ═══
  sess.webRequest.onBeforeRequest({ urls: ['http://*/*'] }, (details, callback) => {
    if (details.resourceType === 'mainFrame') {
      const httpsUrl = details.url.replace(/^http:\/\//i, 'https://');
      privacyStats.httpsUpgrades++;
      return callback({ redirectURL: httpsUrl });
    }
    callback({ cancel: false });
  });

  // ═══ ANTI-TRACKING HEADERS (Day 11) ═══
  sess.webRequest.onBeforeSendHeaders({ urls: ['<all_urls>'] }, (details, callback) => {
    const headers = details.requestHeaders;

    // Remove tracking headers
    delete headers['X-Client-Data'];
    delete headers['X-Google-Apps-Framework'];

    // Add DNT headers
    headers['DNT'] = '1';
    headers['Sec-GPC'] = '1';

    // Remove referer for cross-site
    if (headers['Referer']) {
      try {
        const refHost = new URL(headers['Referer']).hostname;
        const reqHost = new URL(details.url).hostname;
        if (refHost !== reqHost) delete headers['Referer'];
      } catch (e) {
        delete headers['Referer'];
      }
    }

    callback({ requestHeaders: headers });
  });

  // ═══ PERMISSIONS (Day 11 — strict) ═══
  sess.setPermissionRequestHandler((wc, permission, callback) => {
    const allowed = ['fullscreen', 'clipboard-sanitized-write'];
    if (!allowed.includes(permission)) {
      privacyStats.permissionsDenied++;
    }
    callback(allowed.includes(permission));
  });

  sess.setPermissionCheckHandler((wc, permission) => {
    return ['fullscreen', 'clipboard-sanitized-write'].includes(permission);
  });
}

function injectAdKiller(wc) {
  wc.insertCSS(AD_HIDE_CSS).catch(() => {});
  wc.executeJavaScript(AD_KILLER_JS, true).catch(() => {});
  wc.on('did-navigate-in-page', () => {
    wc.insertCSS(AD_HIDE_CSS).catch(() => {});
    wc.executeJavaScript(AD_KILLER_JS, true).catch(() => {});
  });
}

// ═══════════════════════════════════════════════════════════════
//   RECENTLY CLOSED TABS — DAY 6
// ═══════════════════════════════════════════════════════════════
let recentlyClosed = [];

function addToRecentlyClosed(url, title) {
  if (!url || url === 'about:blank') return;
  recentlyClosed.unshift({ url, title: title || url, time: Date.now() });
  if (recentlyClosed.length > 20) recentlyClosed.pop();
}

ipcMain.handle('get-recently-closed', () => recentlyClosed);
ipcMain.handle('clear-recently-closed', () => {
  recentlyClosed = [];
  return true;
});

// ═══════════════════════════════════════════════════════════════
//   PERFORMANCE MONITORING — DAY 10
// ═══════════════════════════════════════════════════════════════
let perfStats = {
  cpuHistory: [],
  memHistory: [],
  startTime: Date.now()
};

function getPerformanceStats() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  let totalIdle = 0, totalTick = 0;
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  const cpuUsage = 100 - ~~(100 * totalIdle / totalTick);

  const processMem = process.memoryUsage();
  const uptime = Math.round((Date.now() - perfStats.startTime) / 1000);

  return {
    cpu: cpuUsage,
    ram: {
      used: usedMem,
      total: totalMem,
      percent: Math.round((usedMem / totalMem) * 100)
    },
    process: {
      heapUsed: processMem.heapUsed,
      heapTotal: processMem.heapTotal,
      rss: processMem.rss
    },
    uptime: uptime,
    platform: process.platform,
    cpuModel: cpus[0] ? cpus[0].model : 'Unknown',
    cpuCores: cpus.length
  };
}

ipcMain.handle('get-performance-stats', () => {
  const s = getPerformanceStats();
  perfStats.cpuHistory.push(s.cpu);
  perfStats.memHistory.push(s.ram.percent);
  if (perfStats.cpuHistory.length > 60) perfStats.cpuHistory.shift();
  if (perfStats.memHistory.length > 60) perfStats.memHistory.shift();
  return s;
});

ipcMain.handle('get-performance-history', () => ({
  cpu: perfStats.cpuHistory,
  mem: perfStats.memHistory
}));

ipcMain.handle('cleanup-memory', () => {
  try {
    if (global.gc) global.gc();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ═══════════════════════════════════════════════════════════════
//   PRIVACY & SECURITY HANDLERS — DAY 11
// ═══════════════════════════════════════════════════════════════
ipcMain.handle('get-privacy-stats', () => privacyStats);

ipcMain.handle('reset-privacy-stats', () => {
  privacyStats = {
    trackersBlocked: 0,
    cookiesBlocked: 0,
    httpsUpgrades: 0,
    fingerprintBlocked: 0,
    permissionsDenied: 0
  };
  return privacyStats;
});

ipcMain.handle('clear-all-cookies', async () => {
  try {
    await session.defaultSession.clearStorageData({
      storages: ['cookies', 'localstorage', 'indexdb', 'websql', 'shadercache', 'cachestorage']
    });
    const wvSession = session.fromPartition('persist:browser');
    await wvSession.clearStorageData({
      storages: ['cookies', 'localstorage', 'indexdb', 'websql', 'shadercache', 'cachestorage']
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('clear-cache', async () => {
  try {
    await session.defaultSession.clearCache();
    const wvSession = session.fromPartition('persist:browser');
    await wvSession.clearCache();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('set-privacy-setting', (e, key, value) => {
  console.log('[Privacy] Setting:', key, '=', value);
  return { success: true };
});

// ═══════════════════════════════════════════════════════════════
//   MAIN WINDOW
// ═══════════════════════════════════════════════════════════════
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Universal Browser',
    backgroundColor: '#1e1e2e',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
      partition: 'persist:browser',
      webSecurity: true
    }
  });

  mainWindow.loadFile('index.html');

  // ═══ CLIPBOARD SHORTCUTS ═══
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    const isMac = process.platform === 'darwin';
    const cmd = isMac ? input.meta : input.control;

    if (cmd && input.key.toLowerCase() === 'c') {
      mainWindow.webContents.copy();
      event.preventDefault();
    }
    if (cmd && input.key.toLowerCase() === 'v') {
      mainWindow.webContents.paste();
      event.preventDefault();
    }
    if (cmd && input.key.toLowerCase() === 'x') {
      mainWindow.webContents.cut();
      event.preventDefault();
    }
    if (cmd && input.key.toLowerCase() === 'a') {
      mainWindow.webContents.selectAll();
      event.preventDefault();
    }
    if (cmd && input.key.toLowerCase() === 'z' && !input.shift) {
      mainWindow.webContents.undo();
      event.preventDefault();
    }
    if (cmd && input.shift && input.key.toLowerCase() === 'z') {
      mainWindow.webContents.redo();
      event.preventDefault();
    }
    if (input.key === 'F12') {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
    if (input.meta && input.alt && input.key.toLowerCase() === 'i') {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  mainWindow.webContents.on('did-attach-webview', (event, wc) => {
    // ═══ WEBVIEW CLIPBOARD SHORTCUTS ═══
    wc.on('before-input-event', (event, input) => {
      if (input.type !== 'keyDown') return;
      const isMac = process.platform === 'darwin';
      const cmd = isMac ? input.meta : input.control;
      const key = input.key.toLowerCase();

      if (cmd && key === 'c') { wc.copy(); event.preventDefault(); }
      if (cmd && key === 'v') { wc.paste(); event.preventDefault(); }
      if (cmd && key === 'x') { wc.cut(); event.preventDefault(); }
      if (cmd && key === 'a') { wc.selectAll(); event.preventDefault(); }
    });

    applyAdBlockToSession(wc.session);
    wc.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    wc.on('did-finish-load', () => injectAdKiller(wc));
    wc.on('dom-ready', () => injectAdKiller(wc));
    wc.setWindowOpenHandler(({ url }) => {
      if (shouldBlock(url)) return { action: 'deny' };
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('open-new-tab', url);
      return { action: 'deny' };
    });
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (shouldBlock(url)) return { action: 'deny' };
    mainWindow.webContents.send('open-new-tab', url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

function updateBadge() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('blocked-count', blockedCount);
  }
}

// ═══════════════════════════════════════════════════════════════
//   IPC — BASIC
// ═══════════════════════════════════════════════════════════════
ipcMain.handle('get-blocked-count', () => blockedCount);
ipcMain.handle('reset-blocked-count', () => {
  blockedCount = 0;
  stats = { blocked: 0, timeSaved: 0, dataSaved: 0, sitesVisited: 0, startTime: Date.now() };
  updateBadge();
  return blockedCount;
});
ipcMain.handle('get-stats', () => stats);
ipcMain.handle('increment-sites', () => { stats.sitesVisited++; return stats.sitesVisited; });

ipcMain.on('webview-ready', (e, id) => {
  const wc = webContents.fromId(id);
  if (wc) { applyAdBlockToSession(wc.session); injectAdKiller(wc); }
});

ipcMain.handle('window-toggle-fullscreen', () => {
  if (!mainWindow) return false;
  const isFs = mainWindow.isFullScreen();
  mainWindow.setFullScreen(!isFs);
  return !isFs;
});
ipcMain.handle('window-is-fullscreen', () => mainWindow ? mainWindow.isFullScreen() : false);

ipcMain.handle('save-screenshot', async (e, dataURL) => {
  try {
    const base64 = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const dir = path.join(app.getPath('pictures'), 'UniversalBrowser');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filepath = path.join(dir, 'screenshot-' + Date.now() + '.png');
    fs.writeFileSync(filepath, buffer);
    return { success: true, path: filepath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('extract-article', async (e) => {
  const wc = e.sender;
  try {
    const result = await wc.executeJavaScript(`
      (function() {
        var title = (document.querySelector('h1') || {}).innerText || document.title || 'Untitled';
        var article = document.querySelector('article') || document.querySelector('main') || document.body;
        var clone = article.cloneNode(true);
        clone.querySelectorAll('script, style, nav, header, footer, aside, iframe, .ad, .ads, [class*="ad-"]').forEach(function(el) { el.remove(); });
        var blocks = [];
        clone.querySelectorAll('h1, h2, h3, h4, p, blockquote, pre, img').forEach(function(el) {
          if (el.tagName === 'IMG') {
            if (el.src && el.src.startsWith('http')) blocks.push({ type: 'img', src: el.src, alt: el.alt || '' });
          } else {
            var text = el.innerText.trim();
            if (text.length > 20) blocks.push({ type: el.tagName.toLowerCase(), text: text });
          }
        });
        return { title: title, blocks: blocks };
      })();
    `, true);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ═══════════════════════════════════════════════════════════════
//   AI HANDLERS — DAY 1-4
// ═══════════════════════════════════════════════════════════════

ipcMain.handle('ai-chat', async (e, messages) => {
  if (!openai) return { success: false, error: 'OpenAI API key not set' };
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-summarize', async (e, content) => {
  if (!openai) return { success: false, error: 'OpenAI API key not set' };
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Summarize this webpage concisely with bullet points.' },
        { role: 'user', content: content.substring(0, 8000) }
      ],
      max_tokens: 500
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-page-content', async (e) => {
  const wc = e.sender;
  try {
    const text = await wc.executeJavaScript(
      'document.body ? document.body.innerText.substring(0, 15000) : ""',
      true
    );
    return { success: true, text: text };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-ask-page', async (e, question) => {
  if (!openai) return { success: false, error: 'OpenAI API key not set' };
  const wc = e.sender;
  try {
    const pageContent = await wc.executeJavaScript(
      'document.body ? document.body.innerText.substring(0, 12000) : ""',
      true
    );
    if (!pageContent || pageContent.length < 50) {
      return { success: false, error: 'Page content too short' };
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Answer questions based ONLY on this page content. If not in content, say "Not found in this page."\n\n=== PAGE ===\n' + pageContent + '\n=== END ===' },
        { role: 'user', content: question }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-translate', async (e, text, targetLang) => {
  if (!openai) return { success: false, error: 'OpenAI API key not set' };
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Translate to ' + targetLang + '. Only return translation.' },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-translate-page', async (e, targetLang) => {
  if (!openai) return { success: false, error: 'OpenAI API key not set' };
  const wc = e.sender;
  try {
    const pageContent = await wc.executeJavaScript(
      'document.body ? document.body.innerText.substring(0, 8000) : ""',
      true
    );
    if (!pageContent) return { success: false, error: 'No content' };
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Translate this webpage content to ' + targetLang + '. Preserve structure.' },
        { role: 'user', content: pageContent }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-detect-language', async (e) => {
  if (!openai) return { success: false, error: 'OpenAI API key not set' };
  const wc = e.sender;
  try {
    const sample = await wc.executeJavaScript(
      'document.body ? document.body.innerText.substring(0, 500) : ""',
      true
    );
    if (!sample) return { success: false, error: 'No content' };
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Detect language. Return ONLY the language name in English.' },
        { role: 'user', content: sample }
      ],
      temperature: 0,
      max_tokens: 20
    });
    return { success: true, language: response.choices[0].message.content.trim() };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-get-selection', async (e) => {
  const wc = e.sender;
  try {
    const text = await wc.executeJavaScript(
      'window.getSelection ? window.getSelection().toString() : ""',
      true
    );
    return { success: true, text: text || '' };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ═══════════════════════════════════════════════════════════════
//   VOICE HANDLERS — DAY 4
// ═══════════════════════════════════════════════════════════════
ipcMain.handle('voice-save-settings', async (e, settings) => {
  try {
    const settingsPath = path.join(app.getPath('userData'), 'voice-settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('voice-load-settings', async () => {
  try {
    const settingsPath = path.join(app.getPath('userData'), 'voice-settings.json');
    if (fs.existsSync(settingsPath)) {
      return { success: true, settings: JSON.parse(fs.readFileSync(settingsPath, 'utf8')) };
    }
    return { success: true, settings: {} };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ═══════════════════════════════════════════════════════════════
//   APP LIFECYCLE
// ═══════════════════════════════════════════════════════════════
app.whenReady().then(() => {
  app.setName('Universal Browser');

  applyAdBlockToSession(session.defaultSession);
  session.defaultSession.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  const wvSession = session.fromPartition('persist:browser');
  applyAdBlockToSession(wvSession);
  wvSession.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ═══ APPLICATION MENU ═══
const menu = Menu.buildFromTemplate([
  {
    label: 'Universal Browser',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { role: 'close' }
    ]
  }
]);
Menu.setApplicationMenu(menu);