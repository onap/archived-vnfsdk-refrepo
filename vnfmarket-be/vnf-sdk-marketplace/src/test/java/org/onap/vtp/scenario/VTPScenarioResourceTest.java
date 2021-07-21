/**
 * Copyright 2019 Huawei Technologies Co., Ltd.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.onap.vtp.scenario;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import mockit.Mock;
import mockit.MockUp;
import org.junit.Before;
import org.junit.Test;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.manager.DistManager;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.*;
import org.onap.vtp.scenario.model.VTPTestCase;

public class VTPScenarioResourceTest {

    VTPScenarioResource vtpScenarioResource;

    @Before
    public void setUp() throws Exception {
        vtpScenarioResource = new VTPScenarioResource();
    }

    @Test
    public void testListTestScenariosHandler() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout)
                    throws VTPError.VTPException, IOException {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"description\":\"its 4th release\"}]";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };
        new MockUp<DistManager>() {
            @mockit.Mock
            protected JsonElement getJsonResult(String url) {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"description\":\"its 4th release\"}]";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestScenariosHandler());
    }

    @Test
    public void testListTestSutiesHandler() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout)
                    throws VTPError.VTPException, IOException {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"service\":\"test\",\"description\":\"its 4th release\"}]";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };

        new MockUp<DistManager>() {
            @mockit.Mock
            protected JsonElement getJsonResult(String url) {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"service\":\"test\",\"description\":\"its 4th release\"}]";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestSutiesHandler("open-cli"));
    }

    @Test
    public void testListTestcasesHandler() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout)
                    throws VTPError.VTPException, IOException {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "[{\"command\":\"list-users\",\"service\":\"ut\"}]";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };
        new MockUp<DistManager>() {
            @mockit.Mock
            protected JsonElement getJsonResult(String url) {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "[{\"command\":\"list-users\",\"service\":\"ut\"}]";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };

        VTPTestCase vtpTestCases = vtpScenarioResource.listTestcasesHandler("testsuite", "open-cli").getTestCases()
                .get(0);
        assertNotNull(vtpTestCases);
    }

    public void testListTestcases() throws Exception {
        vtpScenarioResource.listTestcases("open-cli", "testsuite");
    }

    @Test(expected = Exception.class)
    public void testGetTestcase() throws Exception {
        vtpScenarioResource.getTestcase("open-cli", "testsuit", "testcase");
    }

    @Test
    public void testGetTestcaseHandler() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout)
                    throws VTPError.VTPException, IOException {
                JsonParser jsonParser = new JsonParser();
                String jsonvalue = "{\"schema\":{\"name\":\"cli\",\"product\":\"onap-dublin\",\"description\":\"its 4th release\","
                        + "\"service\":\"test\",\"author\":\"jitendra\",\"inputs\":[{\"name\":\"abc\",\"description\":\"abc\","
                        + "\"type\":\"abc\",\"is_optional\":\"yes\",\"default_value\":\"abc\",\"metadata\":\"abc\"}],"
                        + "\"outputs\":[{\"name\":\"abc\",\"description\":\"abc\",\"type\":\"abc\"}]}}";
                JsonElement jsonNode = jsonParser.parse(jsonvalue);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.getTestcaseHandler("open-cli", "testsuit", "testcase"));
    }
}