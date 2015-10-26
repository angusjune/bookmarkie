window.addEventListener('load', init, false);

function init() {
	// i18n of text strings
	$('extName').innerHTML = chrome.i18n.getMessage('extName');
	$('version').innerHTML = chrome.app.getDetails().version // undocumented method!
	$('options').innerHTML = chrome.i18n.getMessage('options');
	$('general').innerHTML = chrome.i18n.getMessage('general');
	$('optionClickNewTab').innerHTML = chrome.i18n.getMessage('optionClickNewTab');
	$('optionOpenNewTab').innerHTML = chrome.i18n.getMessage('optionOpenNewTab');
	$('optionCloseUnusedFolders').innerHTML = chrome.i18n.getMessage('optionCloseUnusedFolders');
	$('optionPopupStays').innerHTML = chrome.i18n.getMessage('optionPopupStays');
	$('optionConfirmOpenFolder').innerHTML = chrome.i18n.getMessage('optionConfirmOpenFolder');
	$('optionRememberPrevState').innerHTML = chrome.i18n.getMessage('optionRememberPrevState');
	var extName = chrome.i18n.getMessage('extName');
	var version = chrome.i18n.getMessage('version');

	var neatGithub = '<a href="http://github.com/cheeaun/neat-bookmarks">Neat Bookmarks</a>';
	var linkCheeAun = '<a href="http://twitter.com/cheeaun">Lim Chee Aun</a>';
	$('optionsFooterText').innerHTML = chrome.i18n.getMessage('optionsFooterText7', [neatGithub, linkCheeAun]);
};

var _m = chrome.i18n.getMessage;

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
});

document.addEventListener('DOMContentLoaded', function(){
	// check if options can be saved locally
	if (window.localStorage == null) {
		alert("LocalStorage must be enabled for managing options.");
		return;
	}
});

onerror = function(){
	chrome.extension.sendRequest({error: [].slice.call(arguments)})
};
