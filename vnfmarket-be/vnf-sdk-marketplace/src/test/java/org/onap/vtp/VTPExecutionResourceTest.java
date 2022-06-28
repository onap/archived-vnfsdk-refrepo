/**
 * Copyright 2019 Huawei Technologies Co., Ltd.
 * Copyright 2020 Nokia.
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
package org.onap.vtp;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Properties;
import java.util.UUID;

import javax.ws.rs.client.Client;

import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.execution.VTPExecutionResource;
import org.onap.vtp.execution.model.VTPTestExecution;
import org.onap.vtp.execution.model.VTPTestExecution.VTPTestExecutionList;
import org.onap.vtp.manager.DistManager;
import org.onap.vtp.manager.model.Tester;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenInterfaceGrpcClient;
import org.open.infc.grpc.client.OpenInterfaceGrpcClient.OpenInterfaceGrpcTimeoutExecption;
import org.open.infc.grpc.client.OpenRemoteCli;
import org.yaml.snakeyaml.Yaml;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import mockit.MockUp;

@RunWith(MockitoJUnitRunner.class)
public class VTPExecutionResourceTest {

    static class VTPExecutionResourceForTests extends VTPExecutionResource {
        public JsonElement expectedRpcResponse = null;
        public List<String> expectedArguments = null;

        VTPExecutionResourceForTests() {
            VTPExecutionResource.pathToExecutions = "src/test/resources/executions";
        }

        @Override
        protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException {
            if(expectedRpcResponse != null && expectedArguments != null) {
                if (args.containsAll(expectedArguments)) {
                    return expectedRpcResponse;
                } else {
                    return null;
                }
            } else {
                return super.makeRpcAndGetJson( args, timeout);
            }
        }
    }

    @Mock
    FormDataBodyPart formDataBodyPart;
    @Mock
    ContentDisposition contentDisposition;
    @Mock
    DistManager distManager;
    String requestId;
    VTPExecutionResourceForTests vtpExecutionResource;
    VTPResource vTPResource;
    @Before
    public void setUp() {
        vtpExecutionResource= new VTPExecutionResourceForTests();
        vTPResource = new VTPResource();
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
        vtp.setProfile("open-cli-schema");
        vtp.setStatus("pass");
        vtp.setRequestId(requestId);
        vtp.setExecutionId("executionid");
        vtp.setParameters(rootNode);
        vtp.setResults(rootNode);
        vtp.setScenario("VTP Scenario 1");
        vtp.setStartTime("2019-04-12T11:49:52.845");
        vtp.setTestCaseName("s1.ts1.testcase-1");
        vtp.setTestSuiteName("testsuite-1");
        list.add(vtp);
        executions.setExecutions(list);
        System.out.println(executions.getExecutions());
        assertNotNull(executions.getExecutions());
       vtpExecutionResource.executeHandler(executions,null);
    }

    @Test
    public void whenListTestExecutionsHandlerIsCalledWithProperParametersThenCorrectExecutionDataIsReturned()
        throws IOException, VTPError.VTPException {
        // given
        String testStartTime = "2019-03-12T11:49:52.845";
        String testEndTime = "2020-03-12T11:49:52.845";
        String testProduct = "VTP Scenario 1";
        String testCommand = "s1.ts1.testcase-1";
        String testSuiteName = "testsuite-1";
        String testRequestId = "test-01-request-id";
        String testExecutionId = testRequestId + "-execution-id";
        String testProfile = "open-cli-schema";
        String expectedStatus = "SUCCESS";
        JsonElement expectedResult = new Gson().fromJson("" +
            "[{" +
            "\"test_1\": \"error01\"," +
            "\"test_2\": \"error02\" " +
            "}]", JsonArray.class);

        prepareMockRpcMethods(
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus
        );

        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getExecutionJson(int count, int index) {
                String values = "[{\"tester_id\":\"1\", \"end-time\":\"end-time\", " +
                        "\"id\":\"2\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution_id\":\"test-01-request-id-execution-id\"}]";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };

        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getResponseFromTester(Client client, String managerURL, String testerPath) {
                String values = "{\"tester_id\":\"1\", \"end-time\":\"end-time\", " +
                        "\"iP\":\"localhost\", \"port\":\"55130\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };

        new MockUp<DistManager>(){
            @mockit.Mock
            protected Result getExecutionDetails(String vtpTestCenterIp, int vtpTestCenterPort, List<String> args, int timeout) throws VTPError.VTPException {
                     Result result = Result.newBuilder().build();
                     return result;
                 }
             };
             new MockUp<Result>(){
                 @mockit.Mock
                 public String getOutput() {
                     return "{\"start-time\":\"2019-03-12T11:49:52.845\", \"end-time\":\"2020-03-12T11:49:52.845\",\"request-id\":\"test-01-request-id\", " +
                             "\"product\":\"VTP Scenario 1\", \"command\":\"s1.ts1.testcase-1\"," +
                             "\"service\":\"testsuite-1\", \"profile\":\"open-cli-schema\", " +
                             "\"status\":\"SUCCESS\", \"execution-id\":\"test-01-request-id-execution-id\"}";
                 }
             };

        // when
        VTPTestExecution.VTPTestExecutionList testExecutionResponse =
            vtpExecutionResource.listTestExecutionsHandler(
                testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime,1,0
            );

        // then
        assertThatListOfExecutionsContainsOneCorrectExecutionResponse(
            testExecutionResponse,
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus, expectedResult
        );
    }

    @Test
    public void whenListTestExecutionsHandlerIsCalledWithProperParametersThenCorrectExecutionDataIsReturned_2()
        throws IOException, VTPError.VTPException {
        String testStartTime = "2019-03-12T11:49:52.845";
        String testEndTime = "2020-03-12T11:49:52.845";
        String testProduct = "VTP Scenario 1";
        String testCommand = "s1.ts1.testcase-1";
        String testSuiteName = "testsuite-1";
        String testRequestId = "test-01-request-id";
        String testExecutionId = testRequestId + "-execution-id";
        String testProfile = "open-cli-schema";
        String expectedStatus = "SUCCESS";
        prepareMockRpcMethods(
	    testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
	    testRequestId, testExecutionId, testProfile, expectedStatus
	);
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList("--product", "open-cli", "execution-list", "--format", "json"));
        if (testStartTime != null && !testStartTime.isEmpty()) {
            args.add("--start-time");
            args.add(testStartTime);
        }
        if (testEndTime != null && !testEndTime.isEmpty()) {
            args.add("--end-time");
            args.add(testEndTime);
        }
        if (requestId != null && !requestId.isEmpty()) {
            args.add("--request-id");
            args.add(requestId);
        }
        if (testSuiteName != null && !testSuiteName.isEmpty()) {
            args.add("--service");
            args.add(testSuiteName);
        }
        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getExecutionJson(int count, int index) {
                String values = "[{\"tester_id\":\"1\", \"end-time\":\"end-time\", "+
	                "\"id\":\"2\", \"product\":\"product\","+
			"\"service\":\"service\", \"command\":\"command\", "+
			"\"profile\":\"profile\", \"status\":\"status\", \"execution_id\":\"test-01-request-id-execution-id\"}]";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getResponseFromTester(Client client, String managerURL, String testerPath) {
                String values = "{\"tester_id\":\"1\", \"end-time\":\"end-time\", "+
		        "\"iP\":\"localhost\", \"port\":\"55130\","+
			"\"service\":\"service\", \"command\":\"command\", "+
			"\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        new MockUp<DistManager>(){
            @mockit.Mock
            protected Result getExecutionDetails(String vtpTestCenterIp, int vtpTestCenterPort, List<String> args,int timeout) throws VTPError.VTPException {
                     Result result = Result.newBuilder().build();
                     return result;
                 }
             };
        new MockUp<Result>(){
            @mockit.Mock
            public String getOutput() {
                return "{\"start-time\":\"2019-03-12T11:49:52.845\", \"end-time\":\"2020-03-12T11:49:52.845\",\"request-id\":\"test-01-request-id\", "
			+ "\"product\":\"VTP Scenario 1\", \"command\":\"s1.ts1.testcase-1\","+
		        "\"service\":\"testsuite-1\", \"profile\":\"open-cli-schema\", "+
		        "\"status\":\"SUCCESS\", \"execution-id\":\"test-01-request-id-execution-id\"}";
            }
        };
        JsonElement respData = vTPResource.makeRpcAndGetJson(args, 1, 1);
        assertNotNull(respData);
    }
    @Test
    public void whenListTestExecutionsHandlerIsCalledWithIdThatDoesNotMatchAnyExecutionFileThenResultContainsProperInformation()
        throws IOException, VTPError.VTPException {
        // given
        String testStartTime = "2020-08-09T08:49:52.845";
        String testEndTime = "2020-08-10T08:49:55.845";
        String testProduct = "VTP Scenario 2";
        String testCommand = "s1.ts1.testcase-2";
        String testSuiteName = "testsuite-2";
        String testRequestId = "test-wrong-request-id";
        String testExecutionId = testRequestId + "-execution-id";
        String testProfile = "open-cli-schema";
        String expectedStatus = "FAIL";
        JsonElement expectedResult = new Gson().fromJson("" +
            "{ \"error\": \"unable to find execution results\"}", JsonObject.class);

        prepareMockRpcMethods(
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus
        );

        new MockUp<Result>(){
            @mockit.Mock
            public String getOutput() {
                return "{\"start-time\":\"2020-08-09T08:49:52.845\", \"end-time\":\"2020-08-10T08:49:55.845\","
                        + "\"request-id\":\"test-wrong-request-id\", " +
                        "\"product\":\"VTP Scenario 2\", \"command\":\"s1.ts1.testcase-2\"," +
                        "\"service\":\"testsuite-2\", \"profile\":\"open-cli-schema\", " +
                        "\"status\":\"FAIL\", \"execution-id\":\"test-wrong-request-id-execution-id\"}";
            }
        };


        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getExecutionJson(int count, int index) {
                String values = "[{\"tester_id\":\"1\", \"end-time\":\"end-time\", " +
                        "\"id\":\"2\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution_id\":\"test-01-request-id-execution-id\"}]";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };

        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getResponseFromTester(Client client, String managerURL, String testerPath) {
                String values = "{\"tester_id\":\"1\", \"end-time\":\"end-time\", " +
                        "\"iP\":\"localhost\", \"port\":\"55130\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };

        new MockUp<DistManager>(){
            @mockit.Mock
            protected Result getExecutionDetails(String vtpTestCenterIp, int vtpTestCenterPort, List<String> args, int timeout) throws VTPError.VTPException {
                     Result result = Result.newBuilder().build();
                     return result;
                 }
             };

        // when
        VTPTestExecution.VTPTestExecutionList testExecutionResponse =
            vtpExecutionResource.listTestExecutionsHandler(
                testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime,1,0
            );

        // then
        assertThatListOfExecutionsContainsOneCorrectExecutionResponse(
            testExecutionResponse,
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus, expectedResult
        );
    }

    @Test
    public void whenListTestExecutionsHandlerIsCalledWithIdThatMatchIncorrectExecutionFileThenResultContainsProperInformation()
        throws IOException, VTPError.VTPException {
        // given
        String testStartTime = "2020-08-09T08:49:52.845";
        String testEndTime = "2020-08-10T08:49:55.845";
        String testProduct = "VTP Scenario 3";
        String testCommand = "s1.ts1.testcase-3";
        String testSuiteName = "testsuite-3";
        String testRequestId = "test-incorrect-request-id";
        String testExecutionId = testRequestId + "-execution-id";
        String testProfile = "open-cli-schema";
        String expectedStatus = "FAIL";
        JsonElement expectedResult = new Gson().fromJson("" +
                "{ " +
                "\"error\": \"fail to load execution result\"," +
                "\"reason\":\"com.google.gson.stream.MalformedJsonException: Use JsonReader.setLenient(true) to accept malformed JSON at line 1 column 8 path $\"" +
                "}",
            JsonObject.class
        );

        prepareMockRpcMethods(
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus
        );
        new MockUp<Result>(){
            @mockit.Mock
            public String getOutput() {
                return "{\"start-time\":\"2020-08-09T08:49:52.845\", \"end-time\":\"2020-08-10T08:49:55.845\","
                        + "\"request-id\":\"test-incorrect-request-id\", " +
                        "\"product\":\"VTP Scenario 3\", \"command\":\"s1.ts1.testcase-3\"," +
                        "\"service\":\"testsuite-3\", \"profile\":\"open-cli-schema\", " +
                        "\"status\":\"FAIL\", \"execution-id\":\"test-incorrect-request-id-execution-id\"}";
            }
        };
        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getExecutionJson(int count, int index) {
                String values = "[{\"tester_id\":\"1\", \"end-time\":\"end-time\", " +
                        "\"id\":\"2\", \"product\":\"product\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution_id\":\"test-01-request-id-execution-id\"}]";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };
        new MockUp<DistManager>(){
            @mockit.Mock
            protected JsonElement getResponseFromTester(Client client, String managerURL, String testerPath) {
                String values = "{\"tester_id\":\"1\", \"end-time\":\"end-time\", " +
                        "\"iP\":\"localhost\", \"port\":\"55130\"," +
                        "\"service\":\"service\", \"command\":\"command\", " +
                        "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}";
                JsonParser jsonParser = new JsonParser();
                return jsonParser.parse(values);
            }
        };

        new MockUp<DistManager>(){
            @mockit.Mock
            protected Result getExecutionDetails(String vtpTestCenterIp, int vtpTestCenterPort, List<String> args, int timeout) throws VTPError.VTPException {
                     Result result = Result.newBuilder().build();
                     return result;
                 }
             };

        // when
        VTPTestExecution.VTPTestExecutionList testExecutionResponse =
            vtpExecutionResource.listTestExecutionsHandler(
                testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime,1,0
            );

        // then
        assertThatListOfExecutionsContainsOneCorrectExecutionResponse(
            testExecutionResponse,
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus, expectedResult
        );
    }

    @Rule
    public ExpectedException exceptionRule = ExpectedException.none();

    @Test
    public void whenListTestExecutionsHandlerIsCalledAndGRpcClientIsUnReachableThenExceptionShouldBeThrown()
        throws IOException, VTPError.VTPException {
        // given
        String testStartTime = "2020-08-10T08:50:20.845";
        String testEndTime = "2020-08-11T08:51:50.845";
        String testProduct = "VTP Scenario 3";
        String testCommand = "s1.ts1.testcase-3";
        String testSuiteName = "testsuite-3";
        String testRequestId = "test-03-request-id";
        String testProfile = "open-cli-schema";

        exceptionRule.expect(VTPError.VTPException.class);
        exceptionRule.expectMessage("Timed out. Please use request-id to track the progress.");
        vtpExecutionResource.listTestExecutionsHandler(
                testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime, 1, 0);

    }

    private void assertThatListOfExecutionsContainsOneCorrectExecutionResponse(
        VTPTestExecution.VTPTestExecutionList testExecutionResponse,
        String testStartTime, String testEndTime, String testProduct, String testCommand,
        String testSuiteName, String testRequestId, String testExecutionId, String testProfile,
        String expectedStatus, JsonElement expectedResult ) {

        assertNotNull(testExecutionResponse);
        assertEquals(1, testExecutionResponse.getExecutions().size());
        VTPTestExecution vtpTestExecution = testExecutionResponse.getExecutions().get(0);
        assertFieldsInExecutionResponseAreCorrect(
            vtpTestExecution,
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus, expectedResult
        );
    }

    private void prepareMockRpcMethods(String testStartTime, String testEndTime, String testProduct, String testCommand, String testSuiteName, String testRequestId, String testExecutionId, String testProfile, String expectedStatus) {
        vtpExecutionResource.expectedArguments =
            buildListOfMockRpcArguments(
                testStartTime, testEndTime, testProduct, testCommand, testRequestId, testSuiteName
            );
        vtpExecutionResource.expectedRpcResponse =
            buildExpectedRpcResponse(
                testStartTime, testEndTime, testProduct, testCommand, testSuiteName, testRequestId,
                testExecutionId, testProfile, expectedStatus
            );
    }

    private JsonArray buildExpectedRpcResponse(
        String testStartTime, String testEndTime, String testProduct,
        String testCommand, String testSuiteName, String testRequestId,
        String testExecutionId, String testProfile, String expectedStatus) {
        return new Gson().fromJson("[{" +
            "\"start-time\":\"" + testStartTime + "\";" +
            "\"end-time\":\"" + testEndTime + "\";" +
            "\"product\":\"" + testProduct + "\";" +
            "\"command\":\"" + testCommand + "\";" +
            "\"service\":\"" + testSuiteName + "\";" +
            "\"request-id\":\"" + testRequestId + "\";" +
            "\"execution-id\":\"" + testExecutionId + "\";" +
            "\"profile\":\"" + testProfile + "\";" +
            "\"status\":\"" + expectedStatus + "\"" +
            "}]", JsonArray.class);
    }

    private List<String> buildListOfMockRpcArguments(
        String testStartTime, String testEndTime, String testProduct,
        String testCommand, String testRequestId, String testSuiteName) {
        return Lists.newArrayList(
            "--product", "open-cli", "execution-list", "--format", "json",
            "--start-time", testStartTime, "--end-time", testEndTime,
            "--service", testSuiteName, "--product", testProduct,
            "--command", testCommand, "--request-id", testRequestId);
    }

    private void assertFieldsInExecutionResponseAreCorrect(
        VTPTestExecution vtpTestExecution,
        String testStartTime, String testEndTime, String testProduct,
        String testCommand, String testSuiteName, String testRequestId,
        String testExecutionId, String testProfile, String expectedStatus, JsonElement expectedResult) {
        assertEquals(testStartTime, vtpTestExecution.getStartTime());
        assertEquals(testEndTime, vtpTestExecution.getEndTime());
        assertEquals(testProduct, vtpTestExecution.getScenario());
        assertEquals(testCommand, vtpTestExecution.getTestCaseName());
        assertEquals(testSuiteName, vtpTestExecution.getTestSuiteName());
        assertEquals(testExecutionId, vtpTestExecution.getExecutionId());
        assertEquals(testRequestId, vtpTestExecution.getRequestId());
        assertEquals(testProfile, vtpTestExecution.getProfile());
        assertEquals(expectedStatus, vtpTestExecution.getStatus());
        assertEquals(expectedResult, vtpTestExecution.getResults());
    }

    @Test(expected = Exception.class)
    public void testListTestExecutions() throws Exception
    {
        vtpExecutionResource.listTestExecutions(requestId, "abc", "abc", "abc", "abc", "123", "123",1,0);
    }
    @Test(expected = Exception.class)
    public void testGetTestExecution() throws Exception
    {
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        assertNotNull(vtpExecutionResource.getTestExecution("1234"));
    }
    @Test(expected = Exception.class)
    public void testGetTestExecutionHandler() throws Exception
    {
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        assertNotNull(vtpExecutionResource.getTestExecutionHandler("1234"));
    }

    @Test(expected = NullPointerException.class)
    public void testExecuteTestcases() throws Exception
    {

        List<FormDataBodyPart> bodyParts= new ArrayList<>();
        formDataBodyPart.setName("abc");
        formDataBodyPart.setValue("123");
        formDataBodyPart.setContentDisposition(contentDisposition);
        formDataBodyPart.getContentDisposition().getFileName();
        bodyParts.add(formDataBodyPart);
      vtpExecutionResource.executeTestcases(requestId,bodyParts,"exeJson") ;
    }

    @Test
    public void snakeYamlTest()
    {
        Yaml yaml = vTPResource.snakeYaml();
        assertNotNull(yaml);
    }

    @Test
    public void getStorePathTest()
    {
        String storePath = VTPResource.getStorePath();
        assertNotNull(storePath);
    }

    @Test(expected = Exception.class)
    public void testGetTestExecutionLogsHandler() throws Exception {
        assertNotNull(vtpExecutionResource.getTestExecutionLogsHandler("1234", "action"));
    }

    @Test
    public void testGetTestExecutionLogsHandlerSuccess() throws Exception {
        new MockUp<DistManager>() {
            @mockit.Mock
            protected Tester httpRequestExecutions(String executionId) {
                Tester tester= new Tester();
                tester.setId("1");
                tester.setIp("localhost");
                tester.setPort(50051);
                tester.setTesterId("123");
                return tester;
            }
        };
          new MockUp<OpenRemoteCli>(){
                @mockit.Mock
                protected Result run(List<String> args) throws  Exception {
                    Result result = Result.newBuilder().build();
                    return result;
                }
                 };
        assertNotNull(vtpExecutionResource.getTestExecutionLogsHandler("1234-", "action"));
    }

    @Test
    public void testGetTestExecutionLogsHandlerSuccess_2() throws Exception {
        new MockUp<DistManager>() {
            @mockit.Mock
            protected Tester httpRequestExecutions(String executionId) {
                Tester tester= new Tester();
                tester.setId("1");
                tester.setIp("localhost");
                tester.setPort(50051);
                tester.setTesterId("123");
                return tester;
            }
        };
          new MockUp<OpenRemoteCli>(){
                @mockit.Mock
                protected Result run(List<String> args) throws  Exception {
                    Result result = Result.newBuilder().build();
                    return result;
                }
                 };
        assertNotNull(vtpExecutionResource.getTestExecutionLogsHandler("1234", "schema-show"));
    }
}
