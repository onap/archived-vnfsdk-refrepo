app.factory("DataService", function($http, $log){
    var lcData = null;
    return {
        getAllData: function (value) {
            //var value = $scope.param;
            return $http({
                url: 'http://localhost:8080/POC_NodeToServletPorting_Server/?widgetType=' + value,
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            }).then(function (response) {
                //$log.info(response.data);
                return response.data;
            })
        },

        getLCData : function() {
            return $http({
                url: 'http://localhost:4000/api/getLCData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
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
                url: 'http://localhost:4000/api/getOverlayVPNData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });
        },
        getUnderlayData : function() {
            return $http({
                url: 'http://localhost:4000/api/getUnderlayVPNData',
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


        addProvinceData : function(provinceDetail) {
            return $http({
                url: 'http://localhost:3000/api/addProvinceData',
                method: 'POST',
                data: provinceDetail,
                headers: {'Content-Type': 'application/json '}
            }).then(function(response){
                console.log("Response : ");
                $log.info(response.data);
                return response.data;
            });
        },
        deleteProvinceData : function(idList) {
            return $http({
                url: 'http://localhost:3000/api/deleteProvinceData',
                method: 'POST',
                data: {'idList':idList},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                console.log("Successfully Deleted..");
                $log.info(response);
                return response.data;
            });
        },
        editProvinceData : function(provinceDetail) {
            return $http({
                url: 'http://localhost:3000/api/editProvinceData',
                method: 'POST',
                data: provinceDetail,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                console.log("Successfully Edited...");
                $log.info(response);
                return response.data;
            });
        }
    }
});