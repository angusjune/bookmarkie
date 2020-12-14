const $ = function(id){
	return document.getElementById(id);
};
const _m = chrome.i18n.getMessage;

module.exports= [$, _m];