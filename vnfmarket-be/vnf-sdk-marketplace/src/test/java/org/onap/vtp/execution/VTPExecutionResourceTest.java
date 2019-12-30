/**
 * Copyright 2019 Huawei Technologies Co., Ltd.
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
package org.onap.vtp.execution;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import mockit.Mock;
import mockit.MockUp;
import org.junit.Before;
import org.junit.Test;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenRemoteCli;

import java.io.IOException;
import java.util.*;

import static org.junit.Assert.*;
public class VTPExecutionResourceTest {

    String requestId;
    VTPExecutionResource vtpExecutionResource;
    @Before
    public void setUp() throws Exception {
        vtpExecutionResource= new VTPExecutionResource();
        requestId = UUID.randomUUID().toString();
    }

    @Test
    public void testgetTestExecutionHandler() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(List<String> args) throws Exception {

                Result result = Result.newBuilder().build();
                return result;
            }
        };
        new MockUp<VTPResource>() {

            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
                JsonObject result = new JsonObject();
                result.addProperty("execution-id","1222");
                result.addProperty("start-time","12:00");
                result.addProperty("end-time","12:02");
                result.addProperty("request-id","1234");
                result.addProperty("product","onap");
                result.addProperty("service","vtp2ovp");
                result.addProperty("command","vtp2ovp");
                result.addProperty("profile","http");
                result.addProperty("status","PASS");
                result.addProperty("input","input");

                JsonObject output = new JsonObject();
                output.addProperty("test","test");
                result.add("output",output);

                return result;
            }
        };

        assertNotNull(vtpExecutionResource.getTestExecutionHandler("1234"));

    }

    @Test
    public void testlistTestExecutionsHandlerForGson() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(List<String> args) throws Exception {

                Result result = Result.newBuilder().build();
                return result;
            }
        };
        new MockUp<VTPResource>() {

            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
                JsonArray resultArray = new JsonArray();
                JsonObject result = new JsonObject();
                result.addProperty("execution-id","1222");
                result.addProperty("start-time","12:00");
                result.addProperty("end-time","12:02");
                result.addProperty("request-id","1234");
                result.addProperty("product","onap");
                result.addProperty("service","vtp2ovp");
                result.addProperty("command","vtp2ovp");
                result.addProperty("profile","http");
                result.addProperty("status","PASS");
                result.addProperty("input","input");

                JsonObject output = new JsonObject();
                output.addProperty("test","test");
                result.add("output",output);

                resultArray.add(result);
                return resultArray;
            }
        };
        assertNotNull(vtpExecutionResource.listTestExecutionsHandler(requestId,"VTP Scenario 1","testsuite-1","s1.ts1.testcase-1","open-cli-schema","2019-03-12T11:49:52.845","2020-03-12T11:49:52.845"));

    }

    class TestClass extends VTPResource{
        @Override
        public JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
            return super.makeRpcAndGetJson(args, timeout);
        }
    }
    @Test
    public void testmakeRpcAndGetJson() throws IOException, VTPError.VTPException {

        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(List<String> args) throws Exception {

                Result result = Result.newBuilder().build();

                return result;
            }
        };
        new MockUp<Result>() {

            @Mock
            public String getOutput() {

                String str = "{\"product\":\"onap-dublin\"}";

                return str;
            }
        };
        TestClass testClass = new TestClass();
        List<String> list = new ArrayList<>();
        list.add("abc");
        testClass.makeRpcAndGetJson(list,1000);
    }
}