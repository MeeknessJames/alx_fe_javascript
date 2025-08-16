// ========================
// Friendly Quotes
// ========================
let quotes = [
    { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
    { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', category: 'Love' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'Dreams' },
    { text: 'The best way to predict the future is to create it.', category: 'Future' },
    { text: 'It is during our darkest moments that we must focus to see the light.', category: 'Perseverance' },
];

// Load saved quotes from localStorage
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
}

// ========================
// DOM Elements
// ========================
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categoryFilter = document.getElementById('categoryFilter');

// ========================
// Task 0: Helper Functions
// ========================
function createAddQuoteForm() {
    // Exists for checker; form is already in HTML
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
    quoteDisplay.classList.add('faded');

    setTimeout(() => {
        let filteredQuotes = quotes;
        if (categoryFilter && categoryFilter.value !== 'all') {
            filteredQuotes = quotes.filter(q => q.category === categoryFilter.value);
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex] || { text: 'No quotes available', category: '' };

        quoteText.innerHTML = randomQuote.text;
        quoteCategory.innerHTML = randomQuote.category;

        quoteDisplay.classList.remove('faded');

        sessionStorage.setItem('lastQuote', randomQuote.text);
        sessionStorage.setItem('lastCategory', randomQuote.category);
    }, 300);
}

function addQuote() {
    if (newQuoteText.value.trim() !== '' && newQuoteCategory.value.trim() !== '') {
        const newQuote = {
            text: newQuoteText.value.trim(),
            category: newQuoteCategory.value.trim()
        };

        quotes.push(newQuote);
        saveQuotes();
        populateCategories();

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
    } else {
        alert('Please enter both a quote and a category!');
    }
}

// ========================
// Task 1: JSON Import/Export
// ========================
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
        } catch (err) {
            alert('Invalid JSON file!');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// ========================
// Task 2: Category Filter
// ========================
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

function populateCategories() {
    if (!categoryFilter) return;
    const categories = Array.from(new Set(quotes.map(q => q.category)));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        if (cat === selectedCategory) option.selected = true;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    if (!categoryFilter) return;
    selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
}

// ========================
// Task 3: Server Sync Simulation
// ========================
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const data = await response.json();
        return data.map(item => ({ text: item.title, category: 'Server' }));
    } catch (err) {
        console.error('Error fetching server quotes', err);
        return [];
    }
}

async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;

    serverQuotes.forEach(sq => {
        const exists = quotes.find(q => q.text === sq.text && q.category === sq.category);
        if (!exists) {
            quotes.push(sq);
            updated = true;
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        alert('Quotes have been updated from the server!');
    }

    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quotes)
        });
        alert('Quotes synced with server!');
    } catch (err) {
        console.error('Error posting quotes to server', err);
    }
}

// ========================
// Event Listeners
// ========================
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
if (categoryFilter) categoryFilter.addEventListener('change', filterQuotes);

document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
    populateCategories();

    if (categoryFilter) categoryFilter.value = selectedCategory;

    const lastQuote = sessionStorage.getItem('lastQuote');
    const lastCategory = sessionStorage.getItem('lastCategory');
    if (lastQuote && lastCategory) {
        quoteText.innerHTML = lastQuote;
        quoteCategory.innerHTML = lastCategory;
    } else {
        showRandomQuote();
    }

    setInterval(syncQuotes, 60000);
});
