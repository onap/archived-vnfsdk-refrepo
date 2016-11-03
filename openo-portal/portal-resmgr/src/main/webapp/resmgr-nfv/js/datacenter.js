function trim(str) {

	return str.replace(/(^\s*)|(\s*$)/g, '');
}
function hideFirstCol() {
	$('table tr').find('th:eq(0)').hide();
	$('table tr').find('td:eq(0)').hide();
}

function deleteDatacenter(objectId) {
	var requestUrl = app_url + "/openoapi/resmgr/v1/datacenters/" + objectId;
	$.ajax({
		type : "DELETE",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			$('#Datacenter_table').bootstrapTable('remove', {
				field : 'id',
				values : [ objectId ]
			});
			bootbox.alert("Delete  successfull !!!");
			hideFirstCol();
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox.alert("Error on deleting data: " + xhr.responseText);
		}
	});
}

function loadDatacenterData() {
	var requestUrl = app_url + "/openoapi/resmgr/v1/datacenters";
	$.ajax({
		type : "GET",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			$.each(jsonobj.datacenters, function(n, v) {
				v.cpu = "used:" + v.usedCPU + "<br>total:" + v.totalCPU;
				v.memory = "used:" + v.usedMemory + "<br>total:"
						+ v.totalMemory;
				v.hardDisk = "used:" + v.usedDisk + "<br>total:" + v.totalDisk;
			});
			$('#Datacenter_table').bootstrapTable({
				data : jsonobj.datacenters
			});
			$('#Datacenter_table').bootstrapTable('refresh');
			hideFirstCol();
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox.alert("Error on getting site data : " + xhr.responseText);
		}
	});
	$('#location_table').bootstrapTable('refresh');
	hideFirstCol();
}
function loadNetWorkData() {
	var requestUrl = app_url + "/openoapi/resmgr/v1/networks";
	$.ajax({
		type : "GET",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			$('#network_table').bootstrapTable({
				data : jsonobj.networks
			});
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox.alert("Error on getting site data : " + xhr.responseText);
		}
	});
}
function loadPortData() {
	var requestUrl = app_url + "/openoapi/resmgr/v1/ports";
	$.ajax({
		type : "GET",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			$('#port_table').bootstrapTable({
				data : jsonobj.ports
			});
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox.alert("Error on getting site data : " + xhr.responseText);
		}
	});
}
function loadHostData() {
	var requestUrl = app_url + "/openoapi/resmgr/v1/hosts";
	$.ajax({
		type : "GET",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			$('#host_table').bootstrapTable({
				data : jsonobj.hosts
			});
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox.alert("Error on getting site data : " + xhr.responseText);
		}
	});
}

function fillCountryData() {

	var requestUrl = app_url + "/openoapi/resmgr/v1/locations/country";
	var htmlContent = "<option value=''>--select--</option>";
	$.ajax({
		type : "GET",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			var str = jsonobj.data.replace('[', '').replace(']', '').split(',')
			$.each(str, function(n, v) {
				htmlContent += "<option value='" + v + "'>" + v + "</option>";
				$("#country").html(htmlContent);

			});
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox
					.alert("Error on getting country data : "
							+ xhr.responseText);
		}
	});
}

function fillVimNameData() {

	var requestUrl = app_url + "/openoapi/resmgr/v1/datacenters/vims";
	var htmlContent = "<option value=''>--select--</option>";
	$.ajax({
		type : "GET",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
			var str = jsonobj.data;
			$.each(str, function(n, v) {
				htmlContent += "<option value='" + v.vimId + "'>" + v.name
						+ "</option>";
				$("#vimName").html(htmlContent);

			});
		},
		error : function(xhr, ajaxOptions, thrownError) {
			bootbox
					.alert("Error on getting country data : "
							+ xhr.responseText);
		}
	});
}

$(function() {
	$("#vmAppForm").validate({
		rules : {
			country : "required",
			location : "required",
			lantitude : "required",
			longitude : "required"
		}
	});

	$('.close,.button-previous').click(function() {
		$('#vmAppDialog').removeClass('in').css('display', 'none');
	});
	$('.detail-top ul li').click(function() {
		$(this).addClass('current').siblings().removeClass('current');
	});
	$('.basic').click(function() {
		$('#flavorTab').css('display', 'none');
	});

	$('.table tbody tr').click(
			function() {
				$(this).addClass('openoTable_row_selected').siblings()
						.removeClass('openoTable_row_selected');
			});
	$('.table tr:odd').addClass('active');
	$('#false').click(function() {
		$('#vmAppForm')[0].reset();
		$('#vmAppDialog').addClass('in').css({
			'display' : 'block'
		});
	});
	$('.close,.button-previous').click(function() {
		$('#vmAppDialog').removeClass('in').css('display', 'none');
	});

	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	$('#createDatacenter').click(function() {

		var formData = JSON.stringify($("#vmAppForm").serializeObject());
		var jsonobj = JSON.parse(formData);
		var requestUrl = app_url + "/openoapi/resmgr/v1/datacenters";
		$.ajax({
			type : "POST",
			url : requestUrl,
			contentType : "application/json",
			dataType : "json",
			data : formData,
			success : function(jsonResp) {
				loadDatacenterData();
				bootbox.alert(jsonResp.msg, function() {
					window.location.reload();
				});
				$('#vmAppDialog').removeClass('in').css({
					'display' : 'none'
				});
			},
			error : function(xhr, ajaxOptions, thrownError) {
				bootbox.alert("Error on page : " + xhr.responseText);
			}
		});
	});

	$('#country')
			.change(
					function() {
						var country = $(this).children('option:selected').val();
						country = trim(country);
						var requestUrl = app_url
								+ "/openoapi/resmgr/v1/locations/locationbycountry?country="
								+ country;
						var htmlContent = "<option value=''>--select--</option>";
						$
								.ajax({
									type : "GET",
									url : requestUrl,
									contentType : "application/json",
									success : function(jsonobj) {
										var str = jsonobj.data.replace('[', '')
												.replace(']', '').split(',')
										$.each(str, function(n, v) {
											htmlContent += "<option value='"
													+ v + "'>" + v
													+ "</option>";
											$("#location").html(htmlContent);
										});

									},
									error : function(xhr, ajaxOptions,
											thrownError) {
										bootbox
												.alert("Error on getting location data : "
														+ xhr.responseText);
									}
								});

					})

	$('#vimName').change(
			function() {
				var vimName = $(this).children('option:selected').val();
				vimName = trim(vimName);
				var requestUrl = app_url + "/openoapi/resmgr/v1/limits?vimId="
						+ vimName;
				$.ajax({
					type : "GET",
					url : requestUrl,
					contentType : "application/json",
					success : function(jsonobj) {
						$('#totalCPU').html(jsonobj.totalCPU);
						$('#totalMemory').html(jsonobj.totalMemory);
						$('#totalDisk').html(jsonobj.totalDisk);
						
					},
					error : function(xhr, ajaxOptions, thrownError) {
						bootbox.alert("Error on getting data : "
								+ xhr.responseText);
					}
				});

				// fresh data
				refreshDatas(vimName);

			})

})

/**
 * 
 * @param vimId
 * @returns
 */
function refreshDatas(vimId) {
	var requestUrl = app_url
			+ "/openoapi/resmgr/v1/resoperate/updateres?vimId=" + vimId;
	$.ajax({
		type : "PUT",
		url : requestUrl,
		contentType : "application/json",
		success : function(jsonobj) {
		},
		error : function(xhr, ajaxOptions, thrownError) {
//			bootbox.alert("Error on getting site data : " + xhr.responseText);
		}
	});
}