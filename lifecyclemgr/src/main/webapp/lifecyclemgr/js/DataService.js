app.factory("DataService", function($http, $log){
    var lcData = null;
    return {
        loadGetServiceData : function() {

            //load main Table
            return $http({
                url: '/openoapi/inventory/v1/services',
                //url: 'http://localhost:5000/api/getLCData',
                method: 'GET',
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
                lcData = response.data.lcData;
                return response.data;
            });
        },
        getSavedLCData : function(id){
            var returnData = null;
            if(lcData) {
                for (var i = 0; i < lcData.length; i++) {
                    if(lcData[i].id == id) {
                        returnData = lcData[i].inputParameters;
                        break;
                    }
                }
                return returnData;
            }
            else
                return null;
        },
        getOverlayData : function() {
            return $http({
                url: 'http://localhost:5000/api/getOverlayVPNData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });
        },
        getUnderlayData : function() {
            return $http({
                url: 'http://localhost:5000/api/getUnderlayVPNData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });
        },
        loadServiceDetails : function(id) {
            return JSON.parse('[{"id":"12345", "name":"sdno"}, {"id":"23456", "name":"gso"},{"id":"12345", "name":"nfvo"}]');
        },

        generateTemplatesComponent : function() {
            //dropdown data
            return $http({
                url: '/openoapi/catalog/v1/servicetemplates',
                //url: 'http://localhost:5000/api/getTemplateData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data.templateData;
            });
        },
	
	fetchCreateParameters : function(templateId) {
            //For Template parameters tab in popup
            return $http({
                url: '/openoapi/catalog/v1/servicetemplates/'+templateId,
               // url: 'http://localhost:5000/api/getTemplateParameter',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });
        },

        createServiceInstance : function(lifecycleData, sengMsgObj) {
            ///For submit of OK button
            var parameter = {
                'service' : {
                    'name' :  lifecycleData.name,
                    'description' : lifecycleData.desc,
                    'serviceDefId' : '', //no need now, reserved
                    'templateId' :  lifecycleData.optSelect,
                    'parameters' : sengMsgObj
                }
            };
            return $http({
                url: '/openoapi/servicegateway/v1/services',
                //url: 'http://localhost:5000/api/getTemplateData',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data : JSON.stringify(parameter)
            }).then(function(response){
                //$log.info(response);
                return response.data.templateData;
            });
        }
    }
});