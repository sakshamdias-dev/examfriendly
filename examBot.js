import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

class ExamFriendlyMan extends HTMLElement {
    constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.hfSpace = "ExamFriendly/aboutexam";
    this.msgCount = 0; // Global counter for this instance
}

    connectedCallback() {
        this.render();
        this.setupEvents();
        this.initGradio();
    }

    async initGradio() {
        try { this.client = await Client.connect(this.hfSpace); } 
        catch (e) { console.error("AI Connection Failed", e); }
    }

    render() {
    this.shadowRoot.innerHTML = `
    <style>
        :host { --blue: #00BFFF; --orange: #FF8C00; --glass: rgba(255, 255, 255, 0.85); }

        /* Professional Bouncing Launcher with Bot Icon */
        #launcher {
            position: fixed; bottom: 30px; right: 30px;
            width: 70px; height: 70px; background: var(--orange);
            color: white; border-radius: 50%; display: flex;
            justify-content: center; align-items: center;
            cursor: pointer; z-index: 99999;
            box-shadow: 0 8px 32px rgba(255, 140, 0, 0.4);
            animation: bounce 2s infinite ease-in-out, pulse 2s infinite;
            border: 3px solid white; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
            /* Add this to your style block */
        .loading {
            font-style: italic;
            opacity: 0.7;
        }
        
        /* Bot Icon Styling */
        #launcher svg {
            width: 38px; height: 38px; fill: white;
            transition: transform 0.3s ease;
        }

        #launcher:hover { transform: scale(1.1) rotate(5deg); background: #00a8e8; }
        #launcher:hover svg { transform: scale(1.1); }

        /* Glassmorphism Chat Window */
        #chat-window {
            position: fixed; bottom: 110px; right: 30px;
            width: 380px; height: 580px; 
            background: var(--glass);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 24px; display: none; flex-direction: column;
            z-index: 100000; box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            transform: scale(0.8) translateY(40px); opacity: 0;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #chat-window.active { display: flex; transform: scale(1) translateY(0); opacity: 1; }

        /* Header Styling */
        header {
            background: linear-gradient(135deg, var(--blue), #0099cc);
            color: white; padding: 20px; border-radius: 24px 24px 0 0;
            display: flex; align-items: center; gap: 12px;
        }
        .avatar { width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .title-area { flex: 1; font-family: 'Segoe UI', sans-serif; }
        .title-area b { display: block; font-size: 16px; }
        .title-area span { font-size: 12px; opacity: 0.9; }

        /* Messages Area */
        #chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
        .msg { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; font-family: 'Segoe UI', sans-serif; max-width: 80%; animation: slideIn 0.3s ease-out; }
        .bot { background: white; color: #333; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .user { background: var(--orange); color: white; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: 0 4px 12px rgba(255,140,0,0.2); }

        /* Input Section */
        .input-box { padding: 15px; background: white; border-top: 1px solid #eee; display: flex; gap: 10px; align-items: center; border-radius: 0 0 24px 24px; }
        input { flex: 1; border: none; padding: 12px; outline: none; font-size: 14px; background: #f5f5f5; border-radius: 12px; font-family: 'Segoe UI', sans-serif; }
        #send-btn { background: var(--blue); color: white; border: none; width: 42px; height: 42px; border-radius: 12px; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; font-size: 18px; }
        #send-btn:hover { background: var(--orange); transform: translateY(-2px); }

        /* Animations */
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.5); } 70% { box-shadow: 0 0 0 15px rgba(255, 140, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>

    <div id="launcher">
        <svg viewBox="0 0 24 24">
            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.59,5.39 13,5.73V7H14A3,3 0 0,1 17,10V11H18A2,2 0 0,1 20,13V17A2,2 0 0,1 18,19H17V20A2,2 0 0,1 15,22H9A2,2 0 0,1 7,20V19H6A2,2 0 0,1 4,17V13A2,2 0 0,1 6,11H7V10A3,3 0 0,1 10,7H11V5.73C10.41,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A1.5,1.5 0 0,0 6,14.5A1.5,1.5 0 0,0 7.5,16A1.5,1.5 0 0,0 9,14.5A1.5,1.5 0 0,0 7.5,13M16.5,13A1.5,1.5 0 0,0 15,14.5A1.5,1.5 0 0,0 16.5,16A1.5,1.5 0 0,0 18,14.5A1.5,1.5 0 0,0 16.5,13M12,14A1,1 0 0,0 11,15V17A1,1 0 0,0 12,18A1,1 0 0,0 13,17V15A1,1 0 0,0 12,14Z" />
        </svg>
    </div>

    <div id="chat-window">
        <header>
            <div class="avatar">🤖</div>
            <div class="title-area">
                <b>ExamFriendly Man</b>
                <span>AI Assistant • <span style="color : red;"> Always Online</span></span>
            </div>
            <button id="close" style="background:none; border:none; color:white; font-size:28px; cursor:pointer; line-height: 1;">×</button>
        </header>
        <div id="chat-body">
            <div class="msg bot">Hello! I'm your AI Assistant. How can I help you get to know ExamFriendly better today?</div>
        </div>
        <div class="input-box">
            <input type="text" id="user-input" placeholder="Ask a query...">
            <button id="send-btn">➔</button>
        </div>
    </div>
    `;
}

    setupEvents() {
        const launcher = this.shadowRoot.getElementById('launcher');
        const windowDiv = this.shadowRoot.getElementById('chat-window');
        const closeBtn = this.shadowRoot.getElementById('close');
        const sendBtn = this.shadowRoot.getElementById('send-btn');
        const input = this.shadowRoot.getElementById('user-input');

        launcher.onclick = () => { windowDiv.style.display = 'flex'; setTimeout(() => windowDiv.classList.add('active'), 10); launcher.style.display = 'none'; };
        closeBtn.onclick = () => { windowDiv.classList.remove('active'); setTimeout(() => { windowDiv.style.display = 'none'; launcher.style.display = 'flex'; }, 400); };

        const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;
    
    this.addMessage(text, 'user');
    input.value = '';
    
    const loadId = this.addMessage("...", 'bot'); // Use "..." as a simpler placeholder
    
    try {
        const result = await this.client.predict("/chat", { 
            message: text,
            // If your Gradio backend uses state/history, you may need to pass [] 
            // history: [] 
        });

        // FIX: Check if the result is an array (history) or a direct string
        let reply = result.data[0];
        if (Array.isArray(reply)) {
            // Get the last message's content from the history array
            // Usually [ ["user", "hi"], ["bot", "hello"] ]
            const lastPair = reply[reply.length - 1];
            reply = lastPair[1]; 
        }

        this.updateMessage(loadId, reply);
    } catch (e) { 
        console.error(e);
        this.updateMessage(loadId, "I'm having trouble connecting. Try again!"); 
    }
};

        sendBtn.onclick = handleSend;
        input.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };
    }

    addMessage(text, type) {
    const body = this.shadowRoot.getElementById('chat-body');
    const div = document.createElement('div');
    
    // Create a truly unique ID
    this.msgCount++;
    const id = `msg-${performance.now()}-${this.msgCount}`;
    
    div.id = id; 
    div.className = `msg ${type}`;
    
    // Use marked if available, otherwise fallback to text
    if (type === 'bot' && window.marked) {
        div.innerHTML = marked.parse(text);
    } else {
        div.textContent = text;
    }

    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return id;
}

    updateMessage(id, text) {
    const m = this.shadowRoot.getElementById(id);
    if (m) {
        if (window.marked) {
            m.innerHTML = marked.parse(text);
        } else {
            m.textContent = text;
        }
    }
    // Smooth scroll to bottom
    const body = this.shadowRoot.getElementById('chat-body');
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
}
}
customElements.define('examfriendly-man', ExamFriendlyMan);