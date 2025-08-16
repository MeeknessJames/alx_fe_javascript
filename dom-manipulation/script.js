let quotes = [ 
    { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
    { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', category: 'Love' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'Dreams' },
    { text: 'The best way to predict the future is to create it.', category: 'Future' },
    { text: 'It is during our darkest moments that we must focus to see the light.', category: 'Perseverance' },
];

const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
}

// DOM elements
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

// Show a random quote
function showRandomQuote() {
    quoteDisplay.classList.add('faded');
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteText.innerHTML = randomQuote.text;
        quoteCategory.innerHTML = randomQuote.category;
        
        quoteDisplay.classList.remove('faded');

        // Save last viewed quote in sessionStorage
        sessionStorage.setItem('lastQuote', randomQuote.text);
        sessionStorage.setItem('lastCategory', randomQuote.category);
    }, 300);
}

// Add a new quote
function addQuote() {
    if (newQuoteText.value.trim() !== '' && newQuoteCategory.value.trim() !== '') {
        const newQuote = {
            text: newQuoteText.value.trim(),
            category: newQuoteCategory.value.trim()
        };

        quotes.push(newQuote);
        saveQuotes(); 

        // Update category dropdown if new category
        populateCategories();

        newQuoteText.value = '';
        newQuoteCategory.value = '';

        alert('Quote added successfully!');
        filterQuotes(); 
    } else {
        alert('Please enter both a quote and a category!');
    }
}

// Populate category dropdown dynamically
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore last selected filter
    const lastFilter = localStorage.getItem('lastFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
        filterQuotes();
    }
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastFilter', selectedCategory); 

    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    quoteDisplay.innerHTML = '';
    filteredQuotes.forEach(q => {
        const p = document.createElement('p');
        p.textContent = q.text;

        const span = document.createElement('span');
        span.textContent = ` (${q.category})`;

        quoteDisplay.appendChild(p);
        quoteDisplay.appendChild(span);
    });
}

// Export quotes to JSON
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

// Import quotes from JSON
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

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', filterQuotes);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();

    const lastQuote = sessionStorage.getItem('lastQuote');
    const lastCategory = sessionStorage.getItem('lastCategory');
    if (lastQuote && lastCategory) {
        quoteText.innerHTML = lastQuote;
        quoteCategory.innerHTML = lastCategory;
    } else {
        showRandomQuote();
    }
});
