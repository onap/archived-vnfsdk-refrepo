/*
    Copyright 2017, China Mobile Co., Ltd.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

$(document).ready(function() {
    $("li a").each(function(index) {
        $(this).click(function() {
            $("li a").removeClass("submenu_active");
            $("li a").eq(index).addClass("submenu_active");
        });
    });
});

function init_menu() {
    var windowH = $(window).height();
    var headerH = $('#header-logo').height();
    var menuHeight = windowH - headerH;
    $('#page-sidebar').height(windowH);
    $("#sidebar-menu").height(menuHeight);

    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    }

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
            $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
    }
    var accordion = new Accordion($('#accordion'), false);
};

function iFrameHeight() {
    var ifm= document.getElementById("mainFrame");
    var subWeb = document.frames ? document.frames["mainFrame"].document : ifm.contentDocument;
    if (ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
    }
};
