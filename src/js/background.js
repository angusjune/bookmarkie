// Initial values on installed
chrome.runtime.onInstalled.addListener(function() {

});

const setIcon = (iconType = 'star', iconStyle = 'dark', iconStyleAuto = true) => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches; // OS set to dark mode
    const isIncognito = chrome.extension.inIncognitoContext; // Chrome is in incognito context

    if (iconStyleAuto) {
        if (isDarkMode || isIncognito) {
            // set light-colored icon in dark UI
            chrome.browserAction.setIcon({ path: `/images/${iconType}-light-128.png`});
        } else {
            chrome.browserAction.setIcon({ path: `/images/${iconType}-dark-128.png`});
        }
    } else {
        chrome.browserAction.setIcon({ path: `/images/${iconType}-${iconStyle}-128.png`});
    }
}

chrome.storage.sync.get({
    iconType: 'star',
    iconStyle: 'dark',
    iconStyleAuto: true
}, props => {
    setIcon(props.iconType, props.iconStyle, props.iconStyleAuto);
});

chrome.storage.onChanged.addListener(changes => {
    console.log('changed')
});

// Context menus

// add link to Chrome bookmark manager to context menu
chrome.contextMenus.create({
    "title": chrome.i18n.getMessage('viewBookmarksOnChrome'),
    "contexts": ["browser_action"],
    "onclick": () => {
      chrome.tabs.create({ url: "chrome://bookmarks" });
    }
});