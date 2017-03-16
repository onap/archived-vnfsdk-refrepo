/*
    Copyright 2017, China Mobile Co., Ltd.

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
        /*getAllData: function (value) {
            //var value = $scope.param;
            return $http({
                url: 'http://localhost:8080/POC_NodeToServletPorting_Server/?widgetType=' + value,
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            }).then(function (response) {
                $log.info(response.data);
                return response.data;
            })
        },*/
    }
});

app.factory('LoginService', function($http, $log) {
    return {
        login: function(user) {
            return $http({
                // TODO
                url: 'http://localhost:8080/api/signin',
                method: 'POST',
                data: {'name':user.username, 'pswd':user.password},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                if(response.status == 200) {
                    // TODO
                    // login succeeded
                } else {
                    // TODO
                    // login failed
                }
                // TODO
                return response;
            }, function(error){
                // TODO
                return error;
            });
        }
    };
});
