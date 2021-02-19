'use strict';

import './options.scss';
import {MDCSwitch} from '@material/switch';

window.addEventListener('load', getMessage, false);
const os = (navigator.platform.toLowerCase().match(/mac|win|linux/i) || ['other'])[0];
const _m = chrome.i18n.getMessage;

// i18n of text strings
function getMessage() {

	// Distinct mac and windows
	if (os == 'mac') {
		document.querySelector('#optionOpenNewTab').dataset.msg = 'optionOpenNewTabMac';
	}

	const elements = document.querySelectorAll('[data-msg]');
	elements.forEach((el, i) => {
		el.textContent = _m(el.dataset.msg);
	});

};

function optionSaved() {
	console.log('Saved');
}

function setOption(name, value) {
	chrome.storage.sync.set({
		name: value
	},optionSaved);
}

document.addEventListener('DOMContentLoaded', () => {
	if (chrome.storage === null) {
		alert("Chrome storage not available");
		return;
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

	const iconColorPanel = document.querySelector('.icon-style-panel');

	const setIcon = (iconType = 'star', iconStyle = 'dark', iconStyleAuto = true) => {
		const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches; // OS set to dark mode
		const isIncognito = chrome.extension.inIncognitoContext; // Chrome is in incognito context
	
		if (iconStyleAuto) {
			if (isDarkMode || isIncognito) {
				// set light-colored icon in dark UI
				chrome.browserAction.setIcon({ path: `./images/${iconType}-light-32.png`});
				document.querySelectorAll('.icon-list-item__graphic').forEach(el => {
					el.classList.remove('dark', 'light', 'colored');
					el.classList.add('light');
				});
			} else {
				chrome.browserAction.setIcon({ path: `./images/${iconType}-dark-32.png`});
				document.querySelectorAll('.icon-list-item__graphic').forEach(el => {
					el.classList.remove('dark', 'light', 'colored');
					el.classList.add('dark');
				});
			}
		} else {
			chrome.browserAction.setIcon({ path: `./images/${iconType}-${iconStyle}-32.png`});
			document.querySelectorAll('.icon-list-item__graphic').forEach(el => {
				el.classList.remove('dark', 'light', 'colored');
				el.classList.add(iconStyle);
			});
		}
	}

	let iconType = 'star';
	let iconStyle = 'dark';
	let iconStyleAuto = true;

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
		ctrlOpenNewTabs.checked  = props.openNewTabs;
		ctrlOpenTabsInBg.checked    = props.openTabsInBg;
		ctrlCloseOtherFolders.checked = props.closeOtherFolders;
		ctrlPopupFixed.checked     = props.popupFixed;
		ctrlPreserveState.checked = props.preserveState;
		ctrlIconStyleAuto.checked = props.iconStyleAuto;

		ctrlIconStyleAuto.checked ? iconColorPanel.classList.add('hidden') : iconColorPanel.classList.remove('hidden');

		iconType = props.iconType;
		iconStyle = props.iconStyle;
		iconStyleAuto = props.iconStyleAuto;

		document.querySelector(`[name=icon-type-group][value=${props.iconType}]`).setAttribute('checked', true);
		document.querySelector(`[name=icon-style-group][value=${props.iconStyle}]`).setAttribute('checked', true);

		setIcon(iconType, iconStyle, iconStyleAuto);
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
			// ripple.activate();

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
				}, () =>  {
					optionSaved();
				})
			}
		});
	});

	chrome.storage.onChanged.addListener(changes => {

		if (changes.iconType) {
			const val = changes.iconType.newValue;
			iconType = val;
			setIcon(iconType, iconStyle, iconStyleAuto);
		}

		// if icon color is changed
		if (changes.iconStyle) {
			const val = changes.iconStyle.newValue;
			iconStyle = val;
			setIcon(iconType, iconStyle, iconStyleAuto);
		}

		if (changes.iconStyleAuto) {
			const val = changes.iconStyleAuto.newValue;
			val ? iconColorPanel.classList.add('hidden') : iconColorPanel.classList.remove('hidden');

			iconStyleAuto = val;
			setIcon(iconType, iconStyle, iconStyleAuto);
		}
	});
});