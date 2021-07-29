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

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import mockit.MockUp;

import org.apache.http.Header;
import org.apache.http.HeaderIterator;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ProtocolVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.params.HttpParams;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.onap.vtp.execution.model.VTPTestExecution;
import org.onap.vtp.manager.DistManager;
import org.onap.vtp.manager.model.Tester;
import org.open.infc.grpc.Output;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenRemoteCli;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;

import java.io.IOException;
import java.util.*;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.WebTarget;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
@RunWith(MockitoJUnitRunner.class)
public class VTPExecutionResourceTest {

    String requestId;
    VTPExecutionResource vtpExecutionResource;
    @Before
    public void setUp() throws Exception {
        requestId = UUID.randomUUID().toString();
    }
    @Test(expected = Exception.class)
    public void testExecuteHandler() throws Exception
    {
        VTPTestExecution.VTPTestExecutionList executions= new VTPTestExecution.VTPTestExecutionList();
        List<VTPTestExecution> list= new ArrayList<>();
        JsonParser jsonParser = new JsonParser();
        String jsonString = "{\"name\":\"Mahesh Kumar\", \"age\":\"nine\",\"verified\":\"false\"}";
        JsonElement rootNode = jsonParser.parse(jsonString);

        VTPTestExecution vtp=new VTPTestExecution();
        vtp.setEndTime("2019-03-12T11:49:52.845");
        vtp.setProfile("abc");
        vtp.setStatus("pass");
        vtp.setRequestId(requestId);
        vtp.setExecutionId("executionid");
        vtp.setParameters(rootNode);
        vtp.setResults(rootNode);
        vtp.setScenario("open-cli");
        vtp.setStartTime("2019-04-12T11:49:52.845");
        vtp.setTestCaseName("testcase");
        vtp.setTestSuiteName("testsuite");
        list.add(vtp);
        executions.setExecutions(list);
        //System.out.println(executions.getExecutions());
        assertNotNull(executions.getExecutions());
        vtpExecutionResource = new VTPExecutionResource();
       vtpExecutionResource.executeHandler(executions,null);
       // vtpExecutionResource.executeHandler(executions,requestId);

    }
    @Test
    public void testExecuteHandlerForGsonCoverage() throws Exception
    {
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected Output makeRpc(String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode) throws VTPError.VTPException {
                String dummyValue = "{\"execution-id\":\"execution-id\"}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue,Output.class);
            }
        };
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected Output makeRpc(String testSuite,String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode) throws VTPError.VTPException {
                String dummyValue = "{\"execution-id\":\"execution-id\"}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue,Output.class);
            }
        };
        new MockUp<Output>(){
            @mockit.Mock
            public Map<String, String> getAddonsMap() {
                String dummyValue = "{\"execution-id\":\"execution-id\"}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue,Map.class);
            }
        };
        new MockUp<Output>(){
            @mockit.Mock
            public Map<String, String> getAttrsMap() {
                String dummyValue = "{\"results\":[{\"execution-id\":\"execution-id\"}]}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue,Map.class);
            }
        };
        new MockUp<Output>(){
            @mockit.Mock
            public boolean getSuccess() {
                return true;
            }
        };
        VTPTestExecution.VTPTestExecutionList executions= new VTPTestExecution.VTPTestExecutionList();
        List<VTPTestExecution> list= new ArrayList<>();
        JsonParser jsonParser = new JsonParser();
        String jsonString = "{\"name\":\"Mahesh Kumar\", \"age\":\"nine\",\"verified\":\"false\"}";
        JsonElement rootNode = jsonParser.parse(jsonString);

        VTPTestExecution vtp=new VTPTestExecution();
        vtp.setEndTime("2019-03-12T11:49:52.845");
        vtp.setProfile("abc");
        vtp.setStatus("pass");
        vtp.setRequestId(requestId);
        vtp.setExecutionId("executionid");
        vtp.setParameters(rootNode);
        vtp.setResults(rootNode);
        vtp.setScenario("open-cli");
        vtp.setStartTime("2019-04-12T11:49:52.845");
        vtp.setTestCaseName("testcase");
        vtp.setTestSuiteName("testsuite");
        list.add(vtp);
        executions.setExecutions(list);
        //System.out.println(executions.getExecutions());
        assertNotNull(executions.getExecutions());
        vtpExecutionResource = new VTPExecutionResource();
       assertNotNull(vtpExecutionResource.executeHandler(executions,null));
       // vtpExecutionResource.executeHandler(executions,requestId);

    }
    @Test
    public void testExecuteHandlerForGsonCoverageNegative() throws Exception
    {
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected Output makeRpc(String scenario, String requestId, String profile, String testCase,
                    JsonElement argsJsonNode) throws VTPError.VTPException {
                String dummyValue = "{\"execution-id\":\"execution-id\"}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue, Output.class);
            }
        };
         new MockUp<VTPResource>(){
                @mockit.Mock
                protected Output makeRpc(String testSuite,String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode) throws VTPError.VTPException {
                    String dummyValue = "{\"execution-id\":\"execution-id\"}";
                    Gson gson = new Gson();
                    return gson.fromJson(dummyValue,Output.class);
                }
            };
        new MockUp<Output>(){
            @mockit.Mock
            public Map<String, String> getAddonsMap() {
                String dummyValue = "{\"execution-id\":\"execution-id\"}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue,Map.class);
            }
        };
        new MockUp<Output>(){
            @mockit.Mock
            public Map<String, String> getAttrsMap() {
                String dummyValue = "{\"error\":\"DummyError occurs\"}";
                Gson gson = new Gson();
                return gson.fromJson(dummyValue,Map.class);
            }
        };
        new MockUp<Output>(){
            @mockit.Mock
            public boolean getSuccess() {
                return false;
            }
        };
        new MockUp<OpenRemoteCli>(){
            @mockit.Mock
            public Output invoke(String arg0, String arg1, String arg2, Map<String, String> arg3) throws Exception{
                 String dummyValue = "{\"execution-id\":\"execution-id\"}";
                 Gson gson = new Gson();
                 return gson.fromJson(dummyValue,Output.class);
            }
        };
        new MockUp<DistManager>(){
            @mockit.Mock
            protected Tester httpRequestTestcase(String testSuite, String scenario, String testCase)  { 
          Tester tester =  new Tester();
        tester.setId("1");
        tester.setIp("localhost");
        tester.setPort(50051);
        tester.setTesterId("123");
        return tester;
        }

        };
        VTPTestExecution.VTPTestExecutionList executions= new VTPTestExecution.VTPTestExecutionList();
        List<VTPTestExecution> list= new ArrayList<>();
        JsonParser jsonParser = new JsonParser();
        String jsonString = "{\"name\":\"Mahesh Kumar\", \"age\":\"nine\",\"verified\":\"false\"}";
        JsonElement rootNode = jsonParser.parse(jsonString);

        VTPTestExecution vtp=new VTPTestExecution();
        vtp.setEndTime("2019-03-12T11:49:52.845");
        vtp.setProfile("abc");
        vtp.setStatus("pass");
        vtp.setRequestId(requestId);
        vtp.setExecutionId("executionid");
        vtp.setParameters(rootNode);
        vtp.setResults(rootNode);
        vtp.setScenario("open-cli");
        vtp.setStartTime("2019-04-12T11:49:52.845");
        vtp.setTestCaseName("testcase");
        vtp.setTestSuiteName("testsuite");
        list.add(vtp);
        executions.setExecutions(list);
        //System.out.println(executions.getExecutions());
        assertNotNull(executions.getExecutions());
        vtpExecutionResource = new VTPExecutionResource();
       assertNotNull(vtpExecutionResource.executeHandler(executions,null));
       // vtpExecutionResource.executeHandler(executions,requestId);

    }
    public void testListTestExecutionsHandler() throws Exception
    {
        vtpExecutionResource = new VTPExecutionResource();
        vtpExecutionResource.listTestExecutionsHandler(requestId,"abc","abc","abc","abc","123","123",1,0);
    }
    @Test
    public void testListTestExecutionsHandlerForGson() throws Exception
    {
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
                String values = "[{\"start-time\":\"start-time\", \"end-time\":\"end-time\", " +
                        "\"request-id\":\"request-id\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"execution-id\"}]";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected JsonElement makeRpcAndGetJson(List<String> args,int count,int index, int timeout) throws VTPError.VTPException, IOException {
                String values = "[{\"start-time\":\"start-time\", \"end-time\":\"end-time\", " +
                        "\"request-id\":\"request-id\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"execution-id\"}]";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        vtpExecutionResource = new VTPExecutionResource();
        assertNotNull(vtpExecutionResource.listTestExecutionsHandler(requestId,"abc","abc","abc","abc","123","123",1,0));
    }
    @Test
    public void testListTestExecutionsHandlerTestmakeRpcAndGetJson() throws Exception
    {
        VTPExecutionResource vtpExecutionResource1 = new VTPExecutionResource();
        VTPResource vtpResource = new VTPResource();

        new MockUp<VTPResource>(){
            @mockit.Mock
            protected Result makeRpc(List <String> args, int timeout) throws VTPError.VTPException {
                Result result = Result.newBuilder().build();
                return result;
            }
        };
        new MockUp<Result>(){
            @mockit.Mock
            public String getOutput() {
                return "[{\"product\":\"tutorial\"}]";
            }
        };
        VTPTestExecution.VTPTestExecutionList vtpTestExecutionList = vtpExecutionResource1.listTestExecutionsHandler(requestId,"tutorial","ut","list-users","abc","123","123",1,0);
        assertTrue(vtpTestExecutionList.getExecutions().size()>0);
    }
    public void testListTestExecutions() throws Exception
    {
        vtpExecutionResource = new VTPExecutionResource();
        vtpExecutionResource.listTestExecutions(requestId,"abc","abc","abc","abc","123","123",1,0);
    }
    public void testGetTestExecution() throws Exception
    {
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        vtpExecutionResource = new VTPExecutionResource();
        assertNotNull(vtpExecutionResource.getTestExecution("1234"));
    }
    public void testGetTestExecutionHandler() throws Exception
    {
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        vtpExecutionResource = new VTPExecutionResource();
        assertNotNull(vtpExecutionResource.getTestExecutionHandler("1234"));
    }
    @Test
    public void testGetTestExecutionHandlerForGson() throws Exception
    {
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
                String values = "{\"start-time\":\"start-time\", \"end-time\":\"end-time\", " +
                        "\"request-id\":\"request-id\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"execution-id\"," +
                        "\"input\": \"[]\", \"output\":\"[]\"}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        vtpExecutionResource = new VTPExecutionResource();
        assertNotNull(vtpExecutionResource.getTestExecutionHandler("1234"));
    }
    @Test
    public void testGetTestExecutionHandlerForGsonWithResultNull() throws Exception
    {
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
                String values = "{\"start-time\":\"start-time\", \"end-time\":\"end-time\", " +
                        "\"request-id\":\"request-id\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"execution-id\"," +
                        "\"input\": \"[]\", \"output\":\"null\"}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        VTPExecutionResource vtpExecutionResource10 = new VTPExecutionResource();
        assertNotNull(vtpExecutionResource10.getTestExecutionHandler("1234"));
    }
    @Test
    public void testGetTestExecutionHandlerForGsonWithResultNullForCatchException() throws Exception
    {
        new MockUp<VTPResource>(){
            @mockit.Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout)
                    throws VTPError.VTPException, IOException {
                String values = "{\"start-time\":\"start-time\", \"end-time\":\"end-time\", " +
                        "\"request-id\":\"request-id\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"execution-id\"," +
                        "\"input\": \"[]\", \"output\":null}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        VTPExecutionResource vtpExecutionResource11 = new VTPExecutionResource();
        assertNotNull(vtpExecutionResource11.getTestExecutionHandler("1234"));
    }

    @Test
    public void testExecuteTestcases() throws Exception
    {
        vtpExecutionResource = new VTPExecutionResource();
        String execJson = "[{\"scenario\":\"tutorial\",\"testCaseName\":\"list-users\",\"testSuiteName\":\"ut\"," +
                "\"requestId\":\"1234567890\",\"executionId\":\"123\",\"profile\":\"http\"}]";
        assertEquals(200, vtpExecutionResource.executeTestcases(requestId,null,"exeJson").getStatus());
    }
}
