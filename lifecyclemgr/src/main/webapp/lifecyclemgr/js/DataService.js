/*

    Copyright 2017, Huawei Technologies Co., Ltd.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

app.factory("DataService", function($http, $log){
    var lcData = null;
    var overLayData = null;
    var createParamJsonObj = {
        templateId:'',
        parameters: {}
    };
    var url = "";
    var tableDataLoaded = false;
    
    return {
        setTableDataLoaded : function() {
            tableDataLoaded = true;
        },
        getTableDataLoaded : function() {
            return tableDataLoaded;
        },
        getCreateParamJsonObj: function(){
            return createParamJsonObj;
        },
        loadGetServiceData : function() {

            //load main Table
            return $http({
                url: url+'/openoapi/servicegateway/v1/services',
                //url: 'http://localhost:5000/api/getLCData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}

                /*url: '/openoapi/inventory/v1/services',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify({'sort': [],
                 'pagination': 0,
                 'pagesize': 10000,
                 'condition': {},
                 'serviceId': ""})*/
            }).then(function(response){
                //$log.info(response);
                lcData = response.data;
                return response;
            });
        },
        getSavedLCData : function(id){
            var returnData = null;
            if(lcData) {
                for (var i = 0; i < lcData.length; i++) {
                    if(lcData[i].serviceId == id) {
                        returnData = lcData[i];
                        break;
                    }
                }
                return returnData;
            }
            else
                return null;
        },
        getOverlayData : function(id) {
            return $http({
                url: url+'/openoapi/sdnooverlay/v1/vpns/' + id,
                //url: 'http://localhost:5000/api/getOverlayVPNData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                overLayData = response.data;
                return response.data;
            });
        },
        getOverlayVPNConnData : function(id, type){
            var returnData = null;
            if(overLayData) {
                return overLayData[type];
            }
            else
                return [];
        },
        getSiteListData : function() {
            return $http({
                url: url+'/openoapi/sdnobrs/v1/sites',
                //url: 'http://localhost:5000/api/getOverlayVPNData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                if(overLayData) {
                    var sites = [];
                    var index = 0;
                    for(var i = 0 ; i < response.data.length; i++){
                        var isContains = false;
                        for(var j = 0; j < overLayData.siteList.length; j++){
                            if(response.data[i].id == overLayData.siteList[j]){
                                isContains = true;
                            }
                        }
                        if(isContains){
                            sites[index] = response.data[i];
                            index ++;
                        }
                    }
                    return sites;
                }
                else {
                    return [];
                }
            });
        },
        getVpcListData : function() {
            return $http({
                url: url+'/openoapi/sdnovpc/v1/vpcs',
                //url: 'http://localhost:5000/api/getOverlayVPNData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                if(overLayData) {
                    var vpcs = [];
                    var index = 0;
                    for(var i = 0 ; i < response.data.length; i++){
                        var isContains = false;
                        for(var j = 0; j < overLayData.vpcList.length; j++){
                            if(response.data[i].id == overLayData.vpcList[j]){
                                isContains = true;
                            }
                        }
                        if(isContains){
                            vpcs[index] = response.data[i];
                            index ++;
                        }
                    }
                    return vpcs;
                }
                else {
                    return [];
                }
            });
        },
        getUnderlayData : function(id) {
            return $http({
                url: url+'/openoapi/sdnol3vpn/v1/l3vpns/' + id,
                //url: 'http://localhost:5000/api/getUnderlayVPNData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                underlayData = response.data;
                return response.data;
            });
        },
	getTPLinkData : function(){
            var returnData = null;
            if(underlayData) {                
                return underlayData.accessPointList;
            }
            else
                return [];
        },
        loadServiceTopoSequence : function(id) {
            return $http({
                url: url+'/openoapi/gso/v1/services/toposequence/' + id,
                //url: 'http://localhost:5000/api/getOverlayVPNData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                var serviceToposequence = response.data;
                var responseData = [];
                for (var i = 0; i < serviceToposequence.service.segments.length; i++) {
                    var segment = serviceToposequence.service.segments[i];
                    responseData[i] = {"id":segment.serviceSegmentId, "name":segment.serviceSegmentType};
                }
                return responseData;
            });
            //return JSON.parse('[{"id":"12345", "name":"sdno"}, {"id":"23456", "name":"gso"},{"id":"12345", "name":"nfvo"}]');
        },
        loadNfvoServiceDetails : function(id) {
            return JSON.parse('{"vnfInfoId": [{ "vnfInstanceId": "123", "vnfInstanceName": "vnf instance 1", "vnfProfileId": "321" }, { "vnfInstanceId": "123", "vnfInstanceName": "vnf instance 1", "vnfProfileId": "321" }],  "vlInfo": [{ "networkResource": {"resourceName": "network resource 1"}, "linkPortResource": { "resourceName": "link port resource 1"}}, { "networkResource": {"resourceName": "network resource 1"}, "linkPortResource": { "resourceName": "link port resource 1"}}], "vnffgInfo": [{"vnfId": "vnfid-123", "virtualLinkId": "virtual link 123", "cpId": "cp id 123", "nfp": "nfp 123"}, {"vnfId": "vnfid-123", "virtualLinkId": "virtual link 123", "cpId": "cp id 123", "nfp": "nfp 123"}]}');
        },

        generateTemplatesComponent : function() {
            //dropdown data
            return $http({
                url: url+'/openoapi/catalog/v1/servicetemplates',
                //url: 'http://localhost:5000/api/getTemplateData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });
        },
	
        generateCreateParameters : function(template) {
            // For Template parameters tab in popup
            return $.when(fetchCreateParameters(template.serviceTemplateId))
            .then(function(createParam) {
                // set the create param object
                createParamJsonObj = createParam;
                // convert the create param to UI.
                return convertCreateParamsToUI('create', createParam.parameters);

            });
        },

        createService : function(serviceBaseInfo) {
            if (!checkInputs('create', createParamJsonObj.parameters)) {
                return {status:'checkfailed'};
            }
            var sengMsgObj = collectCreateParamfromUI('', 'create', createParamJsonObj.parameters);
            var gatewayService = '/openoapi/servicegateway/v1/services';
            return createServiceInstance(serviceBaseInfo, sengMsgObj);            
        },
        
        deleteService : function(serviceId) {
            return deleteServiceInstance(serviceId);    
        },
        scaleService: function (nsInstanceId, scaleType, aspectId, numberOfSteps, resultHandleFun) {
            scaleServiceInstance(nsInstanceId, scaleType, aspectId, numberOfSteps, resultHandleFun);
        }
    }
});

