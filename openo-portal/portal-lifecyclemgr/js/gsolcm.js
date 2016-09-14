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
