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

package org.openo.vnfsdk.marketplace.rest;


public class RestConstant {

    public static final String UNAME_KEY = "UNAME_KEY";

    public static final String PWD_KEY = "PWD_KEY";

    public static final String NETCONF = "NETCONF";

    public static final String ASYNC = "ASYNC";

    public static final String SYNC = "SYNC";

    public static final String HEADERMAP_TYPE = "HEADERMAP_TYPE";

    public static final String HEADERMAP_VALUE = "HEADERMAP_VALUE";

    public static final String AUTH_TOKEN = "AUTH_TOKEN";

    public static final String DEFAULT_HOST_ADDRESS = "localhost";

    public static final int DEFAULT_PORT = 8080;

    public static final int DEFAULT_MAX_CONNECTION_PER_CONTROLLER = 10;

    public static final int DEFAULT_STRING_LENGTH_64 = 64;

    public static final int DEFAULT_STRING_LENGTH_128 = 128;
    
    public static final int RESPONSE_CODE_200 = 200;
    
    public static final int RESPONSE_CODE_201 = 201;

    public static class HttpContext {

        public static final String CONTENT_TYPE = "Content-Type";

        public static final String MEDIA_TYPE_JSON = "application/json;charset=UTF-8";

        public static final String URL = "url";

        public static final String METHOD_TYPE = "methodType";

        private HttpContext() {
        }
    }


    public static class MethodType {

        public static final String POST = "post";

        public static final String DELETE = "delete";

        public static final String PUT = "put";

        public static final String GET = "get";

        private MethodType() {
        }
    }

    private RestConstant() {
    }
}
