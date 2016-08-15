/*
 * Copyright (C) 2015 ZTE, Inc. and others. All rights reserved. (ZTE)
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
function loginSubmitHandler(form) {
			          var params = {};
					  params["username"] =$("#inputUserName").val().trim();
					  var sourcePass = $("#inputPassword").val();
					  var pass = sourcePass;
					  if( FrameConst.isEncypt === "true"){
					      pass = ict_framework_func1(pass);
					  }
					  params["password"] = pass;
					  params["isEncypted"]  = FrameConst.isEncypt;					  
					  saveUserInfo(params);			          
  					  $.ajax({  
							url : FrameConst.REST_LOGIN,  
							type : 'POST',  
							data : JSON.stringify(params),  
							dataType : 'json',  
							contentType : 'application/json; charset=utf-8',  
							success : function(data, status, xhr) {  
							if(data.result == 0){
								 var epass=CryptoJS.MD5(params.username+sourcePass);
								 store("icttka", epass.toLocaleString());
							}
								processLoginResult(data,params);
							},  
							Error : function(xhr, error, exception) {  
								alert( error );
								if( console ){
									console.log( "login fail:" + error );
									console.log( exception ); 
								}
							}   
						});	   
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
	                   required: $.i18n.prop('com_zte_ums_ict_login_inputname').replace(/\"/g,'') 
	                },
	                password: {
	                   required: $.i18n.prop('com_zte_ums_ict_login_inputpwd').replace(/\"/g,'')
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	                $('.alert-danger', $('.login-form')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
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
			
			$("input[name='remember']").bind("click", function () {
			    saveUserInfo();
			});
	}

	var handleForgetPassword = function () {
		$('.forget-form').validate({
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	                email: {
	                    required: true,
	                    email: true
	                }
	            },

	            messages: {
	                email: {
	                    required: "Email is required."
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                form.submit();
	            }
	        });

	        $('.forget-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.forget-form').validate().form()) {
	                    $('.forget-form').submit();
	                }
	                return false;
	            }
	        });

	        $('#forget-password').click(function () {
	            $('.login-form').hide();
	            $('.forget-form').show();
	        });

	        $('#back-btn').click(function () {
	            $('.login-form').show();
	            $('.forget-form').hide();
	        });

	}
    return {
        //main function to initiate the module
        init: function () {
        	
            handleLogin();
            handleForgetPassword();
	       
	       	$.backstretch([
		        "img/integration/zte_bg_1.jpg",
		        "img/integration//zte_bg_2.jpg",
		        "img/integration//zte_bg_3.jpg"
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
        $("#inputUserName").val(store("inputUserName"));
        $("#inputPassword").val(store("inputPassword"));
    }
});


function saveUserInfo(params) {
    var rmbcheck=$("input[name='remember']");
    if (rmbcheck.attr("checked")==true||rmbcheck.is(':checked')) {
	    var userName = $("#inputUserName").val();
        var passWord = $("#inputPassword").val();
        store("remember", "true"); 
        store("inputUserName", params.username); 
        store("inputPassword", passWord); 
    }
    else {
        store.remove("remember");
        store.remove("inputUserName");
        store.remove("inputPassword");
    }
}

