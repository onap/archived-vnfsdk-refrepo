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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class VTPResource {

    protected static final Logger LOG = LoggerFactory.getLogger(VTPResource.class);

    public static String VTP_TEST_CENTER_IP = "localhost";
    public static int VTP_TEST_CENTER_PORT = 50051;
    public static String VTP_ARTIFACT_STORE = "d:/temp/data/artifacts/";
    public static String VTP_EXECUTION_TEMP_STORE = "d:/temp/data/transient";

    public static SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.US);

    static {
        dateFormatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        Properties prp = new Properties();
        try {
            prp.load(VTPResource.class.getClassLoader().getResourceAsStream("vtp.properties"));
            VTP_TEST_CENTER_IP = prp.getProperty("vtp.grpc.server");
            VTP_TEST_CENTER_PORT = Integer.parseInt(prp.getProperty("vtp.grpc.port"));
            VTP_ARTIFACT_STORE = prp.getProperty("vtp.artifact.store");
            VTP_EXECUTION_TEMP_STORE = prp.getProperty("vtp.file.store");
        } catch (Exception e) {
            LOG.error(e.getMessage());
        }
    }

    protected Result makeRpc(List <String> args) throws VTPException {
        Result result = null;
        String requestId = UUID.randomUUID().toString();
        try {
            result = OpenRemoteCli.run(
                    VTP_TEST_CENTER_IP, VTP_TEST_CENTER_PORT, requestId,
                    args);
//        } catch(OpenInterfaceGrpcClient.OpenInterfaceGrpcTimeoutExecption e) {
//            throw new VTPException(
//                    new VTPError().setHttpStatus(HttpStatus.SC_GATEWAY_TIMEOUT).setMessage("Timeout.").setCode(VTPError.TIMEOUT));
        } catch (Exception e) {
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

    protected JsonNode makeRpcAndGetJson(List<String> args) throws VTPException, IOException {
        Result result = this.makeRpc(args);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode resultJson = mapper.readTree(result.getOutput());
        return resultJson;
    }


    protected Output makeRpc(String scenario, String requestId, String profile, String testCase, JsonNode argsJsonNode) throws VTPException {
        Output output = null;
        ObjectMapper mapper = new ObjectMapper();
        Map <String, String> args = mapper.convertValue(argsJsonNode, Map.class);
        try {
            output = OpenRemoteCli.invoke(VTP_TEST_CENTER_IP, VTP_TEST_CENTER_PORT, scenario, profile, testCase, requestId, args);
//        } catch(OpenInterfaceGrpcClient.OpenInterfaceGrpcTimeoutExecption e) {
//            throw new VTPException(
//                    new VTPError().setHttpStatus(HttpStatus.SC_GATEWAY_TIMEOUT).setMessage(e.getMessage()).setCode(VTPError.TIMEOUT));
        } catch (Exception e) {
            throw new VTPException(
                    new VTPError().setMessage(e.getMessage()));
        }

        return output;
    }
}
