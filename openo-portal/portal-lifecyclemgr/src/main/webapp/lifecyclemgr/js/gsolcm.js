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
            serviceParameters: collectServiceParameters(templateParameters.parameters),
            vimLocation: $('#vim_location').val()
        };
        var gatewayService = 'http://localhost:8080/openoapi/servicegateway/v1/services';
        $.when(
            fetchServiceTemplateBy(serviceInstance.serviceTemplateId)
        ).then(
            function(template) {
                serviceInstance.templateName = template.name;
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

function renderTemplateParametersTab() {
    $.when(
        fetchTemplateParameterDefinitions(templateParameters),
        fetchVimInfo()
    ).then(function(templateParameterResponse, vimsInfoResponse) {
        templateParameters = translateToTemplateParameters(templateParameterResponse[0].inputs);
        var vims = translateToVimInfo(vimsInfoResponse[0]);
        var components = transfromToComponents(templateParameters.parameters, vims);

		//TODO need to address the issue of the dynamic loading of parameter tab,,,
     //   document.getElementById("parameterTab").innerHTML = components;
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

function fetchServiceTemplateBy(templateId) {
    var defer = $.Deferred();
    var serviceTemplateUri = 'http://localhost:8080/openoapi/catalog/v1/servicetemplates/' + templateId;
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
            var queryCsarUri = 'http://localhost:8080/openoapi/catalog/v1/csars/' + template.gsarId;
            return $.ajax({
                type: "GET",
                url: queryCsarUri,
                contentType: "application/json"
            });
        }
    ).then(
        function(response) {
            template.csarType = response.type;
            defer.resolve(template)
        }
    );
    return defer;
}

function createNetworkServiceInstance(template, serviceInstance, gatewayService) {
    if (template.csarType === 'GSAR') {
        return createGsoServiceInstance(gatewayService, serviceInstance, template);
    } else if (template.csarType === 'NSAR' || template.csarType === 'NFAR') {
        return createNfvoServiceInstance(gatewayService, serviceInstance);
    } else if (template.csarType === 'SSAR') {
        return createSdnoServiceInstance(gatewayService, serviceInstance);
    }
}

function createGsoServiceInstance(gatewayService, serviceInstance, serviceTemplate) {
    var defer = $.Deferred();
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
    $.when($.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(parameter)
    })).then(function(response) {
        serviceInstance.serviceInstanceId = response.serviceId;
        defer.resolve(serviceInstance);
    })
    return defer;
}

function createNfvoServiceInstance(gatewayService, serviceInstance) {
    var nfvoLcmNsUrl = '/openoapi/nslcm/v1.0/ns';
    serviceInstance.serviceParameters.location = serviceInstance.vimLocation;
    return createServiceInstance(gatewayService, nfvoLcmNsUrl, serviceInstance);
}

function createSdnoServiceInstance(gatewayService, serviceInstance) {
    var sdnoLcmNsUrl = '/openoapi/sdnonslcm/v1.0/ns';
    return createServiceInstance(gatewayService, sdnoLcmNsUrl, serviceInstance);
}

function createServiceInstance(gatewayService, nsUri, serviceInstance) {
    var defer = $.Deferred();
    var sParameter = {
        'nsdId': serviceInstance.serviceTemplateId,
        'nsName': serviceInstance.serviceName,
        'description': serviceInstance.serviceDescription,
        'gatewayUri': nsUri
    };
    $.when($.ajax({
        type: "POST",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(sParameter)
    })).then(function(response) {
        var nsInstanceId = response[0].nsInstanceId;
        var initNsUrl = nsUri + '/' + nsInstanceId + '/Instantiate'
        var parameter = {
            'gatewayUri': initNsUrl,
            'nsInstanceId': nsInstanceId,
            'additionalParamForNs': serviceInstance.serviceParameters
        };
        return $.ajax({
            type: "POST",
            url: gatewayService,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(parameter)
        });
    }).then(function(response) {
        defer.resolve(serviceInstance);
    });
    return defer;
}


function collectServiceParameters(parameters) {
    var serviceParameters = {};
    var i;
    for (i = 0; i < parameters.length; i += 1) {
        serviceParameters[parameters[i].name] = $('#' + parameters[i].id).val();
    }
    return serviceParameters;
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

        var gatewayService = 'http://localhost:8080/openoapi/servicegateway/v1/services';
        $.when(
            fetchServiceTemplateBy(templateId)
        ).then(
            function(template) {
                if (template.csarType === 'GSAR') {
                    return deleteGsoServiceInstance(gatewayService, instanceId);
                } else if (template.csarType === 'NSAR' || serviceTemplate.csarType === 'NFAR') {
                    var nfvoNsUri = '/openoapi/nslcm/v1.0/ns';
                    return deleteServiceInstance(gatewayService, nfvoNsUri, instanceId);
                } else if (template.csarType === 'SSAR') {
                    var sdnoNsUri = '/openoapi/sdnonslcm/v1.0/ns';
                    return deleteServiceInstance(gatewayService, sdnoNsUri, instanceId);
                }
            }
        ).then(
            function() {
                trElement.remove();
            }
        );
    });
}

function deleteGsoServiceInstance(gatewayService, instanceId) {
    var defer = $.Deferred();
    var gsoLcmUri = '/openoapi/lifecyclemgr/v1/services';
    $.when(
        deleteNetworkServiceInstance(gatewayService, gsoLcmUri, instanceId);
    ).then(
        function(response) {
        defer.resolve();
    });
    return defer;
}

function deleteServiceInstance(gatewayService, nsUri, instanceId) {
    var defer = $.Deferred();
    $.when(
        terminateNetworkServiceInstance(gatewayService, nsUri, instanceId)
    ).then(
        function(response) {
            return deleteNetworkServiceInstance(gatewayService, nsUri, instanceId);
        }
    ).then(
        function(response) {
            defer.resolve();
        }
    )
    return defer;
}

function deleteNetworkServiceInstance(gatewayService, nsUri, instanceId) {
    var instanceUri = nsUri + '/' + instanceId;
    var parameter = {
        'operation': "DELETE",
        'gatewayUri': instanceUri
    };
    return $.ajax({
        type: "DELETE",
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
        type: "DELETE",
        url: gatewayService,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(terminateParameter)
    });
}
