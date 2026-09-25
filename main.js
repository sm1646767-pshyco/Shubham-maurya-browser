const { app, BrowserWindow, ipcMain, session, Menu, shell, webContents } = require('electron');
const path = require('path');
const fs = require('fs');

app.commandLine.appendSwitch('log-level', '3');
app.commandLine.appendSwitch('disable-logging');

// ═══ AD DOMAINS ═══
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
  'chatgpt.com', 'chat.openai.com', 'openai.com',
  'claude.ai', 'anthropic.com',
  'instagram.com', 'facebook.com', 'fbcdn.net',
  'twitter.com', 'x.com', 'linkedin.com', 'reddit.com',
  'whatsapp.com', 'telegram.org', 'discord.com',
  'wikipedia.org', 'stackoverflow.com',
  'amazon.com', 'flipkart.com', 'netflix.com', 'spotify.com',
  'mail.google.com', 'outlook.live.com', 'drive.google.com'
];

let blockedCount = 0;
let stats = { blocked: 0, timeSaved: 0, dataSaved: 0, sitesVisited: 0 };

function shouldBlock(url) {
  try {
    const lower = url.toLowerCase();
    for (const w of WHITELIST) if (lower.includes(w)) return false;
    for (const d of AD_DOMAINS) if (lower.includes(d)) return true;
    for (const p of AD_URL_PATTERNS) if (p.test(url)) return true;
    return false;
  } catch { return false; }
}

const AD_HIDE_CSS = `
  .ytp-ad-module, .ytp-ad-overlay-container, .ytp-ad-progress-list,
  .ytp-ad-image-overlay, .ytp-ad-text-overlay, .ytp-ad-player-overlay,
  .ytp-ad-player-overlay-flyout-cta, .ytp-ad-survey-questions, .ytp-ad-survey,
  ytd-promoted-sparkles-web-renderer, ytd-promoted-video-renderer,
  ytd-display-ad-renderer, ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer,
  ytd-banner-promo-renderer, ytd-statement-banner-renderer,
  ytd-compact-promoted-video-renderer, ytd-promoted-sparkles-text-search-renderer,
  #player-ads, #masthead-ad, .ytp-featured-product, .ytp-suggested-action,
  .commercial-unit-desktop-top, .commercial-unit-desktop-rhs,
  .commercial-unit-mobile-top, .commercial-unit-mobile-bottom,
  #tads, #tadsb, #bottomads, #rhsads, [data-text-ad="1"], [data-text-ad-slot],
  div[aria-label="Ads"], div[aria-label="Advertisement"],
  [id^="div-gpt-ad-"], [id^="google_ads_iframe_"], [id^="aswift_"],
  iframe[id^="google_ads_iframe"], iframe[src*="doubleclick.net"],
  iframe[src*="googlesyndication.com"], iframe[src*="adservice.google"],
  iframe[src*="/pagead/"], ins.adsbygoogle, .adsbygoogle {
    display: none !important;
  }
  #movie_player, .html5-video-player, .html5-video-container,
  .html5-main-video, video {
    display: revert !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
`;

