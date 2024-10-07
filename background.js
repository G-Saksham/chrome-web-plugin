// background.js (service worker)
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service Worker: Installed");
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'keepAlive') {
        // You can do something here to keep the worker alive for a bit
        console.log("Keeping the service worker alive temporarily");
        sendResponse({ status: "Service worker is alive" });
    }
});

// Background script to listen for the action when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    // Inject content.js into the active tab when the plugin icon is clicked
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});