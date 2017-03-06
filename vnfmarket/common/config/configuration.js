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
            "common": {
                "baseUrl": "http://54.254.186.22:3000"
            },
            "api": {
                "home": {
                    "postServiceUpload": {
                        "url": "/Demo/rest/PackageResource/csars",
                        "method": "POST"
                    },
                    "getFeaturesList": {
                        "url": "/Demo/rest/PackageResource/csars",
                        "method": "GET"
                    },
                    "downloadServiceFile": {
                        "url": "/Demo/rest/PackageResource/csars/:csarId/files",
                        "method": "GET"
                    },
                    "serviceDelete": {
                        "url": "/Demo/rest/PackageResource/csars/:csarId",
                        "method": "DELETE"
                    },
                    "serviceDetails": {
                        "url": "/Demo/rest/PackageResource/csars/:csarId",
                        "method": "GET"
                    }
                }
            },
            "modulePath": {
                "home": "vnfmarket/app/modules/home"
            }
        })
})();