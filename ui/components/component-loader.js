// Component Loader - Dynamically injects navbar and footer
(function() {
    async function loadComponents() {
        // Find root URL relative to the script location (ui/components/component-loader.js)
        const scriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
        const rootUrl = new URL('../../', scriptUrl).href;

        // Determine if we're on homepage
        const normalize = urlStr => {
            try {
                const u = new URL(urlStr);
                let p = u.pathname;
                if (p.endsWith('/index.html')) p = p.slice(0, -10);
                if (!p.endsWith('/')) p += '/';
                return u.origin + p;
            } catch (e) {
                return urlStr;
            }
        };
        const isHomepage = normalize(window.location.href) === normalize(rootUrl);

        // Define navbar link paths based on current page
        const navbarLinks = {
            home: isHomepage ? '#' : `${rootUrl}index.html`,
            about: isHomepage ? '#about' : `${rootUrl}index.html#about`,
            research: isHomepage ? '#projects' : `${rootUrl}index.html#projects`,
            writing: isHomepage ? '#writing' : `${rootUrl}index.html#writing`,
            projects: `${rootUrl}pages/projects.html`
        };

        try {
            // Load navbar
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                const navResponse = await fetch(`${rootUrl}ui/components/navbar.html`);
                if (!navResponse.ok) throw new Error(`Navbar load failed: ${navResponse.status}`);

                let navHTML = await navResponse.text();

                // Replace placeholder links with actual paths
                navHTML = navHTML
                    .replace(/NAVBAR_HOME/g, navbarLinks.home)
                    .replace(/NAVBAR_ABOUT/g, navbarLinks.about)
                    .replace(/NAVBAR_RESEARCH/g, navbarLinks.research)
                    .replace(/NAVBAR_WRITING/g, navbarLinks.writing)
                    .replace(/NAVBAR_PROJECTS/g, navbarLinks.projects);

                navbarContainer.innerHTML = navHTML;
            }

            // Load footer
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                const footerResponse = await fetch(`${rootUrl}ui/components/footer.html`);
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

        if (!hamburgerBtn || !nav) {
            console.warn('Hamburger menu elements not found');
            return;
        }

        const setMenuOpen = (open) => {
            hamburgerBtn.classList.toggle('open', open);
            nav.classList.toggle('open', open);
            hamburgerBtn.setAttribute('aria-expanded', String(open));
        };

        // Hamburger menu toggle
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(!nav.classList.contains('open'));
        });

        // Close menu when a regular nav link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        // Close menu on Escape and return focus to the toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                setMenuOpen(false);
                hamburgerBtn.focus();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        });
    }

    // Load components when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
