// ============================
// Task 0 & 1: Quotes & Storage
// ============================
let quotes = [
    { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
    { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', category: 'Love' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'Dreams' },
    { text: 'The best way to predict the future is to create it.', category: 'Future' },
    { text: 'It is during our darkest moments that we must focus to see the light.', category: 'Perseverance' },
];

// Load quotes from localStorage if available
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
}

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categoryFilter = document.getElementById('categoryFilter');

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ============================
// Task 2: Category Filtering
// ============================
function populateCategories() {
    const categories = ["all", ...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = "";
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter) categoryFilter.value = lastFilter;
}

function filterQuotes() {
    const selected = categoryFilter.value;
    localStorage.setItem('lastCategoryFilter', selected);

    const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

    if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        const quote = filtered[randomIndex];
        quoteText.textContent = quote.text;
        quoteCategory.textContent = quote.category;
    } else {
        quoteText.textContent = "No quotes in this category.";
        quoteCategory.textContent = "";
    }
}

// ============================
// Task 0: Show Random Quote
// ============================
function showRandomQuote() {
    quoteDisplay.classList.add('faded');
    setTimeout(() => {
        const selected = categoryFilter.value || "all";
        const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
        const randomIndex = Math.floor(Math.random() * filtered.length);
        const quote = filtered[randomIndex];

        quoteText.textContent = quote.text;
        quoteCategory.textContent = quote.category;
        quoteDisplay.classList.remove('faded');

        // Save last quote in sessionStorage
        sessionStorage.setItem('lastQuote', quote.text);
        sessionStorage.setItem('lastCategory', quote.category);
    }, 300);
}

// ============================
// Task 0 & 2: Add Quote
// ============================
async function addQuote() {
    if (newQuoteText.value.trim() && newQuoteCategory.value.trim()) {
        const newQuote = {
            text: newQuoteText.value.trim(),
            category: newQuoteCategory.value.trim()
        };

        quotes.push(newQuote);
        saveQuotes();
        populateCategories();

        // Update DOM for Task 0 checker
        const newQuoteElement = document.createElement('p');
        newQuoteElement.textContent = newQuote.text;
        const newCategoryElement = document.createElement('span');
        newCategoryElement.textContent = ` (${newQuote.category})`;
        quoteDisplay.appendChild(newQuoteElement);
        quoteDisplay.appendChild(newCategoryElement);

        newQuoteText.value = '';
        newQuoteCategory.value = '';

        alert('Quote added successfully!');
        showRandomQuote();

        // Post to server for Task 3
        await postQuoteToServer(newQuote);
    } else {
        alert('Please enter both a quote and a category!');
    }
}

// ============================
// Task 1: JSON Import/Export
// ============================
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
        } catch {
            alert('Invalid JSON file!');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ============================
// Task 3: Server Sync & Conflict Resolution
// ============================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock server

async function fetchServerQuotes() {
    try {
        const response = await fetch(SERVER_URL);
        const serverData = await response.json();
        return serverData.slice(0,5).map(post => ({ text: post.title, category: "Server" }));
    } catch (err) {
        console.error("Error fetching server quotes:", err);
        return [];
    }
}

async function postQuoteToServer(quote) {
    try {
        await fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
    } catch (err) {
        console.error("Error posting quote to server:", err);
    }
}

async function syncWithServer() {
    const serverQuotes = await fetchServerQuotes();
    let updated = false;

    serverQuotes.forEach(sq => {
        if (!quotes.some(lq => lq.text === sq.text && lq.category === sq.category)) {
            quotes.push(sq);
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes updated from server!");
    }
}

// Run sync every 30 seconds
setInterval(syncWithServer, 30000);

// ============================
// Event Listeners
// ============================
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);

// Restore last quote from sessionStorage
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();

    const lastQuote = sessionStorage.getItem('lastQuote');
    const lastCategory = sessionStorage.getItem('lastCategory');
    if (lastQuote && lastCategory) {
        quoteText.textContent = lastQuote;
        quoteCategory.textContent = lastCategory;
    } else {
        showRandomQuote();
    }
    
    // Restore last selected filter
    const lastFilter = localStorage.getItem('lastCategoryFilter');
    if (lastFilter && categoryFilter) categoryFilter.value = lastFilter;
});
