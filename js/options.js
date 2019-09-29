// mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
const ripple = mdc.ripple.MDCRipple.attachTo(document.querySelector('.icon-list-item__graphic'));

window.addEventListener('load', getMessage, false);
const os = (navigator.platform.toLowerCase().match(/mac|win|linux/i) || ['other'])[0];
const _m = chrome.i18n.getMessage;

const extName = _m('extName');

// i18n of text strings
function getMessage() {

	// Distinct mac and windows
	if (os == 'mac') {
		$('optionOpenNewTab').dataset.msg = 'optionOpenNewTabMac';
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

	const ctrlOpenNewTabs = mdc.switchControl.MDCSwitch.attachTo(document.querySelector('#openNewTabs'));
	const ctrlOpenTabsInBg = mdc.switchControl.MDCSwitch.attachTo($('openTabsInBg'));
	const ctrlCloseOtherFolders = mdc.switchControl.MDCSwitch.attachTo($('closeOtherFolders'));
	const ctrlPopupFixed = mdc.switchControl.MDCSwitch.attachTo($('popupFixed'));
	const ctrlPreserveState = mdc.switchControl.MDCSwitch.attachTo($('preserveState'));
	const ctrlIconStyleAuto = mdc.switchControl.MDCSwitch.attachTo($('iconStyleAuto'));

	const ctrlOpenNewTabsNative = $('openNewTabsNative');
	const ctrlOpenTabsInBgNative = $('openTabsInBgNative');
	const ctrlCloseOtherFoldersNative = $('closeOtherFoldersNative');
	const ctrlPopupFixedNative = $('popupFixedNative');
	const ctrlPreserveStateNative = $('preserveStateNative');
	const ctrlIconStyleAutoNative = $('iconStyleAutoNative');

	const iconColorPanel = document.querySelector('.icon-style-panel');

	let iconType = 'star';
	let iconStyle = 'dark';
	let iconStyleAuto = true;

	chrome.storage.sync.get({
		openNewTabs:    false,
		openTabsInBg:      false,
		closeOtherFolders:   false,
		popupFixed:       false,
		preserveState:   true,
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
			ripple.activate();

			if (target.checked) {
				chrome.storage.sync.set({
					iconType: target.value
				}, optionSaved);

			}
		});
	});

	document.querySelectorAll('[name=icon-style-group]').forEach(el => {
		el.addEventListener('change', res=> {
			const target = res.target;

			if (target.checked) {
				chrome.storage.sync.set({
					iconStyle: target.value
				}, () =>  {
					optionSaved();
					iconStyle = target.value;
					chrome.browserAction.setIcon({path: `/images/${iconType}-${iconStyle}-128.png`});
				})

			}
		});
	});

	chrome.storage.onChanged.addListener(changes => {
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

		if (changes.iconType) {
			const val = changes.iconType.newValue;
			iconType = val;
			setIcon(iconType, iconStyle, iconStyleAuto);
		}

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