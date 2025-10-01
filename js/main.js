/**
 * ================================================================
 * ENHANCED SCRIPT.JS - V6 - PROFESSIONAL & MODULAR
 * Mohamed Hassan Portfolio - Complete JavaScript Overhaul
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const App = {
        // Configuration object for easy management
        config: {
            aos: {
                duration: 1000,
                once: true, // Animate elements only once
                easing: 'ease-out-cubic',
                offset: 50,
            },
            textScramble: {
                phrases: [
                    "3D Artist & Visual Creator",
                    "High-End Photo Retoucher",
                    "AI Content Specialist",
                    "Filmmaker & Videographer"
                ],
                delay: 3000,
            },
        },

        // Application state
        state: {
            isMobile: window.innerWidth <= 768,
            testimonialInterval: null,
            currentTestimonial: 0,
        },

        /**
         * Initializes all the application modules.
         */
        init() {
            this.initPageLoader();
            this.initAOS();
            this.initMobileNav();
            this.initThemeToggle();
            this.initTextScramble();
            this.initParticles();
            this.initTestimonialSlider();
            this.initVideoHover();
            this.setupEventListeners();
        },

        /**
         * Sets up global event listeners.
         */
        setupEventListeners() {
            window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        },

        /**
         * Handles the page loader animation.
         */
        initPageLoader() {
            const loader = document.getElementById('pageLoader');
            if (!loader) return;

            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('fade-out');
                }, 500); // Minimum display time
            });
        },

        /**
         * Initializes the AOS (Animate On Scroll) library.
         */
        initAOS() {
            if (typeof AOS !== 'undefined') {
                AOS.init(this.config.aos);
            }
        },

        /**
         * Initializes mobile navigation (hamburger menu).
         */
        initMobileNav() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.navbar__menu');
            if (!hamburger || !navMenu) return;

            const toggleMenu = () => {
                const isActive = hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
            };

            hamburger.addEventListener('click', toggleMenu);
            navMenu.addEventListener('click', (e) => {
                if (e.target.matches('.navbar__link')) {
                    toggleMenu();
                }
            });
        },

        /**
         * Initializes the theme (dark/light mode) toggle.
         */
        initThemeToggle() {
            const toggleButton = document.querySelector('.theme-toggle');
            if (!toggleButton) return;
            const icon = toggleButton.querySelector('i');

            const applyTheme = (theme) => {
                document.body.dataset.theme = theme;
                localStorage.setItem('theme', theme);
                if (icon) {
                    icon.classList.toggle('fa-sun', theme === 'light');
                    icon.classList.toggle('fa-moon', theme === 'dark');
                }
            };

            toggleButton.addEventListener('click', () => {
                const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });

            applyTheme(localStorage.getItem('theme') || 'dark');
        },

        /**
         * Initializes the text scramble effect in the hero section.
         */
        initTextScramble() {
            const el = document.getElementById('textAnimation');
            if (!el) return;
            const phrases = this.config.textScramble.phrases;
            let counter = 0;

            class TextScrambleEffect {
                constructor(el) {
                    this.el = el;
                    this.chars = '!<>-_\\/[]{}—=+*^?#_';
                    this.update = this.update.bind(this);
                }
                setText(newText) {
                    const oldText = this.el.innerText;
                    const length = Math.max(oldText.length, newText.length);
                    const promise = new Promise(resolve => this.resolve = resolve);
                    this.queue = [];
                    for (let i = 0; i < length; i++) {
                        const from = oldText[i] || '';
                        const to = newText[i] || '';
                        const start = Math.floor(Math.random() * 40);
                        const end = start + Math.floor(Math.random() * 40);
                        this.queue.push({ from, to, start, end });
                    }
                    cancelAnimationFrame(this.frameRequest);
                    this.frame = 0;
                    this.update();
                    return promise;
                }
                update() {
                    let output = '';
                    let complete = 0;
                    for (let i = 0, n = this.queue.length; i < n; i++) {
                        let { from, to, start, end, char } = this.queue[i];
                        if (this.frame >= end) {
                            complete++;
                            output += to;
                        } else if (this.frame >= start) {
                            if (!char || Math.random() < 0.28) {
                                char = this.chars[Math.floor(Math.random() * this.chars.length)];
                                this.queue[i].char = char;
                            }
                            output += `<span class="dud">${char}</span>`;
                        } else {
                            output += from;
                        }
                    }
                    this.el.innerHTML = output;
                    if (complete === this.queue.length) {
                        this.resolve();
                    } else {
                        this.frameRequest = requestAnimationFrame(this.update);
                        this.frame++;
                    }
                }
            }

            const fx = new TextScrambleEffect(el);
            const next = () => {
                fx.setText(phrases[counter]).then(() => {
                    setTimeout(next, this.config.textScramble.delay);
                });
                counter = (counter + 1) % phrases.length;
            };
            
            // Start after initial page animations
            setTimeout(next, 2000);
        },

        /**
         * Initializes the floating particles background effect.
         */
        initParticles() {
            const container = document.getElementById('heroParticles');
            if (!container) return;

            // Reduce particles on mobile for better performance
            const particleCount = this.state.isMobile ? 15 : 30;
            container.innerHTML = ''; // Clear existing particles on resize

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 8}s`;
                particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
                container.appendChild(particle);
            }
        },

        /**
         * Initializes the testimonials slider.
         */
        initTestimonialSlider() {
            const testimonials = document.querySelectorAll('.testimonial-card');
            if (testimonials.length === 0) return;
            const nextBtn = document.getElementById('nextTestimonial');
            const prevBtn = document.getElementById('prevTestimonial');
            
            const showTestimonial = (index) => {
                testimonials.forEach((card, i) => {
                    card.classList.toggle('active', i === index);
                });
            };

            const next = () => {
                this.state.currentTestimonial = (this.state.currentTestimonial + 1) % testimonials.length;
                showTestimonial(this.state.currentTestimonial);
            };

            const prev = () => {
                this.state.currentTestimonial = (this.state.currentTestimonial - 1 + testimonials.length) % testimonials.length;
                showTestimonial(this.state.currentTestimonial);
            };

            const resetInterval = () => {
                clearInterval(this.state.testimonialInterval);
                this.state.testimonialInterval = setInterval(next, 6000);
            };

            nextBtn.addEventListener('click', () => { next(); resetInterval(); });
            prevBtn.addEventListener('click', () => { prev(); resetInterval(); });

            this.state.testimonialInterval = setInterval(next, 6000);
        },

        /**
         * Initializes hover effect for videos to play/pause.
         */
        initVideoHover() {
            document.querySelectorAll('.featured-media video').forEach(video => {
                const parentLink = video.closest('a');
                parentLink.addEventListener('mouseenter', () => video.play().catch(() => {}));
                parentLink.addEventListener('mouseleave', () => video.pause());
            });
        },

        /**
         * Handles window resize events.
         */
        handleResize() {
            const wasMobile = this.state.isMobile;
            this.state.isMobile = window.innerWidth <= 768;
            if (wasMobile !== this.state.isMobile) {
                this.initParticles(); // Re-create particles for new screen size
            }
        },

        /**
         * Utility function to limit the execution rate of a function.
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
    };

    // Run the app
    App.init();

});