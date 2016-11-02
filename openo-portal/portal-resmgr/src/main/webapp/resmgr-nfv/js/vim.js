function loadDatacenterData() {
    var requestUrl = app_url+"/openoapi/resmgr/v1/datacenters";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            $.each(jsonobj.datacenters, function (n, v) {
                printCharts(v.usedCPU, v.totalCPU, v.usedMemory, v.totalMemory, v.usedDisk, v.totalDisk,v.name);
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on getting site data : " + xhr.responseText);
            printCharts(11, 12, 21, 22, 31, 32,1);
        }
    });
}


function loadVimData() {
    var requestUrl = app_url+"/v1/resmanage/vim/vimInfo";
    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (jsonobj) {
            printCharts(jsonobj.data[0].used.cpu,
                jsonobj.data[0].total.cpu, jsonobj.data[0].used.memory, jsonobj.data[0].total.memory, jsonobj.data[0].used.disk, jsonobj.data[0].total.disk,1);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert("Error on getting data (here display the test data) : " + xhr.responseText);
            printCharts(11, 12, 21, 22, 31, 32,1);
        }
    });
}

function addHtmlTemplate(dc_id){
	var htmlTemplate= '<div><br/><div>DataCenter[ '+dc_id+' ]</div><div style="width: 33%; float: left; text-align: center; display: inline"> <canvas id="cpuChart_'+dc_id+'"></canvas> <br> <label style="font-size: 14px;">Cpu status</label> </div> <div style="width: 33%; float: left; text-align: center; display: inline"> <canvas id="memoryChart_'+dc_id+'"></canvas> <br> <label style="font-size: 14px;">Memory status</label> </div> <div style="width: 34%; float: left; text-align: center; display: inline"> <canvas id="diskChart_'+dc_id+'"></canvas> <br> <label style="font-size: 14px;">Disk status</label> </div> </div>';
	$('#chartArea').append(htmlTemplate);
}

function printCharts(v11, v12, v21, v22, v31, v32,dc_id) {
	addHtmlTemplate(dc_id);
    var cpuChart = new Chart($("#cpuChart_"+dc_id+""), {
        type: 'doughnut',
        data: {
            labels: ["used", "available"],
            datasets: [{
                data: [v11, v12-v11],
                backgroundColor: ["#FFCE56", "#36A2EB"],
                hoverBackgroundColor: ["#FFCE56", "#36A2EB"]
            }]
        },
        options: {
            animation: {
                animateScale: true,
                animateRotate: true

            }
        }
    });
    var memoryChart = new Chart($("#memoryChart_"+dc_id+""), {
        type: 'doughnut',
        data: {
            labels: ["used", "available"],
            datasets: [{
                data: [v21, v22-v21],
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB"]
            }]
        },
        options: {

            animation: {
                animateScale: true,
                animateRotate: true

            }
        }
    });
    var diskChart = new Chart($("#diskChart_"+dc_id+""), {
        type: 'doughnut',
        data: {
            labels: ["used", "available"],
            datasets: [{
                data: [v31, v32-v31],
                backgroundColor: ["#FF6384", "green"],
                hoverBackgroundColor: ["#FF6384", "green"]
            }]
        },
        options: {
            animation: {
                animateScale: true,
                animateRotate: true

            }
        }
    });
}

$(function () {
	loadDatacenterData();

})