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
        width: 380px;
        max-width: calc(100vw - 32px);
        height: 540px;
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
        font-size: 12px;
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
      }
      .sb-controls button:hover {
        background: rgba(255,255,255,0.35);
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
        background: #f3e5f5;
        color: #2c0b30;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      }
      .sb-msg.user {
        align-self: flex-end;
        background: linear-gradient(135deg, #a23cad, #c2185b);
        color: white;
        border-bottom-right-radius: 4px;
        box-shadow: 0 2px 6px rgba(162,60,173,0.25);
      }
      .sb-msg.bot .sb-tts-btn {
        margin-top: 6px;
        font-size: 11px;
        background: rgba(162,60,173,0.12);
        border: none;
        border-radius: 8px;
        padding: 3px 8px;
        cursor: pointer;
        color: #6a1b9a;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .sb-msg.bot .sb-tts-btn:hover {
        background: rgba(162,60,173,0.22);
      }

      .sb-chips {
        padding: 8px 12px;
        background: #ffffff;
        border-top: 1px solid #f0e6f2;
        display: flex;
        gap: 6px;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
      }
      .sb-chips::-webkit-scrollbar { display: none; }
      .sb-chip {
        background: #fdf0fa;
        color: #8e24aa;
        border: 1px solid #f8bbd0;
        padding: 4px 10px;
        border-radius: 14px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      }
      .sb-chip:hover {
        background: #a23cad;
        color: white;
      }

      .sb-input-area {
        padding: 10px 14px;
        background: #ffffff;
        border-top: 1px solid #f0e6f2;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sb-input-area input {
        flex: 1;
        padding: 10px 14px;
        border: 1.5px solid #e1bee7;
        border-radius: 24px;
        outline: none;
        font-size: 14px;
        transition: border-color 0.2s;
      }
      .sb-input-area input:focus {
        border-color: #a23cad;
      }
      .sb-input-area button {
        background: #a23cad;
        color: white;
        border: none;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        transition: background 0.2s;
      }
      .sb-input-area button:hover {
        background: #8e24aa;
      }
      .sb-input-area #sb-mic-btn {
        background: #f3e5f5;
        color: #8e24aa;
      }
      .sb-input-area #sb-mic-btn.listening {
        background: #e91e63;
        color: white;
        animation: soulbot-pulse 1s infinite;
      }

      .sb-typing {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
        background: #f3e5f5;
        border-radius: 16px;
        width: fit-content;
      }
      .sb-typing-dot {
        width: 6px;
        height: 6px;
        background: #a23cad;
        border-radius: 50%;
        animation: sb-bounce 1.4s infinite ease-in-out both;
      }
      .sb-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .sb-typing-dot:nth-child(2) { animation-delay: -0.16s; }
      @keyframes sb-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    </style>

    <button id="soulbot-fab" title="Chat with SoulBot AI">
      <div class="pulse-ring"></div>
      💬
    </button>

    <div id="soulbot-modal">
      <div class="sb-header">
        <div class="sb-title">
          <span>🧠 AI</span> SoulBot Counselor
        </div>
        <div class="sb-controls">
          <button id="sb-clear-btn" title="Clear Chat">🧹</button>
          <button id="sb-close-btn" title="Close">✕</button>
        </div>
      </div>
      
      <div class="sb-chat-body" id="sb-chat-body">
        <div class="sb-msg bot">
          👋 Hi there, I'm <strong>SoulBot</strong>—your personal AI heartbreak & mental health counselor. 
          <br><br>
          I'm here to listen without judgment. Whether you're feeling hurt, missing your ex, or struggling with overthinking, tell me everything. 💜
          <br>
          <button class="sb-tts-btn" onclick="SoulBotWidget.speak('Hi there, I am SoulBot, your personal AI heartbreak counselor. I am here to listen without judgment.')">🔊 Listen</button>
        </div>
      </div>

      <div class="sb-chips">
        <button class="sb-chip" onclick="SoulBotWidget.sendQuick('I miss my ex so much right now')">💔 I miss my ex</button>
        <button class="sb-chip" onclick="SoulBotWidget.sendQuick('I have a strong urge to text them')">📱 Urge to text</button>
        <button class="sb-chip" onclick="SoulBotWidget.sendQuick('I feel like crying and I feel so lonely')">😢 Feeling lonely</button>
        <button class="sb-chip" onclick="SoulBotWidget.sendQuick('Help me stop overthinking what happened')">🌀 Overthinking</button>
        <button class="sb-chip" onclick="SoulBotWidget.sendQuick('Guide me through a calming exercise')">🧘 Calm exercise</button>
      </div>

      <div class="sb-input-area">
        <button id="sb-mic-btn" title="Voice Input">🎤</button>
        <input type="text" id="sb-input" placeholder="Type what's in your heart..." autocomplete="off" />
        <button id="sb-send-btn" title="Send Message">➤</button>
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: conversationHistory
        })
      });
      const data = await res.json();
      typingDiv.remove();

      if (data && data.reply) {
        // Format markdown bold/bullets simply
        const formatted = data.reply
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        appendMessage(formatted, 'bot', true);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        appendMessage("I'm right here with you. Take a deep breath. Can you tell me more?", 'bot');
      }
    } catch (err) {
      typingDiv.remove();
      appendMessage("I'm listening to your heart. Remember: you are stronger than this temporary wave of pain. What's on your mind?", 'bot');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
