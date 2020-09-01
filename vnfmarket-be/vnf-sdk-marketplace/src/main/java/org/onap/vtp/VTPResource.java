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
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.TimeZone;
import java.util.UUID;

import org.apache.http.HttpStatus;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.error.VTPError.VTPException;
import org.open.infc.grpc.Output;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenInterfaceGrpcClient;
import org.open.infc.grpc.client.OpenRemoteCli;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

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

    protected static final SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.US);  // NOSONAR

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
        } catch (Exception e) {  // NOSONAR
            LOG.error(e.getMessage());
        }
    }

    protected Result makeRpc(List <String> args) throws VTPException {
        return this.makeRpc(args, VTP_EXECUTION_GRPC_TIMEOUT);
    }

    protected Result makeRpc(List <String> args, int timeout) throws VTPException {
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

    protected Output makeRpc(String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode) throws VTPException {
        return this.makeRpc(scenario, requestId, profile, testCase, argsJsonNode, VTP_EXECUTION_GRPC_TIMEOUT);
    }

    protected Output makeRpc(String scenario, String requestId, String profile, String testCase, JsonElement argsJsonNode, int timeout) throws VTPException {
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
}
