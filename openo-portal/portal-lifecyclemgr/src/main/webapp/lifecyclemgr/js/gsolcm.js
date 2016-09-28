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
    templateName: '',
    parameters: []
};

var service_instance_insert_index = 0;

var lcmHandler = function () {
    this._addOwnEvents();
};

lcmHandler.prototype = {
    _addOwnEvents: function () {
        $('a[data-toggle="tab"]').on('show.bs.tab', this.beforeParameterTabShow);
        $('#createNS').click(this.okAction);
    },
    beforeParameterTabShow: function (event) {
        renderTemplateParametersTab();
    },
    okAction: function (event) {
        var serviceInstance = {
            serviceTemplateId: $('#svcTempl').val(),
            serviceName: $('#svcName').val(),
            serviceDescription: $('#svcDesc').val(),
            serviceParameters: collectServiceParameters(templateParameters),
            vimLocation: $('#vim_location').val()
        }
        var gatewayService = 'http://localhost:8080/openoapi/servicegateway/v1/services';
        var serviceTemplate = fetchServiceTemplateBy(serviceInstance.serviceTemplateId);
        if (serviceTemplate === undefined) {
            return;
        }
        serviceInstance.templateName = serviceTemplate.name;
        if (serviceTemplate.csarType === 'GSAR') {
            serviceInstance.serviceInstanceId = createGsoServiceInstance(gatewayService, serviceInstance, serviceTemplate);
        } else if (serviceTemplate.csarType === 'NSAR' || serviceTemplate.csarType === 'NFAR') {
            serviceInstance.serviceInstanceId = createNfvoServiceInstance(gatewayService, serviceInstance);
        } else if (serviceTemplate.csarType === 'SSAR') {
            serviceInstance.serviceInstanceId = createSdnoServiceInstance(gatewayService, serviceInstance);
        }
        if (serviceInstance.serviceInstanceId === undefined) {
            return;
        }
        updateTable(serviceInstance);
        $('#vmAppDialog').removeClass('in').css('display', 'none');
    }
};

function collectServiceParameters(parameters) {
    var serviceParameters = {};
    var i;
    for (i = 0; i < parameters.length; i += 1) {
        serviceParameters[parameters.name] = $('#' + parameters[i].id).val();
    }
    return serviceParameters;
}

