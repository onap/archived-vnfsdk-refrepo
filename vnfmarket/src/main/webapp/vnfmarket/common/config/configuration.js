/*
 * Copyright 2017 Huawei Technologies Co., Ltd.
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
(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name app.service:homeService
     * @description
     * # homeService
     * Service of the app
     */
    'use strict';
    angular
        .module('vnfmarket')
        .constant("vnfConfig", {
            "api": {
                "home": {
                    "postServiceUpload": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars",
                        "method": "POST"
                    },
					"repostServiceUpload": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId/reupload",
                        "method": "POST"
                    },
                    "getFeaturesList": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars",
                        "method": "GET"
                    },
                    "downloadServiceFile": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId/files",
                        "method": "GET"
                    },
                    "serviceDelete": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId",
                        "method": "DELETE"
                    },
                    "serviceDetails": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId",
                        "method": "GET"
                    },
					"getFunctionTestDetails" : {
						"url" : "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId/operresult?operTypeId=functiontest",
						"method" : "GET"
					},
					"updateDownloadCount" :{
						"url" : "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId/downloaded",
						"method" : "GET"
					},
					"getOnBoardingSteps": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/onboardsteps",
                        "method": "GET"
                    },
                    "getFunctionalList": {
                        "url": "/openoapi/vnfsdk-marketplace/v1/PackageResource/csars/:csarId/onboardstatus",
                        "method": "GET"
                    }
                }
            },
            "modulePath": {
                "home": "vnfmarket/app/modules/home"
            }
        })
})();