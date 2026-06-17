// Project card renderer - Loads JSON data and creates project cards
class ProjectRenderer {
    constructor() {
        this.baseDataPath = './data/';
    }

    // Fetch JSON data
    async fetchData(filename) {
        try {
            const response = await fetch(this.baseDataPath + filename);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to load ${filename}:`, error);
            return null;
        }
    }

    // Parse markdown-like bold syntax
    parseMarkdown(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    // Create tag badges
    createTagBadges(tags) {
        if (!tags || !Array.isArray(tags)) return '';
        return tags
            .map(tag => `<span class="tag-badge">${tag}</span>`)
            .join('');
    }

    // Create iGEM project card
    createIGEMCard(project) {
        const { id, year, title, team, role, description, link, tags } = project;
        return `
            <div class="project-card" id="${id}">
                <div class="project-meta">
                    <span class="project-year">${year}</span>
                    <span class="project-type">iGEM</span>
                </div>
                <h3 class="project-title">${title}</h3>
                <p class="project-role">${role}</p>
                <p class="project-description">${this.parseMarkdown(description)}</p>
                <div class="project-tags">
                    ${this.createTagBadges(tags)}
                </div>
                ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Learn More</a>` : ''}
            </div>
        `;
    }

    // Create science communication card
    createSciCommCard(item) {
        const { id, type, title, date, venue, description, link, tags } = item;
        const dateStr = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return `
            <div class="project-card sci-comm-card" id="${id}">
                <div class="project-meta">
                    <span class="project-date">${dateStr}</span>
                    <span class="project-type">${type}</span>
                </div>
                <h3 class="project-title">${title}</h3>
                ${venue ? `<p class="project-venue">${venue}</p>` : ''}
                <p class="project-description">${this.parseMarkdown(description)}</p>
                <div class="project-tags">
                    ${this.createTagBadges(tags)}
                </div>
                ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View</a>` : ''}
            </div>
        `;
    }

    // Create GitHub repo card
    createGitHubCard(repo) {
        const { id, name, description, link, tags, featured } = repo;
        return `
            <div class="project-card github-card${featured ? ' featured' : ''}" id="${id}">
                <div class="project-meta">
                    <span class="project-type">GitHub</span>
                    ${featured ? '<span class="badge-featured">Featured</span>' : ''}
                </div>
                <h3 class="project-title">${name}</h3>
                <p class="project-description">${this.parseMarkdown(description)}</p>
                <div class="project-tags">
                    ${this.createTagBadges(tags)}
                </div>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View Repository</a>
            </div>
        `;
    }

    // Render projects to container
    async renderProjects(containerId, dataFile, cardType) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        const data = await this.fetchData(dataFile);
        if (!data) {
            container.innerHTML = `<p class="error-message">Unable to load ${cardType} data. Please refresh the page.</p>`;
            return;
        }

        let html = '';
        const items = data.projects || data.items || data.repos || [];

        if (items.length === 0) {
            container.innerHTML = `<p class="error-message">No ${cardType} to display yet.</p>`;
            return;
        }

        for (const item of items) {
            if (cardType === 'iGEM') {
                html += this.createIGEMCard(item);
            } else if (cardType === 'Science Communication') {
                html += this.createSciCommCard(item);
            } else if (cardType === 'GitHub') {
                html += this.createGitHubCard(item);
            }
        }

        container.innerHTML = html;

        // Re-render KaTeX after inserting new content
        if (typeof rerenderMathInElement === 'function') {
            rerenderMathInElement(container);
        }
    }

    // Render all sections
    async renderAll() {
        await this.renderProjects('igem-container', 'igem.json', 'iGEM');
        await this.renderProjects('scicomm-container', 'science-comm.json', 'Science Communication');
        await this.renderProjects('github-container', 'github-repos.json', 'GitHub');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const renderer = new ProjectRenderer();
    renderer.renderAll();
});
