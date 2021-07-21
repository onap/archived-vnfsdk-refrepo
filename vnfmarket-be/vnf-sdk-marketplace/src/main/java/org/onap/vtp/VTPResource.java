/**
 * Copyright 2018 Huawei Technologies Co., Ltd.
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

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.google.gson.*;
import org.apache.http.HttpStatus;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.error.VTPError.VTPException;
import org.onap.vtp.manager.DistManager;
import org.onap.vtp.manager.model.Tester;
import org.open.infc.grpc.Output;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenInterfaceGrpcClient;
import org.open.infc.grpc.client.OpenRemoteCli;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.reflect.TypeToken;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;

public class VTPResource {

    protected static final Logger LOG = LoggerFactory.getLogger(VTPResource.class);
    private static Gson gson = new Gson();

    protected static String VTP_TEST_CENTER_IP;  // NOSONAR
    protected static int VTP_TEST_CENTER_PORT;  // NOSONAR
    protected static String VTP_ARTIFACT_STORE;  // NOSONAR
    protected static String VTP_EXECUTION_TEMP_STORE;  // NOSONAR
    protected static int VTP_EXECUTION_GRPC_TIMEOUT;  // NOSONAR
    protected static String VTP_YAML_STORE;  // NOSONAR
    protected static String VTP_SCRIPT_STORE;  // NOSONAR
    public static boolean mode=false;
    protected static final SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.US);  // NOSONAR
    DistManager distManager = null;
    Tester tester = null;
    static {
        dateFormatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        Properties prp = new Properties();
        try {
            prp.load(VTPResource.class.getClassLoader().getResourceAsStream("vtp.properties"));
            VTP_TEST_CENTER_IP = prp.getProperty("vtp.grpc.server");
            VTP_TEST_CENTER_PORT = Integer.parseInt(prp.getProperty("vtp.grpc.port"));
            VTP_ARTIFACT_STORE = prp.getProperty("vtp.artifact.store");
            VTP_EXECUTION_TEMP_STORE = prp.getProperty("vtp.file.store");
            VTP_EXECUTION_GRPC_TIMEOUT = Integer.parseInt(prp.getProperty("vtp.grpc.timeout")) * 1000 ;
            VTP_YAML_STORE = prp.getProperty("vtp.yaml.store");
            VTP_SCRIPT_STORE = prp.getProperty("vtp.script.store");
            if (prp.getProperty("vtp.execution.mode").equals("dist"))
                mode=true;
        } catch (Exception e) {  // NOSONAR
            LOG.error(e.getMessage());
        }
    }

    protected Result makeRpc(List <String> args) throws VTPException {
        return this.makeRpc(args, VTP_EXECUTION_GRPC_TIMEOUT);
    }

    protected Result makeRpc(List <String> args, int timeout) throws VTPException {
        String executionId=args.get(4);
        if(isDistMode() && (executionId.contains("-") || args.contains("schema-show"))) {
            distManager =new DistManager();

            if (executionId.contains("-")){
                tester = distManager.httpRequestExecutions(executionId);
            }
            else {
                String scenario=args.get(4);
                String testSuiteName=args.get(6);
                String testCaseName=args.get(8);
                tester = distManager.httpRequestTestcase(testSuiteName,scenario,testCaseName);
            }

            VTP_TEST_CENTER_IP = tester.getIp();
            VTP_TEST_CENTER_PORT = tester.getPort();

        }
        Result result = null;
        String requestId = UUID.randomUUID().toString();
        try {
            result = new OpenRemoteCli(
                    VTP_TEST_CENTER_IP,
                    VTP_TEST_CENTER_PORT,
                    timeout,
                    requestId).run(args);
        } catch(OpenInterfaceGrpcClient.OpenInterfaceGrpcTimeoutExecption e) {
            LOG.info("Timed out.", e);
            throw new VTPException(
                  new VTPError().setHttpStatus(HttpStatus.SC_GATEWAY_TIMEOUT).setMessage("Timed out. Please use request-id to track the progress.").setCode(VTPError.TIMEOUT));
        } catch (Exception e) {
            LOG.info("Exception occurs.", e);
            throw new VTPException(new VTPError().setMessage(e.getMessage()));
        }

        if (result.getExitCode() != 0) {
            throw new VTPException(
                    new VTPError().setMessage(result.getOutput()));
        }

        return result;
    }

    public static String getStorePath() {
        return VTP_ARTIFACT_STORE;
    }

    protected JsonElement makeRpcAndGetJson(List<String> args) throws VTPException, IOException {
        return this.makeRpcAndGetJson(args, VTP_EXECUTION_GRPC_TIMEOUT);
    }

    protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPException {
        Result result = this.makeRpc(args, timeout);
        JsonParser jsonParser = new JsonParser();
        return jsonParser.parse(result.getOutput());
    }

    protected Output makeRpc(String testSuite,String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode) throws VTPException {
        return this.makeRpc(testSuite,scenario, requestId, profile, testCase, argsJsonNode, VTP_EXECUTION_GRPC_TIMEOUT);
    }

    protected Output makeRpc(String testSuite,String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode, int timeout) throws VTPException {
        if (isDistMode()){
            distManager =new DistManager();
            tester = distManager.httpRequestTestcase(testSuite,scenario,testCase);
            VTP_TEST_CENTER_IP =tester.getIp();
            VTP_TEST_CENTER_PORT = tester.getPort();
        }
        Output output = null;
        Map <String, String> args = gson.fromJson(argsJsonNode, new TypeToken<Map<String,String>>(){}.getType());
        try {
            output = new OpenRemoteCli(
                    VTP_TEST_CENTER_IP,
                    VTP_TEST_CENTER_PORT,
                    timeout,
                    requestId).invoke(scenario, profile, testCase, args);
         } catch(OpenInterfaceGrpcClient.OpenInterfaceGrpcTimeoutExecption e) {
            LOG.info("Timed out.", e);
             throw new VTPException(
                  new VTPError().setHttpStatus(HttpStatus.SC_GATEWAY_TIMEOUT).setMessage("Timed out. Please use request-id to track the progress.").setCode(VTPError.TIMEOUT));
        } catch (Exception e) {
            LOG.info("Exception occurs", e);
            throw new VTPException(
                    new VTPError().setMessage(e.getMessage()));
        }
        if (isDistMode())
        {
            String executionId= output.getAddonsMap().get("execution-id");
            assert distManager != null;
            distManager.postDataToManager(executionId,tester.getId(),tester.getTesterId());
        }
        return output;
    }

    /**
     * Build SnakeYaml instance
     * @return
     */
    protected Yaml snakeYaml() {
        DumperOptions dumperOptions = new DumperOptions();
        dumperOptions.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);
        dumperOptions.setDefaultScalarStyle(DumperOptions.ScalarStyle.PLAIN);
        dumperOptions.setPrettyFlow(false);
        return new Yaml(dumperOptions);
    }
    public boolean isDistMode() {
        return mode;
    }
    protected JsonElement makeRpcAndGetJson(List<String> args,int count,int index) throws VTPException, IOException {
        return this.makeRpcAndGetJson(args,count,index, VTP_EXECUTION_GRPC_TIMEOUT);
    }

    protected JsonElement makeRpcAndGetJson(List<String> args,int count,int index, int timeout) throws VTPException {
        List<String> result = this.makeRpc(args,count,index, timeout);
        JsonArray jsonArray = new JsonArray();
        for (String jsonString : result) {
            JsonElement obj = new JsonParser().parse(jsonString);
            jsonArray.add(obj);
        }
        return jsonArray;
    }

    protected List<String> makeRpc(List<String> args, int count, int index, int timeout) {
        distManager = new DistManager();
        JsonElement jsonElement = distManager.getExecutionJson(count, index);
        List<String> resultList = new ArrayList<>();
        if (jsonElement != null && jsonElement.isJsonArray() && jsonElement.getAsJsonArray().size() > 0) {
            JsonArray resultsArray = jsonElement.getAsJsonArray();
            Client client = ClientBuilder.newClient();
            for (JsonElement jElement : resultsArray) {
                JsonObject jsonObject = jElement.getAsJsonObject();
                String testerId = null;
                String executionId = null;
                if (jsonObject.has("tester_id"))
                    testerId = jsonObject.get("tester_id").getAsString();
                if (jsonObject.has("execution_id"))
                    executionId = jsonObject.get("execution_id").getAsString();
                if (testerId == null || executionId == null)
                    throw new IllegalArgumentException("testerId: " + testerId + " and " + " executionId: " + executionId + " should not be null");

                String testerPath = "/manager/tester/" + testerId;
                JsonObject jObject = distManager.getResponseFromTester(client, distManager.getManagerURL(), testerPath).getAsJsonObject();
                String vtpTestCenterIp = jObject.get("iP").getAsString();
                int vtpTestCenterPort = Integer.parseInt(jObject.get("port").getAsString());
                args.set(4, executionId);
                try {
                    resultList.add(distManager.getExecutionDetails(vtpTestCenterIp, vtpTestCenterPort, args, timeout).getOutput());
                } catch (Exception e) {
                    LOG.error("executionId : " + executionId + " not valid::: " + e.getMessage());
                }
            }
        }
        return resultList;
    }
}
