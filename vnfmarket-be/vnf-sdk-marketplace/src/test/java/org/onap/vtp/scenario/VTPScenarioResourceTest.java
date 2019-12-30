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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import mockit.Mock;
import mockit.MockUp;
import org.junit.Before;
import org.junit.Test;
import org.onap.vtp.VTPResource;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.*;

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
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"description\":\"its 4th release\"}]";
                JsonArray jsonNode = mapper.fromJson(jsonvalue,JsonArray.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestScenariosHandler());
    }

    @Test
    public void testListTestSutiesHandler() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"service\":\"test\",\"description\":\"its 4th release\"}]";
                JsonArray jsonNode = mapper.fromJson(jsonvalue,JsonArray.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestSutiesHandler("open-cli"));
    }

    @Test(expected = Exception.class)
    public void testListTestcasesHandler() throws Exception {
        vtpScenarioResource.listTestcasesHandler("testsuite", "open-cli");
    }

//    @Test(expected = Exception.class)
//    public void testListTestcases() throws Exception {
//        vtpScenarioResource.listTestcases("open-cli", "testsuite");
//    }

    @Test(expected = Exception.class)
    public void testGetTestcase() throws Exception {
        vtpScenarioResource.getTestcase("open-cli", "testsuit", "testcase");
    }

    @Test
    public void testGetTestcaseHandler() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();

                String jsonvalue = "{\"schema\":{\"name\":\"cli\",\"product\":\"onap-dublin\",\"description\":\"its 4th release\"," +
                        "\"service\":\"test\",\"author\":\"jitendra\",\"inputs\":[{\"name\":\"abc\",\"description\":\"abc\"," +
                        "\"type\":\"abc\",\"is_optional\":\"yes\",\"default_value\":\"abc\",\"metadata\":{\"abc\":\"abc\"}}]," +
                        "\"outputs\":[{\"name\":\"abc\",\"description\":\"abc\",\"type\":\"abc\"}]}}";
                JsonObject jsonNode = mapper.fromJson(jsonvalue,JsonObject.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.getTestcaseHandler("open-cli", "testsuit", "testcase"));
    }

    @Test
    public void testListTestScenariosHandlerForGson() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"description\":\"its 4th release\"}]";
                JsonArray jsonNode = mapper.fromJson(jsonvalue,JsonArray.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestScenariosHandler());
    }
    @Test
    public void testListTestScenariosHandlerForGsonWithProductChange() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();
                String jsonvalue = "[{\"product\":\"open-cli\",\"description\":\"its 4th release\"}]";
                JsonArray jsonNode = mapper.fromJson(jsonvalue,JsonArray.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestScenariosHandler());
    }

    @Test
    public void testListTestSutiesHandlerForGson() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();
                String jsonvalue = "[{\"product\":\"onap-dublin\",\"service\":\"test\",\"description\":\"its 4th release\"}]";
                JsonArray jsonNode = mapper.fromJson(jsonvalue,JsonArray.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestSutiesHandler("open-cli"));
    }

    @Test
    public void testListTestcasesHandlerForGson() throws Exception
    {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();
                String jsonvalue = "[{\"command\":\"hello\",\"service\":\"test\"}]";
                JsonArray jsonNode = mapper.fromJson(jsonvalue,JsonArray.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.listTestcasesHandler("testsuite","open-cli"));
    }

    @Test
    public void testGetTestcaseHandlerForGson() throws Exception {
        new MockUp<VTPResource>() {
            @Mock
            public JsonElement makeRpcAndGetJson(List<String> args) throws IOException {
                Gson mapper = new Gson();

                String jsonvalue = "{\"schema\":{\"name\":\"cli\",\"product\":\"onap-dublin\",\"description\":\"its 4th release\"," +
                        "\"service\":\"test\",\"author\":\"jitendra\",\"inputs\":[{\"name\":\"abc\",\"description\":\"abc\"," +
                        "\"type\":\"abc\",\"is_optional\":\"yes\",\"default_value\":\"abc\",\"metadata\":{\"abc\":\"abc\"}}]," +
                        "\"outputs\":[{\"name\":\"abc\",\"description\":\"abc\",\"type\":\"abc\"}]}}";
                JsonObject jsonNode = mapper.fromJson(jsonvalue,JsonObject.class);
                return jsonNode;
            }
        };
        assertNotNull(vtpScenarioResource.getTestcaseHandler("open-cli", "testsuit", "testcase"));
    }

}