/**
 * init parameter tab
 * @returns
 */
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
    $.when(fetchCreateParameters(templateId))
    .then(function(createParam) {
        // set the create param object
        templateParameters.paramJsonObj = createParam.parameters;
        // convert the create param to UI.
        var components = convertCreateParamsToUI('create', createParam.parameters);
        document.getElementById("templateParameterTab").innerHTML = components;
        templateParameters.changed = false;
    });
}

/**
 * generate the template to create parameters object
 * 
 * @param templateId
 *            the template id
 * @returns
 */
function fetchCreateParameters(templateId) {
    //return $.getJSON("./conf/queryCreateParams.json");
    var uri = '/openoapi/servicegateway/v1/createparameters/' + templateId;
    return $.ajax({
        type : "GET",
        url : uri,
        error : function(xhr, ajaxOptions, thrownError) {
            showErrorMessage("Generate parameters failed.", xhr.responseText);
        } 
    });
}

/**
 * convert the template params obj to html UI string
 * 
 * @param identify the object identify, it should be '' when called
 * @return the html component string
 */
function convertCreateParamsToUI(identify, createParam) {
    var components = '';
    // convert host to UI
    if (undefined !=  createParam.domainHost && 'enum' === createParam.domainHost.type) {
        components = components
                + generateParamComponent(createParam.nodeType, identify,
                        createParam.domainHost, false);
    }
    // convert own locationConstraints to UI
    if(undefined != createParam.nsParameters.locationConstraints){
        createParam.nsParameters.locationConstraints.forEach(function(param) {
            components = components
                    + generateParamComponent(createParam.nodeType,
                            identify, param.locationConstraints.vimId, false);
        });
    }
    
    // convert own param to UI
    createParam.nsParameters.additionalParamForNs
            .forEach(function(param) {
                components = components
                        + generateParamComponent(createParam.nodeType,
                                identify, param, false);
            });
    // convert segments to UI
    createParam.segments.forEach(function(segment) {
        // each segment in a field set.
        components = components + '<fieldset style="margin-left:25px;"><legend>'
                + segment.nodeTemplateName + '</legend>';
        // the identify for segment
        var segmentIdentify = '' == identify ? segment.nodeTemplateName
                : identify + '_' + segment.nodeTemplateName;
        // convert segment to UI
        components = components
                + convertCreateParamsToUI(segmentIdentify, segment);
        components = components + '</fieldset>';
    });
    return components;
}


