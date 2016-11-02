/*
 * Copyright 2016, CMCC Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

function loginSubmitHandler() {
	var loginData = {
		"userName": $("#openo_input_userName").val(),
		"password": $("#openo_input_password").val()
	}

	$.ajax({
		url : "/openoapi/auth/v1/tokens",
		type : "POST",
		contentType : 'application/json; charset=utf-8',
		data : JSON.stringify(loginData)
	}).done(function(data) {
		var topURL = top.window.document.location.href;
		if (topURL.indexOf("?service") != -1) {
			top.window.document.location.href = decodeURIComponent(topURL.substring(topURL.indexOf("?service") + 9));
		} else {
			top.window.document.location.href = "/openoui/common/default.html";
		}
		store("loginUserName", $("#openo_input_userName").val());
	}).fail(function(data) {
		var tipDivId = $("#loginConnError");
		if (data.status == 401) {
			tipDivId = $("#nameOrpwdError");
		}

		tipDivId.addClass('alert-danger');
		if (tipDivId.attr("tipstatus") == "normal") {
			tipDivId.show();
		} else if (tipDivId.attr("tipstatus") == "close") {
			tipDivId.attr("tipstatus", "normal");
		}
	});

	saveUserInfo();
};

var Login = function () {
	var handleLogin = function() {
		$('.login-form').validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			rules: {
				username: {
					required: true
				},
				password: {
					required: false
				},
				remember: {
					required: false
				}
			},
			messages: {
				username: {
					required: $.i18n.prop('openo_input_userName').replace(/\"/g,'') 
				},
				password: {
					required: $.i18n.prop('openo_input_password').replace(/\"/g,'')
				}
			},
			invalidHandler: function (event, validator) {
				$('.alert-danger', $('.login-form')).show();
			},
			highlight: function (element) {
				$(element).closest('.form-group').addClass('has-error'); // set error class to the control group
			},
			success: function (label) {
				label.closest('.form-group').removeClass('has-error');
				label.remove();
			},
			errorPlacement: function (error, element) {
				error.insertAfter(element.closest('.input-icon'));
			},
			submitHandler: loginSubmitHandler
		});

		$('.login-form input').keypress(function (e) {
			$("#nameOrpwdError").hide();
			$("#loginConnError").hide();
			if (e.which == 13) {
				if ($('.login-form').validate().form()) {
					$('.login-form').submit();
				}
				return false;
			}
		});
	}

	return {
		//main function to initiate the module
		init: function () {
			handleLogin();
			$.backstretch([
				"image/integration/openo_bg_1.jpg",
				"image/integration//openo_bg_2.jpg",
				"image/integration//openo_bg_3.jpg"
			], {
				fade: 500,
				duration: 15000
			});
		}
	};
}();

$(document).ready(function() {
	if (store("remember") == "true") {
		$("input[name='remember']").attr("checked", "checked");
		$("#openo_input_userName").val(store("openo_input_userName"));
		$("#openo_input_password").val(store("openo_input_password"));
	}
});

function saveUserInfo() {
	var rmbcheck = $("input[name='remember']");
	if (rmbcheck.attr("checked") == true || rmbcheck.is(':checked')) {
		store("remember", "true");
		store("openo_input_userName", $("#openo_input_userName").val());
		store("openo_input_password", $("#openo_input_password").val());
	} else {
		store.remove("remember");
		store.remove("openo_input_userName");
		store.remove("openo_input_password");
	}
}
