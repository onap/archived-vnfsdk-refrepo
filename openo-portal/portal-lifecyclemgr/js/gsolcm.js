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
var templateParameters = {
  templateName: '',
  parameters: []
};

var service_instance_insert_index = 0;

var lcmHandler = function(){
  this._addOwnEvents();
};

lcmHandler.prototype = {
  _addOwnEvents : function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', this.beforeParameterTabShow);
    $('#createNS').click(this.okAction);
  },
  beforeParameterTabShow : function (event) {
    renderTemplateParametersTab();
  },
  okAction : function (event) {
    var serviceInstance = {
      serviceTemplateId: $('#svcTempl').val(),
      serviceName: $('#svcName').val(),
      serviceDescription: $('#svcDesc').val(),
      serviceParameters: collectServiceParameters(templateParameters)
    }
    var s1ServiceUrl = '/openoapi/servicegateway/v1/services';
    var serviceTemplate = fetchServiceTemplateBy(serviceInstance.serviceTemplateId);
    if(serviceTemplate === undefined) {
      return;
    }
    if(serviceTemplate.csarType === 'GSAR') {
      serviceInstance.serviceInstanceId = createGsoServiceInstance(s1ServiceUrl, serviceInstance);
    }else if(serviceTemplate.csarType === 'NSAR' || serviceTemplate.csarType === 'NFAR') {
      serviceInstance.serviceInstanceId = createNfvoServiceInstance(s1ServiceUrl, serviceInstance);
    }else if(serviceTemplate.csarType === 'SSAR') {
      serviceInstance.serviceInstanceId = createSdnoServiceInstance(s1ServiceUrl, serviceInstance);
    }
    if(serviceInstance.serviceInstanceId === undefined) {
      return;
    }
    updateTable(serviceInstance);
  }
};

function collectServiceParameters(parameters) {
  var serviceParameters = {};
  var i;
  for( i = 0; i < parameters.length; i += 1) {
    serviceParameters[parameters.name] = $('#' + parameters[i].id).val();
  }
  return serviceParameters;
}

function fetchServiceTemplateBy(templateId) {
  var serviceTemplateUri = '/openoapi/catalog/v1/servicetemplates/'+ templateId;
  var template;
  $.ajax({
    type : "GET",
    async: false,
    url : serviceTemplateUri,
    contentType : "application/json",
    dataType : "json",
    success : function(jsonResp) {
      template = {
        name: jsonResp.templateName,
        gsarId: jsonResp.csarId
      }
    },
    error : function(xhr, ajaxOptions, thrownError) {
      alert("Error on page : " + xhr.responseText);
    }
  });
  if(template === undefined) {
    return template;
  }
  var queryCsarUri = '/openoapi/catalog/v1/csars/' + template.gsarId;
  $.ajax({
    type : "GET",
    async: false,
    url : queryCsarUri,
    contentType : "application/json",
    dataType : "json",
    success : function(jsonResp) {
      template.csarType = jsonResp.type
    },
    error : function(xhr, ajaxOptions, thrownError) {
      alert("Error on page : " + xhr.responseText);
    }
  });
  return template;
}

function renderTemplateParametersTab() {
  templateParameters = fetchTemplateParameterDefinitions(templateParameters);
  var components = transfromToComponents(templateParameters.parameters);
  document.getElementById("parameterTab").innerHTML = components;
}

