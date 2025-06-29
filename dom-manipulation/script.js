const QUOTES_KEY = 'quotes';
const LAST_QUOTE_INDEX_KEY = 'lastQuoteIndex';
const LAST_CATEGORY_KEY = 'lastCategoryFilter';

let quotes = [];

// Load quotes from localStorage or use defaults
function loadQuotes() {
    const stored = localStorage.getItem(QUOTES_KEY);
    if (stored) {
        try {
            quotes = JSON.parse(stored);
        } catch {
            quotes = [];
        }
    }
    if (!quotes.length) {
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Motivation" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
        ];
        saveQuotes();
    }
}

function saveQuotes() {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
}

function populateCategories() {
    let categories = [...new Set(quotes.map(q => q.category))];
    const filter = document.getElementById('categoryFilter');
    if (!filter) return;
    filter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filter.appendChild(option);
    });
    // Restore last selected filter
    const lastCategory = localStorage.getItem(LAST_CATEGORY_KEY);
    if (lastCategory && [...filter.options].some(opt => opt.value === lastCategory)) {
        filter.value = lastCategory;
    }
}

function filterQuotes() {
    const filter = document.getElementById('categoryFilter');
    const selectedCategory = filter ? filter.value : 'all';
    localStorage.setItem(LAST_CATEGORY_KEY, selectedCategory);
    const container = document.getElementById('quoteDisplay');
    if (!container) return;
    let filtered = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filtered.length === 0) {
        container.innerHTML = `<p>No quotes found for this category.</p>`;
        return;
    }
    // Show all filtered quotes
    container.innerHTML = filtered.map(quote => `
        <blockquote>
            "${quote.text}"
            <footer><em>${quote.category}</em></footer>
        </blockquote>
    `).join('');
}

function showRandomQuote() {
    const filter = document.getElementById('categoryFilter');
    const selectedCategory = filter ? filter.value : 'all';
    let filtered = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    const container = document.getElementById('quoteDisplay');
    if (!container) return;
    if (filtered.length === 0) {
        container.innerHTML = `<p>No quotes found for this category.</p>`;
        return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    container.innerHTML = `
        <blockquote>
            "${quote.text}"
            <footer><em>${quote.category}</em></footer>
        </blockquote>
    `;
    // Save last viewed quote index in session storage (relative to all quotes)
    const globalIndex = quotes.findIndex(q => q.text === quote.text && q.category === quote.category);
    sessionStorage.setItem(LAST_QUOTE_INDEX_KEY, globalIndex);
}

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        populateCategories();
        // If new category, select it
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.value = category;
            localStorage.setItem(LAST_CATEGORY_KEY, category);
        }
        filterQuotes();
        textInput.value = '';
        categoryInput.value = '';
    }
}

function createAddQuoteForm() {
    const form = document.createElement('div');
    form.innerHTML = `
        <input type="text" id="newQuoteText" placeholder="Quote text" />
        <input type="text" id="newQuoteCategory" placeholder="Category" />
        <button id="addQuoteBtn">Add Quote</button>
    `;
    document.body.appendChild(form);
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Export quotes as JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                filterQuotes();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON format.');
            }
        } catch {
            alert('Failed to parse JSON.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

document.addEventListener('DOMContentLoaded', () => {
    // Add category filter dropdown
    let filter = document.getElementById('categoryFilter');
    if (!filter) {
        filter = document.createElement('select');
        filter.id = 'categoryFilter';
        filter.onchange = filterQuotes;
        document.body.insertBefore(filter, document.body.firstChild);
    }

    loadQuotes();
    populateCategories();

    // Restore last selected filter and show quotes
    const lastCategory = localStorage.getItem(LAST_CATEGORY_KEY) || 'all';
    filter.value = lastCategory;
    filterQuotes();

    document.getElementById('newQuote').addEventListener('click', showRandomQuote);

    // Add export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Quotes';
    exportBtn.onclick = exportToJsonFile;
    document.body.appendChild(exportBtn);

    // Add import input
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.id = 'importFile';
    importInput.accept = '.json';
    importInput.onchange = importFromJsonFile;
    document.body.appendChild(importInput);

    // Optionally, show last viewed quote from session storage
    const lastIndex = sessionStorage.getItem(LAST_QUOTE_INDEX_KEY);
    if (lastIndex !== null && quotes[lastIndex]) {
        const container = document.getElementById('quoteDisplay');
        const quote = quotes[lastIndex];
        container.innerHTML = `
            <blockquote>
                "${quote.text}"
                <footer><em>${quote.category}</em></footer>
            </blockquote>
        `;
    }
});