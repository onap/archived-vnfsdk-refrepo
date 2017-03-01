/* Copyright 2017, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

app.factory("locationDataService", function($http,DataService, $log){
    var uri = 'http://192.168.9.13:18008';
    uri += "/openoapi/resmgr/v1/locations/";
    return {
        getLocationData : function() {
            /*console.log("hi in dataservice");
            return $http({
                url: 'http://localhost:3000/locationAPI/getLocationData',
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                //$log.info(response);
                return response.data;
            });*/
            return DataService.get(uri)
                .then(function(response){
                    $log.info("in get data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        deleteLocationData : function(id) {
            /*return $http({
                url: 'http://localhost:3000/locationAPI/deleteLocationData',
                method: 'POST',
                data: {'idList':idList},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                console.log("Successfully Deleted..");
                $log.info(response);
                return response.data;
            });*/
            return DataService.delete(uri+"/"+id)
                .then(function(response){
                    $log.info("in delete data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        editLocationData : function(locationData) {
            return DataService.put(uri, locationData)
                .then(function(response){
                    console.log("Successfully edited.. Data returned in DataService is");
                    console.log(response);
                    return response;
                });
        },
        addLocationData : function(locationData) {
            return DataService.post(uri, locationData)
                .then(function(response){
                    console.log("Successfully added.. Data returned in DataService is");
                    console.log(response);
                    return response;
                });
        }
    }
});