function fetchTemplateParameterDefinitions(parameters) {
  var serviceTemplate = parameters.templateName;
  var currentServiceTemplate = $("#svcTempl").val();
  // Do not need to fetch template parameters if template do not change in UI.
  if(serviceTemplate === currentServiceTemplate) {
    return;
  }
  var queryParametersUri = '/openoapi/catalog/v1/servicetemplates/' + currentServiceTemplate + '/parameters';
  var inputParameters = [];
  $.ajax({
    type : "GET",
    async: false,
    url : queryParametersUri,
    contentType : "application/json",
    dataType : "json",
    success : function(jsonResp) {
      var inputs = jsonResp.inputs;
      var i;
      for( i = 0; i < inputs.length; i += 1) {
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
    },
    error : function(xhr, ajaxOptions, thrownError) {
      alert("Error on page : " + xhr.responseText);
    }
  });
  return { name: currentServiceTemplate, parameters: inputParameters };
}

function transfromToComponents(parameters) {
  var components = '';
  var i;
  for( i = 0; i < parameters.length; i += 1) {
    var component = '<div class="form-group">' +
      '<label class="col-sm-3 control-label">' +
        '<span>' + parameters[i].description + '</span>' + generateRequiredLabel(parameters[i]) +
      '</label>' +
      '<div class="col-sm-7">' +
        '<input type="text" id="'+ parameters[i].id +'" name="parameter description" class="form-control" placeholder="' +
              parameters[i].description + '" value="'+ parameters[i].value +'" />' +
      '</div></div>';
    components = components + component;
  }
  return components;
}

function generateRequiredLabel(parameter) {
  var requiredLabel = '';
  if(parameter.required === 'true') {
    requiredLabel = '<span class="required">*</span>';
  }
  return requiredLabel;
}

function createGsoServiceInstance(s1ServiceUrl, serviceInstance) {
  var gsoLcmUri = '/openoapi/lifecyclemgr/v1/services';
  var parameter = {
    'name': serviceInstance.serviceName,
    'description': serviceInstance.serviceDescription,
    'serviceDefId': serviceTemplate.gsarId,
    'templatedId': serviceInstance.serviceTemplateId,
    'templateName': serviceTemplate.templateName,
    'getewayUri': gsoLcmUrl,
    'parameters': serviceInstance.serviceParameters
  };
  var serviceInstanceId;
  $.ajax({
    type : "POST",
    async: false,
    url : s1ServiceUrl,
    contentType : "application/json",
    dataType : "json",
    data : JSON.stringify(parameter),
    success : function(jsonResp) {
      if(jsonResp.result.errorCode != '200') {
        alert("Create service instance Error!");
        return;
      }
      serviceInstanceId = jsonResp.serviceId;
    },
    error : function(xhr, ajaxOptions, thrownError) {
      alert("Error on page : " + xhr.responseText);
    }
  });
  return serviceInstanceId;
}

function createNfvoServiceInstance(s1ServiceUrl, serviceInstance) {
  var nfvoLcmNsUrl = '/openoapi/nslcm/v1.0/ns';
  createServiceInstance(s1ServiceUrl, nfvoLcmNsUrl, serviceInstance);
}

function createServiceInstance(s1ServiceUrl, gatewayUri, serviceInstance) {
  var nsInstanceId = createNetworkService(s1ServiceUrl, gatewayUri, serviceInstance);
  if(nsInstanceId === undefined) {
    return;
  }
  instantiateNetworkService(gatewayUri, nsInstanceId, serviceInstance);
}

function createNetworkService(s1ServiceUrl, gatewayUri, serviceInstance) {
  var parameter = {
    'nsdId': serviceInstance.serviceTemplateId,
    'nsName': serviceInstance.serviceName,
    'description': serviceInstance.serviceDescription,
    'gatewayUri': gatewayUri,
    'parameters': serviceInstance.serviceParameters
  };
  var nsInstanceId;
  $.ajax({
    type : "POST",
    async: false,
    url : s1ServiceUrl,
    contentType : "application/json",
    dataType : "json",
    data : JSON.stringify(parameter),
    success : function(jsonResp) {
      nsInstanceId = jsonResp.nsInstanceId;
    },
    error : function(xhr, ajaxOptions, thrownError) {
      alert("Error on page : " + xhr.responseText);
    }
  });
  return nsInstanceId;
}

function instantiateNetworkService(gatewayUri, nsInstanceId, serviceInstance) {
  var initNsUrl = gatewayUri + '/' + nsInstanceId + '/Instantiate'
  var parameter = {
    'gatewayUri': initNsUrl,
    'nsInstanceId': nsInstanceId,
    'additionalParamForNs': serviceInstance.serviceParameters
  };
  var result = false;
  $.ajax({
    type : "POST",
    async: false,
    url : s1ServiceUrl,
    contentType : "application/json",
    dataType : "json",
    data : JSON.stringify(parameter),
    success : function(jsonResp) {
      result = true;
    },
    error : function(xhr, ajaxOptions, thrownError) {
      alert("Error on page : " + xhr.responseText);
    }
  });
  return result;
}

function createSdnoServiceInstance(s1ServiceUrl, serviceInstance) {
  var sdnoLcmNsUrl = '/openoapi/sdnonslcm/v1.0/ns';
  createServiceInstance(s1ServiceUrl, sdnoLcmNsUrl, serviceInstance);
}

function updateTable(serviceInstance) {
  appendOenRow();
  addDeleteEventRegistration();
}

function appendOenRow() {
  var index = service_instance_insert_index;
  var creator = '';
  $('#sai').append('<tr id="service_instance_' + index + '"></tr>');
  $("#service_instance_" + index).html('<td><div class="DataTables_sort_wrapper openo-ellipsis "><span id="service_name" class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">'+ serviceInstance.serviceName + '</span></td>' +
    '<td><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">'+ serviceInstance.templateName + '</span></td>' +
    '<td class="service_template_id"><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">'+ serviceInstance.serviceTemplateId + '</span><input type="hidden" value="'+serviceInstance.serviceInstanceId+'"/></td>' +
    '<td><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">'+ formatDate(new Date()) + '</span></td>' +
    '<td><span class="openo-table-th-sorticon overflow_elip  leftHeaderAlign  openo-table-disable-element ">'+ creator + '</span></td>' +
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
  $(".data_delete_action").click(function(event) {
    var trElement = $(this).parents("tr")[0];
    var tdElement = $(trElement).children("td.service_template_id")[0];
    var spanElement = $(tdElement).children("span")[0];
    var templateId = $(spanElement).text();
    var inputElement = $(tdElement).children("input")[0];
    var instanceId = $(inputElement).val();
    var result = deleteServiceInstance(templateId, instanceId);
    if(result) {
      trElement.remove();
      alert("Service instance deleted successfully!");
    }
  });
}

function deleteServiceInstance(templateId, instanceId) {
    var serviceTemplate = fetchServiceTemplateBy(templateId);
    if(serviceTemplate === undefined) {
        return;
    }
    var s1ServiceUrl = '/openoapi/servicegateway/v1/services';
    var result = false;
    if(serviceTemplate.csarType === 'GSAR') {
        result = deleteGsoServiceInstance(s1ServiceUrl, instanceId);
    }else if(serviceTemplate.csarType === 'NSAR' || serviceTemplate.csarType === 'NFAR') {
        result = deleteNfvoServiceInstance(s1ServiceUrl, instanceId);
    }else if(serviceTemplate.csarType === 'SSAR') {
        result = deleteSdnoServiceInstance(s1ServiceUrl, instanceId);
    }
    return result;
}

function deleteGsoServiceInstance(s1ServiceUrl, instanceId) {
    var gsoLcmUrl = '/openoapi/lifecyclemgr/v1/services/'+ instanceId;
    return sendDeleteRequest(s1ServiceUrl, gsoLcmUrl);
}

function deleteNfvoServiceInstance(s1ServiceUrl, instanceId) {
    var nfvoNsUrl = '/openoapi/nslcm/v1.0/ns/' + instanceId;
    var nfvoNsTerminateUrl = nfvoNsUrl +'/terminate';
    var result = sendDeleteRequest(s1ServiceUrl, nfvoNsTerminateUrl);
    if(result) {
        result = sendDeleteRequest(s1ServiceUrl, nfvoNsUrl);
    }
    return result;
}

function deleteSdnoServiceInstance(s1ServiceUrl, instanceId) {
    var sdnoNsUrl = '/openoapi/sdnonslcm/v1.0/ns/' + instanceId;
    var sdnoNsTerminateUrl = sdnoNsUrl + '/terminate';
    var result = sendDeleteRequest(s1ServiceUrl, sdnoNsTerminateUrl);
    if(result) {
        result = sendDeleteRequest(s1ServiceUrl, sdnoNsUrl);
    }
    return result;
}

function sendDeleteRequest(s1ServiceUrl, url) {
    var parameter = {
        URL: url
    };
    var result = false;
    $.ajax({
        type : "DELETE",
        async: false,
        url : s1ServiceUrl,
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(parameter),
        success : function(jsonResp) {
            result = true;
        },
        error : function(xhr, ajaxOptions, thrownError) {
            alert("Error on page : " + xhr.responseText);
        }
    });
    return result;
}
