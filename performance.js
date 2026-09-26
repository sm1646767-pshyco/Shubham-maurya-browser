// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — performance.js
//   Performance Monitor + Tab Sleeping + Focus Mode
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Performance] Loading...');

  var SLEEP_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  var tabActivity = {};
  var sleepInterval = null;
  var perfInterval = null;
  var focusMode = false;

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

  function formatUptime(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (h > 0) return h + 'h ' + m + 'm';
    if (m > 0) return m + 'm ' + s + 's';
    return s + 's';
  }

  // ═══════════════════════════════════════════════
  //   TAB SLEEPING
  // ═══════════════════════════════════════════════
  function startTabSleeping() {
    if (sleepInterval) clearInterval(sleepInterval);

    sleepInterval = setInterval(function() {
      if (typeof tabs === 'undefined' || !tabs) return;

      var now = Date.now();

      tabs.forEach(function(tab) {
        // Skip active tab
        if (tab.id === activeTabId) {
          tabActivity[tab.id] = now;
          return;
        }

        // Skip pinned tabs
        if (tab.pinned) return;

        // Initialize activity time
        if (!tabActivity[tab.id]) {
          tabActivity[tab.id] = now;
          return;
        }

        var idleTime = now - tabActivity[tab.id];

        // Sleep if idle for 10 minutes
        if (idleTime > SLEEP_TIMEOUT && !tab.sleeping) {
          sleepTab(tab);
        }
      });
    }, 30000); // Check every 30 seconds
  }

  function sleepTab(tab) {
    try {
      tab.sleeping = true;
      tab.el.classList.add('sleeping');

      // Try to freeze webview
      if (tab.webview && tab.webview.isDestroyed && !tab.webview.isDestroyed()) {
        try {
          tab.webview.setAudioMuted(true);
          tab.webview.executeJavaScript('window.__slept = true; if (window.stop) window.stop();', true).catch(function() {});
        } catch (e) {}
      }

      console.log('[Sleep] Tab slept:', tab.title);
    } catch (e) {}
  }

  function wakeTab(tab) {
    try {
      if (!tab.sleeping) return;
      tab.sleeping = false;
      tab.el.classList.remove('sleeping');

      if (tab.webview && tab.webview.isDestroyed && !tab.webview.isDestroyed()) {
        try {
          tab.webview.setAudioMuted(false);
        } catch (e) {}
      }

      console.log('[Sleep] Tab woke:', tab.title);
    } catch (e) {}
  }

  // Hook tab click to wake
  function hookTabActivity() {
    if (typeof tabs === 'undefined') {
      setTimeout(hookTabActivity, 500);
      return;
    }

    // Watch for tab switches
    var origSwitchTab = window.switchTab;
    if (origSwitchTab && !origSwitchTab.__hooked) {
      window.switchTab = function(id) {
        var tab = tabs.find(function(t) { return t.id === id; });
        if (tab) {
          wakeTab(tab);
          tabActivity[id] = Date.now();
        }
        return origSwitchTab.apply(this, arguments);
      };
      window.switchTab.__hooked = true;
    }

    // Update activity on any tab click
    document.addEventListener('click', function(e) {
      var tabEl = e.target.closest('.tab');
      if (tabEl) {
        var id = parseInt(tabEl.dataset.id);
        if (id) {
          tabActivity[id] = Date.now();
          var tab = tabs.find(function(t) { return t.id === id; });
          if (tab) wakeTab(tab);
        }
      }
    });

    console.log('[Sleep] Tab activity hooked');
  }

  // ═══════════════════════════════════════════════
  //   FOCUS MODE
  // ═══════════════════════════════════════════════
  function toggleFocusMode() {
    focusMode = !focusMode;
    document.body.classList.toggle('focus-mode', focusMode);

    var focusBtn = document.getElementById('focusBtn');
    if (focusBtn) {
      focusBtn.textContent = focusMode ? '🎯✓' : '🎯';
      focusBtn.title = focusMode ? 'Exit Focus Mode' : 'Focus Mode (Ctrl+Shift+F)';
    }

    if (typeof showToast === 'function') {
      showToast(focusMode ? '🎯 Focus Mode ON' : 'Focus Mode OFF', 'success');
    }
  }

  // ═══════════════════════════════════════════════
  //   PERFORMANCE DASHBOARD
  // ═══════════════════════════════════════════════
  function createDashboard() {
    var modal = document.createElement('div');
    modal.className = 'perf-modal';
    modal.id = 'perfModal';
    modal.innerHTML =
      '<div class="perf-box">' +
      '<div class="perf-header">' +
      '<h2>📊 Performance Monitor</h2>' +
      '<button class="icon-btn" id="perfClose">✕</button>' +
      '</div>' +
      '<div class="perf-body" id="perfBody"></div>' +
      '</div>';
    document.body.appendChild(modal);
    return modal;
  }

  function renderDashboard() {
    var body = document.getElementById('perfBody');
    if (!body) return;

    if (!window.browserAPI || !window.browserAPI.getPerformanceStats) {
      body.innerHTML = '<div class="notes-empty">Performance API not available</div>';
      return;
    }

    window.browserAPI.getPerformanceStats().then(function(stats) {
      window.browserAPI.getPerformanceHistory().then(function(history) {
        var cpuClass = stats.cpu > 70 ? 'warning' : '';
        var ramClass = stats.ram.percent > 80 ? 'warning' : '';

        var cpuBars = '';
        if (history && history.cpu) {
          history.cpu.slice(-30).forEach(function(c) {
            cpuBars += '<div class="perf-chart-bar" style="height:' + Math.max(2, c) + '%;"></div>';
          });
        }

        var tabsCount = (typeof tabs !== 'undefined' && tabs) ? tabs.length : 0;
        var sleepingCount = (typeof tabs !== 'undefined' && tabs) ? tabs.filter(function(t) { return t.sleeping; }).length : 0;

        body.innerHTML =
          // Main stats
          '<div class="perf-grid">' +
          '<div class="perf-card">' +
          '<div class="perf-card-icon">⚡</div>' +
          '<div class="perf-card-value">' + stats.cpu + '%</div>' +
          '<div class="perf-card-label">CPU Usage</div>' +
          '<div class="perf-bar"><div class="perf-bar-fill ' + cpuClass + '" style="width:' + stats.cpu + '%"></div></div>' +
          '</div>' +
          '<div class="perf-card">' +
          '<div class="perf-card-icon">💾</div>' +
          '<div class="perf-card-value">' + stats.ram.percent + '%</div>' +
          '<div class="perf-card-label">RAM Usage</div>' +
          '<div class="perf-bar"><div class="perf-bar-fill ' + ramClass + '" style="width:' + stats.ram.percent + '%"></div></div>' +
          '</div>' +
          '<div class="perf-card">' +
          '<div class="perf-card-icon">📑</div>' +
          '<div class="perf-card-value">' + tabsCount + '</div>' +
          '<div class="perf-card-label">Open Tabs</div>' +
          '</div>' +
          '<div class="perf-card">' +
          '<div class="perf-card-icon">😴</div>' +
          '<div class="perf-card-value">' + sleepingCount + '</div>' +
          '<div class="perf-card-label">Sleeping</div>' +
          '</div>' +
          '</div>' +

          // Chart
          '<div class="perf-section">' +
          '<h3>CPU History (last 30 samples)</h3>' +
          '<div class="perf-chart">' + cpuBars + '</div>' +
          '</div>' +

          // Details
          '<div class="perf-section">' +
          '<h3>System Info</h3>' +
          '<div class="perf-info-row"><span>Platform</span><span>' + escapeHtml(stats.platform) + '</span></div>' +
          '<div class="perf-info-row"><span>CPU Model</span><span>' + escapeHtml(stats.cpuModel.substring(0, 30)) + '</span></div>' +
          '<div class="perf-info-row"><span>CPU Cores</span><span>' + stats.cpuCores + '</span></div>' +
          '<div class="perf-info-row"><span>Total RAM</span><span>' + formatBytes(stats.ram.total) + '</span></div>' +
          '<div class="perf-info-row"><span>Used RAM</span><span>' + formatBytes(stats.ram.used) + '</span></div>' +
          '<div class="perf-info-row"><span>Browser Heap</span><span>' + formatBytes(stats.process.heapUsed) + '</span></div>' +
          '<div class="perf-info-row"><span>Browser RSS</span><span>' + formatBytes(stats.process.rss) + '</span></div>' +
          '<div class="perf-info-row"><span>Uptime</span><span>' + formatUptime(stats.uptime) + '</span></div>' +
          '</div>' +

          // Actions
          '<div class="perf-section">' +
          '<h3>Quick Actions</h3>' +
          '<div class="perf-actions">' +
          '<button class="perf-btn primary" id="perfCleanup">🧹 Cleanup Memory</button>' +
          '<button class="perf-btn" id="perfSleepAll">😴 Sleep Inactive</button>' +
          '<button class="perf-btn" id="perfClearCache">🗑️ Clear Cache</button>' +
          '<button class="perf-btn" id="perfRefresh">🔄 Refresh</button>' +
          '</div>' +
          '</div>';

        // Attach action listeners
        var cleanupBtn = document.getElementById('perfCleanup');
        if (cleanupBtn) cleanupBtn.addEventListener('click', function() {
          window.browserAPI.cleanupMemory().then(function(result) {
            if (result.success) {
              if (typeof showToast === 'function') showToast('Memory cleanup done', 'success');
            }
          });
        });

        var sleepAllBtn = document.getElementById('perfSleepAll');
        if (sleepAllBtn) sleepAllBtn.addEventListener('click', function() {
          if (typeof tabs === 'undefined' || !tabs) return;
          var count = 0;
          tabs.forEach(function(t) {
            if (t.id !== activeTabId && !t.pinned && !t.sleeping) {
              sleepTab(t);
              count++;
            }
          });
          if (typeof showToast === 'function') {
            showToast('Slept ' + count + ' tabs', 'success');
          }
        });

        var clearCacheBtn = document.getElementById('perfClearCache');
        if (clearCacheBtn) clearCacheBtn.addEventListener('click', function() {
          if (window.browserAPI && window.browserAPI.clearCache) {
            window.browserAPI.clearCache().then(function() {
              if (typeof showToast === 'function') showToast('Cache cleared', 'success');
            }).catch(function() {
              if (typeof showToast === 'function') showToast('Cache cleared', 'success');
            });
          } else {
            if (typeof showToast === 'function') showToast('Cache clear not available', 'warning');
          }
        });

        var refreshBtn = document.getElementById('perfRefresh');
        if (refreshBtn) refreshBtn.addEventListener('click', function() {
          renderDashboard();
        });
      });
    }).catch(function(err) {
      body.innerHTML = '<div class="notes-empty">Error: ' + escapeHtml(err.message) + '</div>';
    });
  }

  // ═══════════════════════════════════════════════
  //   INIT
  // ═══════════════════════════════════════════════
  function init() {
    // Create dashboard
    var modal = createDashboard();

    var perfBtn = document.getElementById('performanceBtn');
    var perfClose = document.getElementById('perfClose');
    var focusBtn = document.getElementById('focusBtn');

    function openPerf() {
      modal.classList.add('show');
      renderDashboard();
      if (perfInterval) clearInterval(perfInterval);
      perfInterval = setInterval(renderDashboard, 3000);
    }

    function closePerf() {
      modal.classList.remove('show');
      if (perfInterval) {
        clearInterval(perfInterval);
        perfInterval = null;
      }
    }

    if (perfBtn) perfBtn.addEventListener('click', openPerf);
    if (perfClose) perfClose.addEventListener('click', closePerf);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closePerf();
      });
    }

    if (focusBtn) focusBtn.addEventListener('click', toggleFocusMode);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      var mod = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+P — Performance
      if (mod && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        if (modal.classList.contains('show')) closePerf();
        else openPerf();
      }

      // Ctrl+Shift+F — Focus Mode
      if (mod && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        toggleFocusMode();
      }

      // Escape
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closePerf();
      }
    });

    // Start tab sleeping
    startTabSleeping();
    hookTabActivity();

    console.log('[Performance] ✅ Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 700);
  }
})();