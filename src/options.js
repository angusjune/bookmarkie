'use strict';

import './options.scss';
import {MDCSwitch} from '@material/switch';

const os = (navigator.platform.toLowerCase().match(/mac|win|linux/i) || ['other'])[0];

const storageCache = {};

// i18n of text strings
function getMessage() {
	// Distinct mac and windows
	if (os == 'mac') {
		document.querySelector('#optionOpenNewTab').dataset.msg = 'optionOpenNewTabMac';
	}

	const elements = document.querySelectorAll('[data-msg]');
	elements.forEach((el, i) => {
		el.textContent = chrome.i18n.getMessage(el.dataset.msg);
	});
}
getMessage();

function optionSaved() {
	console.log('Saved');
}

const ctrlOpenNewTabs = new MDCSwitch(document.querySelector('#openNewTabs'));
const ctrlOpenTabsInBg = new MDCSwitch(document.querySelector('#openTabsInBg'));
const ctrlCloseOtherFolders = new MDCSwitch(document.querySelector('#closeOtherFolders'));
const ctrlPopupFixed = new MDCSwitch(document.querySelector('#popupFixed'));
const ctrlPreserveState = new MDCSwitch(document.querySelector('#preserveState'));
const ctrlIconStyleAuto = new MDCSwitch(document.querySelector('#iconStyleAuto'));

const ctrlOpenNewTabsNative = document.querySelector('#openNewTabsNative');
const ctrlOpenTabsInBgNative = document.querySelector('#openTabsInBgNative');
const ctrlCloseOtherFoldersNative = document.querySelector('#closeOtherFoldersNative');
const ctrlPopupFixedNative = document.querySelector('#popupFixedNative');
const ctrlPreserveStateNative = document.querySelector('#preserveStateNative');
const ctrlIconStyleAutoNative = document.querySelector('#iconStyleAutoNative');

const iconStylePanel = document.querySelector('.icon-style-panel');
const iconColorList  = document.querySelector('.icon-color-list');

const setIcon = (iconType = 'star', iconStyle = 'dark', iconStyleAuto = true) => {
	const isBrowserDark = window.matchMedia("(prefers-color-scheme: dark)").matches || chrome.extension.inIncognitoContext;

	const iconList = document.querySelector('.icon-list');
	iconList.className = 'icon-list';

	if (iconStyleAuto) {
		if (isBrowserDark) {
			iconStyle = 'light';
		} else {
			iconStyle = 'dark';
		}
	}
	iconList.classList.add(iconStyle);
};

chrome.storage.sync.get({
	openNewTabs: false,
	openTabsInBg: false,
	closeOtherFolders: false,
	popupFixed: false,
	preserveState: true,
	panelHeight: '500px',
	iconType: 'star',
	iconStyle: 'dark',
	iconStyleAuto: true,
}, props => {
	Object.assign(storageCache, props);

	ctrlOpenNewTabs.checked  = props.openNewTabs;
	ctrlOpenTabsInBg.checked    = props.openTabsInBg;
	ctrlCloseOtherFolders.checked = props.closeOtherFolders;
	ctrlPopupFixed.checked     = props.popupFixed;
	ctrlPreserveState.checked = props.preserveState;
	ctrlIconStyleAuto.checked = props.iconStyleAuto;

	ctrlIconStyleAuto.checked ? iconStylePanel.classList.add('hidden') : iconStylePanel.classList.remove('hidden');

	if (props.iconStyle === 'colored') {
		storageCache.iconStyle = 'yellow';
		chrome.storage.sync.set({ iconStyle: 'yellow'});
	}

	document.querySelector(`[name=icon-type-group][value=${storageCache.iconType}]`).setAttribute('checked', true);
	document.querySelector(`[name=icon-style-group][value=${storageCache.iconStyle}]`).setAttribute('checked', true);

	setIcon(storageCache.iconType, storageCache.iconStyle, storageCache.iconStyleAuto);
	const isBrowserDark = window.matchMedia("(prefers-color-scheme: dark)").matches || chrome.extension.inIncognitoContext;
	chrome.runtime.sendMessage({ isBrowserDark: isBrowserDark });
});

/* Always open bookmarks in a new tab */
ctrlOpenNewTabsNative.addEventListener('change', () => {
	chrome.storage.sync.set({
		openNewTabs: ctrlOpenNewTabs.checked
	}, optionSaved);
});

/* Open bookmark in background while holding cmd */
ctrlOpenTabsInBgNative.addEventListener('change', () => {
	chrome.storage.sync.set({
		openTabsInBg: ctrlOpenTabsInBg.checked
	},optionSaved);
});

/* Close others folders when opening a new one */
ctrlCloseOtherFoldersNative.addEventListener('change', () => {
	chrome.storage.sync.set({
		closeOtherFolders: ctrlCloseOtherFolders.checked
	}, optionSaved);
});

/* Popup stay open when opening a bookmark */
ctrlPopupFixedNative.addEventListener('change', () => {
	chrome.storage.sync.set({
		popupFixed: ctrlPopupFixed.checked
	}, optionSaved);
});

/* Remember last state */
ctrlPreserveStateNative.addEventListener('change', () => {
	chrome.storage.sync.set({
		preserveState: ctrlPreserveState.checked
	},optionSaved);
});

ctrlIconStyleAutoNative.addEventListener('change', () => {
	chrome.storage.sync.set({
		iconStyleAuto: ctrlIconStyleAuto.checked
	}, optionSaved);
});

document.querySelectorAll('input[name=icon-type-group]').forEach(el => {
	el.addEventListener('change', res=> {
		const target = res.target;

		if (target.checked) {
			chrome.storage.sync.set({
				iconType: target.value
			}, optionSaved);
		}
	});
});

// Setting icon color
document.querySelectorAll('[name=icon-style-group]').forEach(el => {
	el.addEventListener('change', res=> {
		const target = res.target;

		if (target.checked) {
			chrome.storage.sync.set({
				iconStyle: target.value
			}, optionSaved);
		}
	});
});

chrome.storage.onChanged.addListener(changes => {
	for (const [key, value] of Object.entries(changes)) {
        storageCache[key] = value.newValue;
    }

	if (changes.iconType || changes.iconStyle || changes.iconStyleAuto) {
		setIcon(storageCache.iconType, storageCache.iconStyle, storageCache.iconStyleAuto);
	}

	if (changes.iconStyleAuto) {
		const val = changes.iconStyleAuto.newValue;
		val ? iconStylePanel.classList.add('hidden') : iconStylePanel.classList.remove('hidden');
	}
});