const AD_KILLER_JS = `
(function() {
  if (window.__adKillerInstalled) return;
  window.__adKillerInstalled = true;

  function isProtected(el) {
    if (!el) return true;
    if (el.id === 'movie_player') return true;
    if (el.id === 'player') return true;
    if (el.closest && el.closest('#movie_player')) return true;
    if (el.closest && el.closest('.html5-video-player')) return true;
    if (el.closest && el.closest('.html5-video-container')) return true;
    if (el.tagName === 'VIDEO') return true;
    if (el.tagName === 'SOURCE') return true;
    if (el.tagName === 'TRACK') return true;
    if (['HTML','BODY','HEAD','MAIN'].includes(el.tagName)) return true;
    return false;
  }

  const adSelectors = [
    '.ytp-ad-module', '.ytp-ad-overlay-container', '.ytp-ad-progress-list',
    '.ytp-ad-image-overlay', '.ytp-ad-text-overlay', '.ytp-ad-player-overlay',
    '.ytp-ad-player-overlay-flyout-cta',
    'ytd-promoted-sparkles-web-renderer', 'ytd-promoted-video-renderer',
    'ytd-display-ad-renderer', 'ytd-ad-slot-renderer',
    'ytd-in-feed-ad-layout-renderer', 'ytd-banner-promo-renderer',
    'ytd-statement-banner-renderer', 'ytd-compact-promoted-video-renderer',
    '#player-ads', '#masthead-ad',
    '.commercial-unit-desktop-top', '.commercial-unit-desktop-rhs',
    '#tads', '#tadsb', '#bottomads', '#rhsads', '[data-text-ad="1"]',
    'ins.adsbygoogle', 'iframe[id^="google_ads_iframe"]',
    'iframe[src*="doubleclick.net"]', 'iframe[src*="googlesyndication.com"]',
    'iframe[src*="adservice.google"]', 'div[id^="div-gpt-ad-"]',
    'div[id^="google_ads_iframe_"]'
  ];

  function removeAds() {
    for (const sel of adSelectors) {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (isProtected(el)) return;
          el.remove();
        });
      } catch (e) {}
    }
  }

  function youtubeAdSkip() {
    if (!location.hostname.includes('youtube.com')) return;
    const player = document.getElementById('movie_player');
    if (!player) return;
    const isAd = player.classList.contains('ad-showing')
              || player.classList.contains('ad-interrupting');
    if (isAd) {
      const skipBtn = document.querySelector(
        '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button'
      );
      if (skipBtn) skipBtn.click();
      else {
        const video = player.querySelector('video');
        if (video && video.duration && video.duration > 0 && isFinite(video.duration)) {
          try {
            video.currentTime = video.duration;
            video.playbackRate = 16;
            video.muted = true;
          } catch (e) {}
        }
      }
    } else {
      const video = player.querySelector('video');
      if (video) {
        try {
          if (video.playbackRate > 2) video.playbackRate = 1;
          if (video.muted && !video.__userMuted) video.muted = false;
        } catch (e) {}
      }
    }
  }

  const origOpen = window.open;
  window.open = function(url, ...args) {
    if (!url) return null;
    const lower = String(url).toLowerCase();
    const bad = ['doubleclick', 'googlesyndication', 'adservice',
                 'popads', 'popcash', 'propellerads', 'adsterra',
                 'popunder', '/ads/'];
    if (bad.some(b => lower.includes(b))) return null;
    return origOpen.call(window, url, ...args);
  };

  if (window.Notification) {
    try { window.Notification.requestPermission = () => Promise.resolve('denied'); } catch (e) {}
  }

  setInterval(() => { removeAds(); youtubeAdSkip(); }, 1000);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes.length) { removeAds(); youtubeAdSkip(); break; }
    }
  });

  function startObserver() {
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    else setTimeout(startObserver, 100);
  }
  startObserver();
})();
`;

function applyAdBlockToSession(sess) {
  if (sess.__adblockApplied) return;
  sess.__adblockApplied = true;

  sess.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    if (details.resourceType === 'mainFrame') return callback({ cancel: false });
    if (shouldBlock(details.url)) {
      blockedCount++;
      stats.blocked = blockedCount;
      updateBadge();
      return callback({ cancel: true });
    }
    callback({ cancel: false });
  });

  sess.setPermissionRequestHandler((wc, permission, callback) => {
    callback(['fullscreen', 'clipboard-sanitized-write'].includes(permission));
  });

  sess.setPermissionCheckHandler((wc, permission) => {
    return ['fullscreen', 'clipboard-sanitized-write'].includes(permission);
  });
}

function injectAdKiller(wc) {
  wc.insertCSS(AD_HIDE_CSS).catch(() => {});
  wc.executeJavaScript(AD_KILLER_JS, true).catch(() => {});
}

