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
package org.onap.vtp;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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

import java.io.IOException;
import java.util.*;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class VTPExecutionResourceTest {

    static class VTPExecutionResourceForTests extends VTPExecutionResource {
        public JsonElement expectedRpcResponse = null;
        public List<String> expectedArguments = null;

        VTPExecutionResourceForTests() {
            VTPExecutionResource.PATH_TO_EXECUTIONS = "src/test/resources/executions";
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
    String requestId;
    VTPExecutionResourceForTests vtpExecutionResource;
    @Before
    public void setUp() {
        vtpExecutionResource= new VTPExecutionResourceForTests();
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
       //vtpExecutionResource.executeHandler(executions,requestId);
        //for handler
    }

    @Test
    public void WhenListTestExecutionsHandlerIsCalledWithProperParametersThenCorrectExecutionDataIsReturned()
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

        // when
        VTPTestExecution.VTPTestExecutionList testExecutionResponse =
            vtpExecutionResource.listTestExecutionsHandler(
                testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime
            );

        // then
        assertThatListOfExecutionsContainsOneCorrectExecutionResponse(
            testExecutionResponse,
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus, expectedResult
        );
    }

    @Test
    public void WhenListTestExecutionsHandlerIsCalledWithIdThatDoesNotMatchAnyExecutionFileThenResultContainsProperInformation()
        throws IOException, VTPError.VTPException {
        // given
        String testStartTime = "2020-08-09T08:49:52.845";
        String testEndTime = "2020-08-10T08:49:55.845";
        String testProduct = "VTP Scenario 2";
        String testCommand = "s1.ts1.testcase-2";
        String testSuiteName = "testsuite-2";
        String testRequestId = "test-02-request-id";
        String testExecutionId = testRequestId + "-execution-id";
        String testProfile = "open-cli-schema";
        String expectedStatus = "SUCCESS";
        JsonElement expectedResult = new Gson().fromJson("" +
            "{ \"errors\": \"no output file\"}", JsonObject.class);

        prepareMockRpcMethods(
            testStartTime, testEndTime, testProduct, testCommand, testSuiteName,
            testRequestId, testExecutionId, testProfile, expectedStatus
        );

        // when
        VTPTestExecution.VTPTestExecutionList testExecutionResponse =
            vtpExecutionResource.listTestExecutionsHandler(
                testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime
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
    public void WhenListTestExecutionsHandlerIsCalledAndGRpcClientIsUnReachableThenExceptionShouldBeThrown()
        throws IOException, VTPError.VTPException {
        // given
        String testStartTime = "2020-08-10T08:50:20.845";
        String testEndTime = "2020-08-11T08:51:50.845";
        String testProduct = "VTP Scenario 3";
        String testCommand = "s1.ts1.testcase-3";
        String testSuiteName = "testsuite-3";
        String testRequestId = "test-03-request-id";
        String testProfile = "open-cli-schema";

        // when
        exceptionRule.expect(VTPError.VTPException.class);
        exceptionRule.expectMessage("Timed out. Please use request-id to track the progress.");
        vtpExecutionResource.listTestExecutionsHandler(
            testRequestId, testProduct, testSuiteName, testCommand, testProfile, testStartTime, testEndTime
        );

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
        vtpExecutionResource.listTestExecutions(requestId, "abc", "abc", "abc", "abc", "123", "123");
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

    @Test(expected = Exception.class)
    public void testGetTestExecutionLogsHandler() throws Exception {
        assertNotNull(vtpExecutionResource.getTestExecutionLogsHandler("1234", "action"));
    }
}
