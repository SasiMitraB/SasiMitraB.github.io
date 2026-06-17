// Initialize KaTeX rendering on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof renderMathInElement === 'undefined') {
        console.warn('KaTeX auto-render not loaded');
        return;
    }

    renderMathInElement(document.body, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false,
        errorColor: '#d97757'
    });
});

// Re-render KaTeX after dynamic content updates
// Call this function after adding new content to the DOM
function rerenderMathInElement(element = document.body) {
    if (typeof renderMathInElement === 'undefined') {
        console.warn('KaTeX auto-render not loaded');
        return;
    }

    renderMathInElement(element, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false,
        errorColor: '#d97757'
    });
}
