// Function to extract product info
function extractProductInfo() {
    const productName = document.querySelector('.product-detail-card-info__name')?.innerText ||
                        document.querySelector('.product-detail-info__header-name')?.innerText ||
                        "not found";

    const priceElement = document.querySelector('.money-amount__main');
    const productPrice = priceElement ? priceElement.innerText : "not found";

    const pictureElement = document.querySelector('picture.media-image');
    let productImage = "not found";

    if (pictureElement) {
        const imgElement = pictureElement.querySelector('img.media-image__image');
        if (imgElement) {
            productImage = imgElement.src || "not found";
        }
    }

    return {
        name: productName,
        price: productPrice,
        image: productImage,
    };
}

// Use MutationObserver to monitor changes in the DOM
function observeProductInfo(resolve) {
    const observer = new MutationObserver(() => {
        const productInfo = extractProductInfo();
        if (productInfo.name !== "not found" || productInfo.price !== "not found" || productInfo.image !== "not found") {
            observer.disconnect();
            resolve(productInfo);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Wait for product info to be available
function waitForProductInfo() {
    return new Promise((resolve) => {
        const productInfo = extractProductInfo();
        if (productInfo.name === "not found" && productInfo.price === "not found" && productInfo.image === "not found") {
            observeProductInfo(resolve);
        } else {
            resolve(productInfo);
        }
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getProductInfo") {
        waitForProductInfo().then((productInfo) => {
            sendResponse(productInfo);
        });
    }
    return true;  // Required to indicate async response
});
