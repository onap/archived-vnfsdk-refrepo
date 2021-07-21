/**
 * Copyright 2020 Huawei Technologies Co., Ltd.
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
package org.onap.vtp.manager;


import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonArray;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.manager.model.Tester;
import org.onap.vtp.scenario.model.VTPTestCase;
import org.onap.vtp.scenario.model.VTPTestScenario;
import org.onap.vtp.scenario.model.VTPTestSuite;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenInterfaceGrpcClient;
import org.open.infc.grpc.client.OpenRemoteCli;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Objects;
import java.util.Properties;
import java.util.UUID;


public class DistManager implements Manager {
    private static final Logger LOG = LoggerFactory.getLogger(DistManager.class);
    private static Gson gson = new Gson();
    private Client client = ClientBuilder.newClient();

    public Tester httpRequestTestcase(String testSuite, String scenario, String testCase) {
        String testcasePath = "edgeT/manager/testcase";
        JsonElement jsonElement = getResponseForTestcase(client, getManagerURL(), testcasePath, testSuite, scenario, testCase);
        return getTester(jsonElement);
    }

    private Tester getTester(JsonElement jsonElement) {
        Tester tester = new Tester();
        JsonObject jsonObject = jsonElement.getAsJsonArray().get(0).getAsJsonObject();
        String testerId = null;
        if (jsonObject.has("testerId"))
            testerId = jsonObject.get("testerId").getAsString();
        else if (jsonObject.has("tester_id"))
            testerId = jsonObject.get("tester_id").getAsString();
        String testcaseId = jsonObject.get("id").getAsString();
        if (testerId == null || testcaseId == null)
            throw new IllegalArgumentException("testerId or testcaseId should not be empty or null "
                    + " testerId: " + testerId + ", testcaseId:" + testcaseId);

        String testerPath = "edgeT/manager/tester/" + testerId;
        JsonObject responseJson = getResponseFromTester(client, getManagerURL(), testerPath).getAsJsonObject();
        if (responseJson.has("iP") && responseJson.has("port")) {
            tester.setIp(responseJson.get("iP").getAsString());
            tester.setPort(responseJson.get("port").getAsInt());
            tester.setId(testcaseId);
            tester.setTesterId(testerId);
        } else {
            throw new NotFoundException("Ip or port not exist ");
        }
        return tester;
    }

    public JsonElement getResponseFromTester(Client client, String managerURL, String testerPath) {
        WebTarget webTarget = client.target(managerURL).path(testerPath);
        return getJsonResponse(webTarget);
    }

    private JsonElement getResponseForTestcase(Client client, String uri, String path, String testSuite, String scenario, String testCase) {
        WebTarget webTarget = client.target(uri).path(path)
                .queryParam("scenario", scenario)
                .queryParam("testcase", testCase)
                .queryParam("testsuite", testSuite);

        return getJsonResponse(webTarget);
    }

    public JsonElement getJsonResponse(WebTarget webTarget) {
        Invocation.Builder invocationBuilder = webTarget.request(MediaType.APPLICATION_JSON);
        Response response = invocationBuilder.get();
        if (response.getStatus() != 200 && response.getStatus() != 201) {
            throw new NotFoundException("Status code is not 200 or 201");
        }
        String jsonResult = response.readEntity(String.class);
        if (jsonResult.isEmpty())
            throw new NotFoundException("require values are not exist on manager server");
        return new JsonParser().parse(jsonResult);
    }

    public void postDataToManager(String executionId, String id, String testerId) {
        ExecutionsResult executionsResult = new ExecutionsResult();
        executionsResult.setExecutionId(executionId);
        executionsResult.setTesterId(Integer.parseInt(testerId));
        executionsResult.setTestcaseId(Integer.parseInt(id));

        String executionsUrl = getManagerURL() + "/edgeT/manager/executions";
        HttpClient httpClient = HttpClientBuilder.create().build();
        HttpPost postRequest = new HttpPost(executionsUrl);
        postRequest.addHeader("content-type", "application/json");
        StringEntity userEntity = null;
        try {
            userEntity = new StringEntity(gson.toJson(executionsResult));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        postRequest.setEntity(userEntity);

        HttpResponse response = null;
        try {
            response = httpClient.execute(postRequest);
        } catch (IOException e) {
            LOG.error("error during post execution data in manager ::" + e);
        }

        assert response != null;
        if (response.getStatusLine().getStatusCode() == 201 || response.getStatusLine().getStatusCode() == 200)
            LOG.info("========= data post successfully in manager ==========");
        else
            LOG.error("====== data post failed in manager  =====");
    }

    public String getManagerURL() {
        String managerIP = null;
        int managerPort = 0;
        Properties prp = new Properties();
        try {
            prp.load(Objects.requireNonNull(VTPResource.class.getClassLoader().getResourceAsStream("vtp.properties")));
            return prp.getProperty("vtp.manager.url");
        } catch (Exception e) {  // NOSONAR
            LOG.error(e.getMessage());
        }
        return null;
    }

    public JsonElement getExecutionJson(int count, int index) {
        String executionsPath = "edgeT/manager/executions";
        JsonElement jsonElement = getResponseForExecution(client, getManagerURL(), executionsPath, count, index);
        return jsonElement;
    }

    public Result getExecutionDetails(String vtpTestCenterIp, int vtpTestCenterPort, List<String> args, int timeout) throws VTPError.VTPException {
        String requestId = UUID.randomUUID().toString();
        Result result = null;
        try {
            result = new OpenRemoteCli(
                    vtpTestCenterIp,
                    vtpTestCenterPort,
                    timeout,
                    requestId).run(args);
        } catch (OpenInterfaceGrpcClient.OpenInterfaceGrpcTimeoutExecption e) {
            LOG.info("Timed out.", e);
            throw new VTPError.VTPException(
                    new VTPError().setHttpStatus(HttpStatus.SC_GATEWAY_TIMEOUT).setMessage("Timed out. Please use request-id to track the progress.").setCode(VTPError.TIMEOUT));
        } catch (Exception e) {
            LOG.info("Exception occurs.", e);
            throw new VTPError.VTPException(new VTPError().setMessage(e.getMessage()));
        }

        if (result.getExitCode() != 0) {
            throw new VTPError.VTPException(
                    new VTPError().setMessage(result.getOutput()));
        }
        return result;
    }

    private JsonElement getResponseForExecution(Client client, String managerURL, String executionsPath, int count, int index) {
        WebTarget webTarget = client.target(managerURL).path(executionsPath)
                .queryParam("count", count)
                .queryParam("index", index);

        return getJsonResponse(webTarget);
    }

    public Tester httpRequestExecutions(String executionId) {
        String testcasePath = "edgeT/manager/executions";
        JsonElement jsonElement = getResponseFromTestcase(client, getManagerURL(), testcasePath, executionId);
        return getTester(jsonElement);
    }

    private JsonElement getResponseFromTestcase(Client client, String managerURL, String testcasePath, String executionId) {
        WebTarget webTarget = client.target(managerURL).path(testcasePath).queryParam("execution_id", executionId);
        return getJsonResponse(webTarget);
    }

    public VTPTestSuite.VTPTestSuiteList getSuiteListFromManager(String url) {
        JsonElement results = getJsonResult(url);
        try {
            VTPTestSuite.VTPTestSuiteList list = new VTPTestSuite.VTPTestSuiteList();
            JsonArray resultsArray = results.getAsJsonArray();
            for (JsonElement jsonElement : resultsArray) {
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.entrySet().iterator().hasNext())
                    list.getSuites().add(gson.fromJson(n, VTPTestSuite.class));
            }
            return list;
        } catch (Exception e) {
            LOG.error("exception occurs during communication with manager for SuiteList :: ", e);
        }
        return null;
    }

    public VTPTestScenario.VTPTestScenarioList getScenarioListFromManager(String url) {
        JsonElement results = getJsonResult(url);
        try {
            VTPTestScenario.VTPTestScenarioList list = new VTPTestScenario.VTPTestScenarioList();
            JsonArray resultsArray = results.getAsJsonArray();
            for (JsonElement jsonElement : resultsArray) {
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.entrySet().iterator().hasNext())
                    list.getScenarios().add(gson.fromJson(n, VTPTestScenario.class));
            }
            return list;
        } catch (Exception e) {
            LOG.error("exception occurs during communication with manager for ScenarioList:: ", e);
        }
        return null;
    }

    public VTPTestCase.VTPTestCaseList getTestCaseListFromManager(String url) {
        JsonElement results = getJsonResult(url);
        try {
            VTPTestCase.VTPTestCaseList list = new VTPTestCase.VTPTestCaseList();
            JsonArray resultsArray = results.getAsJsonArray();
            for (JsonElement jsonElement : resultsArray) {
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.entrySet().iterator().hasNext())
                    list.getTestCases().add(gson.fromJson(n, VTPTestCase.class));
            }
            return list;
        } catch (
                Exception e) {
            LOG.error("exception occurs during communication with manager for TestCaseList:: ", e);
        }
        return null;
    }

    private JsonElement getJsonResult(String url) {
        WebTarget webTarget = client.target(getManagerURL()).path(url);
        String jsonResult = webTarget.request(MediaType.APPLICATION_JSON).get().readEntity(String.class);
        return new JsonParser().parse(jsonResult);
    }


    static class ExecutionsResult {
        private int tester_id;
        private int testcase_id;
        private String execution_id;

        public int getTesterId() {
            return tester_id;
        }

        public void setTesterId(int tester_id) {
            this.tester_id = tester_id;
        }

        public int getTestcaseId() {
            return testcase_id;
        }

        public void setTestcaseId(int testcase_id) {
            this.testcase_id = testcase_id;
        }

        public String getExecutionId() {
            return execution_id;
        }

        public void setExecutionId(String execution_id) {
            this.execution_id = execution_id;
        }
    }
}
