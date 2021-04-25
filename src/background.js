'use strict';

const setIcon = (isDark = false) => {
    chrome.storage.sync.get({
        iconType: 'star',
        iconStyle: 'dark',
        iconStyleAuto: true
    }, props => {
        if (props.iconStyleAuto) {
            if (isDark) {
                // set light-colored icon in dark UI
                chrome.browserAction.setIcon({ path: {
                    16: `/images/${props.iconType}-light-16.png`,
                    24: `/images/${props.iconType}-light-24.png`,
                    32: `/images/${props.iconType}-light-32.png`,
                }});
            } else {
                chrome.browserAction.setIcon({ path: {
                    16: `/images/${props.iconType}-dark-16.png`,
                    24: `/images/${props.iconType}-dark-24.png`,
                    32: `/images/${props.iconType}-dark-32.png`
                }});
            }
        } else {
            chrome.browserAction.setIcon({ path: `/images/${props.iconType}-${props.iconStyle}-16.png`});
        }
    });   
};

// Change the icon if the browser becomes dark
chrome.runtime.onMessage.addListener(message => {
    const isBrowserDark = message.isBrowserDark;
    setIcon(isBrowserDark);
});