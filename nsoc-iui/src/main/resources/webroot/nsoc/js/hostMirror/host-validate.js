$(function(){
	var form = $("#hostForm");
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	form.validate({
		doNotHideMessage : true,
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : false,
		rules : {
			hosturl : {
				required : true,
				url : true
			},
			hostName : {
				required : true
			},
			vim : {
				required : true
			}
		},
		messages : {
			hosturl : {
				required : $.i18n.prop('nfv-host-iui-validate-hosturl-required'),
				url : $.i18n.prop('nfv-host-iui-validate-hosturl-url')
			},
			hostName : {
				required : $.i18n.prop('nfv-host-iui-validate-hostName')
			},
			vim : {
				required : $.i18n.prop('nfv-host-iui-validate-vim')
			}
		},
		errorPlacement : function(error, element) {
			error.insertAfter(element);
		},
		invalidHandler : function(event, validator) {
			success.hide();
			error.show();
		},
		highlight : function(element) {
			$(element).closest(".form-group").removeClass("has-success").addClass("has-error");
		},
		unhighlight : function(element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		success : function(label) {
			label.addClass("valid").closest(".form-group").removeClass("has-error");
		},
		submitHandler : function(form) {
			success.show();
			error.hide();
		}
	});
});