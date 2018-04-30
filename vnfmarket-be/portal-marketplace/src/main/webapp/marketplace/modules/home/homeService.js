/*

    Copyright 2016-2017, Huawei Technologies Co., Ltd.

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
(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.service:homeService
	* @description
	* # homeService
	* Service of the app
	*/

	angular.module('vnfmarket')
		.factory('homeService', homeService);

	homeService.$inject = ['$http'];

	function homeService($http) {

		/*var list = [
			{"feature": "Implemented Best Practices, following: John Papa's Guide"},
			{"feature": "Using Controller AS syntax"},
			{"feature": "Wrap Angular components in an Immediately Invoked Function Expression (IIFE)"},
			{"feature": "Declare modules without a variable using the setter syntax"},
			{"feature": "Using named functions"},
			{"feature": "Including Unit test with Karma"},
			{"feature": "Including UI options for Bootstrap or Angular-Material"},
			{"feature": "Including Angular-Material-Icons for Angular-Material UI"},
			{"feature": "Dynamic Menu generator for both themes"},
			{"feature": "Grunt task for Production and Development"}
		];*/
		var services = [
        {
          "name": "vEPC",
          "vendor": "Huawei",
          "date": "2016-11-21 23:06",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 20,
          "type":"gs-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "vFirewall",
          "vendor": "Huawei",
          "date": "2016-11-23 22:09",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 25,
          "type":"gs-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "vIMS",
          "vendor": "Huawei",
          "date": "2016-10-21 12:04",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 10,
          "type":"sdn-o",
          "size":"104800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "vLoadbalance",
          "vendor": "ZTE",
          "date": "2016-11-20 05:06",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 319,
          "type":"sdn-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "vCPE",
          "vendor": "ZTE",
          "date": "2016-11-03 23:06",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 234,
          "type":"nfv-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "openimscore",
          "vendor": "Intel",
          "date": "2016-11-20 17:06",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 45,
          "type":"nfv-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "openims",
          "vendor": "Intel",
          "date": "2016-11-20 12:06",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 21,
          "type":"sdn-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "vCPE",
          "vendor": "Huawei",
          "date": "2016-11-19 23:06",
          "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum fringilla laoreet. Nulla facilisi. Maecenas consequat tristique odio, in consectetur leo volutpat vitae. Ut porttitor iaculis metus sed tincidunt. Etiam facilisis nec nisi at tempus. Curabitur ultrices molestie dictum. Integer placerat varius lorem, id cursus augue vulputate quis. Nulla pulvinar vel nunc vel lacinia. Aliquam eleifend, ipsum in sodales dictum, mi risus dictum est, non hendrerit neque elit et turpis. Integer lacus massa, pulvinar eget porttitor vel, ultrices in elit. Ut convallis semper gravida. Sed mollis leo est, eget consectetur dui vestibulum a. Phasellus non augue id diam malesuada ultrices. Praesent id nunc vehicula, dapibus quam in, rhoncus lorem. Praesent mattis elit a ex elementum, vel imperdiet risus tempor. Aliquam laoreet mauris nec egestas eleifend.",
          "downloads": 408,
          "type":"nfv-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        },
        {
          "name": "vCPE",
          "vendor": "Siemens",
          "date": "2016-11-20 12:06",
          "desc": "Dolore ex deserunt aute fugiat aute nulla ea sunt aliqua nisi cupidatat eu. Nostrud in laboris labore nisi amet do dolor eu fugiat consectetur elit cillum esse",
          "downloads": 120,
          "type":"sdn-o",
          "size":"204800",
          "down_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 17:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 10:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 00:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:32"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 20:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ],
          "upl_history":[
            {
              "user":"user_001",
              "time": "2016-11-30 15:31"
            },
            {
              "user":"user_002",
              "time": "2016-11-30 14:31"
            },
            {
              "user":"user_003",
              "time": "2016-11-30 11:01"
            },
            {
              "user":"user_004",
              "time": "2016-11-30 14:03"
            },
            {
              "user":"user_005",
              "time": "2016-11-30 10:31"
            },
            {
              "user":"user_006",
              "time": "2016-11-29 19:12"
            },
            {
              "user":"user_007",
              "time": "2016-11-28 02:31"
            },
            {
              "user":"user_008",
              "time": "2016-11-20 09:11"
            }
          ]
        }
      ];

		return {
			getFeaturesList: getFeaturesList
		};

		function getFeaturesList() {
			return services;
		}

	}

})();
