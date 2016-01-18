window.addEventListener('load', init, false);
var os = (navigator.platform.toLowerCase().match(/mac|win|linux/i) || ['other'])[0];
var _m = chrome.i18n.getMessage;

var extName = _m('extName');

function init() {
	// i18n of text strings
	$('extName').innerHTML = extName;
	$('version').innerHTML = chrome.app.getDetails().version // undocumented method!
	$('options').innerHTML = _m('options');
	$('general').innerHTML = _m('general');
	$('appearance').innerHTML = _m('appearance');
	$('heightDefault').innerHTML = _m('heightDefault');
	$('heightCustom').innerHTML = _m('heightCustom');

	// Distinct mac and other users
	$('optionClickNewTab').innerHTML = _m('optionClickNewTab');
	if (os == 'mac') {
		$('optionOpenNewTab').innerHTML = _m('optionOpenNewTabMac');
	} else {
		$('optionOpenNewTab').innerHTML = _m('optionOpenNewTab');
	}

	$('optionCloseUnusedFolders').innerHTML = _m('optionCloseUnusedFolders');
	$('optionPopupStays').innerHTML = _m('optionPopupStays');
	$('optionConfirmOpenFolder').innerHTML = _m('optionConfirmOpenFolder');
	$('optionRememberPrevState').innerHTML = _m('optionRememberPrevState');

	var neatGithub = '<a href="http://github.com/cheeaun/neat-bookmarks">Neat Bookmarks</a>';
	var linkCheeAun = '<a href="http://twitter.com/cheeaun">Lim Chee Aun</a>';
	$('optionsFooterText').innerHTML = _m('optionsFooterText7', [neatGithub]);
};

var __m = function(){
	document.write(_m.apply(this, arguments));
};

document.addEventListener('DOMContentLoaded', function(){
	document.title = _m('extName') + ' ' + _m('options');

	var clickNewTab = $('click-new-tab');
	clickNewTab.checked = !!localStorage.leftClickNewTab;
	clickNewTab.addEventListener('change', function(){
		localStorage.leftClickNewTab = clickNewTab.checked ? '1' : '';
	});

	var openNewTabBg = $('open-new-tab-bg');
	openNewTabBg.checked = !!localStorage.middleClickBgTab;
	openNewTabBg.addEventListener('change', function(){
		localStorage.middleClickBgTab = openNewTabBg.checked ? '1' : '';
	});

	var closeUnusedFolders = $('close-unused-folders');
	closeUnusedFolders.checked = !!localStorage.closeUnusedFolders;
	closeUnusedFolders.addEventListener('change', function(){
		localStorage.closeUnusedFolders = closeUnusedFolders.checked ? '1' : '';
	});

	var popupStayOpen = $('popup-stay-open');
	popupStayOpen.checked = !!localStorage.bookmarkClickStayOpen;
	popupStayOpen.addEventListener('change', function(){
		localStorage.bookmarkClickStayOpen = popupStayOpen.checked ? '1' : '';
	});

	var confirmOpenFolder = $('confirm-open-folder');
	confirmOpenFolder.checked = !localStorage.dontConfirmOpenFolder;
	confirmOpenFolder.addEventListener('change', function(){
		localStorage.dontConfirmOpenFolder = confirmOpenFolder.checked ? '' : '1';
	});

	var rememberPrevState = $('remember-prev-state');
	rememberPrevState.checked = !localStorage.dontRememberState;
	rememberPrevState.addEventListener('change', function(){
		localStorage.dontRememberState = rememberPrevState.checked ? '' : '1';
	});

	var heightDefault = $('height-default');
	var heightCustom  = $('height-default');
	var heightValue   = $('height-value');
	var heightVal = heightValue.value.toLowerCase().replace(' ', '');
	console.log(heightVal);
	heightDefault.checked = localStorage.isHeightDefault;
	heightDefault.addEventListener('change', function(){
		localStorage.isHeightDefault = heightDefault.checked ? '' : '1';
	});
	heightCustom.addEventListener('change', function(){
		if (heightVal.match(/(\d+%)|(\d+px)/i)) {

		} else {
			document.querySelector('.height-value-tip')
		}
	});
});

document.addEventListener('DOMContentLoaded', function(){
	// check if options can be saved locally
	if (window.localStorage == null) {
		alert("LocalStorage must be enabled for managing options.");
		return;
	}
});