/**
 * for each required parameter it could not be empty
 * @param identify the identify of a segment
 * @param createParam the create param object 
 * @returns the check result
 */
function checkInputs(identify, createParam) {
    //check domain host
    if (undefined !=  createParam.domainHost && 'enum' === createParam.domainHost.type) {
        var value = collectParamValue(identify, createParam.domainHost);
        if ('select' == value) {
            var name = getParamLabel(createParam.nodeType, createParam.domainHost);
            alert( name + ' is required.')
            return false;
        }
    }
    //check location constraints
    if(undefined != createParam.nsParameters.locationConstraints){
        for(var i= 0; i < createParam.nsParameters.locationConstraints.length; i++){    
            var param = createParam.nsParameters.locationConstraints[i].locationConstraints.vimId;
            var value = collectParamValue(identify, param);
            if('true' === param.required && ('' === value || ('enum' == param.type && 'select' == value))){
                // the param resource key is nodeType.paramName
                var name = getParamLabel(createParam.nodeType, param);
                alert(name + ' is required.')
                return false;
            }
        }
    }

    // check parameters
    for(var i= 0; i < createParam.nsParameters.additionalParamForNs.length; i++){    
        var param = createParam.nsParameters.additionalParamForNs[i];
        var value = collectParamValue(identify, param);
        if('true' === param.required && ('' === value || ('enum' == param.type && 'select' == value))){
            // the param resource key is nodeType.paramName
            var name = getParamLabel(createParam.nodeType, param);
            alert(name + ' is required.')
            return false;
        }
    }
    // get segments param value from UI
    var segmentcheckResult = true;
    for(var i= 0; i < createParam.segments.length; i++){
        var segment = createParam.segments[i];
        // the identify for segment
        var segmentIdentify = '' == identify ? segment.nodeTemplateName
                : identify + '_' + segment.nodeTemplateName;
        segmentcheckResult = checkInputs(segmentIdentify, segment);
        if (!segmentcheckResult) {
            break;
        }
    }
    return segmentcheckResult;
}


/**
 * convert the template params obj to html UI string
 * 
 * @param identify the object identify, it should be different every time
 * @return the html component string
 */
function collectCreateParamfromUI(parentHost,identify, createParam) {
    // the create params used for create msg
    var paramSentObj = {
            domainHost:'',
            nodeTemplateName:'',
            nodeType:'',
            segments:[],
            nsParameters:{}
    };  
    // get the domain value
    if (undefined !=  createParam.domainHost && 'enum' === createParam.domainHost.type) {
        var domain = collectParamValue(identify, createParam.domainHost);
        paramSentObj.domainHost = collectParamValue(identify, createParam.domainHost)
    }
    //if parent domainHost is not '' and local domain host is'', it should be setted as parent
    if('' != parentHost && '' == paramSentObj.domainHost){
        paramSentObj.domainHost = parentHost;
    }
    paramSentObj.nodeTemplateName = createParam.nodeTemplateName;
    paramSentObj.nodeType = createParam.nodeType;

    //get location constraints
    if(undefined != createParam.nsParameters.locationConstraints){
        paramSentObj.nsParameters['locationConstraints'] = [];
        createParam.nsParameters.locationConstraints.forEach(function(param) {
            var locationConstraints = {};
            locationConstraints['vnfProfileId'] = param.vnfProfileId;
            locationConstraints['locationConstraints'] = {};
            locationConstraints.locationConstraints['vimId'] = collectParamValue(identify, param.locationConstraints.vimId);
            paramSentObj.nsParameters.locationConstraints.push(locationConstraints);
        });
    }

    paramSentObj.nsParameters['additionalParamForNs'] = {};
    // get own param value from UI
    createParam.nsParameters.additionalParamForNs.forEach(function(param) {
        paramSentObj.nsParameters.additionalParamForNs[param.name] = collectParamValue(identify, param);
    });
    // get segments param value from UI
    createParam.segments.forEach(function(segment) {
        // the identify for segment
        var segmentIdentify = '' == identify ? segment.nodeTemplateName
                : identify + '_' + segment.nodeTemplateName;
        var segmentObj = collectCreateParamfromUI(paramSentObj.domainHost, segmentIdentify, segment);
        paramSentObj.segments.push(segmentObj);
    });
    return paramSentObj;
}

