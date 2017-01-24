/*

    Copyright 2016-2017, Huawei Technologies Co., Ltd.

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
    return {
        getAllData: function (value) {
            //var value = $scope.param;
            return $http({
                url: 'http://localhost:8080/POC_NodeToServletPorting_Server/?widgetType=' + value,
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            }).then(function (response) {
                $log.info(response.data);
                return response.data;
            })
        },

        getAllProvinceData : function() {
            return $http({
                url: 'http://localhost:3000/api/getAllProvinceData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });
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

app.factory('LoginService', function($http, $log) {
    var admin = 'admin';
    var pass = 'pass';
    var isAuthenticated = false;

    return {
        login : function(user) {
            console.log(user);
            return $http({
                url: 'http://localhost:8081/api/signin',//http://192.168.4.161:3000/api/login
                method: 'POST',
                data: {'name':user.username, 'pswd':user.password},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                $log.info(response);
                if(response.status == 200) {
                    console.log("Success");
                    //Success
                    isAuthenticated = true;
                }
                else {
                    console.log("Fail");
                    isAuthenticated = false;
                }
                console.log("isAuthenticated: " + isAuthenticated);
                return isAuthenticated;
            }, function(reason){
                $log.info(reason);
                console.log("Fail");
                isAuthenticated = false;
                return reason;
            });
            /*isAuthenticated = user.username === admin && user.password === pass;
            return isAuthenticated;*/
        },
        isAuthenticated : function() {
            return isAuthenticated;
        },
        registerUser: function(user){
            console.log("New Registration: " + JSON.stringify(user));
            return $http({
                url: 'http://localhost:8081/api/signup',//http://192.168.4.161:3000/api/login
                method: 'POST',
                data: {'name':user.username, 'pswd':user.password, 'email':user.email},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                $log.info(response);
            },function(reason){
                $log.info(reason);
            });


        }
    };

});