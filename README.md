﻿# Zara Product Scraper

**Zara Product Scraper** is a Chrome extension that scrapes product details like name, price, and image from Zara's product pages and displays the information in a popup.

## Features

- Scrapes product name, price, and image from Zara product pages.
- Displays the scraped information in a popup window.
- Fetches similar product images using Google's Custom Search API.
- Clickable product images redirect to the original URL.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click on "Load unpacked" and select the folder containing this extension's files.
5. The extension should now appear in your browser toolbar.

## Usage

1. Navigate to any Zara product page.
2. Click on the extension icon to display product details (name, price, image).
3. Use the "Fetch Similar Results" button to find related products.
4. Clicking the product image in the popup will redirect you to the full-size image.

## Configuration (config.js)

To use the "Fetch Similar Results" feature, configure the `config.js` file by updating the `apiKey` and `cx` with your Google Custom Search API credentials:

```js
const API_CONFIG = {
    GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY',
    SEARCH_ENGINE_ID: 'YOUR_GOOGLE_SEARCH_ENGINE_ID'
};
```
## Screenshots
![Screenshot 2024-10-08 025248](https://github.com/user-attachments/assets/a763ef3d-4306-4d71-9a9b-ceecb38ae869)
![Screenshot 2024-10-08 025317](https://github.com/user-attachments/assets/fc684519-0afd-415c-8882-9b7af2a17532)
![Screenshot 2024-10-08 025420](https://github.com/user-attachments/assets/60b6c5c3-f829-4a96-93fe-40e5322f6b9e)
![Screenshot 2024-10-08 025519](https://github.com/user-attachments/assets/44b80d6c-c921-481c-838b-d12d72d54ef6)


This `.md` file provides the necessary instructions for users to install and configure the Chrome extension and includes a brief explanation of its usage.

