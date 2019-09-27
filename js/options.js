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

	chrome.storage.sync.get({
		openNewTabs:    false,
		openTabsInBg:      false,
		closeOtherFolders:   false,
		popupFixed:       false,
		preserveState:   true,
		panelHeight: '500px',
		// isHeightDefault:     true,
		// customHeightVal:     '600px'
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
				}, () =>  {
					optionSaved();
					iconType = target.value;
					chrome.browserAction.setIcon({path: `/images/${iconType}-${iconStyle}-128.png`});
					el.style.backgroundImage = `url(/images/${iconType}-${iconStyle}-128.png)`
				})

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
		console.log(changes)

		if (changes.iconStyleAuto) {
			const val = changes.iconStyleAuto.newValue;
			val ? iconColorPanel.classList.add('hidden') : iconColorPanel.classList.remove('hidden');

			const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (isDarkMode) {
            chrome.browserAction.setIcon({ path: `/images/${items.iconType}-light-128.png`});
        }
		}
	})


		// btnConfirmPh.addEventListener('click', () => {
	// 	var heightVal = panelHeight.value;

	// 	if (heightVal.match(/(\d+%)|(\d+px)/i)) {
	// 		chrome.storage.sync.set({
	// 			panelHeight: heightVal
	// 		}, optionSaved);
	// 	}
	// });


/* Customize panel height */

// 	var heightDefault = $('height-default');
// 	var heightCustom  = $('height-custom');
// 	var heightValue   = $('height-value');
// 	var heightVal = heightValue.value.toLowerCase().replace(' ', '');
//
// 	console.log(heightVal);
//
// 	localStorage.isHeightDefault = localStorage.isHeightDefault ? localStorage.isHeightDefault : true;
//
// 	var isHeightDefault = localStorage.isHeightDefault;
//
// 	if (isHeightDefault) {
// 		heightDefault.checked = true;
// 	} else {
// 		heightCustom.checked = true;
// 	}
//
// 	heightDefault.addEventListener('change', function(){
// 		localStorage.isHeightDefault = heightDefault.checked ? '' : '1';
// 	});
//
// 	heightCustom.addEventListener('change', function(){
//
//
// 		if (heightVal.match(/(\d+%)|(\d+px)/i)) {
// 			localStorage.customHeight = heightVal;
// 			console.log(localStorage.customHeight + 'lc');
//
// 		} else {
// 			document.querySelector('.height-value-tip')
// 		}
// 	});
//
// 	heightValue.addEventListener('focus', function(){
// 		heightCustom.checked = true;
// 	});
});