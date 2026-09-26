// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — backup.js
//   Backup & Restore System
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Backup] Loading...');

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ═══════════════════════════════════════════════
  //   SIMPLE ENCRYPTION (XOR + Base64)
  // ═══════════════════════════════════════════════
  function encrypt(text, password) {
    try {
      var result = '';
      for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
        result += String.fromCharCode(charCode);
      }
      return btoa(unescape(encodeURIComponent(result)));
    } catch (e) {
      return null;
    }
  }

  function decrypt(encrypted, password) {
    try {
      var text = decodeURIComponent(escape(atob(encrypted)));
      var result = '';
      for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (e) {
      return null;
    }
  }

  // ═══════════════════════════════════════════════
  //   COLLECT ALL DATA
  // ═══════════════════════════════════════════════
  function collectData() {
    var data = {
      version: '6.0.0',
      exportedAt: new Date().toISOString(),
      browser: 'Universal Browser',
      author: 'Shubham Maurya',
      data: {
        bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
        history: JSON.parse(localStorage.getItem('history') || '[]'),
        passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
        notes: JSON.parse(localStorage.getItem('notes') || '[]'),
        settings: JSON.parse(localStorage.getItem('settings') || '{}'),
        workspaces: JSON.parse(localStorage.getItem('workspaces') || '[]'),
        activeWorkspace: localStorage.getItem('activeWorkspace') || 'default',
        tabGroups: JSON.parse(localStorage.getItem('tabGroups') || '[]'),
        voiceSettings: JSON.parse(localStorage.getItem('voiceSettings') || '{}')
      }
    };
    return data;
  }

  // ═══════════════════════════════════════════════
  //   RESTORE DATA
  // ═══════════════════════════════════════════════
  function restoreData(data) {
    if (!data || !data.data) {
      throw new Error('Invalid backup file');
    }

    var d = data.data;

    if (d.bookmarks) localStorage.setItem('bookmarks', JSON.stringify(d.bookmarks));
    if (d.history) localStorage.setItem('history', JSON.stringify(d.history));
    if (d.passwords) localStorage.setItem('passwords', JSON.stringify(d.passwords));
    if (d.notes) localStorage.setItem('notes', JSON.stringify(d.notes));
    if (d.settings) localStorage.setItem('settings', JSON.stringify(d.settings));
    if (d.workspaces) localStorage.setItem('workspaces', JSON.stringify(d.workspaces));
    if (d.activeWorkspace) localStorage.setItem('activeWorkspace', d.activeWorkspace);
    if (d.tabGroups) localStorage.setItem('tabGroups', JSON.stringify(d.tabGroups));
    if (d.voiceSettings) localStorage.setItem('voiceSettings', JSON.stringify(d.voiceSettings));

    return true;
  }

  // ═══════════════════════════════════════════════
  //   GET DATA STATS
  // ═══════════════════════════════════════════════
  function getDataStats() {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    var history = JSON.parse(localStorage.getItem('history') || '[]');
    var passwords = JSON.parse(localStorage.getItem('passwords') || '[]');
    var notes = JSON.parse(localStorage.getItem('notes') || '[]');
    var workspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');

    return {
      bookmarks: bookmarks.length,
      history: history.length,
      passwords: passwords.length,
      notes: notes.length,
      workspaces: workspaces.length,
      totalSize: JSON.stringify(collectData()).length
    };
  }

  // ═══════════════════════════════════════════════
  //   FORMAT SIZE
  // ═══════════════════════════════════════════════
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  }

  // ═══════════════════════════════════════════════
  //   INIT
  // ═══════════════════════════════════════════════
  function init() {
    // ═══ CREATE MODAL ═══
    var modal = document.createElement('div');
    modal.className = 'backup-modal';
    modal.id = 'backupModal';
    modal.innerHTML =
      '<div class="backup-box">' +
      '<div class="backup-header">' +
      '<h2>💾 Backup & Restore</h2>' +
      '<button class="icon-btn" id="backupClose">✕</button>' +
      '</div>' +
      '<div class="backup-body" id="backupBody"></div>' +
      '</div>';
    document.body.appendChild(modal);

    var backupBtn = document.getElementById('backupBtn');
    var backupClose = document.getElementById('backupClose');
    var backupBody = document.getElementById('backupBody');

    // ═══ OPEN / CLOSE ═══
    function openBackup() {
      modal.classList.add('show');
      renderBackupContent();
    }

    function closeBackup() {
      modal.classList.remove('show');
    }

    if (backupBtn) backupBtn.addEventListener('click', openBackup);
    if (backupClose) backupClose.addEventListener('click', closeBackup);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeBackup();
      });
    }

    // ═══ RENDER CONTENT ═══
    function renderBackupContent() {
      var stats = getDataStats();

      backupBody.innerHTML =
        // Stats
        '<div class="backup-stats">' +
        '<div class="backup-stat">' +
        '<div class="backup-stat-icon">⭐</div>' +
        '<div class="backup-stat-value">' + stats.bookmarks + '</div>' +
        '<div class="backup-stat-label">Bookmarks</div>' +
        '</div>' +
        '<div class="backup-stat">' +
        '<div class="backup-stat-icon">📝</div>' +
        '<div class="backup-stat-value">' + stats.notes + '</div>' +
        '<div class="backup-stat-label">Notes</div>' +
        '</div>' +
        '<div class="backup-stat">' +
        '<div class="backup-stat-icon">🔐</div>' +
        '<div class="backup-stat-value">' + stats.passwords + '</div>' +
        '<div class="backup-stat-label">Passwords</div>' +
        '</div>' +
        '<div class="backup-stat">' +
        '<div class="backup-stat-icon">🕐</div>' +
        '<div class="backup-stat-value">' + stats.history + '</div>' +
        '<div class="backup-stat-label">History</div>' +
        '</div>' +
        '<div class="backup-stat">' +
        '<div class="backup-stat-icon">📁</div>' +
        '<div class="backup-stat-value">' + stats.workspaces + '</div>' +
        '<div class="backup-stat-label">Workspaces</div>' +
        '</div>' +
        '<div class="backup-stat">' +
        '<div class="backup-stat-icon">💾</div>' +
        '<div class="backup-stat-value">' + formatSize(stats.totalSize) + '</div>' +
        '<div class="backup-stat-label">Total Size</div>' +
        '</div>' +
        '</div>' +

        // Export Section
        '<div class="backup-section">' +
        '<h3>💾 Export Backup</h3>' +
        '<div class="backup-toggle-row">' +
        '<span>🔐 Encrypt with password</span>' +
        '<div class="toggle" id="backupEncryptToggle"></div>' +
        '</div>' +
        '<input type="password" class="backup-password-input" id="backupPassword" placeholder="Enter password (for encryption)" style="display:none;" />' +
        '<button class="backup-action primary" id="backupExportBtn">' +
        '<span class="backup-action-icon">📤</span>' +
        '<div class="backup-action-info">' +
        '<div class="backup-action-title">Export All Data</div>' +
        '<div class="backup-action-desc">Save as JSON file</div>' +
        '</div>' +
        '</button>' +
        '</div>' +

        // Import Section
        '<div class="backup-section">' +
        '<h3>📥 Restore Backup</h3>' +
        '<button class="backup-action" id="backupImportBtn">' +
        '<span class="backup-action-icon">📂</span>' +
        '<div class="backup-action-info">' +
        '<div class="backup-action-title">Import from File</div>' +
        '<div class="backup-action-desc">Load data from backup</div>' +
        '</div>' +
        '</button>' +
        '<input type="file" id="backupFileInput" accept=".json" style="display:none;" />' +
        '</div>' +

        // Danger Zone
        '<div class="backup-section">' +
        '<h3>⚠️ Danger Zone</h3>' +
        '<button class="backup-action danger" id="backupClearBtn">' +
        '<span class="backup-action-icon">🗑️</span>' +
        '<div class="backup-action-info">' +
        '<div class="backup-action-title">Clear All Data</div>' +
        '<div class="backup-action-desc">Bookmarks, notes, passwords — sab delete</div>' +
        '</div>' +
        '</button>' +
        '</div>';

      // ═══ EVENT LISTENERS ═══

      // Encrypt toggle
      var encryptToggle = document.getElementById('backupEncryptToggle');
      var passwordInput = document.getElementById('backupPassword');
      var encryptEnabled = false;

      if (encryptToggle) {
        encryptToggle.addEventListener('click', function() {
          encryptEnabled = !encryptEnabled;
          encryptToggle.classList.toggle('on', encryptEnabled);
          if (passwordInput) {
            passwordInput.style.display = encryptEnabled ? 'block' : 'none';
            if (encryptEnabled) setTimeout(function() { passwordInput.focus(); }, 100);
          }
        });
      }

      // Export
      var exportBtn = document.getElementById('backupExportBtn');
      if (exportBtn) {
        exportBtn.addEventListener('click', function() {
          var data = collectData();
          var jsonStr = JSON.stringify(data, null, 2);
          var finalData = jsonStr;
          var ext = 'json';

          if (encryptEnabled) {
            var pwd = passwordInput ? passwordInput.value : '';
            if (!pwd || pwd.length < 4) {
              alert('Password must be at least 4 characters');
              return;
            }
            var encrypted = encrypt(jsonStr, pwd);
            if (!encrypted) {
              alert('Encryption failed');
              return;
            }
            finalData = JSON.stringify({
              encrypted: true,
              version: data.version,
              data: encrypted
            }, null, 2);
            ext = 'ubk'; // Universal Browser Backup (encrypted)
          }

          var blob = new Blob([finalData], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'universal-browser-backup-' + Date.now() + '.' + ext;
          a.click();
          URL.revokeObjectURL(url);

          if (typeof showToast === 'function') {
            showToast('Backup exported' + (encryptEnabled ? ' (encrypted)' : ''), 'success');
          }
        });
      }

      // Import
      var importBtn = document.getElementById('backupImportBtn');
      var fileInput = document.getElementById('backupFileInput');

      if (importBtn && fileInput) {
        importBtn.addEventListener('click', function() {
          fileInput.click();
        });

        fileInput.addEventListener('change', function(e) {
          var file = e.target.files[0];
          if (!file) return;

          var reader = new FileReader();
          reader.onload = function(evt) {
            try {
              var content = evt.target.result;
              var parsed = JSON.parse(content);

              // Check if encrypted
              if (parsed.encrypted) {
                var pwd = prompt('This backup is encrypted. Enter password:');
                if (!pwd) return;

                var decrypted = decrypt(parsed.data, pwd);
                if (!decrypted) {
                  alert('Wrong password or corrupted backup');
                  return;
                }

                parsed = JSON.parse(decrypted);
              }

              if (!parsed.data) {
                alert('Invalid backup file');
                return;
              }

              if (!confirm('This will replace all current data. Continue?')) return;

              restoreData(parsed);

              if (typeof showToast === 'function') {
                showToast('Backup restored! Reloading...', 'success');
              }

              setTimeout(function() {
                location.reload();
              }, 1500);

            } catch (err) {
              alert('Failed to import: ' + err.message);
            }
          };
          reader.readAsText(file);
        });
      }

      // Clear all
      var clearBtn = document.getElementById('backupClearBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          if (!confirm('⚠️ This will DELETE ALL data:\n\n• Bookmarks\n• History\n• Passwords\n• Notes\n• Workspaces\n\nAre you sure?')) return;
          if (!confirm('⚠️ FINAL WARNING!\n\nThis cannot be undone.\n\nType OK to confirm.')) return;

          var keys = ['bookmarks', 'history', 'passwords', 'notes', 'settings', 'workspaces', 'activeWorkspace', 'tabGroups', 'voiceSettings'];
          keys.forEach(function(k) {
            localStorage.removeItem(k);
          });

          if (typeof showToast === 'function') {
            showToast('All data cleared. Reloading...', 'info');
          }

          setTimeout(function() {
            location.reload();
          }, 1500);
        });
      }
    }

    // ═══ KEYBOARD SHORTCUT: Ctrl+Shift+B ═══
    document.addEventListener('keydown', function(e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        openBackup();
      }
    });

    console.log('[Backup] ✅ Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }
})();