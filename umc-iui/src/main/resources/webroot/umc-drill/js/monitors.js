/*
 * Copyright (C) 2015 ZTE, Inc. and others. All rights reserved. (ZTE)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var cpuLine = function(){
	var chartCPU = echarts.init(document.getElementById('cpuUsage'));
	var optionCpu = {
		title : {
			text: 'CPU使用率',
			subtext: ''
		},
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['CPU']
		},
		toolbox: {
			show : true,
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				/* data : ['周一','周二','周三','周四','周五','周六','周日'] */
				data:[(new Date()).toLocaleTimeString()]
			}
		],
		yAxis : [
			{
				type : 'value',
				axisLabel : {
					formatter: '{value} %'
				}
			}
		],
		series : [
			{
				name:'CPU',
				type:'line',
				//data:[11, 31, 45, 13, 22, 13, 60],
				data:[],
				/* markPoint : {
					data : [
						{type : 'max', name: '最大值'},
						{type : 'min', name: '最小值'}
					]
				}, */
				markLine : {
					data : [
						{type : 'average', name: '平均值'}
					]
				}
			}
		]
	};
						
	chartCPU.setOption(optionCpu);
	
	var timeTicket;
	clearInterval(timeTicket);	
	timeTicket = setInterval(function (){		
		optionCpu.xAxis[0].data.push((new Date()).toLocaleTimeString());
		if(optionCpu.xAxis[0].data.length>7){
			optionCpu.xAxis[0].data.shift();
		}
		optionCpu.series[0].data.push(Math.random()*100);
		if(optionCpu.series[0].data.length>7){
			optionCpu.series[0].data.shift();
		}
		chartCPU.setOption(optionCpu, true);
	}, 2000);

}();

var memLine = function(){
	var chartMem = echarts.init(document.getElementById('memUsage'));
	var optionMem = {
		title : {
			text: '内存使用率',
			subtext: ''
		},
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['内存']
		},
		toolbox: {
			show : true,
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				/* data : ['周一','周二','周三','周四','周五','周六','周日'] */
				data:[(new Date()).toLocaleTimeString()]
			}
		],
		yAxis : [
			{
				type : 'value',
				axisLabel : {
					formatter: '{value} %'
				}
			}
		],
		series : [
			{
				name:'内存',
				type:'line',
				//data:[11, 31, 45, 13, 22, 13, 60],
				data:[],
				/* markPoint : {
					data : [
						{type : 'max', name: '最大值'},
						{type : 'min', name: '最小值'}
					]
				}, */				
				itemStyle: {
					normal: {
						/* lineStyle: {
							color: '#79D6CE'
						} */
						color: '#79D6CE'
					}
				},
				markLine : {
					data : [
						{type : 'average', name: '平均值'}
					]
				}
			}
		]
	};
						
	chartMem.setOption(optionMem);
	
	var timeTicket;
	clearInterval(timeTicket);	
	timeTicket = setInterval(function (){		
		optionMem.xAxis[0].data.push((new Date()).toLocaleTimeString());
		if(optionMem.xAxis[0].data.length>7){
			optionMem.xAxis[0].data.shift();
		}
		optionMem.series[0].data.push(Math.random()*100);
		if(optionMem.series[0].data.length>7){
			optionMem.series[0].data.shift();
		}
		chartMem.setOption(optionMem, true);
	}, 3000);

}();

/* var networkFlow = function(){
	var chartNetFlow = echarts.init(document.getElementById('networkFlow'));
	var optionNetFlow = {
		title : {
			text: '网络信息',
			subtext: ''
		},
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['eht-0','eht-1','eht-2','eht-3','eht-4']
		},
		toolbox: {
			show : true,
			orient: 'vertical',
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				data:[(new Date()).toLocaleTimeString()]
			}
		],
		yAxis : [
			{
				type : 'value',
				axisLabel : {
					formatter: '{value} MB'
				}
			}
		],
		series : [
			{
				name:'eht-0',
				type:'line',
				stack: '总量',
				data:[0]
			},
			{
				name:'eht-1',
				type:'line',
				stack: '总量',
				data:[0]
			},
			{
				name:'eht-2',
				type:'line',
				stack: '总量',
				data:[0]
			},
			{
				name:'eht-3',
				type:'line',
				stack: '总量',
				data:[0]
			},
			{
				name:'eht-4',
				type:'line',
				stack: '总量',
				data:[0]
			}
		]
	};                    
						
	chartNetFlow.setOption(optionNetFlow);
	
	var timeTicket;
	clearInterval(timeTicket);	
	timeTicket = setInterval(function (){		
		optionNetFlow.xAxis[0].data.push((new Date()).toLocaleTimeString());
		if(optionNetFlow.xAxis[0].data.length>7){
			optionNetFlow.xAxis[0].data.shift();
		}
		for(var i=0;i<optionNetFlow.series.length;i++){
			optionNetFlow.series[i].data.push(Math.random()*100);
			if(optionNetFlow.series[i].data.length>7){
				optionNetFlow.series[i].data.shift();
			}
		}
		chartNetFlow.setOption(optionNetFlow, true);
	}, 3000);

}(); */

