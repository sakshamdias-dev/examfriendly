class ExamNavbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        this.render();
        this.setupEventListeners();
    }

    // New: Centralized navigation logic
    handleNavigation(e) {
        const target = e.composedPath().find(el => el.tagName === 'A');
        if (target && target.hasAttribute('href')) {
            const href = target.getAttribute('href');
            
            // Only intercept internal links (not absolute URLs like http://...)
            if (!href.startsWith('http') && !href.startsWith('//')) {
                e.preventDefault();
                
                // Update URL bar without reload
                window.history.pushState({}, '', href);
                
                // Close mobile menu if open
                const menu = this.shadowRoot.getElementById('mobile-menu');
                const overlay = this.shadowRoot.getElementById('mobile-menu-overlay');
                if(menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Dispatch a global event so your main page knows to change content
                window.dispatchEvent(new CustomEvent('onroutechange', { detail: { path: href } }));
            }
        }
    }

    setupEventListeners() {
        const shadow = this.shadowRoot;
        const overlay = shadow.getElementById('mobile-menu-overlay');
        const menu = shadow.getElementById('mobile-menu');
        const themeBtn = shadow.getElementById('theme-toggle');
        const openBtn = shadow.getElementById('open-menu-btn');
        const closeBtn = shadow.getElementById('close-menu-btn');

        // Listen for clicks on the nav containers (Delegation)
        shadow.querySelector('.desktop-nav').onclick = (e) => this.handleNavigation(e);
        shadow.querySelector('.mobile-links').onclick = (e) => this.handleNavigation(e);

        const toggleMenu = (isOpen) => {
            if (isOpen) {
                menu.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        if (openBtn) openBtn.onclick = () => toggleMenu(true);
        if (closeBtn) closeBtn.onclick = () => toggleMenu(false);
        if (overlay) overlay.onclick = () => toggleMenu(false);
        
        if (themeBtn) {
            themeBtn.onclick = () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                this.render();
                this.setupEventListeners(); // Re-bind after re-render
            };
        }
    }

    render() {
        const isDark = document.documentElement.classList.contains('dark');
        
        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');
            @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

            :host { 
                --primary: #00BFFF; 
                --bg: ${isDark ? 'rgba(10, 15, 28, 0.96)' : 'rgba(255, 255, 255, 0.96)'};
                --text: ${isDark ? '#f8fafc' : '#0f172a'};
                --border: ${isDark ? '#1e293b' : '#f1f5f9'};
                font-family: 'Lexend', sans-serif;
            }

            * { box-sizing: border-box; margin: 0; padding: 0; }

            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes continuousWipe {
                0% { transform: translateX(-150%); }
                100% { transform: translateX(250%); }
            }

            header {
                position: fixed; top: 0; left: 0; width: 100%; height: 80px;
                background: var(--bg); backdrop-filter: blur(16px);
                border-bottom: 1px solid var(--border); z-index: 1000;
                display: flex; align-items: center; overflow: hidden;
                transition: background 0.3s ease;
            }

            .navbar-wipe {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(0, 191, 255, 0.18) 45%, 
                    rgba(0, 191, 255, 0.25) 50%, 
                    rgba(0, 191, 255, 0.18) 55%, 
                    transparent 100%);
                animation: continuousWipe 12s linear infinite;
                pointer-events: none;
                filter: blur(25px);
            }

            .container { 
                width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 24px;
                display: flex; justify-content: space-between; align-items: center; position: relative;
            }

            .logo img { height: 42px; transition: transform 0.3s ease; position: relative; z-index: 2;}

            nav.desktop-nav { 
                display: flex; gap: 28px; 
                position: absolute; left: 50%; transform: translateX(-50%);
            }
            
            nav.desktop-nav a { 
                text-decoration: none; font-size: 14px; font-weight: 700; color: var(--text);
                transition: color 0.3s ease;
            }
            
            nav.desktop-nav a:hover { color: var(--primary); }

            .mobile-toggle { display: none !important; }

            @media (max-width: 900px) {
                nav.desktop-nav { display: none !important; }
                .mobile-toggle { display: flex !important; }
            }

            .icon-btn { 
                background: none; border: none; cursor: pointer; color: var(--text); 
                padding: 10px; border-radius: 50%; display: flex; align-items: center;
                transition: all 0.3s ease; position: relative; z-index: 2;
            }

            #mobile-menu-overlay {
                position: fixed; inset: 0; background: rgba(0,0,0,0.6); 
                opacity: 0; pointer-events: none; transition: opacity 0.4s ease; z-index: 2000;
                backdrop-filter: blur(6px);
            }
            #mobile-menu-overlay.active { opacity: 1; pointer-events: auto; }

            #mobile-menu {
                position: fixed; top: 0; right: 0; height: 100%; width: 300px;
                background: ${isDark ? '#0a0f1c' : '#ffffff'};
                transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 2001; padding: 30px 24px; border-left: 1px solid var(--border);
            }
            #mobile-menu.active { transform: translateX(0); }

            .mobile-links { display: flex; flex-direction: column; gap: 10px; margin-top: 40px; }
            
            .mobile-links a { 
                display: block; text-decoration: none; font-size: 18px; font-weight: 700; 
                color: var(--text); padding: 16px; border-radius: 12px;
                opacity: 0; transform: translateY(20px);
            }

            #mobile-menu.active .mobile-links a { animation: slideInUp 0.5s ease forwards; }
            #mobile-menu.active .mobile-links a:nth-child(1) { animation-delay: 0.1s; }
            #mobile-menu.active .mobile-links a:nth-child(2) { animation-delay: 0.2s; }
            #mobile-menu.active .mobile-links a:nth-child(3) { animation-delay: 0.3s; }
            #mobile-menu.active .mobile-links a:nth-child(4) { animation-delay: 0.4s; }
            #mobile-menu.active .mobile-links a:nth-child(5) { animation-delay: 0.5s; }

            .bottom-line {
                position: absolute; bottom: 0; left: 0; width: 100%; height: 2px;
                background: linear-gradient(90deg, transparent, var(--primary), transparent);
            }
        </style>

        <header>
            <div class="navbar-wipe"></div>
            <div class="bottom-line"></div>
            <div class="container">
                <div class="logo"><img src="Artboard 1.png" alt="Logo"></div>
                
                <nav class="desktop-nav">
                    <a href="/">Home</a>
                    <a href="/courses">Courses</a>
                    <a href="/studentsResource">Student Resources</a>
                    <a href="/aboutus">About Us</a>
                    <a href="/paperPilelauncher">Paper Pile Test Gen</a>
                </nav>

                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="theme-toggle" class="icon-btn">
                        <span class="material-symbols-outlined">${isDark ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button id="open-menu-btn" class="icon-btn mobile-toggle">
                        <span class="material-icons">menu</span>
                    </button>
                </div>
            </div>
        </header>

        <div id="mobile-menu-overlay"></div>
        <div id="mobile-menu">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 800; color: var(--primary); font-size: 1.2rem;">Navigation</span>
                <button id="close-menu-btn" class="icon-btn">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <nav class="mobile-links">
                <a href="/">Home</a>
                <a href="/courses">Courses</a>
                <a href="/studentsResource">Resources</a>
                <a href="/paperPilelauncher">Test Gen</a>
                <a href="/aboutus">About Us</a>
            </nav>
        </div>
        `;
    }
}
customElements.define('exam-navbar', ExamNavbar);