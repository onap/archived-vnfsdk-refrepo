var ictWizard = function () {

    var type = "normal";

    if (!jQuery().bootstrapWizard) {
        return;
    }

    var isShowTab2 = true;
    var wizardBody = $('#ict_wizard_body');
    var form = $('#submit_form');

    var initFormData = function () {

        /* $("#tab1 .form-group").each(function () {
         $(this).removeClass('has-success');
         $(this).removeClass('has-error');
         $(this).find(".help-block[for]").remove();
         }); */
        var liSelected = wizardBody.find("li.active");
        if ($("a", liSelected).attr("href") != "#tab1") {
            wizardBody.find("a[href*='tab1']").trigger('click');
        }
        wizardBody.find('.progress-bar').css({
            width: 1 / 3 * 100 + '%'
        });
        if (type) {
            wizardBody.find('.button-back').show();
        } else {
            wizardBody.find('.button-submit').show();
        }
    }

    wizardBody.find('.button-previous').hide();

    var handleTitle = function (tab, navigation, index) {
        var total = navigation.find('li').length;
        var current = index + 1;

        // set done steps
        jQuery('li', wizardBody).removeClass("done");
        var li_list = navigation.find('li');
        for (var i = 0; i < index; i++) {
            jQuery(li_list[i]).addClass("done");
        }

        if (current == 1) {
            wizardBody.find('.button-previous,.button-first').hide();
        } else {
            if (isShowTab2) {
                wizardBody.find('.button-previous').show();
                if (type) {
                    wizardBody.find('.button-back').show();
                } else {
                    wizardBody.find('.button-submit').show();
                }
            } else {
                wizardBody.find('.button-first').show();
            }
        }

        if (current >= total) {
            wizardBody.find('.button-next').hide();
            wizardBody.find('.button-last').hide();
            if (type) {
                wizardBody.find('.button-back').show();
            } else {
                wizardBody.find('.button-submit').show();
            }

        } else {
            if (isShowTab2) {
                wizardBody.find('.button-next').show();
                if (type) {
                    wizardBody.find('.button-back').show();
                } else {
                    wizardBody.find('.button-submit').show();
                }
            } else {
                wizardBody.find('.button-last').show();
            }
        }

        var $percent = (current / total) * 100;
        wizardBody.find('.progress-bar').css({
            width: $percent + '%'
        });
    }

    // default form wizard
    wizardBody.bootstrapWizard({
        'nextSelector': '.button-next',
        'previousSelector': '.button-previous',
        'lastSelector': '.button-last',
        'firstSelector': '.button-first',
        onTabClick: function (tab, navigation, index, clickedIndex) {
            if (!isShowTab2 && clickedIndex == 1) {
                return false;
            }
            /* if (form.valid() == false) {
             return false;
             } */
            handleTitle(tab, navigation, clickedIndex);
        },
        onNext: function (tab, navigation, index) {
            /* if (form.valid() == false) {
             return false;
             } */

            handleTitle(tab, navigation, index);
        },
        onPrevious: function (tab, navigation, index) {
            handleTitle(tab, navigation, index);
        },
        onFirst: function (tab, navigation, index) {
            handleTitle(tab, navigation, index);
        },
        onLast: function (tab, navigation, index) {
            /* if (form.valid() == false) {
             return false;
             } */

            handleTitle(tab, navigation, index);
        }
    });

    //初始化表单数据
    initFormData();
}