// ═══════════════════════════════════════════════
//   MAIN WINDOW
// ═══════════════════════════════════════════════
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Universal Browser',
    backgroundColor: '#1e1e2e',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 16, y: 16 },
    fullscreenable: true,
    maximizable: true,
    resizable: true,
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
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-attach-webview', (event, wc) => {
    applyAdBlockToSession(wc.session);

    wc.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );

    wc.setMaxListeners(50);

    // Copy-paste
    wc.on('before-input-event', (event, input) => {
      const isMac = process.platform === 'darwin';
      const mod = isMac ? input.meta : input.control;
      if (mod && input.type === 'keyDown' && !input.shift) {
        const key = input.key.toLowerCase();
        if (key === 'c') { wc.copy(); event.preventDefault(); }
        if (key === 'v') { wc.paste(); event.preventDefault(); }
        if (key === 'x') { wc.cut(); event.preventDefault(); }
        if (key === 'a') { wc.selectAll(); event.preventDefault(); }
      }
    });

    // Right-click menu
    wc.on('context-menu', (e, params) => {
      const menu = Menu.buildFromTemplate([
        { label: 'Cut', role: 'cut', enabled: params.editFlags.canCut },
        { label: 'Copy', role: 'copy', enabled: params.editFlags.canCopy },
        { label: 'Paste', role: 'paste', enabled: params.editFlags.canPaste },
        { type: 'separator' },
        { label: 'Select All', role: 'selectAll' },
        { type: 'separator' },
        { label: 'Inspect Element', click: () => wc.inspectElement(params.x, params.y) }
      ]);
      menu.popup();
    });

    wc.on('did-finish-load', () => injectAdKiller(wc));
    wc.on('dom-ready', () => injectAdKiller(wc));

    wc.setWindowOpenHandler(({ url }) => {
      if (shouldBlock(url)) return { action: 'deny' };
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('open-new-tab', url);
      }
      return { action: 'deny' };
    });

    wc.on('will-navigate', (ev, url) => {
      if (shouldBlock(url)) ev.preventDefault();
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

// ═══ IPC ═══
ipcMain.handle('get-blocked-count', () => blockedCount);
ipcMain.handle('reset-blocked-count', () => {
  blockedCount = 0;
  updateBadge();
  return blockedCount;
});
ipcMain.handle('get-stats', () => stats);
ipcMain.handle('increment-sites', () => {
  stats.sitesVisited++;
  return stats.sitesVisited;
});

ipcMain.on('webview-ready', (e, id) => {
  const wc = webContents.fromId(id);
  if (wc) {
    applyAdBlockToSession(wc.session);
    injectAdKiller(wc);
  }
});

ipcMain.handle('window-toggle-fullscreen', () => {
  if (!mainWindow) return false;
  const isFs = mainWindow.isFullScreen();
  mainWindow.setFullScreen(!isFs);
  return !isFs;
});

ipcMain.handle('window-is-fullscreen', () => mainWindow ? mainWindow.isFullScreen() : false);

ipcMain.handle('tor-toggle', async (e, enable) => {
  const wvSession = session.fromPartition('persist:browser');
  if (enable) {
    await wvSession.setProxy({ proxyRules: 'socks5://127.0.0.1:9050', proxyBypassRules: '<local>' });
  } else {
    await wvSession.setProxy({ proxyRules: '' });
  }
  return { success: true, enabled: enable };
});

ipcMain.handle('save-screenshot', async (e, dataURL) => {
  try {
    const base64 = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const dir = path.join(app.getPath('pictures'), 'UniversalBrowser');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filepath = path.join(dir, `screenshot-${Date.now()}.png`);
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
        const title = document.querySelector('h1')?.innerText || document.title || 'Untitled';
        const author = document.querySelector('[rel="author"]')?.innerText || '';
        const date = document.querySelector('time')?.innerText || '';
        let article = document.querySelector('article') || document.querySelector('main') || document.body;
        const clone = article.cloneNode(true);
        clone.querySelectorAll('script, style, nav, header, footer, aside, iframe, noscript, button, form').forEach(el => el.remove());
        const blocks = [];
        clone.querySelectorAll('h1, h2, h3, h4, p, blockquote, ul, ol, pre, img').forEach(el => {
          if (el.tagName === 'IMG') {
            const src = el.src;
            if (src && src.startsWith('http')) blocks.push({ type: 'img', src, alt: el.alt || '' });
          } else {
            const text = el.innerText.trim();
            if (text.length > 20 || /^H[1-4]$/.test(el.tagName))
              blocks.push({ type: el.tagName.toLowerCase(), text });
          }
        });
        return { title, author, date, blocks, url: location.href };
      })();
    `, true);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.on('open-external', (e, url) => {
  if (url && /^https?:\/\//i.test(url)) shell.openExternal(url);
});

ipcMain.on('open-downloaded-file', (e, p) => {
  if (p && fs.existsSync(p)) shell.openPath(p);
});

ipcMain.on('show-in-folder', (e, p) => {
  if (p && fs.existsSync(p)) shell.showItemInFolder(p);
});

// ═══ LIFECYCLE ═══
app.whenReady().then(() => {
  app.setName('Universal Browser');

  applyAdBlockToSession(session.defaultSession);
  session.defaultSession.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  const wvSession = session.fromPartition('persist:browser');
  applyAdBlockToSession(wvSession);
  wvSession.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

Menu.setApplicationMenu(null);