/*
 graphApp = angular.module('graphApp', []);

 graphApp.controller('GraphCtrl', function ($scope) {
 $scope.chart = null;
 $scope.config={};
 $scope.config.data1="30, 200, 100, 200, 150, 250";
 $scope.config.data2="70, 30, 10, 240, 150, 125";

 $scope.typeOptions=["line","bar","spline","step","area","area-step","area-spline"];

 $scope.config.type1=$scope.typeOptions[0];
 $scope.config.type2=$scope.typeOptions[1];

 $scope.showGraph = function() {
 var config = {};
 config.bindto = '#placeholderC3';
 config.data = {};
 config.data.json = {};
 config.data.json.data1 = $scope.config.data1.split(",");
 config.data.json.data2 = $scope.config.data2.split(",");
 config.axis = {"y":{"label":{"text":"Number of items","position":"outer-middle"}}};
 config.data.types={"data1":$scope.config.type1,"data2":$scope.config.type2};
 $scope.chart = c3.generate(config);
 }

 $scope.changeColor = function() {
 d3.selectAll('path.c3-bar').style("fill", "red");
 }
 });
 */

var c3ChartDemo = function (placeholderC3, type) {
    var $scopeX = {};
    $scopeX.chart = null;
    $scopeX.config = {};
    $scopeX.config.data1 = "30, 200, 100, 200, 150, 250";
    $scopeX.config.data2 = "70, 30, 10, 240, 150, 125";

    $scopeX.typeOptions = ["line", "bar", "spline", "step", "area", "area-step", "area-spline"];

    $scopeX.config.type1 = $scopeX.typeOptions[0];
    $scopeX.config.type2 = $scopeX.typeOptions[1];
    var config = {};
    config.bindto = '#' + placeholderC3;
    config.data = {};
    config.data.json = {};
    config.data.json.data1 = $scopeX.config.data1.split(",");
    config.data.json.data2 = $scopeX.config.data2.split(",");
    config.axis = {"y": {"label": {"text": "Number of items", "position": "outer-middle"}}};
    config.data.types = {"data1": $scopeX.config.type1, "data2": $scopeX.config.type2};
    if (type && type == "bar") {
        config.data.types.data1 = $scopeX.config.type2;
    }
    if (type && type == "step") {
        config.data.types.data1 = "step";
    }
    $.facebox.charts[placeholderC3] = c3.generate(config);
}