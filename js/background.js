// Initial values on installed
chrome.runtime.onInstalled.addListener(function() {

});

chrome.storage.sync.get({
    iconStyleAuto: true,
    iconType: 'star'
}, items => {
    if (items.iconStyleAuto) {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (isDarkMode) {
            chrome.browserAction.setIcon({ path: `/images/${items.iconType}-light-128.png`});
        }

    }
})