var networkFlow = function(){
	var chartNetFlow = echarts.init(document.getElementById('networkFlow'));
	
	var placeHoledStyle = {
		normal:{
			barBorderColor:'rgba(0,0,0,0)',
			color:'rgba(0,0,0,0)'
		},
		emphasis:{
			barBorderColor:'rgba(0,0,0,0)',
			color:'rgba(0,0,0,0)'
		}
	};
	var dataStyle = { 
		normal: {
			label : {
				show: true,
				position: 'insideLeft',
				formatter: '{c}%'
			}
		}
	};
	
	var optionNetFlow = {
		title: {
			text: '网络信息',
			subtext: '',
			/* sublink: 'http://e.weibo.com/1341556070/AiEscco0H' */
		},
		tooltip : {
			trigger: 'axis',
			axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter : '{b}<br/>{a0}:{c0}%<br/>{a2}:{c2}%<br/>{a4}:{c4}%<br/>{a6}:{c6}%'
		},
		legend: {
			y: 55,
			itemGap : document.getElementById('networkFlow').offsetWidth / 8,
			data:['流入带宽使用率', '流出带宽使用率','收到的错误包率', '发送的错误包率']
		},
		toolbox: {
			show : true,
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		grid: {
			y: 80,
			y2: 30
		},
		xAxis : [
			{
				type : 'value',
				position: 'top',
				splitLine: {show: false},
				axisLabel: {show: false}
			}
		],
		yAxis : [
			{
				type : 'category',
				splitLine: {show: false},
				data : ['eht-0', 'eht-1', 'eht-2', 'eht-3']
			}
		],
		series : [
			{
				name:'流入带宽使用率',
				type:'bar',
				stack: '总量',
				itemStyle : dataStyle,
				data:[38, 50, 33, 72]
			},
			{
				name:'流入带宽使用率',
				type:'bar',
				stack: '总量',
				itemStyle: placeHoledStyle,
				data:[62, 50, 67, 28]
			},
			{
				name:'流出带宽使用率',
				type:'bar',
				stack: '总量',
				itemStyle : dataStyle,
				data:[61, 41, 42, 30]
			},
			{
				name:'流出带宽使用率',
				type:'bar',
				stack: '总量',
				itemStyle: placeHoledStyle,
				data:[39, 59, 58, 70]
			},
			{
				name:'收到的错误包率',
				type:'bar',
				stack: '总量',
				itemStyle : dataStyle,
				data:[37, 35, 44, 60]
			},
			{
				name:'收到的错误包率',
				type:'bar',
				stack: '总量',
				itemStyle: placeHoledStyle,
				data:[63, 65, 56, 40]
			},
			{
				name:'发送的错误包率',
				type:'bar',
				stack: '总量',
				itemStyle : dataStyle,
				data:[71, 50, 31, 39]
			},
			{
				name:'发送的错误包率',
				type:'bar',
				stack: '总量',
				itemStyle: placeHoledStyle,
				data:[29, 50, 69, 61]
			}
		]
	};          
						
	chartNetFlow.setOption(optionNetFlow);
	
	var timeTicket;
	clearInterval(timeTicket);	
	timeTicket = setInterval(function (){		
		/* optionNetFlow.xAxis[0].data.push((new Date()).toLocaleTimeString());
		if(optionNetFlow.xAxis[0].data.length>7){
			optionNetFlow.xAxis[0].data.shift();
		} */
		for(var i=0;i<optionNetFlow.series.length;i++){
			if (i%2 == 0) {
				optionNetFlow.series[i].data.push(Math.floor(Math.random()*100));
			}else{
				for(var j=0;j<4;j++){
					optionNetFlow.series[i].data[j]=100-optionNetFlow.series[i-1].data[j];
				}
			}			
			if(optionNetFlow.series[i].data.length>4){
				optionNetFlow.series[i].data.shift();
			}
		}
		chartNetFlow.setOption(optionNetFlow, true);
	}, 3000);

}();

var diskUsage = function(){
	var chartDiskUsage = echarts.init(document.getElementById('diskUsage'));
	var optionDiskUsage = {
		title : {
			text: '磁盘使用情况',
			subtext: ''
		},
		tooltip : {
			trigger: 'axis',
			axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			data:['已使用', '未使用']
		},
		toolbox: {
			show : true,
			orient: 'vertical',
			feature : {
				mark : {show: true},
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		calculable : true,
		xAxis : [
			{
				type : 'value',
				axisLabel : {
					formatter: '{value} GB'
				}
			}
		],
		yAxis : [
			{
				type : 'category',
				data : ['C:','D:','E:','F:','G:']
			}
		],
		series : [
			{
				name:'已使用',
				type:'bar',
				stack: '总量',
				itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
				data:[320, 302, 301, 334, 390]
			},			
			{
				name:'未使用',
				type:'bar',
				stack: '总量',
				itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
				data:[820, 832, 901, 934, 1290]
			}
		]
	};                                     
						
	chartDiskUsage.setOption(optionDiskUsage);

}();