/**
 * get a param value
 * @param identify the identify of a segment
 * @param param the param object 
 * @returns the value of the param
 */
function collectParamValue(identify, param) {
    var value = $('#' + getParamId(identify, param)).val();
    return value;
}

/**
 * get the param id in ui
 * @param identify
 * @param param
 * @returns
 */
function getParamId(identify, param) {
    var tmpname = param.name.replace(/-/g, '_');
    var tmpname1 = tmpname.replace(/\./g, '_');
    return '' ===identify ? tmpname1 : identify + '_' + tmpname1;
}

/**
 * get the resource string of a param.
 * @param nodeType node type
 * @param param param object
 * @returns resource string
 */
function getParamLabel(nodeType, param) {
    var name = $.i18n.prop(nodeType + '.' + param.name);
    if (name.length === 0 || name.slice(0, 1) === '[') {
        name = param.name;
    }
    return name;
}
/**
 * convert combox component
 * 
 * @param inputPara
 * @param items
 * @param stringReadOnly
 * @returns
 */
function generateParamComponent(nodeType, identify, param, strReadOnly) {
    // the param resource key is nodeType.paramName
    var name = getParamLabel(nodeType, param);
    var id = getParamId(identify,param);
    var component = '';
    if (param.type != 'enum') {
        component = '<div class="mT15 form-group row-content" style="margin-left:0px;">'
                + '<label class="col-sm-6 control-label labelstyle">'
                + '<span>' + name + '</span>' + generateRequiredLabel(param)
                + '</label>' 
                + '<div class="col-sm-6"><input type="text" id="' + id
                + '" name="parameter description" class="form-control" placeholder="'
                + '"value="' + param.defaultValue;
        if(strReadOnly){
            component = component + '" readonly="' + strReadOnly + '"/>'+ '</div></div>';
        }else{
            component = component + '"/>'+ '</div></div>';
        }
                
    } else if (param.type === 'enum') {
        component = '<div class="form-group row-content" style="margin-left:0px;margin-bottom:5px;">'
                + '<label class="col-sm-6 control-label labelstyle">'
                + '<span>' + name + '</span>'
                + generateRequiredLabel(param)
                + '</label>'
                + '<div class="col-sm-6">'
                + '<select class="form-control" style ="padding-top: 0px;padding-bottom: 0px;"'
                + ' id="' + id + '" name="' + param.name + '" value="' + param.defaultValue 
                + '">'
                + this.transformToOptions(param.range)
                + '</select></div></div>';
    }
    return component;
}

/**
 * transfer the enum range to html body
 * @param items the map of the range
 * @returns the html string
 */
function transformToOptions(items) {
    var options = '<option value="select">--select--</option>';
    var i;
    for ( var key in items) {
        var option = '<option value="' + key + '">' + items[key] + '</option>';
        options = options + option;
    }
    return options;
}

/**
 * generate required identify to html string
 * @param parameter the parameter object
 * @returns the html string 
 */
function generateRequiredLabel(parameter) {
    var requiredLabel = '';
    if (parameter.required === 'true') {
        requiredLabel = '<span class="required">*</span>';
    }
    return requiredLabel;
}

