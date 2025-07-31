document.addEventListener('DOMContentLoaded', function() {

    // Initialize Animations on Scroll
    AOS.init({
        duration: 800,
        once: true,
    });

    // Mobile Menu (Hamburger) Functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // --- Portfolio Page Logic ---
    const filterContainer = document.querySelector('#portfolio-filters');
    const portfolioGrid = document.querySelector('#portfolio-grid');
    const showMoreBtn = document.getElementById('show-more-btn');
    const initialItemsToShow = 9;

    // ----- NEW: SMART BACK BUTTON - STEP 1: Update project links with filter -----
    function updateProjectLinks(filter) {
        const currentFilter = filter.replace('.', ''); // remove the dot from class name
        document.querySelectorAll('.portfolio-item a').forEach(link => {
            const originalHref = link.href.split('?')[0]; // Get URL without any parameters
            if (currentFilter !== '*') {
                link.href = `${originalHref}?filter=${currentFilter}`;
            } else {
                link.href = originalHref;
            }
        });
    }

    function applyShowMore() {
        if (!portfolioGrid || !showMoreBtn) return;
        
        const visibleItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item')).filter(item => item.style.display !== 'none');

        visibleItems.forEach((item, index) => {
            if (index >= initialItemsToShow) {
                item.style.display = 'none';
            } else {
                 item.style.display = 'block';
            }
        });

        if (visibleItems.length > initialItemsToShow) {
            showMoreBtn.style.display = 'inline-block';
        } else {
            showMoreBtn.style.display = 'none';
        }
        AOS.refresh();
    }

    // Filter Functionality
    if (filterContainer && portfolioGrid) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filterValue = e.target.getAttribute('data-filter');
                
                Array.from(portfolioGrid.querySelectorAll('.portfolio-item')).forEach(item => {
                    if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                updateProjectLinks(filterValue); // NEW: Update links after filtering
                applyShowMore();
            }
        });
    }

    // Play video on hover
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            item.addEventListener('mouseenter', () => { video.play().catch(e => {}); });
            item.addEventListener('mouseleave', () => { video.pause(); });
        }
    });

    // "Show More" Button Click
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const currentFilter = filterContainer.querySelector('.active').getAttribute('data-filter');
            
            Array.from(portfolioGrid.querySelectorAll('.portfolio-item')).forEach(item => {
                const matchesFilter = (currentFilter === '*') || item.classList.contains(currentFilter.substring(1));
                if (matchesFilter) {
                    item.style.display = 'block';
                }
            });

            showMoreBtn.style.display = 'none';
            AOS.refresh();
        });
    }
    
    // ----- NEW: SMART BACK BUTTON - STEP 2: Apply filter on page load -----
    function applyFilterFromURL() {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get('filter');
        if (filter) {
            const filterButton = document.querySelector(`.filter-btn[data-filter=".${filter}"]`);
            if (filterButton) {
                filterButton.click();
            }
        } else {
             // If no filter in URL, ensure "All" is active and links are updated
            updateProjectLinks('*');
            applyShowMore();
        }
    }

    // Initial setup on page load
    if (portfolioGrid) {
        applyFilterFromURL();
    }
});