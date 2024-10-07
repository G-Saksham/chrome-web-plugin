const apiKey = API_CONFIG.GOOGLE_API_KEY;
const searchEngineId = API_CONFIG.SEARCH_ENGINE_ID;

document.addEventListener('DOMContentLoaded', () => {
    const fetchSimilarBtn = document.getElementById('fetchSimilarBtn');
    const resultGrid = document.getElementById('resultGrid');
    const productLink = document.getElementById('productLink');
    const productImage = document.getElementById('productImage');
    const productNameElement = document.getElementById('productName');
    const productPriceElement = document.getElementById('productPrice');

    // Function to truncate text to a maximum character length
    function truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Function to call Google Custom Search API
    function fetchSimilarResults(searchQuery) {
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=9`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                resultGrid.innerHTML = '';  // Clear previous results
                if (data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        const imgContainer = document.createElement('div');
                        imgContainer.classList.add('image-container');

                        const img = document.createElement('img');
                        img.src = item.link;
                        img.alt = item.title;
                        img.onclick = () => {
                            window.open(item.image.contextLink, '_blank');
                        };

                        const title = document.createElement('p');
                        const truncatedTitle = truncateText(item.title, 10);
                        title.innerText = truncatedTitle;
                        title.classList.add('image-title');
                        title.style.textDecoration = 'underline';

                        imgContainer.appendChild(img);
                        imgContainer.appendChild(title);
                        resultGrid.appendChild(imgContainer);
                    });
                } else {
                    resultGrid.innerHTML = '<p>No similar results found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching similar results:', error);
                resultGrid.innerHTML = '<p>Error fetching similar results.</p>';
            });
    }

    // Fetch similar results when the button is clicked
    fetchSimilarBtn.addEventListener('click', () => {
        const productName = productNameElement.innerText;
        if (productName && productName !== 'Loading...' && productName !== 'not found') {
            fetchSimilarResults(productName);
        } else {
            resultGrid.innerHTML = '<p>No valid product name to search for.</p>';
        }
    });

    // Fetch product info and ensure content script is injected
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
        }, () => {
            // After injection, send message to get product info
            chrome.tabs.sendMessage(tabs[0].id, { action: "getProductInfo" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message to content script:', chrome.runtime.lastError);
                    document.body.innerHTML = "<strong>You are not on a product page</strong>";
                    return;
                }

                if (response) {
                    if (response.name === "not found" && response.price === "not found" && response.image === "not found") {
                        document.body.innerHTML = "<strong>You are not on a product page</strong>";
                    } else {
                        productNameElement.innerText = response.name;
                        productPriceElement.innerText = response.price;

                        // Set image and link attributes
                        productImage.src = response.image;
                        productImage.alt = response.name;
                        productLink.href = response.image; // Redirect to image URL on click
                    }
                } else {
                    document.body.innerHTML = "<strong>You are not on a product page</strong>";
                }
            });
        });
    });
});