/**
 * create service
 * @param sengMsgObj the parameters
 * @returns 
 */
function createServiceInstance(serviceBaseInfo, sengMsgObj) {
    var defer = $.Deferred();
    var parameter = {
        'service' : {
            'name' :  serviceBaseInfo.name,
            'description' : serviceBaseInfo.description,
            'serviceDefId' : '', //no need now, reserved
            'templateId' :  serviceBaseInfo.templateId,
            'parameters' : sengMsgObj
        }
    };
    var serviceGatewayUri = '/openoapi/servicegateway/v1/services';
    $.when($.ajax({
        type : "POST",
        url : serviceGatewayUri,
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(parameter),
        error : function(xhr, ajaxOptions, thrownError) {
            showErrorMessage("Create service failed.", xhr.responseText);
        }
    }))
    .then(function(response) {
        return queryProgress('create service', response.service.serviceId,response.service.operationId);
    }).then(function(result){
        defer.resolve(result);
    });
    return defer;
}

/**
 * sent delete instance msg
 * @param serviceId the service id
 * @returns
 */
function deleteServiceInstance(serviceId) {
    var defer = $.Deferred();
    var deleteUrl = '/openoapi/servicegateway/v1/services/' + serviceId;
    var parameter = {};
    $.when($.ajax({
        type : "DELETE",
        url : deleteUrl,
        contentType : "application/json",
        dataType : "json",
        data : JSON.stringify(parameter),
        error : function(xhr, ajaxOptions, thrownError) {
            showErrorMessage("Delete service failed.", xhr.responseText);
        }        
    }))
    .then(function(response) {
        return queryProgress('delete service', serviceId,response.operationId);
    }).then(function(result){
        defer.resolve(result);
    });
    return defer;
}

/**
 * query progress of the operation 
 * @param operation the operation string
 * @param serviceId the service id
 * @param operationId the operation id
 * @returns
 */
function queryProgress(operation, serviceId, operationId) {
    //show the progress dialog
    $( "#idProgressTitle" ).text(operation);
    $( "#progressContent" ).text('status:');            
    $( "#progressbar" ).attr("style","width: 0%");
    $( "#progressDialog" ).modal({backdrop:'static', keyboard:false});    
    //set a timer for query operation
    var defer = $.Deferred();
    var queryProgressUril = '/openoapi/servicegateway/v1/services/' + serviceId + '/operations/' + operationId;
    var timerDefer = $.Deferred();
    var timeout = 3600000;
    var fun = function() {
        if (timeout === 0) {
            timerDefer.resolve({
                status : 'error',
                reason : operation + ' timeout!',
            });
            return;
        }
        timeout = timeout - 1000;
        $.when($.ajax({
            type : "GET",
            url : queryProgressUril,
            error : function(xhr, ajaxOptions, thrownError) {
                showErrorMessage("Query progress failed.", xhr.responseText);
            } 
        }))
        .then(function(response) {
            //update progress
            $( "#progressbar" ).attr("style","width: " + response.operation.progress.toString() + "%");
            $( "#progressValue" ).text(response.operation.progress.toString() + '%');
            $( "#progressContent" ).text('status: ' + response.operation.operationContent);            
            if (response.operation.result == 'finished' || response.operation.result == 'error') {
                timerDefer.resolve({
                    status : response.operation.result ,
                    reason : response.operation.reason
                });
            }
        });
    };
    var timerId = setInterval(fun, 1000);
    $.when(timerDefer)
    .then(function(responseDesc) {
        clearInterval(timerId);
        $('#progressDialog').modal('hide');
        defer.resolve({
            status : responseDesc.status,
            reason : responseDesc.reason,
            serviceId:serviceId
        });

    });
    return defer; 
}


/**
 * convert the input parameters to ui
 * @param identify the identify of a segment
 * @param createParam the create param object 
 * @returns the check result
 */
