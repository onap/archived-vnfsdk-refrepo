/* Copyright 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function () {
    $.validator.setDefaults({
        onkeyup: null,
        success: function (label) {
            label.text('').addClass('valid');
        },
        onfocusin: function (element) {
            this.lastActive = element;
            this.addWrapper(this.errorsFor(element)).hide();
            var tip = $(element).attr('tip');
            if (tip && $(element).parent().children(".tip").length === 0) {
                $(element).parent().append("<label class='tip'>" + tip + "</label>");
            }
            $(element).addClass('highlight');
            if (this.settings.focusCleanup) {
                if (this.settings.unhighlight) {
                    this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                }
                this.hideThese(this.errorsFor(element));
            }
        },
        onfocusout: function (element) {
            $(element).parent().children(".tip").remove();
            $(element).removeClass('highlight');
            this.element(element);
        }
    });
});