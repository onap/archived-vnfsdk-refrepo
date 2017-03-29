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

var loginApp = angular.module("loginApp", []);
loginApp.controller("loginCtrl", function($scope) {
    $scope.loginFormInit = function() {
        $scope.error = "";
        if ($.cookie("loginkeeping") == "true") {
            $scope.user = {
                'username': $.cookie("username"),
                'password': $.cookie("password"),
                'loginkeeping': true,
            };
        } else {
            $scope.user = {
                'username': $.cookie("username"),
                'password': $.cookie("password"),
                'loginkeeping': false,
            };
        }
    };
    $scope.loginFormSubmit = function() {
                if ($scope.user.loginkeeping) {
                    $.cookie("loginkeeping", "true", {expires: 7});
                    $.cookie("username", $scope.user.username, {expires: 7});
                    $.cookie("password", $scope.user.password, {expires: 7});
                } else {
                    $.cookie("loginkeeping", "false", {expire: -1});
                    $.cookie("username", "", {expires: -1});
                    $.cookie("password", "", {expires: -1});
                }

                //if (response.status == -1) {
                //    $scope.error = "Incorrect username/password !";
                //} else {
                //    $scope.error = "";
                    top.window.document.location.href = "/openoui/login/html/menu.html";
                //}
    };
});
