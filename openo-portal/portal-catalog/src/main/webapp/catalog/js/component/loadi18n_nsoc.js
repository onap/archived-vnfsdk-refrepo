function loadPropertiesSideMenu(lang, fileNamePrefix, filePath){
	jQuery.i18n.properties({
	    language:lang,
	    name:fileNamePrefix,
	    path:filePath,
	    mode:'map',
	    callback: function() {
	        var i18nItems = $("[name_i18n=com_zte_nfv_nsoc_i18n]");
	        for(var i=0;i<i18nItems.length;i++) {
	        	var $item = $(i18nItems.eq(i));
	        	var itemId = $item.attr("id");
	        	var itemTitle = $item.attr("title");
	        	if(typeof(itemTitle) != "undefined") {
	        		$item.attr("title", $.i18n.prop(itemId));
	        	} else {
	        		$item.text($.i18n.prop(itemId));
	        	}
	        }
	    }
	});
}
var lang = getLanguage();
loadPropertiesSideMenu(lang, 'nfv-nso-iui-i18n', 'i18n/');