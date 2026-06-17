// Component Loader - Dynamically injects navbar and footer
(function() {
    async function loadComponents() {
        // Determine if we're on homepage or a sub-page
        const pathname = window.location.pathname;
        const isHomepage = pathname.endsWith('index.html') || pathname.endsWith('/') || pathname === '';

        // Define navbar link paths based on current page
        const navbarLinks = {
            home: isHomepage ? '#' : './',
            about: isHomepage ? '#about' : './#about',
            research: isHomepage ? '#projects' : './#projects',
            writing: isHomepage ? '#writing' : './#writing',
            projects: './projects.html',
            bibtex: 'apps/bibtex-merger/',
            markdown: 'apps/markdown-to-pdf/'
        };

        try {
            // Load navbar
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                const navResponse = await fetch('./ui/components/navbar.html');
                if (!navResponse.ok) throw new Error(`Navbar load failed: ${navResponse.status}`);

                let navHTML = await navResponse.text();

                // Replace placeholder links with actual paths
                navHTML = navHTML
                    .replace(/NAVBAR_HOME/g, navbarLinks.home)
                    .replace(/NAVBAR_ABOUT/g, navbarLinks.about)
                    .replace(/NAVBAR_RESEARCH/g, navbarLinks.research)
                    .replace(/NAVBAR_WRITING/g, navbarLinks.writing)
                    .replace(/NAVBAR_PROJECTS/g, navbarLinks.projects)
                    .replace(/NAVBAR_BIBTEX/g, navbarLinks.bibtex)
                    .replace(/NAVBAR_MARKDOWN/g, navbarLinks.markdown);

                navbarContainer.innerHTML = navHTML;
            }

            // Load footer
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                const footerResponse = await fetch('./ui/components/footer.html');
                if (!footerResponse.ok) throw new Error(`Footer load failed: ${footerResponse.status}`);

                const footerHTML = await footerResponse.text();
                footerContainer.innerHTML = footerHTML;
            }

            // Initialize hamburger menu after DOM injection
            initializeHamburgerMenu();

        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    function initializeHamburgerMenu() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const nav = document.querySelector('header nav');
        const navDropdownBtn = document.querySelector('.nav-dropdown-btn');
        const navDropdownMenu = document.querySelector('.nav-dropdown-menu');

        if (!hamburgerBtn || !nav) {
            console.warn('Hamburger menu elements not found');
            return;
        }

        // Hamburger menu toggle
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('open');
            nav.classList.toggle('open');
        });

        // Close menu when a regular nav link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                hamburgerBtn.classList.remove('open');
                nav.classList.remove('open');
                if (navDropdownMenu) navDropdownMenu.classList.remove('show');
            });
        });

        // Web Apps dropdown toggle
        if (navDropdownBtn && navDropdownMenu) {
            navDropdownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navDropdownMenu.classList.toggle('show');
            });

            // Close dropdown when a dropdown link is clicked
            navDropdownMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    navDropdownMenu.classList.remove('show');
                    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
                    if (nav) nav.classList.remove('open');
                });
            });
        }

        // Close dropdown when clicking outside header area
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header') && navDropdownMenu) {
                navDropdownMenu.classList.remove('show');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (hamburgerBtn) hamburgerBtn.classList.remove('open');
                if (nav) nav.classList.remove('open');
                if (navDropdownMenu) navDropdownMenu.classList.remove('show');
            }
        });
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
