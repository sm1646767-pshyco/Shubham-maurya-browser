// ═══════════════════════════════════════════════════════════════
//   UNIVERSAL BROWSER — ai.js
//   AI Panel, Voice, Translation Logic
// ═══════════════════════════════════════════════════════════════
(function() {
  console.log('[AI] Script loading...');

  // ─── Wait for DOM ───
  function init() {
    var aiPanel = document.getElementById('aiPanel');
    var aiBtn = document.getElementById('aiBtn');
    var aiPanelClose = document.getElementById('aiPanelClose');
    var aiInput = document.getElementById('aiInput');
    var aiSendBtn = document.getElementById('aiSendBtn');
    var aiChat = document.getElementById('aiChat');
    var aiAskInput = document.getElementById('aiAskInput');
    var aiAskBtn = document.getElementById('aiAskBtn');
    var aiLangSelect = document.getElementById('aiLangSelect');
    var aiTranslatePageBtn = document.getElementById('aiTranslatePageBtn');
    var aiTranslateSelectionBtn = document.getElementById('aiTranslateSelectionBtn');
    var aiDetectedLang = document.getElementById('aiDetectedLang');
    var aiMicBtn = document.getElementById('aiMicBtn');
    var aiSpeakBtn = document.getElementById('aiSpeakBtn');
    var voiceSettingsBtn = document.getElementById('aiVoiceSettingsBtn');
    var voiceSettingsModal = document.getElementById('voiceSettingsModal');
    var voiceSettingsClose = document.getElementById('voiceSettingsClose');

    if (!aiPanel) {
      console.error('[AI] aiPanel not found!');
      return;
    }

    console.log('[AI] All elements found, attaching events...');

    // ═══ Panel Open/Close ═══
    if (aiBtn) aiBtn.addEventListener('click', function() {
      aiPanel.classList.add('open');
      if (aiInput) setTimeout(function() { aiInput.focus(); }, 300);
    });

    if (aiPanelClose) aiPanelClose.addEventListener('click', function() {
      aiPanel.classList.remove('open');
    });

    // ═══ Add Message to Chat ═══
    var lastAssistantMessage = '';

    function addMessage(text, type) {
      if (!aiChat) return null;
      var welcome = document.getElementById('aiWelcome');
      if (welcome) welcome.style.display = 'none';

      var msg = document.createElement('div');
      msg.className = 'ai-message ' + type;
      msg.textContent = text;
      aiChat.appendChild(msg);
      aiChat.scrollTop = aiChat.scrollHeight;

      if (type === 'assistant' && text.indexOf('loading') === -1) {
        lastAssistantMessage = text;
      }
      return msg;
    }

    // ═══ Send Message (Chat) ═══
    var conversationHistory = [
      { role: 'system', content: 'You are Universal Browser AI assistant. Be helpful and concise.' }
    ];

    async function sendMessage(text) {
      if (!text || !text.trim()) return;

      if (!window.browserAPI || !window.browserAPI.aiChat) {
        addMessage('❌ browserAPI not available. Check preload.js', 'assistant');
        return;
      }

      addMessage(text, 'user');
      var loading = addMessage('Thinking...', 'assistant loading');
      conversationHistory.push({ role: 'user', content: text });

      try {
        var result = await window.browserAPI.aiChat(conversationHistory);
        if (loading) loading.remove();

        if (result && result.success) {
          addMessage(result.text, 'assistant');
          conversationHistory.push({ role: 'assistant', content: result.text });
        } else {
          addMessage('❌ ' + (result && result.error || 'Unknown error'), 'assistant');
        }
      } catch (err) {
        if (loading) loading.remove();
        addMessage('❌ ' + err.message, 'assistant');
      }
    }

    if (aiSendBtn) {
      aiSendBtn.addEventListener('click', function() {
        var q = aiInput.value.trim();
        if (q) { sendMessage(q); aiInput.value = ''; }
      });
    }

    if (aiInput) {
      aiInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var q = aiInput.value.trim();
          if (q) { sendMessage(q); aiInput.value = ''; }
        }
      });
    }

    // ═══ Ask This Page ═══
    async function askThisPage(question) {
      if (!question.trim()) return;

      if (!window.browserAPI || !window.browserAPI.aiAskPage) {
        addMessage('❌ AI Ask API not available', 'assistant');
        return;
      }

      addMessage('❓ ' + question, 'user');
      var loading = addMessage('Reading page...', 'assistant loading');

      try {
        var result = await window.browserAPI.aiAskPage(question);
        if (loading) loading.remove();

        if (result && result.success) {
          addMessage(result.text, 'assistant');
        } else {
          addMessage('❌ ' + (result && result.error || 'Unknown'), 'assistant');
        }
      } catch (err) {
        if (loading) loading.remove();
        addMessage('❌ ' + err.message, 'assistant');
      }
    }

    if (aiAskBtn) {
      aiAskBtn.addEventListener('click', function() {
        var q = aiAskInput.value.trim();
        if (q) { askThisPage(q); aiAskInput.value = ''; }
      });
    }

    if (aiAskInput) {
      aiAskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var q = aiAskInput.value.trim();
          if (q) { askThisPage(q); aiAskInput.value = ''; }
        }
      });
    }

    // ═══ Quick Actions ═══
    document.querySelectorAll('.ai-action-btn').forEach(function(btn) {
      btn.addEventListener('click', async function() {
        var action = btn.dataset.action;

        if (action === 'summarize') {
          addMessage('📄 Summarizing page...', 'assistant loading');
          try {
            var content = await window.browserAPI.aiGetPageContent();
            if (!content.success) { addMessage('❌ Cannot read page', 'assistant'); return; }
            var result = await window.browserAPI.aiSummarize(content.text);
            document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
            if (result.success) addMessage(result.text, 'assistant');
            else addMessage('❌ ' + result.error, 'assistant');
          } catch (err) {
            document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
            addMessage('❌ ' + err.message, 'assistant');
          }
        }
        else if (action === 'keypoints') {
          addMessage('🔑 Extracting key points...', 'assistant loading');
          try {
            var content = await window.browserAPI.aiGetPageContent();
            if (!content.success) { addMessage('❌ Cannot read page', 'assistant'); return; }
            var result = await window.browserAPI.aiAskPage('Extract the key points from this page in bullet format');
            document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
            if (result.success) addMessage(result.text, 'assistant');
            else addMessage('❌ ' + result.error, 'assistant');
          } catch (err) {
            document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
            addMessage('❌ ' + err.message, 'assistant');
          }
        }
        else if (action === 'explain') {
          askThisPage('Explain this page in simple words');
        }
        else if (action === 'rewrite') {
          addMessage('✍️ Select text on the page first, then use translate selection.', 'assistant');
        }
      });
    });

    // ═══ Translation ═══
    async function translatePage() {
      var lang = aiLangSelect ? aiLangSelect.value : 'Hindi';
      addMessage('🌐 Translating page to ' + lang + '...', 'assistant loading');
      try {
        var result = await window.browserAPI.aiTranslatePage(lang);
        document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
        if (result.success) addMessage(result.text, 'assistant');
        else addMessage('❌ ' + result.error, 'assistant');
      } catch (err) {
        document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
        addMessage('❌ ' + err.message, 'assistant');
      }
    }

    async function translateSelection() {
      try {
        var sel = await window.browserAPI.aiGetSelection();
        if (!sel.success || !sel.text) {
          addMessage('⚠️ Please select text on the page first', 'assistant');
          return;
        }
        var lang = aiLangSelect ? aiLangSelect.value : 'Hindi';
        addMessage('🌐 Translating selection...', 'assistant loading');
        var result = await window.browserAPI.aiTranslate(sel.text, lang);
        document.querySelectorAll('.ai-message.loading').forEach(function(m) { m.remove(); });
        if (result.success) addMessage(result.text, 'assistant');
        else addMessage('❌ ' + result.error, 'assistant');
      } catch (err) {
        addMessage('❌ ' + err.message, 'assistant');
      }
    }

    if (aiTranslatePageBtn) aiTranslatePageBtn.addEventListener('click', translatePage);
    if (aiTranslateSelectionBtn) aiTranslateSelectionBtn.addEventListener('click', translateSelection);

    // ═══ Detect Language ═══
    async function detectLanguage() {
      if (!aiDetectedLang) return;
      try {
        var result = await window.browserAPI.aiDetectLanguage();
        if (result.success) {
          aiDetectedLang.innerHTML = '🌍 Page language: <strong>' + result.language + '</strong>';
        }
      } catch (err) {}
    }

    if (aiBtn) aiBtn.addEventListener('click', function() {
      setTimeout(detectLanguage, 800);
    });

    // ═══ Voice Input ═══
    var isListening = false;
    var recognition = null;
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = function() {
          isListening = true;
          if (aiMicBtn) aiMicBtn.classList.add('listening');
        };

        recognition.onresult = function(event) {
          var transcript = event.results[0][0].transcript;
          isListening = false;
          if (aiMicBtn) aiMicBtn.classList.remove('listening');
          if (transcript && transcript.trim()) {
            if (aiInput) aiInput.value = transcript;
            sendMessage(transcript);
            if (aiInput) aiInput.value = '';
          }
        };

        recognition.onerror = function(event) {
          isListening = false;
          if (aiMicBtn) aiMicBtn.classList.remove('listening');
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            addMessage('❌ Voice error: ' + event.error, 'assistant');
          }
        };

        recognition.onend = function() {
          isListening = false;
          if (aiMicBtn) aiMicBtn.classList.remove('listening');
        };
      } catch (e) {
        console.warn('[Voice] Init failed:', e);
      }
    }

    if (aiMicBtn) {
      aiMicBtn.addEventListener('click', function() {
        if (!recognition) {
          addMessage('❌ Voice recognition not supported on this system', 'assistant');
          return;
        }
        if (isListening) {
          recognition.stop();
        } else {
          try {
            recognition.start();
          } catch (e) {
            addMessage('❌ Could not start: ' + e.message, 'assistant');
          }
        }
      });
    }

    // ═══ Text-to-Speech ═══
    function speak(text) {
      if (!text || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(text.substring(0, 500));
      utterance.lang = 'en-IN';
      utterance.rate = 1;
      utterance.onstart = function() { if (aiSpeakBtn) aiSpeakBtn.classList.add('speaking'); };
      utterance.onend = function() { if (aiSpeakBtn) aiSpeakBtn.classList.remove('speaking'); };
      utterance.onerror = function() { if (aiSpeakBtn) aiSpeakBtn.classList.remove('speaking'); };
      window.speechSynthesis.speak(utterance);
    }

    if (aiSpeakBtn) {
      aiSpeakBtn.addEventListener('click', function() {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          aiSpeakBtn.classList.remove('speaking');
        } else if (lastAssistantMessage) {
          speak(lastAssistantMessage);
        } else {
          addMessage('⚠️ No AI response yet to read', 'assistant');
        }
      });
    }

    // ═══ Voice Settings Modal ═══
    if (voiceSettingsBtn && voiceSettingsModal) {
      voiceSettingsBtn.addEventListener('click', function() {
        voiceSettingsModal.classList.add('show');
      });
    }

    if (voiceSettingsClose) {
      voiceSettingsClose.addEventListener('click', function() {
        if (voiceSettingsModal) voiceSettingsModal.classList.remove('show');
      });
    }

    if (voiceSettingsModal) {
      voiceSettingsModal.addEventListener('click', function(e) {
        if (e.target === voiceSettingsModal) {
          voiceSettingsModal.classList.remove('show');
        }
      });
    }

    // ═══ Keyboard Shortcut: Ctrl+Shift+V ═══
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        if (aiMicBtn) aiMicBtn.click();
      }
    });

    console.log('[AI] ✅ All events attached');
  }

  // ═══ Boot ═══
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