function fetchServiceTemplateBy(templateId) {
    var serviceTemplateUri = 'http://localhost:8080/openoapi/catalog/v1/servicetemplates/' + templateId;
    var template;
    $.ajax({
        type: "GET",
        async: false,
        url: serviceTemplateUri,
        contentType: "application/json",
        dataType: "json",
        success: function (jsonResp) {
            template = {
                name: jsonResp.templateName,
                gsarId: jsonResp.csarId
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    if (template === undefined) {
        return template;
    }
    var queryCsarUri = 'http://localhost:8080/openoapi/catalog/v1/csars/' + template.gsarId;
    $.ajax({
        type: "GET",
        async: false,
        url: queryCsarUri,
        contentType: "application/json",
        dataType: "json",
        success: function (jsonResp) {
            template.csarType = jsonResp.type
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    return template;
}

function renderTemplateParametersTab() {
    $.when(
        fetchTemplateParameterDefinitions(templateParameters),
        fetchVimInfo()
    ).then(function(templateParameterResponse, vimsInfoResponse) {
        templateParameters = translateToTemplateParameters(templateParameterResponse[0].inputs);
        var vims = translateToVimInfo(vimsInfoResponse[0]);
        var components = transfromToComponents(templateParameters.parameters, vims);
        document.getElementById("parameterTab").innerHTML = components;
    });
}

function fetchTemplateParameterDefinitions(parameters) {
    var currentServiceTemplate = $("#svcTempl").val();
    var queryParametersUri = 'http://localhost:8080/openoapi/catalog/v1/servicetemplates/' + currentServiceTemplate + '/parameters';
    return $.ajax({
        type: "GET",
        url: queryParametersUri
    });
}

function fetchVimInfo() {
    var vimQueryUri = 'http://localhost:8080/openoapi/extsys/v1/vims';
    return $.ajax({
        type: "GET",
        url: vimQueryUri
    });
}

function translateToTemplateParameters(inputs) {
    var inputParameters = [];
    var i;
    for (i = 0; i < inputs.length; i += 1) {
        inputParameters[i] = {
            name: inputs[i].name,
            type: inputs[i].type,
            description: inputs[i].description,
            defaultValue: inputs[i].defaultValue,
            required: inputs[i].required,
            id: 'parameter_' + i,
            value: inputs[i].defaultValue
        };
    }
    return {name: $("#svcTempl").val(), parameters: inputParameters};
}

function translateToVimInfo(vims) {
    var result = [];
    var i;
    for (i = 0; i < vims.length; i += 1) {
        var option = '<option value="' + vims[i].vimId + '">' + vims[i].name + '</option>';
        result[i] = {
            vimId: vims[i].vimId,
            vimName: vims[i].name
        }
    }
    return result;
}

function transfromToComponents(parameters, vims) {
    var components = '';
    var i;
    for (i = 0; i < parameters.length; i += 1) {
        var component = '<div class="form-group">' +
            '<label class="col-sm-3 control-label">' +
            '<span>' + parameters[i].description + '</span>' + generateRequiredLabel(parameters[i]) +
            '</label>' +
            '<div class="col-sm-7">' +
            '<input type="text" id="' + parameters[i].id + '" name="parameter description" class="form-control" placeholder="' +
            parameters[i].description + '" value="' + parameters[i].value + '" />' +
            '</div></div>';
        components = components + component;
    }
    components = components + generateLocationComponent(vims);
    return components;
}

function generateRequiredLabel(parameter) {
    var requiredLabel = '';
    if (parameter.required === 'true') {
        requiredLabel = '<span class="required">*</span>';
    }
    return requiredLabel;
}

function generateLocationComponent(vims) {
    var component = '<div class="form-group">' +
        '<label class="col-sm-3 control-label">' +
        '<span>Location</span>' +
        '<span class="required">*</span>' +
        '</label>' +
        '<div class="col-sm-7">' +
        '<select class="form-control" style ="padding-top: 0px;padding-bottom: 0px;"' +
        ' id="vim_location" name="vim_location">' +
        transformToOptions(vims) +
        '</select></div></div>';
    return component;
}

function transformToOptions(vims) {
    var options = '';
    var i;
    for (i = 0; i < vims.length; i += 1) {
        var option = '<option value="' + vims[i].vimId + '">' + vims[i].vimName + '</option>';
        options = options + option;
    }
    return options;
}

function createGsoServiceInstance(gatewayService, serviceInstance, serviceTemplate) {
    serviceInstance.serviceParameters.location = serviceInstance.vimLocation;
    var gsoLcmUri = '/openoapi/lifecyclemgr/v1/services';
    var parameter = {
        'name': serviceInstance.serviceName,
        'description': serviceInstance.serviceDescription,
        'serviceDefId': serviceTemplate.gsarId,
        'templatedId': serviceInstance.serviceTemplateId,
        'templateName': serviceTemplate.templateName,
        'getewayUri': gsoLcmUri,
        'parameters': serviceInstance.serviceParameters
    };
    var serviceInstanceId;
    $.ajax({
        type: "POST",
        async: false,
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter),
        success: function (jsonResp) {
            if (jsonResp.result.errorCode != '200') {
                alert("Create service instance Error!");
                return;
            }
            serviceInstanceId = jsonResp.serviceId;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    return serviceInstanceId;
}

function createNfvoServiceInstance(gatewayService, serviceInstance) {
    var nfvoLcmNsUrl = '/openoapi/nslcm/v1.0/ns';
    serviceInstance.serviceParameters.location = serviceInstance.vimLocation;
    return createServiceInstance(gatewayService, nfvoLcmNsUrl, serviceInstance);
}

function createServiceInstance(gatewayService, nsUri, serviceInstance) {
    var nsInstanceId = createNetworkService(gatewayService, nsUri, serviceInstance);
    if (nsInstanceId === undefined) {
        return;
    }
    instantiateNetworkService(gatewayService, nsUri,nsInstanceId, serviceInstance);
    return nsInstanceId;
}

function createNetworkService(gatewayService, nsUrl, serviceInstance) {
    var parameter = {
        'nsdId': serviceInstance.serviceTemplateId,
        'nsName': serviceInstance.serviceName,
        'description': serviceInstance.serviceDescription,
        'gatewayUri': nsUrl
    };
    var nsInstanceId;
    $.ajax({
        type: "POST",
        async: false,
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter),
        success: function (jsonResp) {
            nsInstanceId = jsonResp.nsInstanceId;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    return nsInstanceId;
}

function instantiateNetworkService(gatewayService, nsUri, nsInstanceId, serviceInstance) {
    var initNsUrl = nsUri + '/' + nsInstanceId + '/Instantiate'
    var parameter = {
        'gatewayUri': initNsUrl,
        'nsInstanceId': nsInstanceId,
        'additionalParamForNs': serviceInstance.serviceParameters
    };
    var result = false;
    $.ajax({
        type: "POST",
        async: false,
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter),
        success: function (jsonResp) {
            result = true;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    return result;
}

function createSdnoServiceInstance(gatewayService, serviceInstance) {
    var sdnoLcmNsUrl = '/openoapi/sdnonslcm/v1.0/ns';
    return createServiceInstance(gatewayService, sdnoLcmNsUrl, serviceInstance);
}

function updateTable(serviceInstance) {
    appendOenRow(serviceInstance);
    addDeleteEventRegistration();
}

function appendOenRow(serviceInstance) {
    var index = service_instance_insert_index;
    var creator = '';
    $('#sai').append('<tr id="service_instance_' + index + '"></tr>');
    $("#service_instance_" + index).html('<td><div class="DataTables_sort_wrapper openo-ellipsis "><span id="service_name" class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">' + serviceInstance.serviceName + '</span></td>' +
        '<td><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">' + serviceInstance.templateName + '</span></td>' +
        '<td class="service_template_id"><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">' + serviceInstance.serviceTemplateId + '</span><input type="hidden" value="' + serviceInstance.serviceInstanceId + '"/></td>' +
        '<td><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">' + formatDate(new Date()) + '</span></td>' +
        '<td><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">' + creator + '</span></td>' +
        '<td><button class="data_delete_action"><img id="delete_action" class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element " src="images/delete.png"></img></button></td>');
    service_instance_insert_index += 1;
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

function addDeleteEventRegistration() {
    $(".data_delete_action").click(function (event) {
        var trElement = $(this).parents("tr")[0];
        var tdElement = $(trElement).children("td.service_template_id")[0];
        var spanElement = $(tdElement).children("span")[0];
        var templateId = $(spanElement).text();
        var inputElement = $(tdElement).children("input")[0];
        var instanceId = $(inputElement).val();
        var result = deleteServiceInstance(templateId, instanceId);
        if (result) {
            trElement.remove();
            alert("Service instance deleted successfully!");
        }
    });
}

function deleteServiceInstance(templateId, instanceId) {
    var serviceTemplate = fetchServiceTemplateBy(templateId);
    if (serviceTemplate === undefined) {
        return;
    }
    var gatewayService = '/openoapi/servicegateway/v1/services';
    var result = false;
    if (serviceTemplate.csarType === 'GSAR') {
        result = deleteGsoServiceInstance(gatewayService, instanceId);
    } else if (serviceTemplate.csarType === 'NSAR' || serviceTemplate.csarType === 'NFAR') {
        result = deleteNfvoServiceInstance(gatewayService, instanceId);
    } else if (serviceTemplate.csarType === 'SSAR') {
        result = deleteSdnoServiceInstance(gatewayService, instanceId);
    }
    return result;
}

function deleteGsoServiceInstance(gatewayService, instanceId) {
    var gsoLcmUrl = '/openoapi/lifecyclemgr/v1/services/' + instanceId;
    var operation = 'DELETE';
    return sendDeleteRequest(operation, gatewayService, gsoLcmUrl);
}

function deleteNfvoServiceInstance(gatewayService, instanceId) {
    var nfvoNsUrl = '/openoapi/nslcm/v1.0/ns/' + instanceId;
    var nfvoNsTerminateUrl = nfvoNsUrl + '/terminate';
    var terminateParameter = {
        'nsInstanceId': instanceId,
        'terminationType': "graceful",
        'gracefulTerminationTimeout': "60",
        'operation': "POST",
        'gatewayUri': nfvoNsTerminateUrl
    };
    var result = sendRequest(gatewayService, terminateParameter);
    if (result) {
        var serviceParameter = {
            'operation': "DELETE",
            'gatewayUri': nfvoNsUrl
        };
        result = sendRequest(gatewayService, serviceParameter);
    }
    return result;
}

function deleteSdnoServiceInstance(gatewayService, instanceId) {
    var sdnoNsUrl = '/openoapi/sdnonslcm/v1.0/ns/' + instanceId;
    var sdnoNsTerminateUrl = sdnoNsUrl + '/terminate';
    var terminateParameter = {
        'nsInstanceId': instanceId,
        'terminationType': "graceful",
        'gracefulTerminationTimeout': "60",
        'operation': "POST",
        'gatewayUri': sdnoNsTerminateUrl
    };
    var result = sendDeleteRequest(gatewayService, terminateParameter);
    if (result) {
        var serviceParameter = {
            'operation': "DELETE",
            'gatewayUri': sdnoNsUrl
        };
        result = sendDeleteRequest(gatewayService, serviceParameter);
    }
    return result;
}

function sendDeleteRequest(gatewayService, parameter) {
    var result = false;
    $.ajax({
        type: "DELETE",
        async: false,
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter),
        success: function (jsonResp) {
            result = true;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    return result;
}
