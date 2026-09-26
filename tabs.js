// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — tabs.js
//   Tab Search + Recently Closed + Tab Groups
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Tabs] Loading...');

  var tabGroups = JSON.parse(localStorage.getItem('tabGroups') || '[]');

  function saveTabGroups() {
    localStorage.setItem('tabGroups', JSON.stringify(tabGroups));
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function init() {
    // ═══ ELEMENTS ═══
    var tabSearchModal = document.getElementById('tabSearchModal');
    var tabSearchInput = document.getElementById('tabSearchInput');
    var tabSearchResults = document.getElementById('tabSearchResults');
    var tabSearchBtn = document.getElementById('tabSearchBtn');
    var tabSearchRecentBtn = document.getElementById('tabSearchRecentBtn');
    var tabSearchGroupsBtn = document.getElementById('tabSearchGroupsBtn');

    var tabGroupsModal = document.getElementById('tabGroupsModal');
    var tabGroupsBody = document.getElementById('tabGroupsBody');
    var tabGroupsClose = document.getElementById('tabGroupsClose');
    var tabGroupsCancel = document.getElementById('tabGroupsCancel');
    var tabGroupsCreate = document.getElementById('tabGroupsCreate');

    var selectedIndex = 0;
    var currentResults = [];

    // ═══════════════════════════════════════════════
    //   TAB SEARCH
    // ═══════════════════════════════════════════════
    function openTabSearch() {
      if (!tabSearchModal) return;
      tabSearchModal.classList.add('show');
      if (tabSearchInput) {
        tabSearchInput.value = '';
        setTimeout(function() { tabSearchInput.focus(); }, 100);
      }
      searchTabs('');
    }

    function closeTabSearch() {
      if (tabSearchModal) tabSearchModal.classList.remove('show');
      selectedIndex = 0;
    }

    function searchTabs(query) {
      query = (query || '').toLowerCase().trim();
      currentResults = [];

      var tabsArr = (typeof tabs !== 'undefined' && tabs) ? tabs : [];

      tabsArr.forEach(function(t) {
        var title = (t.title || '').toLowerCase();
        var url = '';
        try { url = t.webview.getURL() || t.url; } catch (e) { url = t.url; }
        url = (url || '').toLowerCase();

        if (!query || title.indexOf(query) !== -1 || url.indexOf(query) !== -1) {
          currentResults.push({
            type: 'tab',
            id: t.id,
            title: t.title || 'Untitled',
            url: t.url || url
          });
        }
      });

      selectedIndex = 0;
      renderTabResults();
    }

    function renderTabResults() {
      if (!tabSearchResults) return;
      tabSearchResults.innerHTML = '';

      if (currentResults.length === 0) {
        tabSearchResults.innerHTML = '<div class="tab-search-empty">No tabs found</div>';
        return;
      }

      currentResults.forEach(function(item, i) {
        var el = document.createElement('div');
        el.className = 'tab-search-result' + (i === selectedIndex ? ' selected' : '');
        el.innerHTML =
          '<div class="tab-search-result-favicon">🌐</div>' +
          '<div class="tab-search-result-info">' +
          '<div class="tab-search-result-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="tab-search-result-url">' + escapeHtml(item.url) + '</div>' +
          '</div>' +
          '<div class="tab-search-result-badge">Tab</div>';

        el.addEventListener('click', function() {
          if (typeof switchTab === 'function') switchTab(item.id);
          closeTabSearch();
        });

        el.addEventListener('mouseenter', function() {
          selectedIndex = i;
          document.querySelectorAll('.tab-search-result').forEach(function(node, idx) {
            node.classList.toggle('selected', idx === i);
          });
        });

        tabSearchResults.appendChild(el);
      });
    }

    // ═══════════════════════════════════════════════
    //   RECENTLY CLOSED
    // ═══════════════════════════════════════════════
    async function showRecentlyClosed() {
      if (!tabSearchResults) return;
      tabSearchResults.innerHTML = '<div class="tab-search-empty">Loading...</div>';

      try {
        var recent = await window.browserAPI.getRecentlyClosed();

        if (!recent || recent.length === 0) {
          tabSearchResults.innerHTML = '<div class="tab-search-empty">No recently closed tabs</div>';
          return;
        }

        tabSearchResults.innerHTML = '';
        currentResults = [];

        recent.forEach(function(item, i) {
          currentResults.push({
            type: 'recent',
            url: item.url,
            title: item.title
          });

          var el = document.createElement('div');
          el.className = 'tab-search-result';
          el.innerHTML =
            '<div class="tab-search-result-favicon">🕐</div>' +
            '<div class="tab-search-result-info">' +
            '<div class="tab-search-result-title">' + escapeHtml(item.title) + '</div>' +
            '<div class="tab-search-result-url">' + escapeHtml(item.url) + '</div>' +
            '</div>' +
            '<div class="tab-search-result-badge">Recent</div>';

          el.addEventListener('click', function() {
            if (typeof createTab === 'function') createTab(item.url, true);
            closeTabSearch();
          });

          tabSearchResults.appendChild(el);
        });
      } catch (err) {
        tabSearchResults.innerHTML = '<div class="tab-search-empty">Error loading</div>';
      }
    }

    // ═══════════════════════════════════════════════
    //   TAB GROUPS
    // ═══════════════════════════════════════════════
    function openTabGroups() {
      if (!tabGroupsModal) return;
      tabGroupsModal.classList.add('show');
      renderGroups();
    }

    function closeTabGroups() {
      if (tabGroupsModal) tabGroupsModal.classList.remove('show');
    }

    function renderGroups() {
      if (!tabGroupsBody) return;
      tabGroupsBody.innerHTML = '';

      if (tabGroups.length === 0) {
        tabGroupsBody.innerHTML = '<div class="tab-search-empty">No tab groups yet.<br><br>Click "Create Group" to make one.</div>';
        return;
      }

      tabGroups.forEach(function(group, i) {
        var el = document.createElement('div');
        el.className = 'tab-group-item';
        el.innerHTML =
          '<div class="tab-group-color" style="background:' + group.color + ';"></div>' +
          '<div class="tab-group-info">' +
          '<div class="tab-group-name">' + escapeHtml(group.name) + '</div>' +
          '<div class="tab-group-count">' + (group.tabIds ? group.tabIds.length : 0) + ' tabs</div>' +
          '</div>' +
          '<div class="tab-group-actions">' +
          '<button class="tab-group-btn edit" title="Apply">✓</button>' +
          '<button class="tab-group-btn" title="Delete">✕</button>' +
          '</div>';

        el.querySelector('.edit').addEventListener('click', function() {
          applyGroupToTabs(group);
          closeTabGroups();
        });

        el.querySelector('.tab-group-btn:not(.edit)').addEventListener('click', function() {
          if (confirm('Delete group "' + group.name + '"?')) {
            tabGroups.splice(i, 1);
            saveTabGroups();
            renderGroups();
          }
        });

        tabGroupsBody.appendChild(el);
      });
    }

    function applyGroupToTabs(group) {
      // Just show a notification
      if (typeof showToast === 'function') {
        showToast('Applied group: ' + group.name, 'success');
      }
    }

    function createGroup() {
      var name = prompt('Group name (e.g. Work, Research):');
      if (!name || !name.trim()) return;

      var colors = ['#89b4fa', '#a6e3a1', '#f9e2af', '#f38ba8', '#cba6f7', '#94e2d5'];
      var color = colors[tabGroups.length % colors.length];

      var tabsArr = (typeof tabs !== 'undefined' && tabs) ? tabs : [];
      var tabIds = tabsArr.map(function(t) { return t.id; });

      tabGroups.push({
        id: 'group-' + Date.now(),
        name: name.trim(),
        color: color,
        tabIds: tabIds,
        createdAt: Date.now()
      });

      saveTabGroups();
      renderGroups();

      if (typeof showToast === 'function') {
        showToast('Created: ' + name, 'success');
      }
    }

    // ═══════════════════════════════════════════════
    //   EVENT LISTENERS
    // ═══════════════════════════════════════════════
    if (tabSearchBtn) tabSearchBtn.addEventListener('click', openTabSearch);

    if (tabSearchModal) {
      tabSearchModal.addEventListener('click', function(e) {
        if (e.target === tabSearchModal) closeTabSearch();
      });
    }

    if (tabSearchInput) {
      tabSearchInput.addEventListener('input', function(e) {
        searchTabs(e.target.value);
      });

      tabSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeTabSearch();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
          renderTabResults();
          var sel = tabSearchResults.querySelector('.selected');
          if (sel) sel.scrollIntoView({ block: 'nearest' });
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, 0);
          renderTabResults();
          var sel = tabSearchResults.querySelector('.selected');
          if (sel) sel.scrollIntoView({ block: 'nearest' });
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          var item = currentResults[selectedIndex];
          if (item) {
            if (item.type === 'tab' && typeof switchTab === 'function') {
              switchTab(item.id);
            } else if (item.type === 'recent' && typeof createTab === 'function') {
              createTab(item.url, true);
            }
            closeTabSearch();
          }
        }
      });
    }

    if (tabSearchRecentBtn) tabSearchRecentBtn.addEventListener('click', showRecentlyClosed);
    if (tabSearchGroupsBtn) tabSearchGroupsBtn.addEventListener('click', function() {
      closeTabSearch();
      openTabGroups();
    });

    // Tab Groups
    if (tabGroupsClose) tabGroupsClose.addEventListener('click', closeTabGroups);
    if (tabGroupsCancel) tabGroupsCancel.addEventListener('click', closeTabGroups);
    if (tabGroupsCreate) tabGroupsCreate.addEventListener('click', createGroup);

    if (tabGroupsModal) {
      tabGroupsModal.addEventListener('click', function(e) {
        if (e.target === tabGroupsModal) closeTabGroups();
      });
    }

    // ═══ KEYBOARD SHORTCUTS ═══
    document.addEventListener('keydown', function(e) {
      var mod = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+A — Tab Search
      if (mod && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openTabSearch();
      }

      // Ctrl+Shift+T — Recently Closed
      if (mod && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        openTabSearch();
        setTimeout(showRecentlyClosed, 100);
      }
    });

    console.log('[Tabs] ✅ Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 300);
  }
})();