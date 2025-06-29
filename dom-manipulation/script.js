const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Function to display a random quote
function showRandomQuote() {
    const container = document.getElementById('quote-container');
    if (!container) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    container.innerHTML = `
        <blockquote>
            "${quote.text}"
            <footer><em>${quote.category}</em></footer>
        </blockquote>
    `;
}

// Function to create and display the add-quote form
function createAddQuoteForm() {
    const formContainer = document.getElementById('form-container');
    if (!formContainer) return;

    formContainer.innerHTML = `
        <form id="add-quote-form">
            <input type="text" id="quote-text" placeholder="Quote text" required />
            <input type="text" id="quote-category" placeholder="Category" required />
            <button type="submit">Add Quote</button>
        </form>
    `;

    document.getElementById('add-quote-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const text = document.getElementById('quote-text').value.trim();
        const category = document.getElementById('quote-category').value.trim();
        if (text && category) {
            quotes.push({ text, category });
            showRandomQuote();
            this.reset();
        }
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Create containers if they don't exist
    if (!document.getElementById('quote-container')) {
        const qc = document.createElement('div');
        qc.id = 'quote-container';
        document.body.appendChild(qc);
    }
    if (!document.getElementById('form-container')) {
        const fc = document.createElement('div');
        fc.id = 'form-container';
        document.body.appendChild(fc);
    }

    showRandomQuote();
    createAddQuoteForm();

    // Optional: Add a button to show a new random quote
    if (!document.getElementById('new-quote-btn')) {
        const btn = document.createElement('button');
        btn.id = 'new-quote-btn';
        btn.textContent = 'Show Random Quote';
        btn.onclick = showRandomQuote;
        document.body.appendChild(btn);
    }
});