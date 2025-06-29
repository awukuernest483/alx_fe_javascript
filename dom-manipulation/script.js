const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

function showRandomQuote() {
    const container = document.getElementById('quoteDisplay');
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

function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (text && category) {
        quotes.push({ text, category });
        showRandomQuote();
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


document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});