function convertInputsToUI(parentHost, identify, serviceParam) {
    var components = '';
    // convert host to UI
    if (undefined !=  serviceParam.domainHost && '' != serviceParam.domainHost && parentHost != serviceParam.domainHost) {
        var param ={
            name:'domainHost',
            type:'string',
            defaultValue:getShowVal('domainHost', serviceParam.domainHost),
            required:false            
        }
        components = components + generateParamComponent(serviceParam.nodeType, identify,
                param, true);
    }
    //convert location constraints to UI
    if(undefined != serviceParam.nsParameters.locationConstraints){        
        serviceParam.nsParameters.locationConstraints.forEach(function(param) {
            var showValue = getShowVal('location', param.locationConstraints.vimId)
            var param ={
                    name: param.vnfProfileId + '_Location',
                    type:'string',
                    defaultValue:showValue,
                    required:false            
                }
            components = components + generateParamComponent(serviceParam.nodeType,
                            identify, param, true);
        });
    }

    // convert own param to UI
    for(var key in serviceParam.nsParameters.additionalParamForNs ){
        var param ={
                name: key,
                type:'string',
                defaultValue:getShowVal(key, serviceParam.nsParameters.additionalParamForNs[key]),
                required:false            
            }
        components = components + generateParamComponent(serviceParam.nodeType,
                        identify, param, true);
    }
    // convert segments to UI
    serviceParam.segments.forEach(function(segment) {
        // each segment in a field set.
        components = components + '<div class="mT15 form-group"><fieldset style="margin-left:25px;"><legend>'
                + segment.nodeTemplateName + '</legend>';
        // the identify for segment
        var segmentIdentify = '' == identify ? segment.nodeTemplateName
                : identify + '_' + segment.nodeTemplateName;
        // convert segment to UI
        components = components
                + convertInputsToUI(serviceParam.domainHost, segmentIdentify, segment);
        components = components + '</fieldset></div>';
    });
    return components;
}

function getShowVal(paramName, paramValue){
    if(paramName == 'domainHost'){
        return getHostNameByVal(paramValue);
    }
    else if(paramName == 'location'){
        return getVimNameById(paramValue);
    }
    else if(paramName == 'sdncontroller'){
        return getSdnControllerNameById(paramValue);
    }
    else{
        return paramValue;
    }
}

function getHostNameByVal(hostDomain){
     var requestUrl ="/openoapi/servicegateway/v1/domains";
      var returnObj = '';
      $.ajax({
              type : "GET",
              async: false,
              url : requestUrl,
              contentType : "application/json",
              success : function(jsonobj) {
                jsonobj.forEach(function(host){
                    if(host.host == hostDomain){
                          returnObj = host.name;
                    }
                });
              },
              error : function(xhr, ajaxOptions, thrownError) {
                 showErrorMessage("Query host failed.", xhr.responseText);
              }
          });
      return returnObj;
}

//get the vim name by id.
function getVimNameById(vimId){
  var requestUrl ="/openoapi/extsys/v1/vims/" + vimId;
  var returnObj;
  $
      .ajax({
          type : "GET",
          async: false,
          url : requestUrl,
          contentType : "application/json",
          success : function(jsonobj) {
              // TODO return according to the json data received.
              returnObj = jsonobj.name;
          },
          error : function(xhr, ajaxOptions, thrownError) {
              showErrorMessage("Query vims failed.", xhr.responseText);
          }
      });
  return returnObj;
}

//get the sdn controller name by id.
function getSdnControllerNameById(sdnControllerId){
  var requestUrl ="/openoapi/extsys/v1/sdncontrollers/" + sdnControllerId;
  var returnObj;
  $
      .ajax({
          type : "GET",
          async: false,
          url : requestUrl,
          contentType : "application/json",
          success : function(jsonobj) {
              // TODO return according to the json data received.
              returnObj = jsonobj.name;
          },
          error : function(xhr, ajaxOptions, thrownError) {
              showErrorMessage("Query sdn controllers failed.", xhr.responseText);
          }
      });
  return returnObj;
}



/**
 * show error dialog
 * @param title the title 
 * @param result the result
 * @returns
 */
