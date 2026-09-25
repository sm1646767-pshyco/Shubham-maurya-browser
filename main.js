// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER v5.0.0 — main.js
//   Electron Main Process
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════

const { app, BrowserWindow, ipcMain, session, Menu, shell, webContents, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
//   COMMAND LINE FLAGS
// ═══════════════════════════════════════════════════════════════
app.commandLine.appendSwitch('log-level', '3');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('enable-features', 'WebContentsForceFullscreen');
app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy');

// ═══════════════════════════════════════════════════════════════
//   AD DOMAIN BLACKLIST — 300+ domains
// ═══════════════════════════════════════════════════════════════
const AD_DOMAINS = [
  // Google Ads & Analytics
  'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
  'google-analytics.com', 'googletagmanager.com', 'googletagservices.com',
  'adservice.google.com', 'pagead2.googlesyndication.com',
  'analytics.google.com', 'ssl.google-analytics.com',
  'googlesyndication.com', 'googletagservices.com',
  'adwords.google.com', 'adwords.l.google.com',
  'googleadapis.l.google.com', 'googleads.g.doubleclick.net',
  'googleads4.g.doubleclick.net', 'static.doubleclick.net',
  'stats.g.doubleclick.net', 'cm.g.doubleclick.net',
  'pagead.l.doubleclick.net', 'pubads.g.doubleclick.net',
  'securepubads.g.doubleclick.net', 'tpc.googlesyndication.com',
  'video-ad-stats.googlesyndication.com',

  // Amazon Ads
  'amazon-adsystem.com', 'aax.amazon-adsystem.com',
  'aax-us-east.amazon-adsystem.com', 'c.amazon-adsystem.com',
  'z-na.amazon-adsystem.com', 'fls-na.amazon-adsystem.com',
  'mads.amazon-adsystem.com', 's.amazon-adsystem.com',

  // Facebook / Meta
  'connect.facebook.net', 'graph.facebook.com',
  'business.facebook.com', 'pixel.facebook.com',
  'an.facebook.com', 'tr.facebook.com',

  // Microsoft / Bing
  'bat.bing.com', 'c.bing.com', 'analytics.microsoft.com',
  'clarity.microsoft.com', 'ads.microsoft.com',
  'c1.microsoft.com', 'c2.microsoft.com', 'c3.microsoft.com',

  // Twitter / X
  'static.ads-twitter.com', 'analytics.twitter.com',
  'ads.twitter.com', 't.co/ads', 'syndication.twitter.com',

  // LinkedIn
  'snap.licdn.com', 'px.ads.linkedin.com', 'ads.linkedin.com',

  // TikTok / ByteDance
  'analytics.tiktok.com', 'analytics-ipv6.tiktok.com',
  'business-api.tiktok.com', 'ads.tiktok.com',
  'sf16-va.tiktokcdn.com', 'log.tiktokv.com',

  // Pinterest
  'ads.pinterest.com', 'log.pinterest.com', 'trk.pinterest.com',

  // Snapchat
  'tr.snapchat.com', 'sc-analytics.appspot.com',

  // Major Ad Networks
  'ads.yahoo.com', 'advertising.com', 'adnxs.com', 'adsrvr.org',
  'criteo.com', 'criteo.net', 'taboola.com', 'outbrain.com',
  'pubmatic.com', 'rubiconproject.com', 'openx.net',
  'casalemedia.com', 'smartadserver.com', 'yieldmo.com',
  'sharethrough.com', 'teads.tv', 'spotxchange.com',
  'springserve.com', 'tremorhub.com', 'adcolony.com',
  'applovin.com', 'unityads.unity3d.com', 'vungle.com',
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
  'mediavine.com', 'adthrive.com', 'ezoic.net', 'ezoic.com',
  'monumetric.com', 'pubfuture.com', 'onesignal.com', 'pushcrew.com',
  'pushengage.com', 'izooto.com', 'adition.com',
  'crwdcntrl.net', 'datalogix.com', 'dotomi.com', 'eloqua.com',
  'eyeota.net', 'indexexchange.com', 'marketplace.android.com',
  'ml314.com', 'mookie1.com', 'netmng.com', 'nexac.com',
  'omtrdc.net', 'owneriq.net', 'rfihub.com', 'serving-sys.com',
  'sitescout.com', 'stickyadstv.com', 'tidaltv.com', 'turn.com',
  'vidora.com', 'zeotap.com'
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
  /googlevideo\.com\/.*\/ad/i, /\/csi_204/i, /\/generate_204/i
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
let stats = {
  blocked: 0,
  timeSaved: 0,
  dataSaved: 0,
  sitesVisited: 0,
  startTime: Date.now()
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
//   AD HIDE CSS
// ═══════════════════════════════════════════════════════════════
const AD_HIDE_CSS = `
  /* YouTube */
  .ytp-ad-module,
  .ytp-ad-overlay-container,
  .ytp-ad-progress-list,
  .ytp-ad-image-overlay,
  .ytp-ad-text-overlay,
  .ytp-ad-player-overlay,
  .ytp-ad-player-overlay-flyout-cta,
  .ytp-ad-survey-questions,
  .ytp-ad-survey,
  ytd-promoted-sparkles-web-renderer,
  ytd-promoted-video-renderer,
  ytd-display-ad-renderer,
  ytd-ad-slot-renderer,
  ytd-in-feed-ad-layout-renderer,
  ytd-banner-promo-renderer,
  ytd-statement-banner-renderer,
  ytd-compact-promoted-video-renderer,
  ytd-promoted-sparkles-text-search-renderer,
  #player-ads,
  #masthead-ad,
  .ytp-featured-product,
  .ytp-suggested-action,
  .ytp-paid-content-overlay,
  .ytp-ad-badge,
  .ytp-ad-action-interstitial,
  .ytp-ad-overlay-slot,

  /* Google search */
  .commercial-unit-desktop-top,
  .commercial-unit-desktop-rhs,
  .commercial-unit-mobile-top,
  .commercial-unit-mobile-bottom,
  #tads, #tadsb, #bottomads, #rhsads,
  [data-text-ad="1"], [data-text-ad-slot],

  /* Generic */
  div[aria-label="Ads"],
  div[aria-label="Advertisement"],
  [id^="div-gpt-ad-"],
  [id^="google_ads_iframe_"],
  [id^="aswift_"],
  iframe[id^="google_ads_iframe"],
  iframe[src*="doubleclick.net"],
  iframe[src*="googlesyndication.com"],
  iframe[src*="adservice.google"],
  iframe[src*="/pagead/"],
  ins.adsbygoogle,
  .adsbygoogle,
  .adblock-overlay,
  .adblocker-detected,
  [class*="adblock-warning"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    height: 0 !important;
  }

  /* Protect video player */
  #movie_player,
  .html5-video-player,
  .html5-video-container,
  .html5-main-video,
  video {
    display: revert !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
`;

// ═══════════════════════════════════════════════════════════════
//   AD KILLER JS — Injected into every page
// ═══════════════════════════════════════════════════════════════
const AD_KILLER_JS = `
(function() {
  if (window.__smAdKillerV5) return;
  window.__smAdKillerV5 = true;

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
    '.ytp-ad-module',
    '.ytp-ad-overlay-container',
    '.ytp-ad-progress-list',
    '.ytp-ad-image-overlay',
    '.ytp-ad-text-overlay',
    '.ytp-ad-player-overlay',
    '.ytp-ad-player-overlay-flyout-cta',
    'ytd-promoted-sparkles-web-renderer',
    'ytd-promoted-video-renderer',
    'ytd-display-ad-renderer',
    'ytd-ad-slot-renderer',
    'ytd-in-feed-ad-layout-renderer',
    'ytd-banner-promo-renderer',
    'ytd-statement-banner-renderer',
    'ytd-compact-promoted-video-renderer',
    '#player-ads',
    '#masthead-ad',
    '.commercial-unit-desktop-top',
    '.commercial-unit-desktop-rhs',
    '#tads', '#tadsb', '#bottomads', '#rhsads',
    '[data-text-ad="1"]',
    'ins.adsbygoogle',
    'iframe[id^="google_ads_iframe"]',
    'iframe[src*="doubleclick.net"]',
    'iframe[src*="googlesyndication.com"]',
    'iframe[src*="adservice.google"]',
    'div[id^="div-gpt-ad-"]',
    'div[id^="google_ads_iframe_"]',
    '[class*="adblock-overlay"]',
    '[class*="adblock-warning"]'
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
        '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-slot button'
      );
      if (skipBtn) {
        try { skipBtn.click(); } catch (e) {}
      } else {
        const video = player.querySelector('video');
        if (video && video.duration && video.duration > 0 && isFinite(video.duration)) {
          try {
            video.currentTime = video.duration;
            video.playbackRate = 16;
            video.muted = true;
          } catch (e) {}
        }
      }
      const overlay = document.querySelector('.ytp-ad-overlay-container');
      if (overlay) overlay.style.display = 'none';
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

  // ═══ SponsorBlock ═══
  async function sponsorBlockSkip() {
    if (!location.hostname.includes('youtube.com')) return;
    if (!location.pathname.includes('/watch')) return;
    const video = document.querySelector('video');
    if (!video || !video.duration) return;
    const videoId = new URLSearchParams(location.search).get('v');
    if (!videoId || video.__sbVideoId === videoId) return;
    video.__sbVideoId = videoId;
    try {
      const res = await fetch('https://sponsor.ajay.app/api/skipSegments/' + videoId);
      if (!res.ok) return;
      const segments = await res.json();
      if (segments && segments.length) {
        const checkSkip = () => {
          const t = video.currentTime;
          for (const seg of segments) {
            if (t >= seg.segment[0] && t < seg.segment[1]) {
              video.currentTime = seg.segment[1];
              break;
            }
          }
        };
        video.addEventListener('timeupdate', checkSkip);
      }
    } catch (e) {}
  }

  // ═══ Bypass anti-adblock ═══
  function bypassAntiAdblock() {
    const antiSelectors = [
      '[class*="adblock"]', '[id*="adblock"]',
      '[class*="ad-block"]', '[id*="ad-block"]',
      '[class*="adwall"]', '[class*="ad-wall"]'
    ];
    antiSelectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => {
          if (isProtected(el)) return;
          if (el.tagName === 'BODY' || el.tagName === 'HTML') return;
          el.remove();
        });
      } catch (e) {}
    });
    if (document.body) {
      try {
        document.body.style.overflow = 'auto';
        document.body.style.position = 'static';
      } catch (e) {}
    }
  }

  // Track user mute preference
  document.addEventListener('volumechange', (e) => {
    const v = e.target;
    if (v && v.tagName === 'VIDEO') {
      const p = v.closest('#movie_player');
      if (!p || !p.classList.contains('ad-showing')) v.__userMuted = v.muted;
    }
  }, true);

  // Block popups
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

  // Block push notifications
  if (window.Notification) {
    try { window.Notification.requestPermission = () => Promise.resolve('denied'); } catch (e) {}
  }

  // Main loop
  setInterval(() => {
    removeAds();
    youtubeAdSkip();
    bypassAntiAdblock();
  }, 1000);

  // Mutation observer for instant removal
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes.length) {
        removeAds();
        youtubeAdSkip();
        break;
      }
    }
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      setTimeout(startObserver, 100);
    }
  }
  startObserver();

  sponsorBlockSkip();
  console.log('[Universal Browser] AdKiller v5.0 ✅');
})();
`;

// ═══════════════════════════════════════════════════════════════
//   APPLY AD BLOCK TO SESSION
// ═══════════════════════════════════════════════════════════════
function applyAdBlockToSession(sess) {
  if (sess.__adblockApplied) return;
  sess.__adblockApplied = true;

  sess.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    if (details.resourceType === 'mainFrame') {
      return callback({ cancel: false });
    }
    if (shouldBlock(details.url)) {
      blockedCount++;
      stats.blocked = blockedCount;
      stats.timeSaved += 0.5;
      stats.dataSaved += 50;
      updateBadge();
      return callback({ cancel: true });
    }
    callback({ cancel: false });
  });

  sess.webRequest.onBeforeSendHeaders({ urls: ['<all_urls>'] }, (details, callback) => {
    const headers = details.requestHeaders;
    delete headers['X-Requested-With'];
    if (headers['Referer']) {
      try {
        const refHost = new URL(headers['Referer']).hostname;
        const reqHost = new URL(details.url).hostname;
        if (refHost !== reqHost) delete headers['Referer'];
      } catch {
        delete headers['Referer'];
      }
    }
    callback({ requestHeaders: headers });
  });

  sess.setPermissionRequestHandler((wc, permission, callback) => {
    const allowed = ['fullscreen', 'clipboard-sanitized-write', 'media', 'geolocation'];
    callback(allowed.includes(permission));
  });

  sess.setPermissionCheckHandler((wc, permission) => {
    return ['fullscreen', 'clipboard-sanitized-write', 'media', 'geolocation'].includes(permission);
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
//   DOWNLOADS TRACKER
// ═══════════════════════════════════════════════════════════════
const downloads = [];

function attachDownloadHandler(sess) {
  if (sess.__downloadHandlerAttached) return;
  sess.__downloadHandlerAttached = true;

  sess.on('will-download', (event, item, webContents) => {
    const id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const filename = item.getFilename();
    const url = item.getURL();
    const savePath = path.join(app.getPath('downloads'), filename);

    const download = {
      id,
      filename,
      url,
      path: savePath,
      totalBytes: item.getTotalBytes(),
      receivedBytes: 0,
      state: 'progressing',
      startTime: Date.now()
    };
    downloads.push(download);

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('download-started', {
        id, filename, url, totalBytes: download.totalBytes
      });
    }

    item.on('updated', (e, state) => {
      download.receivedBytes = item.getReceivedBytes();
      download.state = state;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('download-progress', {
          id,
          receivedBytes: download.receivedBytes,
          totalBytes: download.totalBytes,
          state,
          speed: item.getReceivedBytes() / ((Date.now() - download.startTime) / 1000)
        });
      }
    });

    item.once('done', (e, state) => {
      download.state = state;
      download.path = item.getSavePath();
      download.endTime = Date.now();
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('download-done', {
          id,
          state,
          path: download.path,
          filename: download.filename
        });
      }
    });
  });
}

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
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      backgroundThrottling: false,
      spellcheck: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('enter-full-screen', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('fullscreen-changed', true);
    }
  });

  mainWindow.on('leave-full-screen', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('fullscreen-changed', false);
    }
  });

  mainWindow.webContents.on('did-attach-webview', (event, wc) => {
    applyAdBlockToSession(wc.session);
    attachDownloadHandler(wc.session);

    wc.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );

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

// ═══════════════════════════════════════════════════════════════
//   IPC HANDLERS
// ═══════════════════════════════════════════════════════════════
ipcMain.handle('get-blocked-count', () => blockedCount);

ipcMain.handle('reset-blocked-count', () => {
  blockedCount = 0;
  stats = {
    blocked: 0,
    timeSaved: 0,
    dataSaved: 0,
    sitesVisited: 0,
    startTime: Date.now()
  };
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

// Window controls
ipcMain.on('window-minimize', () => mainWindow && mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow && mainWindow.close());

ipcMain.handle('window-toggle-fullscreen', () => {
  if (!mainWindow) return false;
  const isFs = mainWindow.isFullScreen();
  mainWindow.setFullScreen(!isFs);
  return !isFs;
});

ipcMain.handle('window-is-fullscreen', () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
});

// Downloads
ipcMain.handle('get-downloads', () => downloads);
ipcMain.handle('clear-downloads', () => {
  downloads.length = 0;
  return true;
});

ipcMain.on('open-downloaded-file', (e, p) => {
  if (p && fs.existsSync(p)) shell.openPath(p);
});

ipcMain.on('show-in-folder', (e, p) => {
  if (p && fs.existsSync(p)) shell.showItemInFolder(p);
});

ipcMain.on('open-external', (e, url) => {
  if (url && /^https?:\/\//i.test(url)) shell.openExternal(url);
});

// Screenshot
ipcMain.handle('save-screenshot', async (e, dataURL) => {
  try {
    const base64 = dataURL.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const dir = path.join(app.getPath('pictures'), 'UniversalBrowser');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filename = `screenshot-${Date.now()}.png`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);
    return { success: true, path: filepath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Reading Mode
ipcMain.handle('extract-article', async (e) => {
  const wc = e.sender;
  try {
    const result = await wc.executeJavaScript(`
      (function() {
        const title = document.querySelector('h1')?.innerText
                   || document.title || 'Untitled';
        const author = document.querySelector('[rel="author"]')?.innerText
                    || document.querySelector('.author')?.innerText
                    || document.querySelector('[class*="author"]')?.innerText
                    || '';
        const date = document.querySelector('time')?.innerText
                  || document.querySelector('[class*="date"]')?.innerText
                  || '';

        let article = document.querySelector('article')
                   || document.querySelector('[role="main"]')
                   || document.querySelector('main')
                   || document.querySelector('.post-content')
                   || document.querySelector('.article-content')
                   || document.querySelector('.entry-content')
                   || document.querySelector('#content')
                   || document.body;

        const clone = article.cloneNode(true);

        clone.querySelectorAll('script, style, nav, header, footer, aside, iframe, noscript, .ad, .ads, [class*="ad-"], [class*="sidebar"], [class*="comment"], [class*="share"], [class*="social"], button, form, [role="navigation"]').forEach(el => el.remove());

        const blocks = [];
        clone.querySelectorAll('h1, h2, h3, h4, p, blockquote, ul, ol, pre, img').forEach(el => {
          if (el.tagName === 'IMG') {
            const src = el.src || el.dataset.src;
            if (src && src.startsWith('http')) {
              blocks.push({ type: 'img', src, alt: el.alt || '' });
            }
          } else {
            const text = el.innerText.trim();
            if (text.length > 20 || /^H[1-4]$/.test(el.tagName)) {
              blocks.push({
                type: el.tagName.toLowerCase(),
                text
              });
            }
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

// ═══════════════════════════════════════════════════════════════
//   APP LIFECYCLE
// ═══════════════════════════════════════════════════════════════
app.whenReady().then(() => {
  app.setName('Universal Browser');

  applyAdBlockToSession(session.defaultSession);
  attachDownloadHandler(session.defaultSession);
  session.defaultSession.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  const wvSession = session.fromPartition('persist:browser');
  applyAdBlockToSession(wvSession);
  attachDownloadHandler(wvSession);
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
// ═══════════════════════════════════════════════
//   AI INTEGRATION — OpenAI GPT-4
// ═══════════════════════════════════════════════
require('dotenv').config();
const OpenAI = require('openai');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

ipcMain.handle('ai-chat', async (e, messages) => {
  if (!openai) {
    return { success: false, error: 'OpenAI API key not set in .env' };
  }
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

ipcMain.handle('ai-summarize', async (e, pageContent) => {
  if (!openai) return { success: false, error: 'API key missing' };
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Summarize webpages concisely.' },
        { role: 'user', content: 'Summarize this page:\n\n' + pageContent.substring(0, 8000) }
      ],
      max_tokens: 500
    });
    return { success: true, text: response.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('ai-translate', async (e, text, targetLang) => {
  if (!openai) return { success: false, error: 'API key missing' };
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a translator. Translate accurately.' },
        { role: 'user', content: 'Translate to ' + targetLang + ':\n\n' + text }
      ],
      max_tokens: 2000
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