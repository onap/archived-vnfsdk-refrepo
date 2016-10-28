/*
 * Copyright 2016 ZTE Corporation.
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
var templateParameters = {
    changed: true,
    parameters: [],
    vimInfos: []
};

var lcmHandler = function () {
    this._addOwnEvents();
};

lcmHandler.prototype = {
    _addOwnEvents: function () {
        $('#createNS').click(this.okAction);
    },
    okAction: function () {
    	if(!checkLocation(templateParameters.parameters)) {
    		alert('Location must be selected in Template Parameters');
    		return;
    	}
        var serviceInstance = {
            serviceTemplateId: $("#svcTempl").val(),
            serviceName: $('#svcName').val(),
            description: $('#svcDesc').val(),
            inputParameters: collectServiceParameters(templateParameters.parameters)
        };
        var gatewayService = '/openoapi/servicegateway/v1/services';
        $.when(
            fetchServiceTemplateBy(serviceInstance.serviceTemplateId)
        ).then(
            function(template) {
                serviceInstance.templateName = template.name;
                serviceInstance.serviceType = template.serviceType;
                return createNetworkServiceInstance(template, serviceInstance, gatewayService);
            }
        ).then(
            function(serviceInstance) {
                updateTable(serviceInstance);
                $('#vmAppDialog').removeClass('in').css('display', 'none');
            }
        );
    }
};

function checkLocation(parameters) {
	var checkPass = true;
	var i = 0;
	for(i = 0; i < parameters.length; i++) {
		if(parameters[i].type === 'location') {
			var value = $('#' + parameters[i].id).val();
			if(value === undefined || value === 'select') {
				checkPass = false;
			}
		}
	}
	return checkPass;
}

function initParameterTab() {
	// Service template was not changed. Do not re-initiate the parameter tab.
    if (!templateParameters.changed) {
        return;
    }
    var templateId = $("#svcTempl").val();
    if ('select' === templateId) {
        document.getElementById("templateParameterTab").innerHTML = '';
        return;
    }
	$.when(
		fetchServiceTemplateBy(templateId)
	).then(
	    function(template) {
	    	if(template.serviceType === 'GSO') {
	    		return fetchGsoTemplateInputParameters(templateId);
	    	} else if(template.serviceType === 'NFVO') {
	    		return fetchNfvoTemplateInputParameters(templateId);
	    	} else if(template.serviceType === 'SDNO') {
	    		return fetchSdnoTemplateInputParameters(templateId);
	    	}
	    }
	).then(
	    function(parameters) {
	    	var components = transformToComponents(parameters);
	    	document.getElementById("templateParameterTab").innerHTML = components;
	    }
	);
}

function fetchServiceTemplateBy(templateId) {
    var defer = $.Deferred();
    var serviceTemplateUri = '/openoapi/catalog/v1/servicetemplates/' + templateId;
    var template = {};
    $.when(
        $.ajax({
            type: "GET",
            url: serviceTemplateUri,
            contentType: "application/json"
        })
    ).then(
        function(response) {
            template.name = response.templateName;
            template.gsarId = response.csarId;
            template.id = response.id;
            return fetchCsar(template.gsarId);
        }
    ).then(
        function(response) {
            if(response.type === 'GSAR') {
                template.serviceType = 'GSO';
            } else if(response.type === 'NSAR' || response.type === 'NFAR') {
                template.serviceType = 'NFVO';
            } else if(response.type === 'SSAR') {
                template.serviceType = "SDNO";
            }
            defer.resolve(template)
        }
    );
    return defer;
}

function fetchCsar(csarId) {
	var queryCsarUri = '/openoapi/catalog/v1/csars/' + csarId;
	return $.ajax({
		type: "GET",
		url: queryCsarUri,
		contentType: "application/json"
	});
}

function fetchGsoTemplateInputParameters(templateId) {
	var defer = $.Deferred();
    $.when(
        fetchTemplateParameterDefinitions(templateId),
        fetchGsoNestingTemplateParameters(templateId),
        fetchVimInfo()
    ).then(
        function (templateParameterResponse, nestingTempatesParas, vimInfoResponse) {
        	var inputParas = concat(templateParameterResponse[0].inputs, nestingTempatesParas);
        	var vims = translateToVimInfo(vimInfoResponse[0]);
            templateParameters = translateToTemplateParameters(inputParas, vims);
            defer.resolve(templateParameters);
        }
    );
    return defer;
}

function fetchGsoNestingTemplateParameters(templateId) {
	var defer = $.Deferred();
	$.when(
		fetchNodeTemplates(templateId)
	).then(
	    function(nodeTemplates) {
	    	var count = nodeTemplates.length;
	    	if(count ===0) {
	    		defer.resolve([]);
	    		return;
	    	}
	    	var nestingParasAggregatation = aggregate(count, function(nestingParas) {
	    		defer.resolve(nestingParas);
	    	});
	    	nodeTemplates.forEach(function(nodeTemplate) {
	    		var nestingNodeUri = '/openoapi/catalog/v1/servicetemplates/nesting?nodeTypeIds=' + nodeTemplate.type;
	    		$.when(
	    			$.ajax({
	    				type: "GET",
	    				url: nestingNodeUri
	    			})
	    		).then(
	    		    function(serviceTemplates) {
	    		    	var nodeAggregatation = aggregate(serviceTemplates.length, function(oneNodeParameters) {
	    		    		nestingParasAggregatation.notify(oneNodeParameters);
	    		    	});
	    		    	serviceTemplates.forEach(function(serviceTemplate) {
							if(serviceTemplate === null || serviceTemplate === undefined || serviceTemplate.inputs === undefined || serviceTemplate.csarId === undefined)
							{
								nodeAggregatation.notify([]);
								return;
							}
	    		    		var inputs = serviceTemplate.inputs.map(function(input) {
	    		    			input.name = nodeTemplate.type + '.' + input.name;
	    		    			return input;
	    		    		});
	    		    		$.when(
	    		    			fetchCsar(serviceTemplate.csarId)
	    		    		).then(
	    		    		    function(response) {
	    		    		    	if(response.type === 'NSAR' || response.type === 'NFAR') {
	    		    		    		inputs.push({
	    		    		    			name: nodeTemplate.type + '.location',
	    		    		    			type: 'location',
	    		    		    			description: nodeTemplate.name + ' Location',
	    		    		    			required: 'true'
	    		    		    		});
	    		    		    	}
	    		    		    	nodeAggregatation.notify(inputs);
	    		    		    }
	    		    		);
	    		    	});
	    		    }
	    		);
	    	});
	    }
	);
	return defer;
}

function fetchNodeTemplates(templateId) {
	var nodeTemplateUri = '/openoapi/catalog/v1/servicetemplates/'+ templateId +'/nodetemplates';
	return $.ajax({
		type: "GET",
		url: nodeTemplateUri
	});
}

function aggregate(n, deferFun) {
	var aggregation = $.Deferred();
	var count = n;
	var result = [];
	aggregation.progress(function(array) {
		pushAll(result, array);
		count--;
		if(count === 0) {
			deferFun(result);
		}
	});
	return aggregation;
}

function concat(array1, array2) {
	var result = [];
	pushAll(result, array1);
	pushAll(result, array2);
	return result;
}

function pushAll(acc, array) {
	var result = acc;
	array.forEach(function(element) {
		result.push(element)
	})
	return result;
}

function translateToTemplateParameters(inputs, vims) {
    var inputParameters = [];
    var i;
    for (i = 0; i < inputs.length; i += 1) {
        inputParameters[i] = {
            name: inputs[i].name,
            type: inputs[i].type,
            description: inputs[i].description,
            defaultValue: inputs[i].defaultValue,
            required: inputs[i].required,
            id: 'parameters_' + i,
            value: inputs[i].defaultValue || ''
        };
    }
    return {changed: false, parameters: inputParameters, vimInfos: vims};
}

function fetchNfvoTemplateInputParameters(templateId) {
	var defer = $.Deferred();
	$.when(
		fetchTemplateParameterDefinitions(templateId),
		fetchVimInfo()
	).then(
	    function (templateParameterResponse, vimInfoResponse) {
	    	var vims = translateToVimInfo(vimInfoResponse[0]);
	    	var inputParas = templateParameterResponse[0].inputs;
	    	inputParas.push({
	    		name: 'location',
	    		type: 'location',
	    		description: 'Location',
	    		required: 'true'
	    	});
	    	templateParameters = translateToTemplateParameters(inputParas, vims);
            defer.resolve(templateParameters);	
	    }
	);
	return defer;
}

function fetchSdnoTemplateInputParameters(templateId) {
	var defer = $.Deferred();
	$.when(
		fetchTemplateParameterDefinitions(templateId)
	).then(
	    function (templateParameterResponse) {
	    	templateParameters = translateToTemplateParameters(templateParameterResponse.inputs, []);
            defer.resolve(templateParameters);	
	    }
	);
	return defer;
}

function fetchTemplateParameterDefinitions(templateId) {
    var queryParametersUri = '/openoapi/catalog/v1/servicetemplates/' + templateId + '/parameters';
    return $.ajax({
        type: "GET",
        url: queryParametersUri
    });
}

function fetchVimInfo() {
    var vimQueryUri = '/openoapi/extsys/v1/vims';
    return $.ajax({
        type: "GET",
        url: vimQueryUri
    });
}

function translateToVimInfo(vims) {
	return vims.map(function (vim) {
		return {
			vimId: vim.vimId,
			vimName: vim.name
		};
	});
}

function transformToComponents(templateParas) {
	var inputs = templateParas.parameters;
	var vimInfos = templateParas.vimInfos;
	var components = '';
	inputs.forEach(function (inputPara) {
		if(inputPara.type === 'location') {
			components = components + generateLocationComponent(inputPara, vimInfos);
		} else {
			components = components + generateComponent(inputPara);
		}
	});
	return components;
}

function generateLocationComponent(inputPara, vimInfos) {
    var component = '<div class="form-group" style="margin-left:25px;margin-bottom:15px;">' +
        '<label class="col-sm-3 control-label">' +
        '<span>'+ inputPara.description +'</span>' +
        '<span class="required">*</span>' +
        '</label>' +
        '<div class="col-sm-7">' +
        '<select class="form-control" style ="padding-top: 0px;padding-bottom: 0px;"' +
        ' id="' + inputPara.id + '" name="vim_location">' +
        transformToOptions(vimInfos) +
        '</select></div></div>';
    return component;
}

function transformToOptions(vims) {
    var options = '<option value="select">--select--</option>';
    var i;
    for (i = 0; i < vims.length; i += 1) {
        var option = '<option value="' + vims[i].vimId + '">' + vims[i].vimName + '</option>';
        options = options + option;
    }
    return options;
}

function generateComponent(inputPara) {
	var component = '<div class="mT15 form-group" style="margin-left:25px;">' +
            '<label class="col-sm-3 control-label">' +
            '<span>' + inputPara.description + '</span>' + generateRequiredLabel(inputPara) +
            '</label>' +
            '<div class="col-sm-7">' +
            '<input type="text" id="' + inputPara.id + '" name="parameter description" class="form-control" placeholder="' +
            inputPara.description + '" value="' + inputPara.value + '" />' +
            '</div></div>';
    return component;
}

function generateRequiredLabel(parameter) {
    var requiredLabel = '';
    if (parameter.required === 'true') {
        requiredLabel = '<span class="required">*</span>';
    }
    return requiredLabel;
}

function createNetworkServiceInstance(template, serviceInstance, gatewayService) {
    if (template.serviceType === 'GSO') {
        return createGsoServiceInstance(gatewayService, serviceInstance, template);
    } else if (template.serviceType === 'NFVO') {
        return createNfvoServiceInstance(gatewayService, serviceInstance, template);
    } else if (template.serviceType === 'SDNO') {
        return createSdnoServiceInstance(gatewayService, serviceInstance);
    }
}

function createGsoServiceInstance(gatewayService, serviceInstance, serviceTemplate) {
    var defer = $.Deferred();
    var gsoLcmUri = '/openoapi/gso/v1/services';
    var parameter = {
    	'service': {
    		'name': serviceInstance.serviceName,
    		'description': serviceInstance.description,
    		'serviceDefId': serviceTemplate.gsarId,
    		'templateId': serviceInstance.serviceTemplateId,
    		'templateName': serviceTemplate.name,
    		'gatewayUri': gsoLcmUri,
    		'parameters': serviceInstance.inputParameters
    	}
    };
    $.when($.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter)
    })).then(function(response) {
        serviceInstance.serviceId = response.serviceId;
        defer.resolve(serviceInstance);
    });
    return defer;
}

function createNfvoServiceInstance(gatewayService, serviceInstance, template) {
    var nfvoLcmNsUri = '/openoapi/nslcm/v1/ns';
    serviceInstance.nsdId = template.id;
    return createServiceInstance(gatewayService, nfvoLcmNsUri, serviceInstance);
}

function createSdnoServiceInstance(gatewayService, serviceInstance) {
    var sdnoLcmNsUri = '/openoapi/sdnonslcm/v1/ns';
    serviceInstance.nsdId = serviceInstance.serviceTemplateId;
    return createServiceInstance(gatewayService, sdnoLcmNsUri, serviceInstance);
}

function createServiceInstance(gatewayService, nsUri, serviceInstance) {
    var defer = $.Deferred();
    var sParameter = {
        'nsdId': serviceInstance.nsdId,
        'nsName': serviceInstance.serviceName,
        'description': serviceInstance.description,
        'gatewayUri': nsUri
    };
    $.when($.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(sParameter)
    })).then(function(response) {
        var nsInstanceId = response.serviceId;
        serviceInstance.serviceId = nsInstanceId;
        var initNsUrl = nsUri + '/' + nsInstanceId + '/instantiate';
        var parameter = {
            'gatewayUri': initNsUrl,
            'nsInstanceId': nsInstanceId,
            'additionalParamForNs': serviceInstance.inputParameters
        };
        return $.ajax({
            type: "POST",
            url: gatewayService,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(parameter)
        });
    }).then(function() {
        defer.resolve(serviceInstance);
    });
    return defer;
}


function collectServiceParameters(parameters) {
    var serviceParameters = {};
    var i;
    for (i = 0; i < parameters.length; i += 1) {
    	var value = $('#' + parameters[i].id).val();
        serviceParameters[parameters[i].name] = value;
    }
    return serviceParameters;
}

function updateTable(serviceInstance) {
    serviceInstance.createTime = formatDate(new Date());
    $('#sai').bootstrapTable("append", serviceInstance);
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
}

function deleteNe(rowId, row) {
    var instanceId = row.serviceId;
    var serviceType = row.serviceType;
    var gatewayService = '/openoapi/servicegateway/v1/services/' + instanceId + '/terminate';
    var remove = function () {
        $('#sai').bootstrapTable('remove', {field: 'serviceId', values: [instanceId]});
    };
    if(serviceType === 'GSO') {
        deleteGsoServiceInstance(gatewayService, instanceId, remove)
    } else if (serviceType === 'NFVO') {
        var nfvoNsUri = '/openoapi/nslcm/v1/ns';
        deleteNonGsoServiceInstance(gatewayService, nfvoNsUri, instanceId, remove);
    } else if (serviceType === 'SDNO') {
        var sdnoNsUri = '/openoapi/sdnonslcm/v1/ns';
        deleteNonGsoServiceInstance(gatewayService, sdnoNsUri, instanceId, remove);
    }
}

function deleteGsoServiceInstance(gatewayService, instanceId, remove) {
    var gsoLcmUri = '/openoapi/gso/v1/services';
    $.when(
        deleteNetworkServiceInstance(gatewayService, gsoLcmUri, instanceId)
    ).then(
        function() {
            remove();
        }
    );
}

function deleteNonGsoServiceInstance(gatewayService, nsUri, instanceId, remove) {
    $.when(
        terminateNetworkServiceInstance(gatewayService, nsUri, instanceId)
    ).then(
        function() {
            return deleteNetworkServiceInstance(gatewayService, nsUri, instanceId);
        }
    ).then(
        function() {
            remove();
        }
    );
}

function deleteNetworkServiceInstance(gatewayService, nsUri, instanceId) {
    var instanceUri = nsUri + '/' + instanceId;
    var parameter = {
        'operation': "DELETE",
        'gatewayUri': instanceUri
    };
    return $.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter)
    });
}

function terminateNetworkServiceInstance(gatewayService, nsUri, instanceId) {
    var instanceUri = nsUri + '/' + instanceId;
    var nsTerminateUri = instanceUri + '/terminate';
    var terminateParameter = {
        'nsInstanceId': instanceId,
        'terminationType': "graceful",
        'gracefulTerminationTimeout': "60",
        'operation': "POST",
        'gatewayUri': nsTerminateUri
    };
    return $.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(terminateParameter)
    });
}
