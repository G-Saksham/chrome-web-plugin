const apiKey = API_CONFIG.GOOGLE_API_KEY;
const searchEngineId = API_CONFIG.SEARCH_ENGINE_ID;


document.addEventListener('DOMContentLoaded', () => {
    const fetchSimilarBtn = document.getElementById('fetchSimilarBtn');
    const resultGrid = document.getElementById('resultGrid');
    // const apiKey = 'AIzaSyA5z8IjLPpoLsyIzzKPaKn5qzV-Jl00Bp4';  // Replace with your API key
    // const searchEngineId = '85d62e5bcbf034665';  // Replace with your search engine ID

    // const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    // const searchEngineId = import.meta.env.VITE_SEARCH_ENGINE_ID;

    console.log(apiKey)
    console.log(searchEngineId)

    // Function to call Google Custom Search API
    function fetchSimilarResults(searchQuery) {
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=9`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                resultGrid.innerHTML = '';  // Clear previous results
                if (data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        const img = document.createElement('img');
                        img.src = item.link;
                        img.alt = item.title;
                        img.onclick = () => {
                            window.open(item.image.contextLink, '_blank');  // Open link in new tab
                        };
                        resultGrid.appendChild(img);
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
        const productName = document.getElementById('productName').innerText;
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
                        document.getElementById('productName').innerText = response.name;
                        document.getElementById('productPrice').innerText = response.price;
                        document.getElementById('productImage').src = response.image;
                        document.getElementById('productImage').alt = response.name;
                    }
                } else {
                    document.body.innerHTML = "<strong>You are not on a product page</strong>";
                }
            });
        });
    });
});
