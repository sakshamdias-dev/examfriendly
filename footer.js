class ExamFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initThemeObserver();
    }

    initThemeObserver() {
        const observer = new MutationObserver(() => this.render());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    render() {
        const isDark = document.documentElement.classList.contains('dark');
        
        this.shadowRoot.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');
            @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

            :host {
                display: block;
                width: 100%;
                font-family: 'Lexend', sans-serif;
                --primary: #00BFFF;
                /* Theme mapping */
                --footer-bg: ${isDark ? '#020617' : '#ffffff'};
                --footer-border: ${isDark ? '#1e293b' : '#f1f5f9'};
                --text-heading: ${isDark ? '#ffffff' : '#0f172a'};
                --text-body: ${isDark ? '#94a3b8' : '#64748b'};
                --icon-bg: ${isDark ? '#1e293b' : '#ffffff'};
            }

            footer {
                background-color: var(--footer-bg);
                border-top: 1px solid var(--footer-border);
                padding: 64px 0 32px 0;
                transition: all 0.3s ease;
                position: relative;
                z-index: 10;
            }

            .max-w-7xl { max-width: 1280px; margin: 0 auto; px: 1rem; }
            .container { padding: 0 1rem; }
            
            .grid { 
                display: grid; 
                gap: 3rem; 
                margin-bottom: 4rem;
                grid-template-columns: 1fr;
            }

            @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
            @media (min-width: 1024px) { .grid { grid-template-columns: repeat(4, 1fr); } }

            .space-y-6 > * + * { margin-top: 1.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .justify-center { justify-content: center; }
            .gap-2 { gap: 0.5rem; }
            .gap-3 { gap: 0.75rem; }
            .gap-4 { gap: 1rem; }

            .logo-icon {
                width: 2rem; height: 2rem;
                background: var(--icon-bg);
                border: 1px solid var(--primary);
                border-radius: 0.375rem;
            }

            .text-xl { font-size: 1.25rem; font-weight: 700; color: var(--text-heading); }
            .text-sm { font-size: 0.875rem; color: var(--text-body); line-height: 1.625; }
            h4 { color: var(--text-heading); font-weight: 700; margin-bottom: 1.5rem; }
            
            ul { list-style: none; padding: 0; margin: 0; }
            a { color: var(--text-body); text-decoration: none; transition: 0.3s; }
            a:hover { color: var(--primary); }

            .social-btn {
                width: 2.5rem; height: 2.5rem;
                border-radius: 9999px;
                background: ${isDark ? '#1e293b' : '#f1f5f9'};
                display: flex; align-items: center; justify-content: center;
                color: var(--text-body);
                transition: 0.3s;
            }
            .social-btn:hover { color: var(--primary); }

            .material-icons, .material-symbols-outlined {
                color: var(--primary);
                font-size: 1.125rem;
            }
        </style>

        <footer>
            <div class="max-w-7xl container">
                <div class="grid">
                    <div class="space-y-6">
                        <div class="flex items-center gap-2">
                            <div class="logo-icon flex items-center justify-center">
                                <span class="material-symbols-outlined">school</span>
                            </div>
                            <span class="text-xl">Examfriendly</span>
                        </div>
                        <p class="text-sm">
                            Leading the future of digital education with accessible, high-quality learning resources for
                            students and teachers worldwide.
                        </p>
                        <div class="flex gap-4">
                            <a class="social-btn" href="https://linkedin.com/company/exam-friendly" target="_blank">
                                <svg style="width:1.25rem; height:1.25rem" fill="currentColor" viewBox="0 0 382 382"><path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889 C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056 H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806 c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1 s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73 c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079 c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426 c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472 L341.91,330.654L341.91,330.654z"></path></svg>
                            </a>
                            <a class="social-btn" href="https://www.instagram.com/examfriendly_tutorials/" target="_blank">
                                <svg style="width:1.25rem; height:1.25rem" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.011 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4>Programs</h4>
                        <ul class="space-y-4">
                            <li><a href="#">CBSE Tutorials</a></li>
                            <li><a href="#">NCERT Solutions</a></li>
                            <li><a href="#">Coding Courses for kids</a></li>
                            <li><a href="#">Maharashtra State Board Textbook Solutions</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Support</h4>
                        <ul class="space-y-4">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="/aboutus"> About Us </a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact Us</h4>
                        <ul class="space-y-4 text-sm">
                            <li class="flex items-start gap-3">
                                <span class="material-icons">location_on</span>
                                <span>401201, Vasai West, Mumbai, Maharashtra</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="material-icons">email</span>
                                <span>inquiry@examfriendly.in</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <span class="material-icons">phone</span>
                                <span>+91 70668 34012</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}
customElements.define('exam-footer', ExamFooter);