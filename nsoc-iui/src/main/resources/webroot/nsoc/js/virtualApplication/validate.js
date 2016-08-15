$(function(){
	var form = $("#vmAppForm");
	var error = $('.alert-danger', form);
	var success = $('.alert-success', form);

	$.extend($.validator.messages, {
		required: $.i18n.prop("nfv-virtualApplication-iui-validate-inputParam")
	});

	form.validate({
		doNotHideMessage : true,
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : false,
		rules : {
			instanceName : {
				required : true
			},
			serviceTemplateName : {
				required : true
			},
			vimId : {
				required : true
			},
			vnfmId : {
				required : true
			}
		},
		messages : {
			instanceName : {
				required : $.i18n.prop("nfv-virtualApplication-iui-validate-instanceName")
			},
			serviceTemplateName : {
				required : $.i18n.prop("nfv-virtualApplication-iui-validate-serviceTemplateName")
			},
			vimId : {
				required : $.i18n.prop("nfv-virtualApplication-iui-validate-vimId")
			},
			vnfmId : {
				required : $.i18n.prop("nfv-virtualApplication-iui-validate-vnfmId")
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
		unhighlight: function (element) {
			$(element).closest(".form-group").removeClass("has-error");
		},
		success : function(label) {
			label.addClass("valid").closest(".form-group").removeClass("has-error");
		},
		submitHandler: function (form) {
			success.show();
			error.hide();
		}
	});
});