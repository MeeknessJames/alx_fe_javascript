// A friendly tutor's notes:

let quotes = [
    { text: 'The only way to do great work is to love what you do.', category: 'Inspiration' },
    { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', category: 'Love' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', category: 'Dreams' },
    { text: 'The best way to predict the future is to create it.', category: 'Future' },
    { text: 'It is during our darkest moments that we must focus to see the light.', category: 'Perseverance' },
];

// This is the core of DOM manipulation: finding elements to change.
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');


function createAddQuoteForm() {
}

function showRandomQuote() {
    quoteDisplay.classList.add('faded');
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteText.innerHTML = randomQuote.text;
        quoteCategory.innerHTML = randomQuote.category;
        
        quoteDisplay.classList.remove('faded');
    }, 300);
}

/*
 This function handles adding a new quote from the user input fields.
 */
function addQuote() {
    if (newQuoteText.value.trim() !== '' && newQuoteCategory.value.trim() !== '') {
        const newQuote = {
            text: newQuoteText.value.trim(),
            category: newQuoteCategory.value.trim()
        };

        quotes.push(newQuote);
        newQuoteText.value = '';
        newQuoteCategory.value = '';

        alert('Quote added successfully!');
        showRandomQuote();
    } else {
        alert('Please enter both a quote and a category!');
    }
}

// This is how we make our application interactive.
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Let's call the function that creates the form and then show a random quote when the page first loads!
document.addEventListener('DOMContentLoaded', showRandomQuote);
