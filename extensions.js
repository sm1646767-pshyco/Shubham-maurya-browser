// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — extensions.js
//   Extension Manager
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Extensions] Loading...');

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function init() {
    // ═══ CREATE MODAL ═══
    var modal = document.createElement('div');
    modal.className = 'ext-modal';
    modal.id = 'extModal';
    modal.innerHTML =
      '<div class="ext-box">' +
      '<div class="ext-header">' +
      '<h2>🧩 Extensions</h2>' +
      '<button class="icon-btn" id="extClose">✕</button>' +
      '</div>' +
      '<div class="ext-body" id="extBody"></div>' +
      '</div>';
    document.body.appendChild(modal);

    var extensionsBtn = document.getElementById('extensionsBtn');
    var extClose = document.getElementById('extClose');
    var extBody = document.getElementById('extBody');

    // ═══ OPEN / CLOSE ═══
    function openExtensions() {
      modal.classList.add('show');
      renderExtensions();
    }

    function closeExtensions() {
      modal.classList.remove('show');
    }

    if (extensionsBtn) extensionsBtn.addEventListener('click', openExtensions);
    if (extClose) extClose.addEventListener('click', closeExtensions);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeExtensions();
      });
    }

    // ═══ RENDER EXTENSIONS ═══
    function renderExtensions() {
      if (!extBody) return;

      extBody.innerHTML = '<div class="ext-loading">⏳ Loading extensions...</div>';

      if (!window.browserAPI || !window.browserAPI.getExtensions) {
        extBody.innerHTML = '<div class="ext-empty">Extension API not available</div>';
        return;
      }

      window.browserAPI.getExtensions().then(function(extensions) {
        extensions = extensions || [];

        var html = 
          // Info box
          '<div class="ext-info-box">' +
          '<b>💡 Chrome Extensions Load Karo</b><br>' +
          'Koi bhi unpacked Chrome extension folder select karo (jisme <b>manifest.json</b> ho). ' +
          'Manifest V3 extensions best kaam karte hain.' +
          '</div>' +

          // Toolbar
          '<div class="ext-toolbar">' +
          '<button class="ext-btn primary" id="extLoadBtn">📦 Load Extension</button>' +
          '<button class="ext-btn" id="extRefreshBtn">🔄 Refresh</button>' +
          '</div>';

        // List
        if (extensions.length === 0) {
          html += 
            '<div class="ext-empty">' +
            '<div class="ext-empty-icon">🧩</div>' +
            'No extensions loaded yet.<br><br>' +
            'Click <b>"📦 Load Extension"</b> to add one.' +
            '</div>';
        } else {
          extensions.forEach(function(ext) {
            var permsHtml = '';
            if (ext.permissions && ext.permissions.length > 0) {
              permsHtml = '<div class="ext-item-permissions">' +
                ext.permissions.slice(0, 6).map(function(p) {
                  return '<span class="ext-perm-badge">' + escapeHtml(p) + '</span>';
                }).join('') +
                (ext.permissions.length > 6 ? '<span class="ext-perm-badge">+' + (ext.permissions.length - 6) + ' more</span>' : '') +
                '</div>';
            }

            html += 
              '<div class="ext-item" data-id="' + escapeHtml(ext.id) + '">' +
              '<div class="ext-item-header">' +
              '<div class="ext-item-icon">🧩</div>' +
              '<div class="ext-item-info">' +
              '<div class="ext-item-name">' + escapeHtml(ext.name) + '</div>' +
              '<div class="ext-item-version">v' + escapeHtml(ext.version) + (ext.manifestVersion ? ' · MV' + ext.manifestVersion : '') + '</div>' +
              '</div>' +
              '<div class="ext-item-actions">' +
              '<button class="ext-action" data-action="info" title="Info">ℹ️</button>' +
              '<button class="ext-action delete" data-action="delete" title="Remove">🗑️</button>' +
              '</div>' +
              '</div>' +
              (ext.description ? '<div class="ext-item-desc">' + escapeHtml(ext.description) + '</div>' : '') +
              permsHtml +
              '</div>';
          });
        }

        extBody.innerHTML = html;

        // Attach listeners
        var loadBtn = document.getElementById('extLoadBtn');
        if (loadBtn) loadBtn.addEventListener('click', loadExtension);

        var refreshBtn = document.getElementById('extRefreshBtn');
        if (refreshBtn) refreshBtn.addEventListener('click', renderExtensions);

        // Per-extension actions
        extBody.querySelectorAll('.ext-item').forEach(function(item) {
          var extId = item.dataset.id;

          item.querySelectorAll('.ext-action').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
              e.stopPropagation();
              var action = btn.dataset.action;

              if (action === 'delete') {
                if (confirm('Remove this extension?')) {
                  window.browserAPI.removeExtension(extId).then(function(result) {
                    if (result.success) {
                      if (typeof showToast === 'function') showToast('Extension removed', 'success');
                      renderExtensions();
                    } else {
                      if (typeof showToast === 'function') showToast('Failed: ' + result.error, 'error');
                    }
                  });
                }
              }

              if (action === 'info') {
                var ext = extensions.find(function(e) { return e.id === extId; });
                if (ext) {
                  var info = 'Name: ' + ext.name + '\n' +
                    'Version: ' + ext.version + '\n' +
                    'Manifest: V' + (ext.manifestVersion || '?') + '\n' +
                    'Path: ' + ext.path + '\n' +
                    'Permissions: ' + (ext.permissions || []).join(', ');
                  alert(info);
                }
              }
            });
          });
        });
      });
    }

    // ═══ LOAD EXTENSION ═══
    function loadExtension() {
      if (!window.browserAPI || !window.browserAPI.selectExtensionFolder) {
        if (typeof showToast === 'function') showToast('Not supported', 'error');
        return;
      }

      window.browserAPI.selectExtensionFolder().then(function(folderResult) {
        if (!folderResult.success) return;

        if (typeof showToast === 'function') showToast('Loading extension...', 'info');

        window.browserAPI.loadExtension(folderResult.path).then(function(result) {
          if (result.success) {
            if (typeof showToast === 'function') {
              showToast('✅ Loaded: ' + result.extension.name, 'success', 4000);
            }
            renderExtensions();
          } else {
            if (typeof showToast === 'function') {
              showToast('❌ ' + result.error, 'error', 5000);
            }
          }
        });
      });
    }

    // ═══ KEYBOARD SHORTCUT: Ctrl+Shift+E ═══
    document.addEventListener('keydown', function(e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        if (modal.classList.contains('show')) closeExtensions();
        else openExtensions();
      }
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeExtensions();
      }
    });

    console.log('[Extensions] ✅ Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 900);
  }
})();