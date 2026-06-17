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
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (hamburgerBtn) hamburgerBtn.classList.remove('open');
                if (nav) nav.classList.remove('open');
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
