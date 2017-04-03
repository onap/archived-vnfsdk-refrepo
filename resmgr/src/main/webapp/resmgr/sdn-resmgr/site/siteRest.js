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

app.factory("siteDataService", function($http, DataService, $log){
    var uri = '';
    return {
        getAllSiteData : function() {
            /*return $http({
                url: 'http://localhost:3000/siteAPI/getAllSiteData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                $log.info("in get data service data is  :"+response);
                console.log(response.data);
                return response.data;
             });*/
            return DataService.get(uri+'/openoapi/sdnobrs/v1/sites')
                .then(function(response){
                    $log.info("in get data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        deleteSiteData : function(id) {
            /*return $http({
                url: 'http://localhost:3000/siteAPI/deleteSiteData',
                method: 'POST',
                data: {'nameList':nameList},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                console.log("Successfully Deleted.. Data returned in DataService is");
                console.log(response.data);
                return response.data;
            });*/
            return DataService.delete(uri+'/openoapi/sdnobrs/v1/sites/'+id)
                .then(function(response){
                    $log.info("in delete data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        editSiteData : function(siteData) {
            /*return $http({
                url: 'http://localhost:3000/siteAPI/editSiteData',
                method: 'POST',
                data: {'siteData':siteData},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                console.log("Successfully edited.. Data returned in DataService is");
                console.log(response.data);
                return response.data;
            });*/

            return DataService.put(uri+'/openoapi/sdnobrs/v1/sites', siteData)
                .then(function(response){
                    console.log("Successfully added.. Data returned in DataService is");
                    console.log(response.data);
                    return response.data;
                });
        },
        addSiteData : function(siteData) {
            /*return $http({
                url: 'http://localhost:3000/siteAPI/addSiteData',
                method: 'POST',
                data: {'siteData':siteData},
                headers: {'Content-Type': 'application/json'}
            }).then(function(response){
                console.log("Successfully edited.. Data returned in DataService is");
                console.log(response.data);
                return response.data;
            });*/
            console.log("In siteRest");
            return DataService.post(uri+'/openoapi/sdnobrs/v1/sites', siteData)
                .then(function(response){
                    console.log("Successfully added.. Data returned in DataService is");
                    console.log(response.data);
                    return response.data;
                });
        }
    }
});
