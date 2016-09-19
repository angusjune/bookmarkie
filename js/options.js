window.addEventListener('load', getMessage, false);
var os = (navigator.platform.toLowerCase().match(/mac|win|linux/i) || ['other'])[0];
var _m = chrome.i18n.getMessage;

var extName = _m('extName');

function getMessage() {
	// i18n of text strings

	// Distinct mac and windows
	if (os == 'mac') {
		$('optionOpenNewTab').dataset.msg = 'optionOpenNewTabMac';
	}

	var neatGithub = '<a href="http://github.com/cheeaun/neat-bookmarks">Neat Bookmarks</a>';
	$('optionsFooterText').innerHTML = _m('optionsFooterText7', [neatGithub]);


	var elements = document.querySelectorAll('[data-msg]');
	Array.prototype.forEach.call(elements, function (el, i) {
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

document.addEventListener('DOMContentLoaded', function(){

	var alwaysOpenNewTab   = $('always-open-new-tab'),
			openNewTabInBg     = $('open-new-tab-in-bg'),
			closeOtherFolders  = $('close-other-folders'),
			popupStayOpen      = $('popup-stay-open'),
			// confirmOpenMultiple = $('confirm-open-multiple'),
			rememberLastState  = $('remember-last-state'),
			btnConfirmPh       = $('btn-confirm-ph'),
			panelHeight        = $('panel-height');
			// isHeightDefault     = $('remember-prev-state'),
			// customHeightVal     = $('remember-prev-state');

	chrome.storage.sync.get({
		alwaysOpenNewTab:    false,
		openNewTabInBg:      false,
		closeOtherFolders:   false,
		popupStayOpen:       false,
		// confirmOpenMultiple: true,
		rememberLastState:   true,
		panelHeight: '500px'
		// isHeightDefault:     true,
		// customHeightVal:     '600px'
	}, function(items){
		alwaysOpenNewTab.checked  = items.alwaysOpenNewTab;
		openNewTabInBg.checked    = items.openNewTabInBg;
		closeOtherFolders.checked = items.closeOtherFolders;
		popupStayOpen.checked     = items.popupStayOpen;
		rememberLastState.checked = items.rememberLastState;
		panelHeight.value         = items.panelHeight;
	});

/* Always open bookmarks in a new tab */

	// var clickNewTab = $('click-new-tab');
	// clickNewTab.checked = !!localStorage.leftClickNewTab;
	alwaysOpenNewTab.addEventListener('change', function(){
		// localStorage.leftClickNewTab = clickNewTab.checked ? '1' : '';
		// setOption('alwaysOpenNewTab', alwaysOpenNewTab.checked);
		chrome.storage.sync.set({
			alwaysOpenNewTab: alwaysOpenNewTab.checked
		},optionSaved);
	});

	/* Open bookmark in background while holding cmd */

	// var openNewTabBg = $('open-new-tab-bg');
	// openNewTabBg.checked = !!localStorage.middleClickBgTab;
	openNewTabInBg.addEventListener('change', function(){
		// setOption('openNewTabInBg', openNewTabInBg.checked);
		chrome.storage.sync.set({
			openNewTabInBg: openNewTabInBg.checked
		},optionSaved);
	});

	/* Close others folders when opening a new one */

	// var closeUnusedFolders = $('close-unused-folders');
	// closeUnusedFolders.checked = !!localStorage.closeUnusedFolders;
	closeOtherFolders.addEventListener('change', function(){
		// localStorage.closeUnusedFolders = closeUnusedFolders.checked ? '1' : '';
		// setOption('closeOtherFolders', closeOtherFolders.checked);
		chrome.storage.sync.set({
			closeOtherFolders: closeOtherFolders.checked
		},optionSaved);
	});

	/* Popup stay open when opening a bookmark */

	// var popupStayOpen = $('popup-stay-open');
	// popupStayOpen.checked = !!localStorage.bookmarkClickStayOpen;
	popupStayOpen.addEventListener('change', function(){
		// localStorage.bookmarkClickStayOpen = popupStayOpen.checked ? '1' : '';
		// setOption('popupStayOpen', popupStayOpen.checked);
		chrome.storage.sync.set({
			popupStayOpen: popupStayOpen.checked
		},optionSaved);
	});

	/* Confirm when trying to open multiple bookmarks */

	// var confirmOpenFolder = $('confirm-open-folder');
	// confirmOpenFolder.checked = !localStorage.dontConfirmOpenFolder;
	// confirmOpenFolder.addEventListener('change', function(){
	// 	localStorage.dontConfirmOpenFolder = confirmOpenFolder.checked ? '' : '1';
	// });

/* Remember last state */

	// var rememberPrevState = $('remember-prev-state');
	// rememberPrevState.checked = !localStorage.dontRememberState;
	rememberLastState.addEventListener('change', function(){
		// localStorage.dontRememberState = rememberPrevState.checked ? '' : '1';
		// setOption('rememberLastState', rememberLastState.checked);
		chrome.storage.sync.set({
			rememberLastState: rememberLastState.checked
		},optionSaved);
	});

	btnConfirmPh.addEventListener('click', function(){
		var heightVal = panelHeight.value;

		if (heightVal.match(/(\d+%)|(\d+px)/i)) {
			chrome.storage.sync.set({
				panelHeight: heightVal
			}, optionSaved);
		}
	});


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

document.addEventListener('DOMContentLoaded', function(){
	// check if options can be saved locally
	if (chrome.storage == null) {
		alert("Chrome storage not available");
		return;
	}
});
