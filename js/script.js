/**
 * ================================================================
 * SCRIPT.JS - V8 - FINAL (Back to Top + All Features)
 * Developer: Gemini (60 Years Experience)
 * STRATEGY: Added initBackToTopButton() for the scroll-to-top
 * functionality. This file now contains all V1-V8 improvements.
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const App = {
        config: {
            aos: {
                duration: 800,
                once: false,
            },
            portfolio: {
                initialItems: 9,
                gridSelector: '#portfolio-grid',
                filtersSelector: '#portfolio-filters',
                showMoreBtnSelector: '#show-more-btn',
                showMoreContainerSelector: '#show-more-container',
                itemSelector: '.portfolio-item',
                filterBtnSelector: '.filter-btn',
                activeFilterClass: 'active',
                hiddenItemClass: 'hidden',
                filterStorageKey: 'activePortfolioFilter',
            },
            mobileMenu: {
                hamburgerSelector: '.hamburger',
                navMenuSelector: '.navbar__menu',
                navLinkSelector: '.navbar__link',
                activeClass: 'active'
            },
            theme: {
                toggleSelector: '.theme-toggle',
                lightIconClass: 'fa-sun',
                darkIconClass: 'fa-moon',
                storageKey: 'theme'
            },
            scrollRestoration: {
                storageKey: 'scrollPosition'
            },
            // 🎯 تعريف جديد لزر العودة للأعلى 🎯
            backToTop: {
                buttonSelector: '.back-to-top',
                activeClass: 'active',
                scrollThreshold: 300 // مسافة الـ scroll لظهور الزر
            }
        },

        init() {
            this.initAOS();
            this.initMobileMenu();
            this.initThemeToggle();
            this.initNavbarActiveLink();
            this.initPortfolio();
            this.initMediaPlayback();
            this.initScrollRestoration();
            this.initFancybox();
            this.initBackToTopButton(); // <-- 🎯 الإضافة الجديدة هنا
        },

        // --- CORE MODULES ---
        initAOS() { if (typeof AOS !== 'undefined') AOS.init(this.config.aos); },
        initMobileMenu() {
            const cfg = this.config.mobileMenu, hamburger = document.querySelector(cfg.hamburgerSelector), navMenu = document.querySelector(cfg.navMenuSelector);
            if (!hamburger || !navMenu) return;
            hamburger.addEventListener('click', () => { const isActive = hamburger.classList.toggle(cfg.activeClass); navMenu.classList.toggle(cfg.activeClass); hamburger.setAttribute('aria-expanded', isActive); });
            navMenu.addEventListener('click', (e) => { if (e.target.matches(cfg.navLinkSelector)) { hamburger.classList.remove(cfg.activeClass); navMenu.classList.remove(cfg.activeClass); hamburger.setAttribute('aria-expanded', 'false'); } });
        },
        initThemeToggle() {
            const cfg = this.config.theme, toggleButton = document.querySelector(cfg.toggleSelector);
            if (!toggleButton) return;
            const icon = toggleButton.querySelector('i');
            const applyTheme = (theme) => { document.body.dataset.theme = theme; localStorage.setItem(cfg.storageKey, theme); if (icon) { icon.classList.toggle(cfg.lightIconClass, theme === 'light'); icon.classList.toggle(cfg.darkIconClass, theme === 'dark'); } };
            toggleButton.addEventListener('click', () => applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'));
            applyTheme(localStorage.getItem(cfg.storageKey) || 'dark');
        },
        initNavbarActiveLink() {
            const cfg = this.config.mobileMenu;
            const navMenu = document.querySelector(cfg.navMenuSelector);
            if (!navMenu) return;

            const navLinks = navMenu.querySelectorAll(cfg.navLinkSelector);
            let currentPage = window.location.pathname.split('/').pop();
            if (currentPage === '') {
                currentPage = 'index.html';
            }

            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href').split('/').pop();
                link.classList.remove(cfg.activeClass);
                if (linkPage === currentPage) {
                    link.classList.add(cfg.activeClass);
                } else if (currentPage === 'index.html' && (linkPage === '' || linkPage === 'index.html')) {
                    link.classList.add(cfg.activeClass);
                }
            });
        },
        initMediaPlayback() {
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            const videoItems = document.querySelectorAll(this.config.portfolio.itemSelector);

            if (isTouchDevice) {
                const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
                const observerCallback = (entries, observer) => {
                    entries.forEach(entry => {
                        const video = entry.target.querySelector('video');
                        if (!video) return;
                        if (entry.isIntersecting) { video.play().catch(e => {}); } 
                        else { video.pause(); }
                    });
                };
                const videoObserver = new IntersectionObserver(observerCallback, observerOptions);
                videoItems.forEach(item => { if (item.querySelector('video')) { videoObserver.observe(item); } });
            } else {
                videoItems.forEach(item => {
                    const video = item.querySelector('video');
                    if (video) { 
                        item.addEventListener('mouseenter', () => video.play().catch(e => {})); 
                        item.addEventListener('mouseleave', () => video.pause()); 
                    }
                });
            }
        },
        initScrollRestoration() {
            const cfg = this.config.scrollRestoration;
            document.body.addEventListener('click', e => { if (e.target.closest(this.config.portfolio.itemSelector)) sessionStorage.setItem(cfg.storageKey, window.scrollY); });
            const restoreScroll = () => { const pos = sessionStorage.getItem(cfg.storageKey); if (pos) { window.scrollTo(0, parseInt(pos, 10)); sessionStorage.removeItem(cfg.storageKey); } };
            window.addEventListener('pageshow', event => { if (event.persisted) restoreScroll(); });
            setTimeout(restoreScroll, 150);
        },
        initFancybox() {
            if (typeof Fancybox === 'undefined') return;
            let scrollPosition = 0;
            Fancybox.bind("[data-fancybox]", {
                wheel: "zoom",
                on: {
                    reveal: () => {
                        scrollPosition = window.scrollY;
                        document.body.style.position = 'fixed';
                        document.body.style.top = `-${scrollPosition}px`;
                        document.body.style.width = '100%';
                    },
                    close: () => {
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        window.scrollTo(0, scrollPosition);
                    }
                }
            });
        },

        // ===================================================================
        // === 🎯 الكود الجديد الخاص بزر العودة للأعلى                        ===
        // ===================================================================
        initBackToTopButton() {
            const cfg = this.config.backToTop;
            const button = document.querySelector(cfg.buttonSelector);
            if (!button) return;

            // 1. إظهار/إخفاء الزر عند التمرير
            const toggleButtonVisibility = () => {
                if (window.scrollY > cfg.scrollThreshold) {
                    button.classList.add(cfg.activeClass);
                } else {
                    button.classList.remove(cfg.activeClass);
                }
            };

            // 2. التحكم بالضغط (Click) للعودة للأعلى
            const scrollToTop = (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            };

            // ربط الأحداث
            window.addEventListener('scroll', toggleButtonVisibility);
            button.addEventListener('click', scrollToTop);
        },
        // ===================================================================

        // --- PORTFOLIO MODULE (RE-ARCHITECTED) ---
        initPortfolio() {
            const cfg = this.config.portfolio;
            const grid = document.querySelector(cfg.gridSelector);
            if (!grid) return;
            
            this.portfolioState = { items: Array.from(grid.querySelectorAll(cfg.itemSelector)) };
            this.initPortfolioFilters();
            this.initPortfolioShowMore();
            
            this.restorePortfolioState();
        },
        renderPortfolio() {
            const { filter, items, visibleCount } = this.portfolioState;
            if (!items) return;
            const filteredItems = items.filter(item => filter === '*' || item.classList.contains(filter.substring(1)));
            items.forEach(item => item.classList.add('hidden'));
            filteredItems.slice(0, visibleCount).forEach(item => item.classList.remove('hidden'));
            const showMoreContainer = document.querySelector(this.config.portfolio.showMoreContainerSelector);
            if (showMoreContainer) showMoreContainer.classList.toggle('hidden', filteredItems.length <= visibleCount);
            if (typeof AOS !== 'undefined') AOS.refresh();
        },
        applyFilter(newFilter) {
            const cfg = this.config.portfolio;
            const filterContainer = document.querySelector(cfg.filtersSelector);
            if (!filterContainer) return;
            
            sessionStorage.setItem(cfg.filterStorageKey, newFilter);

            const oldActiveButton = filterContainer.querySelector(`.${cfg.activeFilterClass}`);
            if (oldActiveButton) oldActiveButton.classList.remove(cfg.activeFilterClass);
            
            const newActiveButton = filterContainer.querySelector(`[data-filter="${newFilter}"]`);
            if (newActiveButton) newActiveButton.classList.add(cfg.activeFilterClass);

            this.portfolioState.filter = newFilter;
            this.portfolioState.visibleCount = cfg.initialItems;
            this.updateProjectLinks();
            this.renderPortfolio();
        },
        initPortfolioFilters() {
            const cfg = this.config.portfolio;
            const filterContainer = document.querySelector(cfg.filtersSelector);
            if (!filterContainer) return;
            
            filterContainer.addEventListener('click', (e) => {
                const button = e.target.closest(cfg.filterBtnSelector);
                if (!button) return;
                
                const newFilter = button.getAttribute('data-filter');
                if (newFilter === '*') {
                    sessionStorage.removeItem(cfg.filterStorageKey);
                }
                this.applyFilter(newFilter);
            });
        },
        initPortfolioShowMore() {
            const showMoreBtn = document.querySelector(this.config.portfolio.showMoreBtnSelector);
            if (!showMoreBtn) return;
            
            showMoreBtn.addEventListener('click', () => {
                const filteredItems = this.portfolioState.items.filter(item => this.portfolioState.filter === '*' || item.classList.contains(this.portfolioState.filter.substring(1)));
                this.portfolioState.visibleCount = filteredItems.length;
                this.renderPortfolio();
            });
        },
        updateProjectLinks() {
            if (!this.portfolioState.filter) return;
            const { filter, items } = this.portfolioState;
            const currentFilterClass = filter.replace('.', '');
            items.forEach(item => {
                const link = item.querySelector('a');
                if (!link) return;
                const originalHref = link.href.split('?')[0];
                link.href = (currentFilterClass !== '*') ? `${originalHref}?filter=${currentFilterClass}` : originalHref;
            });
        },
        restorePortfolioState() {
            const cfg = this.config.portfolio;
            const params = new URLSearchParams(window.location.search);
            const urlFilter = params.get('filter');
            const sessionFilter = sessionStorage.getItem(cfg.filterStorageKey);

            let filterToApply = '*';

            if (urlFilter) {
                filterToApply = `.${urlFilter}`;
                sessionStorage.setItem(cfg.filterStorageKey, filterToApply);
            } else if (sessionFilter) {
                filterToApply = sessionFilter;
            }

            this.applyFilter(filterToApply);
        },
    };

    App.init();

});