function showErrorMessage(title, result) {
    //show the error dialog
    $( "#errorDialogTitle" ).text(title);
    if(undefined != result.reason){
        $( "#errorDialogReason" ).text(result.reason);     
    }
    else{
        $( "#errorDialogReason" ).text(result);     
    }
    $( "#errorDialog" ).modal({backdrop:'static', keyboard:false});    
}

/**
 * generate the template to create parameters object
 * 
 * @param templateId the template id
 * @returns
 */
function queryService(serviceId) {
    var uri = '/openoapi/servicegateway/v1/services/' + serviceId;
    return $.ajax({
        type : "GET",
        url : uri,
        error : function(xhr, ajaxOptions, thrownError) {
            showErrorMessage("Query service failed.", xhr.responseText);
        } 
    });
}

function queryServiceData(){
    var returnVal = [];
    var requestUrl = "/openoapi/servicegateway/v1/services";
    $
        .ajax({
            type : "GET",
            url : requestUrl,
            async: false,
            contentType : "application/json",
            success : function(jsonobj) {
                // TODO return according to the json data received.
                returnVal =  jsonobj;
            },
            error : function(xhr, ajaxOptions, thrownError) {
                showErrorMessage("Query services fail",xhr.responseText);
            }
        });
    return returnVal;
}

function scaleServiceInstance(nsInstanceId, scaleType, aspectId, numberOfSteps, resultHandleFun) {
    var parameter = {
        'nsInstanceId': nsInstanceId,
        'scaleType': 'SCALE_NS',
        'scaleNsData': [
            {
                'scaleNsByStepsData': [
                    {
                        'scalingDirection': scaleType,
                        'aspectId': aspectId,
                        'numberOfSteps': numberOfSteps
                    }
                ]
            }
        ]
    };
    var nfvoUri = '/openoapi/nslcm/v1/ns/' + nsInstanceId + '/scale';
    $.when(
        $.ajax({
            type: "POST",
            url: nfvoUri,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(parameter)
        })
    ).then(
        function (response) {
            var jobId = response.jobID;
            //show the progress dialog
            return queryScaleProgress(jobId);
        }
    ).then(function (response) {
        resultHandleFun(response);
    });
}

function queryScaleProgress(jobId) {
    //show the progress dialog
    var operation = 'scale network service';
    $("#idScaleProgressTitle").text(operation);
    $("#scaleProgressContent").text('status:');
    $("#scaleProgressbar").attr("style", "width: 0%");
    $("#scaleProgressDialog").modal({backdrop: 'static', keyboard: false});
    //set a timer for query operation
    var defer = $.Deferred();
    var queryProgressUri = jobStatusUri(jobId);
    var timerDefer = $.Deferred();
    var timeout = 3600000;
    var fun = function () {
        if (timeout === 0) {
            timerDefer.resolve({
                status: 'error',
                reason: operation + ' timeout!',
            });
            return;
        }
        timeout = timeout - 1000;
        $.when($.ajax({
            type: "GET",
            url: queryProgressUri
        }))
            .then(function (response) {
                //update progress
                $("#scaleProgressbar").attr("style", "width: " + response.responseDescriptor.progress.toString() + "%");
                $("#scaleProgressValue").text(response.responseDescriptor.progress.toString() + '%');
                $("#scaleProgressContent").text('status: ' + response.responseDescriptor.statusDescription);
                if (response.responseDescriptor.status == 'finished' || response.responseDescriptor.status == 'error') {
                    timerDefer.resolve({
                        status: response.responseDescriptor.status,
                        reason: response.responseDescriptor.errorCode
                    });
                }
            });
    };
    var timerId = setInterval(fun, 1000);
    $.when(timerDefer)
        .then(function (responseDesc) {
            clearInterval(timerId);
            $('#scaleProgressDialog').modal('hide');
            defer.resolve({
                status: responseDesc.status,
                reason: responseDesc.reason
            });

        });
    return defer;
}

/**
 * generate url for querying operation status
 * @param jobId
 * @param responseId
 * @returns
 */
function jobStatusUri(jobId, responseId) {
    var responsePara = '';
    if (undefined !== responseId) {
        responsePara = '&responseId=' + responseId;
    }
    return '/openoapi/nslcm/v1/jobs/' + jobId + responsePara;
}