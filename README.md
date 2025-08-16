# Dynamic Quotes Generator

This project demonstrates core front-end concepts including **DOM manipulation**, **Web Storage**, and **working with JSON data**. The application is a dynamic quotes generator that allows users to view, save, and manage inspirational quotes.

## Features

- **Display Random Quotes:** Fetches and displays random quotes from a JSON data source.
- **DOM Manipulation:** Dynamically updates the UI based on user interactions (e.g., displaying new quotes, updating saved quotes).
- **Web Storage Integration:** Uses `localStorage` to persist user-saved quotes across sessions.
- **JSON Data Handling:** Loads quotes from a JSON file or API, parses them, and renders them in the browser.

## How It Works

1. **Loading Quotes:** On page load, the app fetches a list of quotes from a JSON file or endpoint.
2. **Displaying Quotes:** A random quote is selected and displayed in the UI.
3. **Saving Quotes:** Users can save their favorite quotes. Saved quotes are stored in `localStorage`.
4. **Viewing Saved Quotes:** Users can view and manage their saved quotes, which persist even after refreshing or closing the browser.


## Key Concepts Demonstrated

- **DOM Manipulation:** Adding, removing, and updating elements in response to user actions.
- **Event Handling:** Listening for button clicks and other user events.
- **Web Storage:** Using `localStorage` to persist data.
- **JSON Parsing:** Loading and parsing JSON data for use in the application.
