// Global Floating SoulBot AI Widget for BreakChain AI
(function() {
  // Inject widget HTML
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'soulbot-global-container';
  widgetContainer.innerHTML = `
    <style>
      #soulbot-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #a23cad, #e91e63);
        color: white;
        border: none;
        box-shadow: 0 8px 24px rgba(162, 60, 173, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        z-index: 99999;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #soulbot-fab:hover {
        transform: scale(1.08) rotate(5deg);
        box-shadow: 0 12px 28px rgba(162, 60, 173, 0.55);
      }
      #soulbot-fab .pulse-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid #e91e63;
        animation: soulbot-pulse 2s infinite;
        pointer-events: none;
      }
      @keyframes soulbot-pulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.45); opacity: 0; }
      }

      #soulbot-modal {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 390px;
        max-width: calc(100vw - 32px);
        height: 560px;
        max-height: calc(100vh - 120px);
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 99999;
        border: 1px solid rgba(162, 60, 173, 0.15);
        animation: soulbot-slide-up 0.3s ease-out forwards;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      @keyframes soulbot-slide-up {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .sb-header {
        background: linear-gradient(135deg, #a23cad, #e91e63);
        color: white;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sb-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 16px;
      }
      .sb-title span {
        font-size: 11px;
        background: rgba(255,255,255,0.25);
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 500;
      }
      .sb-controls {
        display: flex;
        gap: 8px;
      }
      .sb-controls button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
      }
      .sb-controls button:hover {
        background: rgba(255,255,255,0.35);
      }

      /* Settings Panel inside modal */
      #sb-settings-panel {
        display: none;
        background: #fbf5fc;
        border-bottom: 1px solid #ebd0f5;
        padding: 12px 16px;
        font-size: 13px;
        animation: fadeIn 0.2s ease-in;
      }
      #sb-settings-panel select, #sb-settings-panel input {
        width: 100%;
        padding: 7px 10px;
        margin-top: 5px;
        margin-bottom: 8px;
        border-radius: 8px;
        border: 1px solid #d4b5df;
        font-size: 12px;
        outline: none;
        box-sizing: border-box;
      }
      #sb-settings-panel .save-btn {
        background: #a23cad;
        color: white;
        border: none;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        width: 100%;
      }

      .sb-chat-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #fdfafc;
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-size: 14px;
      }

      .sb-msg {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 16px;
        line-height: 1.45;
        position: relative;
        word-wrap: break-word;
      }
      .sb-msg.bot {
        align-self: flex-start;
        background: #ffffff;
        color: #333333;
        border: 1px solid #f0def4;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(162, 60, 173, 0.06);
      }
      .sb-msg.user {
        align-self: flex-end;
        background: linear-gradient(135deg, #a23cad, #e91e63);
        color: #ffffff;
        border-bottom-right-radius: 4px;
      }
      .sb-msg-meta {
        font-size: 10px;
        opacity: 0.7;
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sb-typing {
        align-self: flex-start;
        background: #ffffff;
        padding: 10px 16px;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        display: flex;
        gap: 4px;
        align-items: center;
        border: 1px solid #f0def4;
      }
      .sb-typing-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #a23cad;
        animation: sb-bounce 1.2s infinite ease-in-out;
      }
      .sb-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .sb-typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes sb-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      .sb-quick-chips {
        padding: 8px 12px;
        background: #faf2fc;
        display: flex;
        gap: 6px;
        overflow-x: auto;
        border-top: 1px solid #f4e3fa;
        scrollbar-width: none;
      }
      .sb-quick-chips::-webkit-scrollbar { display: none; }
      .sb-chip {
        white-space: nowrap;
        background: #ffffff;
        border: 1px solid #e1bde9;
        color: #7b2685;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        cursor: pointer;
        transition: 0.2s;
      }
      .sb-chip:hover {
        background: #a23cad;
        color: white;
        border-color: #a23cad;
      }

      .sb-input-box {
        padding: 12px 14px;
        background: #ffffff;
        border-top: 1px solid #f0def4;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sb-input-box input {
        flex: 1;
        border: 1px solid #ecd3f3;
        border-radius: 24px;
        padding: 10px 14px;
        font-size: 13px;
        outline: none;
        transition: 0.2s;
      }
      .sb-input-box input:focus {
        border-color: #a23cad;
        box-shadow: 0 0 0 2px rgba(162, 60, 173, 0.15);
      }
      .sb-btn-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: 0.2s;
      }
      .sb-mic-btn {
        background: #f4e3fa;
        color: #7b2685;
      }
      .sb-mic-btn.listening {
        background: #e91e63;
        color: white;
        animation: pulse-red 1s infinite;
      }
      @keyframes pulse-red {
        0% { box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.6); }
        70% { box-shadow: 0 0 0 10px rgba(233, 30, 99, 0); }
        100% { box-shadow: 0 0 0 0 rgba(233, 30, 99, 0); }
      }
      .sb-send-btn {
        background: linear-gradient(135deg, #a23cad, #e91e63);
        color: white;
      }
      .sb-send-btn:hover {
        transform: scale(1.05);
      }

      .sb-tts-btn {
        display: inline-block;
        margin-top: 6px;
        background: rgba(162, 60, 173, 0.08);
        border: 1px solid rgba(162, 60, 173, 0.2);
        color: #a23cad;
        border-radius: 10px;
        padding: 2px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: 0.2s;
      }
      .sb-tts-btn:hover {
        background: #a23cad;
        color: white;
      }
    </style>

    <!-- Floating Bubble Button -->
    <button id="soulbot-fab" title="Chat with SoulBot AI Counselor">
      <div class="pulse-ring"></div>
      🧠
    </button>

    <!-- Chat Modal Window -->
    <div id="soulbot-modal">
      <div class="sb-header">
        <div class="sb-title">
          <span>AI Active</span>
          SoulBot Counselor
        </div>
        <div class="sb-controls">
          <button id="sb-settings-toggle" title="AI Model Settings">⚙️</button>
          <button id="sb-clear-btn" title="Clear Conversation">🧹</button>
          <button id="sb-close-btn" title="Close">✕</button>
        </div>
      </div>

      <!-- Settings Panel -->
      <div id="sb-settings-panel">
        <strong>⚡ AI Engine Configuration</strong>
        <label style="display:block; margin-top:6px; font-size:11px; color:#666;">Provider:</label>
        <select id="sb-provider-select">
          <option value="neural">🧠 Built-in Empathetic AI (Zero Setup)</option>
          <option value="gemini">⚡ Google Gemini 2.0 Flash</option>
          <option value="openai">🚀 OpenAI GPT-4o-mini</option>
          <option value="groq">⚡ Groq Llama 3.3 70B</option>
        </select>
        <div id="sb-key-container" style="display:none;">
          <label style="display:block; font-size:11px; color:#666;">API Key:</label>
          <input type="password" id="sb-api-key" placeholder="Paste your API key here...">
        </div>
        <button class="save-btn" id="sb-save-settings">Save & Apply</button>
      </div>

      <div class="sb-chat-body" id="sb-chat-body">
        <div class="sb-msg bot">
          Hello my friend. 🌸 I am <strong>SoulBot</strong>, your 24/7 empathetic counselor on BreakChain AI. 
          <br><br>
          Whether you are feeling the urge to text your ex, dealing with betrayal, or simply need someone to listen without judgment—I am here. How is your heart feeling right now?
        </div>
      </div>

      <!-- Quick prompts -->
      <div class="sb-quick-chips">
        <button class="sb-chip" onclick="window.SoulBotWidget.sendQuick('I miss my ex so much and want to text them')">💔 Urge to text ex</button>
        <button class="sb-chip" onclick="window.SoulBotWidget.sendQuick('How do I stop blaming myself for the breakup?')">😔 Self-blame</button>
        <button class="sb-chip" onclick="window.SoulBotWidget.sendQuick('I feel betrayed and full of anger')">😡 Betrayal & Anger</button>
        <button class="sb-chip" onclick="window.SoulBotWidget.sendQuick('Mujhe bohot akelapan lag raha hai')">🇮🇳 Akelapan</button>
      </div>

      <!-- Input box -->
      <div class="sb-input-box">
        <input type="text" id="sb-input" placeholder="Type here or speak in English / Hindi / Hinglish..." autocomplete="off">
        <button class="sb-btn-icon sb-mic-btn" id="sb-mic-btn" title="Voice Input (Speech-to-Text)">🎤</button>
        <button class="sb-btn-icon sb-send-btn" id="sb-send-btn" title="Send Message">➤</button>
      </div>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  const fab = document.getElementById('soulbot-fab');
  const modal = document.getElementById('soulbot-modal');
  const closeBtn = document.getElementById('sb-close-btn');
  const clearBtn = document.getElementById('sb-clear-btn');
  const sendBtn = document.getElementById('sb-send-btn');
  const micBtn = document.getElementById('sb-mic-btn');
  const input = document.getElementById('sb-input');
  const chatBody = document.getElementById('sb-chat-body');
  const settingsToggle = document.getElementById('sb-settings-toggle');
  const settingsPanel = document.getElementById('sb-settings-panel');
  const providerSelect = document.getElementById('sb-provider-select');
  const keyContainer = document.getElementById('sb-key-container');
  const apiKeyInput = document.getElementById('sb-api-key');
  const saveSettingsBtn = document.getElementById('sb-save-settings');

  // Load saved settings
  const savedProvider = localStorage.getItem('breakchain_ai_provider') || 'neural';
  const savedKey = localStorage.getItem('breakchain_ai_key') || '';
  providerSelect.value = savedProvider;
  apiKeyInput.value = savedKey;
  if (savedProvider !== 'neural') keyContainer.style.display = 'block';

  providerSelect.addEventListener('change', () => {
    keyContainer.style.display = providerSelect.value === 'neural' ? 'none' : 'block';
  });

  settingsToggle.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
  });

  saveSettingsBtn.addEventListener('click', () => {
    localStorage.setItem('breakchain_ai_provider', providerSelect.value);
    localStorage.setItem('breakchain_ai_key', apiKeyInput.value.trim());
    settingsPanel.style.display = 'none';
    appendMessage(`⚙️ AI Engine updated to: <strong>${providerSelect.options[providerSelect.selectedIndex].text}</strong>`, 'bot', true);
  });

  let isListening = false;
  let recognition = null;
  const conversationHistory = [];

  // Toggle modal
  function toggleModal() {
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'flex';
      input.focus();
    }
  }

  fab.addEventListener('click', toggleModal);
  closeBtn.addEventListener('click', () => modal.style.display = 'none');

  clearBtn.addEventListener('click', () => {
    chatBody.innerHTML = `
      <div class="sb-msg bot">
        Conversation cleared. I'm right here whenever you need to talk. 🌸
      </div>
    `;
    conversationHistory.length = 0;
  });

  // Speech Recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      isListening = true;
      micBtn.classList.add('listening');
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      input.value = transcript;
      sendMessage();
    };
    recognition.onerror = () => {
      isListening = false;
      micBtn.classList.remove('listening');
    };
    recognition.onend = () => {
      isListening = false;
      micBtn.classList.remove('listening');
    };

    micBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    micBtn.style.display = 'none';
  }

  // Text-To-Speech helper
  window.SoulBotWidget = {
    speak: function(text) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    sendQuick: function(msg) {
      input.value = msg;
      sendMessage();
    },
    open: function() {
      modal.style.display = 'flex';
      input.focus();
    }
  };

  function appendMessage(text, sender, isHtml = false) {
    const div = document.createElement('div');
    div.className = `sb-msg ${sender}`;
    if (isHtml) {
      div.innerHTML = text;
    } else {
      div.textContent = text;
    }

    if (sender === 'bot') {
      const ttsBtn = document.createElement('button');
      ttsBtn.className = 'sb-tts-btn';
      ttsBtn.innerHTML = '🔊 Listen';
      ttsBtn.onclick = () => window.SoulBotWidget.speak(text);
      div.appendChild(document.createElement('br'));
      div.appendChild(ttsBtn);
    }

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';
    conversationHistory.push({ role: 'user', content: text });

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'sb-typing';
    typingDiv.innerHTML = '<div class="sb-typing-dot"></div><div class="sb-typing-dot"></div><div class="sb-typing-dot"></div>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    const currentProvider = localStorage.getItem('breakchain_ai_provider') || 'neural';
    const currentKey = localStorage.getItem('breakchain_ai_key') || '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': currentKey,
          'x-provider': currentProvider
        },
        body: JSON.stringify({
          message: text,
          history: conversationHistory,
          apiKey: currentKey,
          provider: currentProvider
        })
      });
      const data = await res.json();
      typingDiv.remove();

      if (data && data.reply) {
        const formatted = data.reply
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        appendMessage(formatted, 'bot', true);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        appendMessage("I'm listening closely. Please take a deep breath and tell me more.", 'bot');
      }
    } catch (err) {
      typingDiv.remove();
      appendMessage("I'm here with you. Take a slow, deep breath. Let's try once more.", 'bot');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

})();
