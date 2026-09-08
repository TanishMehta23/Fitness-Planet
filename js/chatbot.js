// Global Chatbot Toggle Function callable directly from HTML or JS
window.toggleGlobalChatbot = function(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }

  let chatbox = document.querySelector('.chatbox');

  // If no chatbox exists on page, dynamically create floating widget
  if (!chatbox) {
    chatbox = document.createElement('div');
    chatbox.className = 'chatbox active';
    chatbox.innerHTML = `
      <div class="chat-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
        <div class="bot-info" style="display:flex; align-items:center; gap:8px;">
          <div class="bot-avatar-badge" style="width:28px; height:28px; border-radius:50%; background:#f1c40f; color:#000; font-weight:bold; font-size:12px; display:flex; align-items:center; justify-content:center;">FP</div>
          <div>
            <h3 style="font-size:0.95rem; margin:0; color:#fff;">Fitness Planet AI</h3>
            <span class="status-online" style="font-size:0.75rem; color:#10b981;">Online</span>
          </div>
        </div>
        <button type="button" class="chat-close-btn" style="background:none; border:none; color:#ffffff; font-size:1.5rem; cursor:pointer; padding:0 6px; line-height:1;">&times;</button>
      </div>
      <div class="chat-container">
        <div class="h1">How can I assist your fitness journey today?</div>
      </div>
      <div class="input-area">
        <input type="text" class="prompt" placeholder="Ask about workouts or nutrition...">
        <button type="button" class="arrow" aria-label="Send Message">&rarr;</button>
      </div>
    `;
    document.body.appendChild(chatbox);

    // Prevent click events inside chatbox from bubbling to document
    chatbox.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    // Bind inner widget handlers
    bindChatboxEvents(chatbox);
  } else {
    chatbox.classList.toggle('active');
  }

  const promptInput = chatbox.querySelector('.prompt');
  if (promptInput && chatbox.classList.contains('active')) {
    setTimeout(() => promptInput.focus(), 100);
  }
};

function bindChatboxEvents(chatbox) {
  const closeBtn = chatbox.querySelector('.chat-close-btn');
  const chatContainer = chatbox.querySelector('.chat-container');
  const h1 = chatbox.querySelector('.h1');
  const prompt = chatbox.querySelector('.prompt');
  const chatbtn = chatbox.querySelector('.input-area button');

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      chatbox.classList.remove('active');
    };
  }

  let userMessage = '';

  function createChatBox(html, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.innerHTML = html;
    return div;
  }

  function scrollToBottom() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function generateApiResponse(aiChatBox) {
    const textElement = aiChatBox.querySelector('.text');
    try {
      if (typeof Api_url !== 'undefined') {
        const response = await fetch(Api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ "role": "user", "parts": [{ text: userMessage }] }]
          })
        });
        const data = await response.json();
        const apiResponse = data?.candidates[0]?.content?.parts[0]?.text?.trim();
        if (textElement) textElement.innerText = apiResponse || "I am here to help you reach your fitness goals!";
      } else {
        setTimeout(() => {
          if (textElement) {
            textElement.innerText = `Thanks for asking! For "${userMessage}", consistency is key. Combine structured resistance training with balanced nutrition for optimal results!`;
          }
          const loadingImg = aiChatBox.querySelector('.loading');
          if (loadingImg) loadingImg.style.display = 'none';
          scrollToBottom();
        }, 500);
        return;
      }
    } catch (error) {
      if (textElement) textElement.innerText = "Sorry, I couldn't process that. Please try again!";
    } finally {
      const loadingImg = aiChatBox.querySelector('.loading');
      if (loadingImg) loadingImg.style.display = 'none';
      scrollToBottom();
    }
  }

  function showLoading() {
    const html = `<p class="text"></p><span class="loading" style="font-size:0.8rem; color:#f1c40f;">Thinking...</span>`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    scrollToBottom();
    generateApiResponse(aiChatBox);
  }

  function sendMessage(msgText) {
    if (!msgText.trim()) return;
    if (h1) h1.style.display = 'none';

    userMessage = msgText;
    const html = `<p class="text"></p>`;
    let userChatBox = createChatBox(html, "user-chat-box");
    userChatBox.querySelector('.text').innerText = userMessage;
    chatContainer.appendChild(userChatBox);
    if (prompt) prompt.value = '';
    scrollToBottom();
    setTimeout(showLoading, 300);
  }

  if (chatbtn && prompt) {
    chatbtn.onclick = () => sendMessage(prompt.value);
    prompt.onkeypress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage(prompt.value);
      }
    };
  }
}

function initializeChatbot() {
  const existingChatbox = document.querySelector('.chatbox');
  if (existingChatbox) {
    existingChatbox.addEventListener('click', (e) => e.stopPropagation());
    bindChatboxEvents(existingChatbox);
  }
}

// Single Unified Click Handler on document body for Chatbot Icon
document.addEventListener('click', function(e) {
  const icon = e.target.closest('.chatboticon');
  if (icon) {
    e.preventDefault();
    e.stopPropagation();
    window.toggleGlobalChatbot(e);
  }
});

// Run initializer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
  initializeChatbot();
}
