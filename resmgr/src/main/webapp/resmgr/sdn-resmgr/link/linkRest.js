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

app.factory("linkDataService", function($http, DataService, $log){
    var uri = '';
    uri += "/openoapi/sdnobrs/v1/topological-links";
    return {
        getAllLinkData: function () {
            /*return $http({
                url: 'http://localhost:3000/linkAPI/getAllLinkData',
                method: 'GET',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                $log.info("in get data service data is  :" + response.data);
                return response.data;
            });*/
            return DataService.get(uri)
                .then(function(response){
                    $log.info("in get data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        deleteLinkData: function (id) {
            /*return $http({
                url: 'http://localhost:3000/linkAPI/deleteLinkData',
                method: 'POST',
                data: {'nameList': nameList},
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
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
        editLinkData : function(linkData) {
            return DataService.put(uri, linkData)
                .then(function(response){
                    console.log("Successfully edited.. Data returned in DataService is");
                    console.log(response);
                    return response;
                });
        },
        addLinkData : function(linkData) {
            return DataService.post(uri, linkData)
                .then(function(response){
                    console.log("Successfully added.. Data returned in DataService is");
                    console.log(response);
                    return response;
                });
        }
    }
});