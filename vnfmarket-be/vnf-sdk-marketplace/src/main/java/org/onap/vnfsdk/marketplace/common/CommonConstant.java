/**
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

package org.onap.vnfsdk.marketplace.common;

public class CommonConstant {

    // Package Status
    public static final String PACKAGE_STATUS_DELETING = "deleting";

    public static final String PACKAGE_STATUS_DELETE_FAIL = "deleteFailed";

    public static final String PACKAGE_XML_FORMAT = "xml";

    public static final String PACKAGE_YAML_FORMAT = "yaml";

    // host image progress

    public static final String TOSCA_METADATA = "TOSCA-Metadata";

    public static final String CSAR_VERSION_META = "Version";

    public static final String CSAR_TYPE_META = "Type";

    public static final String CSAR_PROVIDER_META = "Provider";

    public static final String DEFINITIONS = "Definitions";

    public static final String CSAR_META = "csar.meta";

    public static final String MANIFEST = ".mf";

    public static final String MF_VERSION_META = "vnf_package_version";

    public static final String MF_PRODUCT_NAME = "vnf_product_name";

    public static final String MF_PROVIDER_META = "vnf_provider_id";

    public static final String MF_RELEASE_DATETIME = "vnf_release_date_time";

    public static final String CSAR_SUFFIX = ".csar";

    public static final String YAML_SUFFIX = ".yaml";

    public static final String HTTP_HEADER_CONTENT_RANGE = "Content-Range";

    public static final String CATALOG_CSAR_DIR_NAME = "/csar";

    public static final String REPORT_CSAR_DIR_NAME = "/reports";

    public static final String COMETD_CHANNEL_PACKAGE_DELETE = "/package/delete";

    public static final String SUCCESS_STR = "SUCCESS";

    public static final int ONBOARDING_THREAD_COUNT = 1;

    public static final int SUCESS = 0;

    public static final int FAILED = -1;

    public static final int HTTP_PORT = 8702;

    public static final int HTTPS_PORT = 8702;

    public static final String BASE_URL = "/onapui/vnfmarket";

    public static final String CATALOUGE_UPLOAD_URL = "/onapapi/catalog/v1/csars";

    private CommonConstant() {
        // Cannot create instance of the class
    }

    public static class FunctionTest {

        public static final String FUNCTEST_URL = "/onapapi/vnfsdk/v1/functest/";

        public static final String FUNCTEST_RESULT_URL = "/onapapi/vnfsdk/v1/functest/download/";

        public static final String FUNCTEST_OPERTYPE_ID = "functiontest";

        public static final String FUNCTEST_PACKAGE_EXISTS = "packageExists";

        public static final String FUNCTEST_EXEC = "functestexec";

        private FunctionTest() {
        }
    }

    public static class HttpContext {

        public static final String CONTENT_TYPE = "Content-Type";

        public static final String MEDIA_TYPE_JSON = "application/json;charset=UTF-8";

        public static final String MEDIA_TYPE_YAML = "text/yaml";

        public static final String URL = "url";

        public static final String METHOD_TYPE = "methodType";

        private HttpContext() {
        }
    }

    public static class LifeCycleTest {

        public static final String LIFECYCLE_TEST_URL = "/onapapi/nslcm/v1/vnfpackage";

        public static final String LIFECYCLE_TEST_OPERTYPE_ID = "lifecycletest";

        public static final String LIFECYCLE_TEST_EXEC = "lifecycleTestexec";

        private LifeCycleTest() {
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

    public static class MsbRegisterCode {

        public static final int MSDB_REGISTER_RETRIES = 12;

        public static final int MSDB_REGISTER_RETRY_SLEEP = 10000;

        public static final int MSDB_REGISTER_FILE_NOT_EXISTS = 2;

        public static final int MSDB_REGISTER_SUCESS = 0;

        public static final int MSDB_REGISTER_FAILED = -1;

        private MsbRegisterCode() {
        }
    }
}
