document.addEventListener('DOMContentLoaded', (event) => {
    const searchInput = document.getElementById('search-bar');
    const app = document.getElementById('app');
    searchInput.addEventListener('input', renderCards);

    // Initial render
    renderCards();
    searchInput.focus()
});

async function fetchCodeSnippets() {
    try {
        const response = await fetch('https://api.github.com/gists/ff764fdb9155ceaff064402ee35db0b1');
        const data = await response.json();
        return JSON.parse(data.files.code_snippets.content);
    } catch (error) {
        console.error('Error fetching code snippets:', error);
        return [];
    }
}

async function renderCards() {
    app.innerHTML = '';

    const codeSnippets = await fetchCodeSnippets();
    const searchInput = document.getElementById('search-bar');
    const filteredSnippets = codeSnippets.filter(snippet =>
        snippet.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    filteredSnippets.forEach((snippet) => {
        createCodeCard(snippet)
    });
    hljs.highlightAll();
}

function createCodeCard(snippet) {
    const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h2');
        title.textContent = snippet.title;

        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container';

        const code = document.createElement('pre');
        code.innerHTML = `<code class="python">${snippet.code}</code>`;
        codeContainer.appendChild(code);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(snippet.code);
            copyButton.className = 'copied-button'
            copyButton.textContent = 'Copied ✅'
            setTimeout(() => {
                copyButton.className = 'copy-button'
                copyButton.textContent = 'Copy'
            }, 1000)
        });

        codeContainer.appendChild(copyButton);

        card.appendChild(title);
        card.appendChild(codeContainer);

        app.appendChild(card);
}