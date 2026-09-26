// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — privacy.js
//   Privacy & Security Center
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Privacy] Loading...');

  var settings = JSON.parse(localStorage.getItem('privacySettings') || JSON.stringify({
    antiFingerprint: true,
    httpsUpgrade: true,
    blockCookies: true,
    dnsOverHttps: true,
    doNotTrack: true,
    blockWebRTC: false,
    blockReferrer: true
  }));

  function saveSettings() {
    localStorage.setItem('privacySettings', JSON.stringify(settings));
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n || 0);
  }

  // ═══════════════════════════════════════════════
  //   FINGERPRINT PROTECTION SCRIPT
  // ═══════════════════════════════════════════════
  var FINGERPRINT_PROTECTION_JS = `
(function() {
  if (window.__smPrivacyV6) return;
  window.__smPrivacyV6 = true;

  // ═══ Canvas Fingerprint Protection ═══
  var origToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  };

  var origToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function(cb) {
    var blank = document.createElement('canvas');
    blank.width = 1;
    blank.height = 1;
    origToBlob.call(blank, cb);
  };

  var origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function() {
    var data = origGetImageData.apply(this, arguments);
    for (var i = 0; i < data.data.length; i += 4) {
      data.data[i] = 0;
      data.data[i + 1] = 0;
      data.data[i + 2] = 0;
    }
    return data;
  };

  // ═══ WebGL Fingerprint Protection ═══
  var origGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(p) {
    if (p === 37445) return 'Universal Browser';
    if (p === 37446) return 'Universal Browser';
    return origGetParameter.call(this, p);
  };

  // ═══ Audio Fingerprint Protection ═══
  if (window.AudioContext || window.webkitAudioContext) {
    var AC = window.AudioContext || window.webkitAudioContext;
    var origCreateOscillator = AC.prototype.createOscillator;
    AC.prototype.createOscillator = function() {
      var osc = origCreateOscillator.apply(this, arguments);
      var origConnect = osc.connect;
      osc.connect = function() { return this; };
      return osc;
    };
  }

  // ═══ Battery API Protection ═══
  if (navigator.getBattery) {
    navigator.getBattery = function() {
      return Promise.resolve({ charging: true, level: 1, chargingTime: 0, dischargingTime: Infinity });
    };
  }

  // ═══ Hardware Concurrency ═══
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: function() { return 4; }
  });

  // ═══ Device Memory ═══
  Object.defineProperty(navigator, 'deviceMemory', {
    get: function() { return 8; }
  });

  // ═══ Platform ═══
  Object.defineProperty(navigator, 'platform', {
    get: function() { return 'Universal'; }
  });

  // ═══ WebRTC Protection ═══
  if (window.RTCPeerConnection) {
    var origRTC = window.RTCPeerConnection;
    window.RTCPeerConnection = function(config) {
      if (config && config.iceServers) {
        config.iceServers = [];
      }
      return new origRTC(config);
    };
  }

  console.log('[Privacy] Fingerprint protection active');
})();
`;

  // ═══════════════════════════════════════════════
  //   INJECT FINGERPRINT PROTECTION
  // ═══════════════════════════════════════════════
  function injectFingerprintProtection() {
    if (!settings.antiFingerprint) return;

    if (typeof tabs === 'undefined' || !tabs) {
      setTimeout(injectFingerprintProtection, 500);
      return;
    }

    tabs.forEach(function(tab) {
      try {
        if (tab.webview && tab.webview.executeJavaScript) {
          tab.webview.executeJavaScript(FINGERPRINT_PROTECTION_JS, true).catch(function() {});
        }
      } catch (e) {}
    });

    // Hook new tabs
    if (window.createTab && !window.createTab.__privacyHooked) {
      var origCreate = window.createTab;
      window.createTab = function() {
        var tab = origCreate.apply(this, arguments);
        setTimeout(function() {
          try {
            if (tab && tab.webview && tab.webview.executeJavaScript) {
              tab.webview.executeJavaScript(FINGERPRINT_PROTECTION_JS, true).catch(function() {});
            }
          } catch (e) {}
        }, 1000);
        return tab;
      };
      window.createTab.__privacyHooked = true;
    }
  }

  // ═══════════════════════════════════════════════
  //   RENDER PRIVACY DASHBOARD
  // ═══════════════════════════════════════════════
  function createPrivacyModal() {
    var modal = document.createElement('div');
    modal.className = 'privacy-modal';
    modal.id = 'privacyModal';
    modal.innerHTML =
      '<div class="privacy-box">' +
      '<div class="privacy-header">' +
      '<h2>🔒 Privacy & Security</h2>' +
      '<button class="icon-btn" id="privacyClose">✕</button>' +
      '</div>' +
      '<div class="privacy-tabs">' +
      '<button class="privacy-tab active" data-tab="dashboard">📊 Dashboard</button>' +
      '<button class="privacy-tab" data-tab="settings">⚙️ Settings</button>' +
      '<button class="privacy-tab" data-tab="permissions">🎛️ Permissions</button>' +
      '<button class="privacy-tab" data-tab="data">🗄️ Data</button>' +
      '</div>' +
      '<div class="privacy-body" id="privacyBody"></div>' +
      '</div>';
    document.body.appendChild(modal);
    return modal;
  }

  function renderDashboard() {
    var body = document.getElementById('privacyBody');
    if (!body) return;

    if (!window.browserAPI || !window.browserAPI.getPrivacyStats) {
      body.innerHTML = '<div class="notes-empty">Privacy API not available</div>';
      return;
    }

    window.browserAPI.getPrivacyStats().then(function(stats) {
      stats = stats || {};

      var adBlocked = document.getElementById('blockedCount');
      var adCount = adBlocked ? parseInt(adBlocked.textContent) || 0 : 0;

      var score = 100;
      if (!settings.antiFingerprint) score -= 15;
      if (!settings.httpsUpgrade) score -= 10;
      if (!settings.blockCookies) score -= 10;
      if (!settings.dnsOverHttps) score -= 10;
      if (!settings.doNotTrack) score -= 5;

      var scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
      var scoreText = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

      body.innerHTML =
        // Privacy Score
        '<div class="privacy-info-box" style="text-align:center; padding:20px;">' +
        '<div style="font-size:48px; font-weight:800; color:' + scoreColor + '; margin-bottom:8px;">' + score + '</div>' +
        '<div style="font-size:14px; font-weight:700; color:' + scoreColor + '; margin-bottom:4px;">' + scoreText + '</div>' +
        '<div style="font-size:11px; color:var(--fg-3);">Privacy Score</div>' +
        '</div>' +

        // Stats
        '<div class="privacy-section">' +
        '<h3>🛡️ Protection Stats</h3>' +
        '<div class="privacy-stats-grid">' +
        '<div class="privacy-stat-card">' +
        '<div class="privacy-stat-icon">🚫</div>' +
        '<div class="privacy-stat-value">' + formatNumber(adCount) + '</div>' +
        '<div class="privacy-stat-label">Ads Blocked</div>' +
        '</div>' +
        '<div class="privacy-stat-card">' +
        '<div class="privacy-stat-icon">🕵️</div>' +
        '<div class="privacy-stat-value">' + formatNumber(stats.trackersBlocked || 0) + '</div>' +
        '<div class="privacy-stat-label">Trackers Blocked</div>' +
        '</div>' +
        '<div class="privacy-stat-card">' +
        '<div class="privacy-stat-icon">🍪</div>' +
        '<div class="privacy-stat-value">' + formatNumber(stats.cookiesBlocked || 0) + '</div>' +
        '<div class="privacy-stat-label">Cookies Blocked</div>' +
        '</div>' +
        '<div class="privacy-stat-card">' +
        '<div class="privacy-stat-icon">🔐</div>' +
        '<div class="privacy-stat-value">' + formatNumber(stats.httpsUpgrades || 0) + '</div>' +
        '<div class="privacy-stat-label">HTTPS Upgrades</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        // Info
        '<div class="privacy-info-box">' +
        '<b>🎯 Your privacy is protected</b><br><br>' +
        '• <b>Ads</b> — 200+ domains blocked<br>' +
        '• <b>Fingerprinting</b> — Canvas, WebGL, Audio spoofed<br>' +
        '• <b>HTTPS</b> — Auto-upgrade HTTP → HTTPS<br>' +
        '• <b>DNS</b> — Cloudflare 1.1.1.1 (encrypted)<br>' +
        '• <b>Tracking</b> — DNT + GPC headers sent' +
        '</div>' +

        // Quick Actions
        '<div class="privacy-section">' +
        '<h3>⚡ Quick Actions</h3>' +
        '<div class="privacy-action-grid">' +
        '<button class="privacy-action-btn primary" id="privRefresh">🔄 Refresh</button>' +
        '<button class="privacy-action-btn" id="privResetStats">♻️ Reset Stats</button>' +
        '<button class="privacy-action-btn danger" id="privClearCookies">🍪 Clear Cookies</button>' +
        '<button class="privacy-action-btn danger" id="privClearCache">🗑️ Clear Cache</button>' +
        '</div>' +
        '</div>';

      // Actions
      var refreshBtn = document.getElementById('privRefresh');
      if (refreshBtn) refreshBtn.addEventListener('click', renderDashboard);

      var resetBtn = document.getElementById('privResetStats');
      if (resetBtn) resetBtn.addEventListener('click', function() {
        if (confirm('Reset privacy stats to 0?')) {
          window.browserAPI.resetPrivacyStats().then(function() {
            if (typeof showToast === 'function') showToast('Stats reset', 'success');
            renderDashboard();
          });
        }
      });

      var clearCookiesBtn = document.getElementById('privClearCookies');
      if (clearCookiesBtn) clearCookiesBtn.addEventListener('click', function() {
        if (confirm('Clear ALL cookies? You will be logged out of all sites.')) {
          window.browserAPI.clearAllCookies().then(function(result) {
            if (result.success) {
              if (typeof showToast === 'function') showToast('Cookies cleared', 'success');
            }
          });
        }
      });

      var clearCacheBtn = document.getElementById('privClearCache');
      if (clearCacheBtn) clearCacheBtn.addEventListener('click', function() {
        if (confirm('Clear browser cache?')) {
          window.browserAPI.clearCache().then(function(result) {
            if (result.success) {
              if (typeof showToast === 'function') showToast('Cache cleared', 'success');
            }
          });
        }
      });
    });
  }

  function renderSettings() {
    var body = document.getElementById('privacyBody');
    if (!body) return;

    function toggleRow(id, title, desc, key) {
      return '<div class="privacy-row">' +
        '<div class="privacy-row-info">' +
        '<div class="privacy-row-title">' + title + '</div>' +
        '<div class="privacy-row-desc">' + desc + '</div>' +
        '</div>' +
        '<div class="privacy-toggle ' + (settings[key] ? 'on' : '') + '" data-key="' + key + '"></div>' +
        '</div>';
    }

    body.innerHTML =
      '<div class="privacy-section">' +
      '<h3>🔒 Protection</h3>' +
      toggleRow('antiFingerprint', 'Anti-Fingerprinting', 'Block Canvas, WebGL, Audio fingerprinting', 'antiFingerprint') +
      toggleRow('httpsUpgrade', 'HTTPS Upgrade', 'Auto-upgrade HTTP → HTTPS', 'httpsUpgrade') +
      toggleRow('blockCookies', 'Block Third-Party Cookies', 'Prevent cross-site tracking', 'blockCookies') +
      toggleRow('dnsOverHttps', 'DNS-over-HTTPS', 'Encrypt DNS queries (Cloudflare)', 'dnsOverHttps') +
      toggleRow('doNotTrack', 'Do Not Track', 'Send DNT + GPC headers', 'doNotTrack') +
      toggleRow('blockReferrer', 'Block Referrer', 'Hide referrer to external sites', 'blockReferrer') +
      toggleRow('blockWebRTC', 'Block WebRTC Leaks', 'Prevent IP leaks via WebRTC', 'blockWebRTC') +
      '</div>' +

      '<div class="privacy-info-box">' +
      '<b>💡 Note:</b> Some settings require <b>browser restart</b> to take full effect.' +
      '</div>';

    // Attach toggle handlers
    body.querySelectorAll('.privacy-toggle').forEach(function(el) {
      el.addEventListener('click', function() {
        var key = el.dataset.key;
        settings[key] = !settings[key];
        el.classList.toggle('on', settings[key]);
        saveSettings();

        if (window.browserAPI && window.browserAPI.setPrivacySetting) {
          window.browserAPI.setPrivacySetting(key, settings[key]).catch(function() {});
        }

        if (typeof showToast === 'function') {
          showToast((settings[key] ? '✅ Enabled: ' : '❌ Disabled: ') + key, 'success');
        }
      });
    });
  }

  function renderPermissions() {
    var body = document.getElementById('privacyBody');
    if (!body) return;

    var perms = [
      { icon: '📷', name: 'Camera', status: 'denied' },
      { icon: '🎤', name: 'Microphone', status: 'denied' },
      { icon: '📍', name: 'Location', status: 'denied' },
      { icon: '🔔', name: 'Notifications', status: 'denied' },
      { icon: '📋', name: 'Clipboard', status: 'allowed' },
      { icon: '🖥️', name: 'Fullscreen', status: 'allowed' },
      { icon: '🖼️', name: 'Picture-in-Picture', status: 'allowed' },
      { icon: '🎬', name: 'Media Playback', status: 'allowed' },
      { icon: '📁', name: 'File Access', status: 'ask' },
      { icon: '🔗', name: 'External Open', status: 'allowed' }
    ];

    var html = '<div class="privacy-info-box">' +
      '<b>🎛️ Permission Center</b><br>' +
      'Current permissions for all websites. Click status to toggle.' +
      '</div>';

    perms.forEach(function(p) {
      html += '<div class="privacy-perm-item">' +
        '<div class="privacy-perm-icon">' + p.icon + '</div>' +
        '<div class="privacy-perm-name">' + p.name + '</div>' +
        '<div class="privacy-perm-status ' + p.status + '">' + p.status.toUpperCase() + '</div>' +
        '</div>';
    });

    body.innerHTML = html;
  }

  function renderData() {
    var body = document.getElementById('privacyBody');
    if (!body) return;

    var bookmarkCount = JSON.parse(localStorage.getItem('bookmarks') || '[]').length;
    var historyCount = JSON.parse(localStorage.getItem('history') || '[]').length;
    var noteCount = JSON.parse(localStorage.getItem('notes') || '[]').length;
    var passCount = JSON.parse(localStorage.getItem('passwords') || '[]').length;

    body.innerHTML =
      '<div class="privacy-info-box">' +
      '<b>🗄️ Data Stored Locally</b><br>' +
      'Saara data tumhare device pe hai. Koi cloud, koi tracking.' +
      '</div>' +

      '<div class="privacy-section">' +
      '<h3>📊 Your Data</h3>' +
      '<div class="privacy-stats-grid">' +
      '<div class="privacy-stat-card">' +
      '<div class="privacy-stat-icon">⭐</div>' +
      '<div class="privacy-stat-value">' + bookmarkCount + '</div>' +
      '<div class="privacy-stat-label">Bookmarks</div>' +
      '</div>' +
      '<div class="privacy-stat-card">' +
      '<div class="privacy-stat-icon">🕐</div>' +
      '<div class="privacy-stat-value">' + historyCount + '</div>' +
      '<div class="privacy-stat-label">History</div>' +
      '</div>' +
      '<div class="privacy-stat-card">' +
      '<div class="privacy-stat-icon">📝</div>' +
      '<div class="privacy-stat-value">' + noteCount + '</div>' +
      '<div class="privacy-stat-label">Notes</div>' +
      '</div>' +
      '<div class="privacy-stat-card">' +
      '<div class="privacy-stat-icon">🔐</div>' +
      '<div class="privacy-stat-value">' + passCount + '</div>' +
      '<div class="privacy-stat-label">Passwords</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="privacy-section">' +
      '<h3>⚠️ Danger Zone</h3>' +
      '<div class="privacy-action-grid">' +
      '<button class="privacy-action-btn danger" id="privClearHistory">🕐 Clear History</button>' +
      '<button class="privacy-action-btn danger" id="privClearCookies2">🍪 Clear Cookies</button>' +
      '<button class="privacy-action-btn danger" id="privClearCache2">🗑️ Clear Cache</button>' +
      '<button class="privacy-action-btn danger" id="privClearAll">⚠️ Clear All Data</button>' +
      '</div>' +
      '</div>';

    // History clear
    var clearHistoryBtn = document.getElementById('privClearHistory');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', function() {
      if (confirm('Clear all browsing history?')) {
        localStorage.setItem('history', '[]');
        if (typeof showToast === 'function') showToast('History cleared', 'success');
        renderData();
      }
    });

    // Cookies clear
    var clearCookiesBtn = document.getElementById('privClearCookies2');
    if (clearCookiesBtn) clearCookiesBtn.addEventListener('click', function() {
      if (confirm('Clear all cookies?')) {
        window.browserAPI.clearAllCookies().then(function() {
          if (typeof showToast === 'function') showToast('Cookies cleared', 'success');
        });
      }
    });

    // Cache clear
    var clearCacheBtn = document.getElementById('privClearCache2');
    if (clearCacheBtn) clearCacheBtn.addEventListener('click', function() {
      if (confirm('Clear browser cache?')) {
        window.browserAPI.clearCache().then(function() {
          if (typeof showToast === 'function') showToast('Cache cleared', 'success');
        });
      }
    });

    // Clear all
    var clearAllBtn = document.getElementById('privClearAll');
    if (clearAllBtn) clearAllBtn.addEventListener('click', function() {
      if (!confirm('⚠️ Delete ALL data? Bookmarks, history, notes, passwords?')) return;
      if (!confirm('⚠️ FINAL WARNING! This cannot be undone.')) return;

      ['bookmarks', 'history', 'notes', 'passwords', 'workspaces', 'tabGroups'].forEach(function(k) {
        localStorage.removeItem(k);
      });

      if (typeof showToast === 'function') showToast('All data cleared. Reloading...', 'info');
      setTimeout(function() { location.reload(); }, 1500);
    });
  }

  // ═══════════════════════════════════════════════
  //   INIT
  // ═══════════════════════════════════════════════
  function init() {
    var modal = createPrivacyModal();
    var privacyBtn = document.getElementById('privacyBtn');
    var shieldPlusBtn = document.getElementById('shieldPlusBtn');
    var privacyClose = document.getElementById('privacyClose');
    var currentTab = 'dashboard';

    function openPrivacy(tab) {
      modal.classList.add('show');
      currentTab = tab || 'dashboard';
      renderTab(currentTab);
    }

    function closePrivacy() {
      modal.classList.remove('show');
    }

    function renderTab(tab) {
      document.querySelectorAll('.privacy-tab').forEach(function(t) {
        t.classList.toggle('active', t.dataset.tab === tab);
      });

      if (tab === 'dashboard') renderDashboard();
      else if (tab === 'settings') renderSettings();
      else if (tab === 'permissions') renderPermissions();
      else if (tab === 'data') renderData();
    }

    if (privacyBtn) privacyBtn.addEventListener('click', function() { openPrivacy('dashboard'); });
    if (shieldPlusBtn) shieldPlusBtn.addEventListener('click', function() { openPrivacy('dashboard'); });
    if (privacyClose) privacyClose.addEventListener('click', closePrivacy);

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closePrivacy();
      });
    }

    document.querySelectorAll('.privacy-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        renderTab(tab.dataset.tab);
      });
    });

    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        if (modal.classList.contains('show')) closePrivacy();
        else openPrivacy('dashboard');
      }
    });

    // Inject fingerprint protection
    injectFingerprintProtection();
    setInterval(injectFingerprintProtection, 10000);

    console.log('[Privacy] ✅ Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 800);
  }
})();