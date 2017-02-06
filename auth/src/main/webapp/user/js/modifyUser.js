/*
 * Copyright 2016-2017 Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(document).ready(function() {
    var USER_SERVICE = "/openoapi/auth/v1/users";
    var ROLE_SERVICE = "/openoapi/auth/v1/roles";
    var userId;
    var roleMap=[];
    function initialPage() {
        userId = getId();
        getUserDetails(userId).done(function(data) {
            listUserDetails(data);
        });

        //init listener
    $(".dropdown dt a").on('click', function() {
    $(".dropdown dd ul").slideToggle('fast');
    });

    $(".dropdown dd ul li a").on('click', function() {
      $(".dropdown dd ul").hide();
    });

    function getSelectedValue(id) {
      return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function(e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    });

		$('.mutliSelect input[type="checkbox"]').on('click', function() {
			if($('.hida')[0].innerHTML=='Please select roles')
			{
			$('.hida')[0].innerHTML='';    
			}
			
		  var title;
		  if($('.multiSel').text() ==='')
		  {
			title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
			title = $(this).val();
			}
			else
			{
			title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
			title ="," + $(this).val();
			
			}
			var oldText=$('.hida')[0].innerHTML;
		  if ($(this).is(':checked')) {
			if(oldText.length>0)
			{
				$('.hida')[0].innerHTML=oldText+','+title;
			}
			else
			{
				 $('.hida')[0].innerHTML=title;    
			}

		  } else {
		   
		   var rolesData = oldText.split(',');
		   var rolesList='';
			 for (var i = 0; i < rolesData.length ; i++) {
				   if(title!=rolesData[i])
				   {
					if(i==0 || rolesList.length==0 )
					{
					rolesList=rolesData[i];
					}
					else
					{
					rolesList=rolesList+','+rolesData[i];
					}
				   }
				}
				if(rolesList.length ==0)
				{
					rolesList='Please select roles';
				}
			 $('.hida')[0].innerHTML=rolesList;   
		  
		  }
		});

        /*initial the event*/
        $("#confirm").click(function(e) {
            var data = getModifyUser();
            modifyUser(data).done(function() {
                window.document.location = "/openoui/user/user.html";
            })
        })
        $("#cancel").click(function(e) {
            window.document.location = "/openoui/user/user.html";
        })
    }

    function getModifyUser() {
        var data = {};
        data.description = $("#description").val();
        data.email = "xxxx@xxxx.com";
        //get roles
        var roles=[];
        var rolesData = $('.hida').text().split(',');
        for (var i = 0; i < rolesData.length ; i++) {
            var temp = {};
            temp.name=rolesData[i];
            temp.id=roleMap[rolesData[i]];
            roles.push(temp);
        }
        data.roles=roles;
        return data;
    }
    function getUserDetails(id) {
        return Rest.http({
            url: USER_SERVICE + "/" + id + "?=" + new Date().getTime(),
            type: "GET",
            async: false,
            contentType: 'application/json',
            dataType: "json"
        })
    }

    function listUserDetails(data) {
        $("#userName").val(data.name);
        $("#description").val(data.description);
        var roles=formatRoles(data);
        var rolesList='';
        for (var i = 0; i < roles.length; i++) {
           if(i==0 || rolesList.length==0 )
            {
            rolesList=roles[i].name;
            }
            else
            {
            rolesList=rolesList+','+roles[i].name;
            }
        }
        if(rolesList.length ==0)
        {
            rolesList='Please select roles';
        }
        $('.hida')[0].innerHTML=rolesList; 
     

        //get and initialize roles
         getRolesList().done(function(data) {
                                    var allRoles = formatRoles(data);
                                     for (var i = 0; i < allRoles.length; i++) {
                                        var isExists=false;
                                        for (var j = 0; j < roles.length; j++) {
                                        if( roles[j].name== allRoles[i].name)
                                        {
                                        isExists=true;
                                        break;
                                        }
                                        }
                                         if(isExists)
                                        {
                                         var html = '<li><input type="checkbox" checked=true value="' + allRoles[i].name + '"/>' + allRoles[i].name + '</li>';
                                         $('.mutliSelect ul').append(html);
                                        }
                                        else
                                        {
                                         var html = '<li><input type="checkbox" value="' + allRoles[i].name + '"/>' + allRoles[i].name + '</li>';
                                         $('.mutliSelect ul').append(html);
                                        }
                                    }
                                })
    }


        function getRolesList() {
        return Rest.http({
            url: ROLE_SERVICE + "?=" + new Date().getTime(),
            type: "GET",
            async: false,
            contentType: 'application/json',
            'beforeSend' : function(xhr) {
            xhr.setRequestHeader("X-Auth-Token", "ffbf55c328464a9dbb1920aca768e0d2");
    },
            dataType: "json"
        })
    }

     function formatRoles(data) {
        var rolesData = [];
        for (var i = 0; i < data.roles.length; i++) {
            var temp = {};
            temp.roleid = data.roles[i].id;
            temp.name = data.roles[i].name;
            rolesData.push(temp);
            roleMap[temp.name]=temp.roleid;
        }
        return rolesData;
    }

    function modifyUser(data) {
        return Rest.http({
            url: USER_SERVICE + "/" + userId + "?=" + new Date().getTime(),
            type: "PATCH",
            async: false,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(data)
        })
    }

    function getId() {
        var qs = location.search;
        qs = qs.indexOf("?") === 0 ? qs : ("?" + qs);
        var start = qs.indexOf("id=") + 3;
        var end = qs.indexOf("&") === -1 ? qs.length : qs.indexOf("&") - start;
        return qs.substr(start, end);
    }

    initialPage();
})