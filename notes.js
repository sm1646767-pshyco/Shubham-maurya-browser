// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — notes.js
//   Notes System
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Notes] Loading...');

  var notes = JSON.parse(localStorage.getItem('notes') || '[]');

  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatDate(ts) {
    var d = new Date(ts);
    var now = new Date();
    var diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
    return d.toLocaleDateString();
  }

  function init() {
    // ═══ CREATE PANEL ═══
    var panel = document.createElement('aside');
    panel.className = 'notes-panel';
    panel.id = 'notesPanel';
    panel.innerHTML = 
      '<div class="notes-header">' +
      '<div class="notes-title"><span>📝</span> Notes</div>' +
      '<div class="notes-actions">' +
      '<button class="icon-btn" id="notesExportBtn" title="Export">📤</button>' +
      '<button class="icon-btn" id="notesClose">✕</button>' +
      '</div></div>' +
      '<div class="notes-toolbar">' +
      '<button class="notes-btn primary" id="notesSavePage">📄 Save Page</button>' +
      '<button class="notes-btn" id="notesSaveSelection">✍️ Save Text</button>' +
      '</div>' +
      '<div class="notes-search">' +
      '<input type="text" id="notesSearchInput" placeholder="🔍 Search notes..." />' +
      '</div>' +
      '<div class="notes-list" id="notesList"></div>';
    document.body.appendChild(panel);

    var notesBtn = document.getElementById('notesBtn');
    var notesClose = document.getElementById('notesClose');
    var notesList = document.getElementById('notesList');
    var notesSavePage = document.getElementById('notesSavePage');
    var notesSaveSelection = document.getElementById('notesSaveSelection');
    var notesExportBtn = document.getElementById('notesExportBtn');
    var notesSearchInput = document.getElementById('notesSearchInput');

    // ═══ OPEN / CLOSE ═══
    function openNotes() {
      panel.classList.add('open');
      renderNotes('');
      setTimeout(function() {
        if (notesSearchInput) notesSearchInput.focus();
      }, 300);
    }

    function closeNotes() {
      panel.classList.remove('open');
    }

    if (notesBtn) notesBtn.addEventListener('click', openNotes);
    if (notesClose) notesClose.addEventListener('click', closeNotes);

    // ═══ RENDER NOTES ═══
    function renderNotes(query) {
      if (!notesList) return;
      query = (query || '').toLowerCase().trim();
      notesList.innerHTML = '';

      var filtered = notes.slice().sort(function(a, b) {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt - a.createdAt;
      });

      if (query) {
        filtered = filtered.filter(function(n) {
          var text = (n.title + ' ' + n.content + ' ' + (n.url || '') + ' ' + (n.tags || []).join(' ')).toLowerCase();
          return text.indexOf(query) !== -1;
        });
      }

      if (filtered.length === 0) {
        notesList.innerHTML = 
          '<div class="notes-empty">' +
          '<div class="notes-empty-icon">📝</div>' +
          (query ? 'No notes matching "' + escapeHtml(query) + '"' : 'No notes yet.<br><br>Click "Save Page" to save current page.') +
          '</div>';
        return;
      }

      filtered.forEach(function(note) {
        var el = document.createElement('div');
        el.className = 'note-item' + (note.pinned ? ' pinned' : '');
        
        var tagsHtml = '';
        if (note.tags && note.tags.length > 0) {
          tagsHtml = '<div class="note-item-tags">' +
            note.tags.map(function(t) { return '<span class="note-tag">#' + escapeHtml(t) + '</span>'; }).join('') +
            '</div>';
        }

        var urlHtml = note.url ? 
          '<a class="note-item-url" data-url="' + escapeHtml(note.url) + '">🔗 ' + escapeHtml(note.url.substring(0, 60)) + '</a>' : '';

        el.innerHTML = 
          '<div class="note-item-header">' +
          '<div class="note-item-title">' + (note.pinned ? '📌 ' : '') + escapeHtml(note.title) + '</div>' +
          '<div class="note-item-actions">' +
          '<button class="note-action pin" title="Pin">' + (note.pinned ? '📍' : '📌') + '</button>' +
          '<button class="note-action copy" title="Copy">📋</button>' +
          '<button class="note-action delete" title="Delete">🗑️</button>' +
          '</div></div>' +
          '<div class="note-item-content">' + escapeHtml(note.content) + '</div>' +
          urlHtml +
          tagsHtml +
          '<div class="note-item-meta"><span>' + formatDate(note.createdAt) + '</span><span>' + (note.type || 'note') + '</span></div>';

        // URL click — open
        var urlEl = el.querySelector('.note-item-url');
        if (urlEl) {
          urlEl.addEventListener('click', function(e) {
            e.preventDefault();
            var url = urlEl.dataset.url;
            if (url && typeof navigate === 'function') navigate(url);
            closeNotes();
          });
        }

        // Pin
        el.querySelector('.pin').addEventListener('click', function(e) {
          e.stopPropagation();
          note.pinned = !note.pinned;
          saveNotes();
          renderNotes(query);
        });

        // Copy
        el.querySelector('.copy').addEventListener('click', function(e) {
          e.stopPropagation();
          var text = note.title + '\n\n' + note.content + (note.url ? '\n\n' + note.url : '');
          navigator.clipboard.writeText(text);
          if (typeof showToast === 'function') showToast('Note copied', 'success');
        });

        // Delete
        el.querySelector('.delete').addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm('Delete this note?')) {
            var idx = notes.indexOf(note);
            if (idx > -1) notes.splice(idx, 1);
            saveNotes();
            renderNotes(query);
            if (typeof showToast === 'function') showToast('Note deleted', 'info');
          }
        });

        notesList.appendChild(el);
      });
    }

    // ═══ SAVE PAGE ═══
    if (notesSavePage) {
      notesSavePage.addEventListener('click', async function() {
        try {
          var title = 'Untitled';
          var url = '';
          var content = '';

          if (typeof tabs !== 'undefined' && tabs && typeof activeTabId !== 'undefined') {
            var tab = tabs.find(function(t) { return t.id === activeTabId; });
            if (tab) {
              title = tab.title || 'Untitled';
              try { url = tab.webview.getURL() || tab.url; } catch (e) { url = tab.url; }
            }
          }

          if (window.browserAPI && window.browserAPI.extractArticle) {
            try {
              var result = await window.browserAPI.extractArticle();
              if (result && result.success && result.data) {
                content = result.data.blocks.map(function(b) {
                  return b.type === 'img' ? '[Image: ' + (b.alt || '') + ']' : b.text;
                }).join('\n\n').substring(0, 2000);
              }
            } catch (e) {}
          }

          var note = {
            id: 'note-' + Date.now(),
            title: title,
            content: content || 'Page saved: ' + url,
            url: url,
            tags: [],
            type: 'page',
            pinned: false,
            createdAt: Date.now()
          };

          notes.unshift(note);
          saveNotes();
          renderNotes('');
          if (typeof showToast === 'function') showToast('Page saved to notes', 'success');
        } catch (err) {
          if (typeof showToast === 'function') showToast('Failed to save page', 'error');
        }
      });
    }

    // ═══ SAVE SELECTION ═══
    if (notesSaveSelection) {
      notesSaveSelection.addEventListener('click', async function() {
        try {
          var text = '';
          if (window.browserAPI && window.browserAPI.aiGetSelection) {
            var result = await window.browserAPI.aiGetSelection();
            if (result && result.success) text = result.text;
          }

          if (!text || !text.trim()) {
            // Manual input
            text = prompt('Enter note text:');
            if (!text || !text.trim()) return;
          }

          var title = prompt('Note title:', text.substring(0, 40) + (text.length > 40 ? '...' : ''));
          if (!title) title = 'Quick Note';

          var tagsInput = prompt('Tags (comma separated, optional):', '');
          var tags = tagsInput ? tagsInput.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [];

          var note = {
            id: 'note-' + Date.now(),
            title: title,
            content: text,
            url: '',
            tags: tags,
            type: 'text',
            pinned: false,
            createdAt: Date.now()
          };

          notes.unshift(note);
          saveNotes();
          renderNotes('');
          if (typeof showToast === 'function') showToast('Note saved', 'success');
        } catch (err) {
          if (typeof showToast === 'function') showToast('Failed to save note', 'error');
        }
      });
    }

    // ═══ SEARCH ═══
    if (notesSearchInput) {
      notesSearchInput.addEventListener('input', function(e) {
        renderNotes(e.target.value);
      });

      notesSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          notesSearchInput.value = '';
          renderNotes('');
        }
      });
    }

    // ═══ EXPORT ═══
    if (notesExportBtn) {
      notesExportBtn.addEventListener('click', function() {
        if (notes.length === 0) {
          if (typeof showToast === 'function') showToast('No notes to export', 'warning');
          return;
        }

        var dataStr = JSON.stringify(notes, null, 2);
        var blob = new Blob([dataStr], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'universal-browser-notes-' + Date.now() + '.json';
        a.click();
        URL.revokeObjectURL(url);

        if (typeof showToast === 'function') showToast('Exported ' + notes.length + ' notes', 'success');
      });
    }

    // ═══ KEYBOARD SHORTCUT: Ctrl+Shift+N ═══
    document.addEventListener('keydown', function(e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.shiftKey && (e.key === 'N' || e.key === 'n')) {
        e.preventDefault();
        openNotes();
      }
    });

    console.log('[Notes] ✅ Initialized — ' + notes.length + ' notes loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 400);
  }
})();