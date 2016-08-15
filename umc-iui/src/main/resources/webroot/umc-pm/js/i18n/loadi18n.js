var lang = getLanguage();
function loadProperties(lang){
    jQuery.i18n.properties({
            language:lang,
            name:'ngict-pm-iui-i18n',
            path:'i18n/',
            mode:'map',
            callback: function() {
                 var i18nItems = $("[name_i18n=com_zte_ums_ngict_pm]");
				for(var i=0;i<i18nItems.length;i++){
					var $item = $(i18nItems.eq(i));
					var itemId = $item.attr('id');
					if(typeof($item.attr("title"))!="undefined"){
					$item.attr("title", $.i18n.prop(itemId));
				    }else{
					   $item.text($.i18n.prop(itemId));
				    }
				}		
            }
        });
}


