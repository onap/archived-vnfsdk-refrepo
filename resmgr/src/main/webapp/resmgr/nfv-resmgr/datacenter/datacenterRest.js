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

app.factory("datacenterDataService", function($http,DataService, $log){
    var uri = '';
    uri += "/openoapi/resmgr/v1/datacenters/";
    return {
        getDatacenterData : function() {
            return DataService.get(uri)
                .then(function(response){
                    $log.info("in get data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        deleteDatacenterData : function(id) {
            return DataService.delete(uri+id)
                .then(function(response){
                    $log.info("in delete data service data is  :"+response);
                    console.log(response);
                    return response;
                });
        },
        editDatacenterData : function(datacenterData) {
            return DataService.put(uri, datacenterData)
                .then(function(response){
                    console.log("Successfully edited.. Data returned in DataService is");
                    console.log(response);
                    return response;
                });
        },
        addDatacenterData : function(datacenterData) {
            return DataService.post(uri, datacenterData)
                .then(function(response){
                    console.log("Successfully added.. Data returned in DataService is");
                    console.log(response);
                    return response;
                });
        }
    }
});



function fillCountryData() {

    var requestUrl = "/openoapi/resmgr/v1/locations/country";
    var htmlContent = "";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            var str = jsonobj.data.replace('[', '').replace(']', '').split(',')
            $.each(str, function (n, v) {
                htmlContent += "<option value=" + v + ">" + v + "</option>";
                $("#countrydropdown").html(htmlContent);

            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on getting country data : " + xhr.responseText);
        }
    });
}

function fillVimNameData() {

    var requestUrl = "/openoapi/resmgr/v1/locations/cloudservice";
    var htmlContent = "";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            var str = jsonobj.data.replace('[', '').replace(']', '').split(',')
            $.each(str, function (n, v) {
                htmlContent += "<option value='" + v + "'>" + v + "</option>";
                $("#servicenamedropdown").html(htmlContent);

            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on getting country data : " + xhr.responseText);
        }
    });
}
function regChangeAction(){
	  $('#countrydropdown').change(function () {
        var country = $(this).children('option:selected').val();
        var requestUrl = "/openoapi/resmgr/v1/locations/locationbycountry?country=" + country;

        var htmlContent = "<option value=''>--select--</option>";
        $.ajax({
            type: "GET",
            url: requestUrl,
            contentType: "application/json",
            success: function (jsonobj) {
				console.log(jsonobj.data);
				   var str = jsonobj.data.replace('[', '').replace(']', '').split(',');
				   console.log(str);
                $.each(str, function (n, v) {
                    htmlContent += "<option value='" + v + "'>" + v + "</option>";
                    $("#locationdropdown").html(htmlContent);

                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                bootbox.alert("Error on getting location data : " + xhr.responseText);
            }
        });

    });
}