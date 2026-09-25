// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — workspace.js
//   Workspace Management System
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Workspace] Loading...');

  // ═══ STATE ═══
  var workspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
  var activeWorkspaceId = localStorage.getItem('activeWorkspace') || null;
  var selectedColor = '#89b4fa';
  var saveTabsToggle = true;

  // Default workspace agar kuch nahi
  if (workspaces.length === 0) {
    workspaces.push({
      id: 'default',
      name: 'Default',
      color: '#89b4fa',
      tabs: [],
      createdAt: Date.now()
    });
    activeWorkspaceId = 'default';
    saveWorkspaces();
  }

  function saveWorkspaces() {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
    if (activeWorkspaceId) {
      localStorage.setItem('activeWorkspace', activeWorkspaceId);
    }
  }

  function getActiveWorkspace() {
    return workspaces.find(function(w) { return w.id === activeWorkspaceId; }) || workspaces[0];
  }

  // ═══ DOM ═══
  function init() {
    var selector = document.querySelector('.workspace-selector');
    var currentBtn = document.getElementById('workspaceCurrent');
    var dropdown = document.getElementById('workspaceDropdown');
    var currentName = document.getElementById('workspaceCurrentName');
    var modal = document.getElementById('workspaceModal');
    var modalClose = document.getElementById('workspaceModalClose');
    var modalCancel = document.getElementById('workspaceModalCancel');
    var modalSave = document.getElementById('workspaceModalSave');
    var nameInput = document.getElementById('workspaceName');
    var colorsContainer = document.getElementById('workspaceColors');
    var saveTabsToggleEl = document.getElementById('workspaceSaveTabs');
    var modalTitle = document.getElementById('workspaceModalTitle');

    if (!selector || !currentBtn) {
      console.error('[Workspace] Elements missing');
      return;
    }

    // ═══ Toggle Dropdown ═══
    currentBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      selector.classList.toggle('open');
    });

    document.addEventListener('click', function() {
      selector.classList.remove('open');
    });

    dropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // ═══ Render Dropdown ═══
    function renderDropdown() {
      dropdown.innerHTML = '';
      var active = getActiveWorkspace();

      workspaces.forEach(function(ws) {
        var item = document.createElement('div');
        item.className = 'workspace-item' + (ws.id === activeWorkspaceId ? ' active' : '');
        item.innerHTML =
          '<div class="workspace-item-color" style="background:' + ws.color + ';"></div>' +
          '<div class="workspace-item-name">' + escapeHtml(ws.name) + '</div>' +
          '<div class="workspace-item-count">' + (ws.tabs ? ws.tabs.length : 0) + '</div>' +
          (ws.id !== 'default' ? '<button class="workspace-item-delete" title="Delete">✕</button>' : '');

        item.addEventListener('click', function(e) {
          if (e.target.classList.contains('workspace-item-delete')) {
            e.stopPropagation();
            if (confirm('Delete workspace "' + ws.name + '"?')) {
              deleteWorkspace(ws.id);
            }
            return;
          }
          switchWorkspace(ws.id);
          selector.classList.remove('open');
        });

        dropdown.appendChild(item);
      });

      // Add button
      var addBtn = document.createElement('div');
      addBtn.className = 'workspace-add-btn';
      addBtn.innerHTML = '<span>＋</span> New Workspace';
      addBtn.addEventListener('click', function() {
        selector.classList.remove('open');
        openModal();
      });
      dropdown.appendChild(addBtn);
    }

    function escapeHtml(s) {
      return String(s || '').replace(/[&<>"']/g, function(c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // ═══ Update Current Display ═══
    function updateCurrentDisplay() {
      var ws = getActiveWorkspace();
      if (currentName) currentName.textContent = ws.name;
      var icon = document.querySelector('.workspace-icon');
      if (icon) icon.textContent = '📁';
      var currentEl = document.getElementById('workspaceCurrent');
      if (currentEl) currentEl.style.borderLeft = '4px solid ' + ws.color;
    }

    // ═══ Switch Workspace ═══
    function switchWorkspace(id) {
      var ws = workspaces.find(function(w) { return w.id === id; });
      if (!ws) return;

      // Save current tabs to current workspace
      var currentWs = getActiveWorkspace();
      if (currentWs && currentWs.id !== id) {
        currentWs.tabs = getCurrentTabs();
      }

      activeWorkspaceId = id;
      saveWorkspaces();

      // Restore tabs
      closeAllTabsSilently();
      if (ws.tabs && ws.tabs.length > 0) {
        ws.tabs.forEach(function(tab, i) {
          if (typeof createTab === 'function') {
            createTab(tab.url, i === ws.tabs.length - 1);
          }
        });
      } else {
        if (typeof createTab === 'function') createTab(null, true);
      }

      updateCurrentDisplay();
      renderDropdown();

      if (typeof showToast === 'function') {
        showToast('Switched to: ' + ws.name, 'success');
      }
    }

    // ═══ Get Current Tabs ═══
    function getCurrentTabs() {
      if (typeof tabs === 'undefined' || !tabs) return [];
      return tabs.map(function(t) {
        var url = '';
        try { url = t.webview.getURL() || t.url; } catch (e) { url = t.url; }
        return { url: url, title: t.title };
      }).filter(function(t) { return t.url; });
    }

    // ═══ Close All Tabs ═══
    function closeAllTabsSilently() {
      if (typeof tabs === 'undefined' || !tabs) return;
      var copy = tabs.slice();
      copy.forEach(function(t) {
        try { t.webview.remove(); } catch (e) {}
        try { t.el.remove(); } catch (e) {}
      });
      tabs.length = 0;
    }

    // ═══ Delete Workspace ═══
    function deleteWorkspace(id) {
      if (id === 'default') return;
      workspaces = workspaces.filter(function(w) { return w.id !== id; });
      if (activeWorkspaceId === id) {
        activeWorkspaceId = 'default';
      }
      saveWorkspaces();
      updateCurrentDisplay();
      renderDropdown();
      if (typeof showToast === 'function') {
        showToast('Workspace deleted', 'info');
      }
    }

    // ═══ Open Modal ═══
    function openModal() {
      if (modalTitle) modalTitle.textContent = 'Create Workspace';
      if (nameInput) nameInput.value = '';
      selectedColor = '#89b4fa';
      saveTabsToggle = true;
      if (saveTabsToggleEl) saveTabsToggleEl.classList.add('on');
      updateColorSelection();
      modal.classList.add('show');
      setTimeout(function() { if (nameInput) nameInput.focus(); }, 100);
    }

    function closeModal() {
      modal.classList.remove('show');
    }

    // ═══ Color Selection ═══
    function updateColorSelection() {
      document.querySelectorAll('.workspace-color').forEach(function(el) {
        el.classList.toggle('selected', el.dataset.color === selectedColor);
      });
    }

    if (colorsContainer) {
      colorsContainer.querySelectorAll('.workspace-color').forEach(function(el) {
        el.addEventListener('click', function() {
          selectedColor = el.dataset.color;
          updateColorSelection();
        });
      });
    }

    // ═══ Save Tabs Toggle ═══
    if (saveTabsToggleEl) {
      saveTabsToggleEl.addEventListener('click', function() {
        saveTabsToggle = !saveTabsToggle;
        saveTabsToggleEl.classList.toggle('on', saveTabsToggle);
      });
    }

    // ═══ Modal Events ═══
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    }

    if (modalSave) {
      modalSave.addEventListener('click', function() {
        var name = nameInput.value.trim();
        if (!name) {
          if (nameInput) nameInput.focus();
          return;
        }

        var newWs = {
          id: 'ws-' + Date.now(),
          name: name,
          color: selectedColor,
          tabs: saveTabsToggle ? getCurrentTabs() : [],
          createdAt: Date.now()
        };

        workspaces.push(newWs);
        saveWorkspaces();
        closeModal();
        updateCurrentDisplay();
        renderDropdown();

        if (typeof showToast === 'function') {
          showToast('Workspace created: ' + name, 'success');
        }
      });
    }

    if (nameInput) {
      nameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          modalSave.click();
        }
        if (e.key === 'Escape') {
          closeModal();
        }
      });
    }

    // ═══ Initial Render ═══
    updateCurrentDisplay();
    renderDropdown();

    console.log('[Workspace] ✅ Initialized');
    console.log('[Workspace] Total workspaces:', workspaces.length);
  }

  // ═══ Boot ═══
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();