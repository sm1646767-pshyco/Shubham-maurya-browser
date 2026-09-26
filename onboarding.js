// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — onboarding.js
//   Welcome Tour + Help Panel + About
//   Author: Shubham Maurya
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[Onboarding] Loading...');

  // ═══ TOUR STEPS ═══
  var tourSteps = [
    {
      icon: '🌐',
      title: 'Welcome to Universal Browser!',
      text: 'Ad-free, fast, aur private browsing experience. Chalo ek quick tour karte hain!'
    },
    {
      icon: '🛡️',
      title: 'Built-in Ad Blocker',
      text: 'Top-right me 🛡️ shield dikhega — ye batata hai kitne ads block hue. YouTube ads auto-skip honge!'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      text: 'Sidebar me 🤖 AI Assistant hai — kisi bhi page ka summary, translation, ya Q&A kar sakte ho.'
    },
    {
      icon: '⌨️',
      title: 'Command Palette',
      text: 'Ctrl+K dabao — saare actions ek jagah. Tabs search, bookmarks, settings — sab.'
    },
    {
      icon: '📁',
      title: 'Workspaces',
      text: 'Sidebar me workspace selector hai — alag projects ke liye alag tabs groups banao.'
    },
    {
      icon: '📝',
      title: 'Notes & Backup',
      text: 'Pages save karo, notes likho, aur Ctrl+Shift+B se backup le lo. Sab kuch tumhare paas.'
    },
    {
      icon: '🎉',
      title: 'Ready to Go!',
      text: 'Ctrl+Shift+A = Tab Search, Ctrl+Shift+N = Notes, Ctrl+Shift+B = Backup. Happy browsing!'
    }
  ];

  var SHORTCUTS = [
    { key: 'Ctrl + T', desc: 'New Tab' },
    { key: 'Ctrl + W', desc: 'Close Tab' },
    { key: 'Ctrl + L', desc: 'Focus URL Bar' },
    { key: 'Ctrl + R', desc: 'Reload Page' },
    { key: 'Ctrl + K', desc: 'Command Palette' },
    { key: 'Ctrl + F', desc: 'Find in Page' },
    { key: 'Ctrl + D', desc: 'Bookmark Page' },
    { key: 'Ctrl + B', desc: 'Toggle Sidebar' },
    { key: 'Ctrl + Shift + A', desc: 'Tab Search' },
    { key: 'Ctrl + Shift + T', desc: 'Recently Closed' },
    { key: 'Ctrl + Shift + N', desc: 'Notes Panel' },
    { key: 'Ctrl + Shift + B', desc: 'Backup & Restore' },
    { key: 'Ctrl + Shift + R', desc: 'Reading Mode' },
    { key: 'Ctrl + Shift + S', desc: 'Screenshot' },
    { key: 'Ctrl + Shift + V', desc: 'Voice Input' },
    { key: 'Ctrl + =', desc: 'Zoom In' },
    { key: 'Ctrl + -', desc: 'Zoom Out' },
    { key: 'Ctrl + 0', desc: 'Reset Zoom' },
    { key: 'F11', desc: 'Fullscreen' },
    { key: 'F12', desc: 'DevTools' },
    { key: 'Alt + ←', desc: 'Go Back' },
    { key: 'Alt + →', desc: 'Go Forward' },
    { key: 'Escape', desc: 'Close Modal/Panel' }
  ];

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function init() {
    // ═══════════════════════════════════════════════
    //   ONBOARDING TOUR
    // ═══════════════════════════════════════════════
    var onboarding = document.createElement('div');
    onboarding.className = 'onboarding-overlay';
    onboarding.id = 'onboardingOverlay';
    onboarding.innerHTML =
      '<div class="onboarding-box">' +
      '<div class="onboarding-illustration" id="onbIcon">🌐</div>' +
      '<div class="onboarding-content">' +
      '<div class="onboarding-title" id="onbTitle">Welcome</div>' +
      '<div class="onboarding-text" id="onbText">Loading...</div>' +
      '<div class="onboarding-dots" id="onbDots"></div>' +
      '<div class="onboarding-buttons">' +
      '<button class="onboarding-btn secondary" id="onbSkip">Skip</button>' +
      '<button class="onboarding-btn primary" id="onbNext">Next</button>' +
      '</div></div></div>';
    document.body.appendChild(onboarding);

    var currentStep = 0;
    var onbIcon = document.getElementById('onbIcon');
    var onbTitle = document.getElementById('onbTitle');
    var onbText = document.getElementById('onbText');
    var onbDots = document.getElementById('onbDots');
    var onbNext = document.getElementById('onbNext');
    var onbSkip = document.getElementById('onbSkip');

    function renderStep() {
      var step = tourSteps[currentStep];
      onbIcon.textContent = step.icon;
      onbTitle.textContent = step.title;
      onbText.textContent = step.text;

      onbDots.innerHTML = '';
      tourSteps.forEach(function(_, i) {
        var dot = document.createElement('div');
        dot.className = 'onboarding-dot' + (i === currentStep ? ' active' : '');
        onbDots.appendChild(dot);
      });

      onbNext.textContent = currentStep === tourSteps.length - 1 ? '🎉 Get Started' : 'Next →';
    }

    function nextStep() {
      if (currentStep < tourSteps.length - 1) {
        currentStep++;
        renderStep();
      } else {
        finishTour();
      }
    }

    function finishTour() {
      onboarding.classList.remove('show');
      localStorage.setItem('onboardingComplete', 'true');
      if (typeof showToast === 'function') {
        showToast('Welcome aboard! 🎉', 'success', 3000);
      }
    }

    if (onbNext) onbNext.addEventListener('click', nextStep);
    if (onbSkip) onbSkip.addEventListener('click', finishTour);

    // Show tour only if not completed
    if (!localStorage.getItem('onboardingComplete')) {
      setTimeout(function() {
        onboarding.classList.add('show');
        renderStep();
      }, 800);
    }

    // ═══════════════════════════════════════════════
    //   HELP MODAL
    // ═══════════════════════════════════════════════
    var helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    helpModal.id = 'helpModal';
    helpModal.innerHTML =
      '<div class="help-box">' +
      '<div class="help-header">' +
      '<h2>❓ Help & Info</h2>' +
      '<button class="icon-btn" id="helpClose">✕</button>' +
      '</div>' +
      '<div class="help-tabs">' +
      '<button class="help-tab active" data-tab="shortcuts">⌨️ Shortcuts</button>' +
      '<button class="help-tab" data-tab="tips">💡 Tips</button>' +
      '<button class="help-tab" data-tab="about">📖 About</button>' +
      '</div>' +
      '<div class="help-body" id="helpBody"></div>' +
      '</div>';
    document.body.appendChild(helpModal);

    var helpBtn = document.getElementById('helpBtn');
    var helpClose = document.getElementById('helpClose');
    var helpBody = document.getElementById('helpBody');

    function openHelp(tab) {
      helpModal.classList.add('show');
      renderHelpContent(tab || 'shortcuts');
    }

    function closeHelp() {
      helpModal.classList.remove('show');
    }

    function renderHelpContent(tab) {
      // Update active tab
      document.querySelectorAll('.help-tab').forEach(function(t) {
        t.classList.toggle('active', t.dataset.tab === tab);
      });

      if (tab === 'shortcuts') {
        var grid = '<div class="help-shortcuts-grid">';
        SHORTCUTS.forEach(function(s) {
          grid += '<div class="shortcut-row">' +
            '<span>' + s.desc + '</span>' +
            '<span class="shortcut-key">' + s.key + '</span>' +
            '</div>';
        });
        grid += '</div>';
        helpBody.innerHTML = grid;
      }

      else if (tab === 'tips') {
        helpBody.innerHTML =
          '<div class="about-credits" style="text-align:left; padding:20px; margin-bottom:12px;">' +
          '<div style="font-size:14px; font-weight:700; margin-bottom:8px; color:#89b4fa;">🛡️ Ad Blocking</div>' +
          '<div>Top-right 🛡️ shield click karke counter reset kar sakte ho. YouTube pe video ads auto-skip honge.</div>' +
          '</div>' +
          '<div class="about-credits" style="text-align:left; padding:20px; margin-bottom:12px;">' +
          '<div style="font-size:14px; font-weight:700; margin-bottom:8px; color:#cba6f7;">🤖 AI Assistant</div>' +
          '<div>Koi bhi page kholo aur AI panel me:<br>' +
          '• "Summarize" — page summary<br>' +
          '• "Ask This Page" — Q&A<br>' +
          '• "Translate" — 19 languages<br>' +
          '• Voice input (🎤) — bol ke pucho</div>' +
          '</div>' +
          '<div class="about-credits" style="text-align:left; padding:20px; margin-bottom:12px;">' +
          '<div style="font-size:14px; font-weight:700; margin-bottom:8px; color:#a6e3a1;">📁 Workspaces</div>' +
          '<div>Sidebar me workspace selector se alag projects ke liye alag tabs groups banao. Tabs auto-save hote hain.</div>' +
          '</div>' +
          '<div class="about-credits" style="text-align:left; padding:20px;">' +
          '<div style="font-size:14px; font-weight:700; margin-bottom:8px; color:#f9e2af;">💾 Backup</div>' +
          '<div>Ctrl+Shift+B se backup lo. Encrypted backup bhi possible hai password ke saath.</div>' +
          '</div>';
      }

      else if (tab === 'about') {
        var ua = navigator.userAgent;
        var platform = 'Unknown';
        if (ua.includes('Mac')) platform = 'macOS';
        else if (ua.includes('Win')) platform = 'Windows';
        else if (ua.includes('Linux')) platform = 'Linux';

        helpBody.innerHTML =
          '<div class="about-hero">' +
          '<div class="about-hero-badge">UB</div>' +
          '<h3>Universal Browser</h3>' +
          '<p>Ad-free · Fast · Private</p>' +
          '</div>' +
          '<div class="about-info-grid">' +
          '<div class="about-info-item">' +
          '<div class="about-info-label">Version</div>' +
          '<div class="about-info-value">v6.0.0</div>' +
          '</div>' +
          '<div class="about-info-item">' +
          '<div class="about-info-label">Platform</div>' +
          '<div class="about-info-value">' + platform + '</div>' +
          '</div>' +
          '<div class="about-info-item">' +
          '<div class="about-info-label">Engine</div>' +
          '<div class="about-info-value">Chromium</div>' +
          '</div>' +
          '<div class="about-info-item">' +
          '<div class="about-info-label">Framework</div>' +
          '<div class="about-info-value">Electron</div>' +
          '</div>' +
          '</div>' +
          '<div class="about-credits">' +
          'Made with ❤️ by<br>' +
          '<b>Shubham Maurya</b><br><br>' +
          'MIT License · © 2026<br><br>' +
          '<a href="https://github.com/sm1646767-pshyco/Shubham-maurya-browser" target="_blank" style="color:#89b4fa; text-decoration:none;">github.com/sm1646767-pshyco</a>' +
          '</div>';
      }
    }

    if (helpBtn) helpBtn.addEventListener('click', function() { openHelp('shortcuts'); });
    if (helpClose) helpClose.addEventListener('click', closeHelp);
    if (helpModal) {
      helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) closeHelp();
      });
    }

    // Tab switching
    document.querySelectorAll('.help-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        renderHelpContent(tab.dataset.tab);
      });
    });

    // ═══ KEYBOARD SHORTCUT ═══
    document.addEventListener('keydown', function(e) {
      // F1 — Help
      if (e.key === 'F1') {
        e.preventDefault();
        if (helpModal.classList.contains('show')) {
          closeHelp();
        } else {
          openHelp('shortcuts');
        }
      }
      // Escape
      if (e.key === 'Escape') {
        if (helpModal.classList.contains('show')) {
          closeHelp();
        }
        if (onboarding.classList.contains('show')) {
          finishTour();
        }
      }
    });

    // ═══ RESET TOUR (for testing) ═══
    window.resetOnboarding = function() {
      localStorage.removeItem('onboardingComplete');
      console.log('Tour reset. Reload to see again.');
    };

    console.log('[Onboarding] ✅ Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 600);
  }
})();