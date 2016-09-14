$(function(){
	var form = $('#vnfm_form');
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	form.validate({
		doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
		errorElement: 'span', //default input error message container
		errorClass: 'help-block', // default input error message class
		focusInvalid: false, // do not focus the last invalid input
		rules: {			
			name:{
				required: true,
				maxlength:20
			},
			type:{
				required: true,
				maxlength:20
			},
			version:{
				required: true,
				maxlength:20
			},
			vendor:{
				required: true,
				maxlength:20
			},
			url:{
				required: true,
				url: true
			}
		},
		messages: {		
			name:{
				required: $.i18n.prop("nfv-vnfm-iui-validate-name")
			},
			type:{
				required: $.i18n.prop("nfv-vnfm-iui-validate-type")
			},
			version:{
				required: $.i18n.prop("nfv-vnfm-iui-validate-version")
			},
			vendor:{
				required: $.i18n.prop("nfv-vnfm-iui-validate-vendor")
			},
			url:{
				required: $.i18n.prop("nfv-vnfm-iui-validate-url-required"),
				url: $.i18n.prop("nfv-vnfm-iui-validate-url")
			}
		},
		errorPlacement: function (error, element) { // render error placement for each input type
			error.insertAfter(element); // for other inputs, just perform default behavior
		},
		invalidHandler: function (event, validator) { //display error alert on form submit   
			success.hide();
			error.show();
		},
		highlight: function (element) { // hightlight error inputs
			$(element).closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
		},
		unhighlight: function (element) { // revert the change done by hightlight
			$(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
		},
		success: function (label) {
			label.addClass('valid') // mark the current input as valid and display OK icon
				.closest('.form-group').removeClass('has-error'); // set success class to the control group
		},
		submitHandler: function (form) {
			success.show();
			error.hide();
			//add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
		}
	});
});