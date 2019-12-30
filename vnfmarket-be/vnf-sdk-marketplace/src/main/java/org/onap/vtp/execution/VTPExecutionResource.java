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

package org.onap.vtp.execution;

import java.io.EOFException;
import java.io.File;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jetty.http.HttpStatus;
import org.glassfish.jersey.media.multipart.BodyPartEntity;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.error.VTPError.VTPException;
import org.onap.vtp.execution.model.VTPTestExecution;
import org.onap.vtp.execution.model.VTPTestExecution.VTPTestExecutionList;
import org.open.infc.grpc.Output;
import org.open.infc.grpc.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Path("/vtp")
@Api(tags = {"VTP Execution"})
public class VTPExecutionResource  extends VTPResource{
    private static final String EXECUTION_ID = "execution-id";
    private static final String START_TIME = "start-time";
    private static final String END_TIME = "end-time";
    private static final String REQUEST_ID = "request-id";
    private static final String PRODUCT = "product";
    private static final String SERVICE = "service";
    private static final String COMMAND = "command";
    private static final String PROFILE = "profile";
    private static final String STATUS = "status";
    private static final String OUTPUT = "output";
    private static final String INPUT = "input";
    private static final String ERROR = "error";
    private static final String FILE = "file://";

    public VTPTestExecutionList executeHandler(VTPTestExecutionList executions, String requestId) throws VTPException {
        if (requestId == null) {
            requestId = UUID.randomUUID().toString();
        }

        for (VTPTestExecution execution: executions.getExecutions())  {
            String startTime = dateFormatter.format(new Date());
            execution.setStartTime(startTime);

            //Run execution
            Output output = this.makeRpc(
                    execution.getScenario(),
                    requestId,
                    execution.getProfile(),
                    execution.getTestCaseName(),
                    execution.getParameters()
                    );
            String endTime = dateFormatter.format(new Date());
            execution.setEndTime(endTime);
            execution.setExecutionId(output.getAddonsMap().get(EXECUTION_ID));

            // set execution status based on success from test.
            if (output.getSuccess()) {
              execution.setStatus(VTPTestExecution.Status.COMPLETED.name());
            }
            else {
              execution.setStatus(VTPTestExecution.Status.FAILED.name());
            }

            // set the results from what is available in the output independent of status.
            // tests can fail but still produce results.
            Gson mapper = new Gson();
            Map<String,String> m = output.getAttrsMap();
            if ((m.containsKey(ERROR)) && (!StringUtils.equals(m.get(ERROR), "{}"))) {
                try {
                    execution.setResults(mapper.fromJson(m.get(ERROR), JsonElement.class));
                } catch (Exception e) {
                    LOG.error("IOException occurs",e);
                }
            }
            else if (m.containsKey("results")) {
                try {
                    execution.setResults(mapper.fromJson(m.get("results"),JsonElement.class));
                } catch (Exception e) {
                    LOG.error("IOException occurs",e);
                }
            }
        }

        return executions;
    }

    private Map<String, String> storeTestCaseInputFiles(List<FormDataBodyPart> bodyParts) throws IOException {
        Map<String, String> map = new HashMap<>();
        if (bodyParts != null)
        for (FormDataBodyPart part: bodyParts) {
            String name = part.getContentDisposition().getFileName();
            String path = VTP_EXECUTION_TEMP_STORE + "/" + name;

            File f = new File(path);
            if (f.exists()) {
                FileUtils.forceDelete(f);
            }
            FileUtils.forceMkdir(f.getParentFile());

            BodyPartEntity fileEntity = (BodyPartEntity) part.getEntity();
            java.nio.file.Files.copy(
                    fileEntity.getInputStream(),
                    f.toPath(),
                    StandardCopyOption.REPLACE_EXISTING);

            IOUtils.closeQuietly(fileEntity.getInputStream());

            map.put(name, path);
        }

        return map;
    }

    @Path("/executions")
    @POST
    @ApiOperation(tags = "VTP Execution", value = "Execute the test case with given inputs in 'executions' form-data "
            + "as key-value pair of parameter's name vs parameter's value. If parameter is binary type then" +
            "multi-part form-data 'file' should be used to feed the binary file content and it can be more than once. "
            + "To use the given file as input parameter, prefix the value with file://<filename>." ,
            response = VTPTestExecution.class, responseContainer = "List")
    @Consumes({MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class)})
    public Response executeTestcases(
             @ApiParam(value = "Request Id") @QueryParam("requestId") String requestId,
             @ApiParam(value = "Testcase File arguments", required = false) @FormDataParam("file") List<FormDataBodyPart> bodyParts,
             @FormDataParam("executions") String executionsJson) throws VTPException {

        VTPTestExecutionList executions = new VTPTestExecution.VTPTestExecutionList();
        Map<String, String> map = null;
        try {
            map = this.storeTestCaseInputFiles(bodyParts);
        } catch (IOException e) {
            LOG.error("IOException occurs",e);
        }

        for (Map.Entry<String, String> entry: map.entrySet()) {
            if (executionsJson.contains(FILE + entry.getKey())) {
                executionsJson = executionsJson.replaceAll(FILE + entry.getKey(), entry.getValue());
            }
        }

        if (executionsJson.contains(FILE)) {
            VTPError err = new VTPError()
                    .setMessage("Some file form-data is missing as executions has input parameter tagged with file://")
                    .setHttpStatus(HttpStatus.BAD_REQUEST_400);
            throw new VTPException(err);

        }

        try {
            executions.setExecutions(
                        new Gson().fromJson(executionsJson, new TypeToken<List<VTPTestExecution>>(){}.getType()));
        } catch (Exception e) {
            LOG.error("IOException occurs",e);
        }

        executions = this.executeHandler(executions, requestId);

        for (Map.Entry<String, String> entry: map.entrySet()) {
            try {
                FileUtils.forceDelete(new File(entry.getValue()));
            } catch (IOException e) {
                LOG.error("IOException occurs",e);
            }
        }

        return Response.ok(executions.getExecutions().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestExecutionList listTestExecutionsHandler(
            String requestId,
            String scenario,
            String testSuiteName,
            String testCaseName,
            String profile,
            String startTime,
            String endTime) throws Exception{
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "execution-list", "--format", "json"
                }));

        if (startTime != null && !startTime.isEmpty()) {
            args.add("--start-time");
            args.add(startTime);
        }

        if (endTime != null && !endTime.isEmpty()) {
            args.add("--end-time");
            args.add(endTime);
        }

        if (requestId != null && !requestId.isEmpty()) {
            args.add("--request-id");
            args.add(requestId);
        }

        if (testSuiteName != null && !testSuiteName.isEmpty()) {
            args.add("--service");
            args.add(testSuiteName);
        }

        if (scenario != null && !scenario.isEmpty()) {
            args.add("--product");
            args.add(scenario);
        }

        if (testCaseName != null && !testCaseName.isEmpty()) {
            args.add("--command");
            args.add(testCaseName);
        }

        JsonElement results = this.makeRpcAndGetJson(args);

        VTPTestExecutionList list = new VTPTestExecutionList();

        if (results != null && results.isJsonArray()) {
            JsonArray resultsArray = results.getAsJsonArray();
            if (resultsArray.size() >= 0) {
                for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                    JsonElement n = it.next();
                    if (n.getAsJsonObject().entrySet().iterator().hasNext()) {
                        VTPTestExecution exec = new VTPTestExecution();
                        if (n.getAsJsonObject().get(START_TIME) != null)
                            exec.setStartTime(n.getAsJsonObject().get(START_TIME).getAsString());

                        if (n.getAsJsonObject().get(END_TIME) != null)
                            exec.setEndTime(n.getAsJsonObject().get(END_TIME).getAsString());

                        if (n.getAsJsonObject().get(EXECUTION_ID) != null)
                            exec.setExecutionId(n.getAsJsonObject().get(EXECUTION_ID).getAsString());

                        if (n.getAsJsonObject().get(REQUEST_ID) != null)
                            exec.setRequestId(n.getAsJsonObject().get(REQUEST_ID).getAsString());

                        if (n.getAsJsonObject().get(PRODUCT) != null)
                            exec.setScenario(n.getAsJsonObject().get(PRODUCT).getAsString());

                        if (n.getAsJsonObject().get(SERVICE) != null)
                            exec.setTestSuiteName(n.getAsJsonObject().get(SERVICE).getAsString());

                        if (n.getAsJsonObject().get(COMMAND) != null)
                            exec.setTestCaseName(n.getAsJsonObject().get(COMMAND).getAsString());

                        if (n.getAsJsonObject().get(PROFILE) != null)
                            exec.setProfile(n.getAsJsonObject().get(PROFILE).getAsString());

                        if (n.getAsJsonObject().get(STATUS) != null)
                            exec.setStatus(n.getAsJsonObject().get(STATUS).getAsString());

                        list.getExecutions().add(exec);
                    }

                }
            }
        }

        return list;
    }

    @Path("/executions")
    @GET
    @ApiOperation(tags = "VTP Execution", value = " List test executions", response = VTPTestExecution.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response listTestExecutions(
             @ApiParam("Test request Id") @QueryParam("requestId") String requestId,
             @ApiParam("Test scenario name") @QueryParam("scenario") String scenario,
             @ApiParam("Test suite name") @QueryParam("testsuiteName") String testsuiteName,
             @ApiParam("Test case name") @QueryParam("testcaseName") String testcaseName,
             @ApiParam("Test profile name") @QueryParam("profileName") String profileName,
             @ApiParam("Test execution start time") @QueryParam("startTime") String startTime,
             @ApiParam("Test execution end time") @QueryParam("endTime") String endTime
             ) throws Exception {

        return Response.ok(this.listTestExecutionsHandler(
                requestId, scenario, testsuiteName, testcaseName, profileName, startTime, endTime).getExecutions().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestExecution getTestExecutionHandler(
            String executionId) throws Exception{
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "execution-show", "--execution-id", executionId, "--format", "json"
                }));


        JsonElement result = this.makeRpcAndGetJson(args);

        VTPTestExecution exec = new VTPTestExecution();

        if (result != null && result.getAsJsonObject().entrySet().iterator().hasNext()) {
            if (result.getAsJsonObject().get(START_TIME) != null)
                exec.setStartTime(result.getAsJsonObject().get(START_TIME).getAsString());

            if (result.getAsJsonObject().get(END_TIME) != null)
                exec.setEndTime(result.getAsJsonObject().get(END_TIME).getAsString());

            if (result.getAsJsonObject().get(EXECUTION_ID) != null)
                exec.setExecutionId(result.getAsJsonObject().get(EXECUTION_ID).getAsString());
            if (result.getAsJsonObject().get(REQUEST_ID) != null)
                exec.setExecutionId(result.getAsJsonObject().get(REQUEST_ID).getAsString());

            if (result.getAsJsonObject().get(PRODUCT) != null)
                exec.setScenario(result.getAsJsonObject().get(PRODUCT).getAsString());
            if (result.getAsJsonObject().get(SERVICE) != null)
                exec.setTestSuiteName(result.getAsJsonObject().get(SERVICE).getAsString());
            if (result.getAsJsonObject().get(COMMAND) != null)
                exec.setTestCaseName(result.getAsJsonObject().get(COMMAND).getAsString());
            if (result.getAsJsonObject().get(PROFILE) != null)
                exec.setExecutionId(result.getAsJsonObject().get(PROFILE).getAsString());
            if (result.getAsJsonObject().get(STATUS) != null)
                exec.setStatus(result.getAsJsonObject().get(STATUS).getAsString());
            if (result.getAsJsonObject().get(INPUT) != null) {
                exec.setParameters(result.getAsJsonObject().get(INPUT));
            }
            if (result.getAsJsonObject().get(OUTPUT) != null) {
                Gson mapper = new Gson();
                JsonElement resultJson = null;
                try {
                    resultJson = mapper.fromJson(result.getAsJsonObject().get(OUTPUT),JsonElement.class);

                    //workarround, sometimes its null.
                    if (resultJson == null) {
                        resultJson = mapper.fromJson(result.getAsJsonObject().get(OUTPUT),JsonElement.class);
                    }
                } catch (Exception e) {
                    LOG.error("Exception occurs", e);
                    JsonObject node = new JsonObject();
                    node.addProperty(ERROR, result.getAsJsonObject().get(OUTPUT).getAsString());
                    resultJson = node;

                }

                exec.setResults(resultJson);
            }
        }

        return exec;
    }

    @Path("/executions/{executionId}")
    @GET
    @ApiOperation(tags = "VTP Execution", value = " Retrieve test execution complete details", response = VTPTestExecution.class)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response getTestExecution(
             @ApiParam("Test execution Id") @PathParam("executionId") String executionId
             ) throws Exception {

        return Response.ok(this.getTestExecutionHandler(executionId).toString(), MediaType.APPLICATION_JSON).build();
    }

    public String getTestExecutionLogsHandler(
            String executionId, String action) throws VTPException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "execution-show-" + action, "--execution-id", executionId, "--format", "text"
                }));


        Result result = this.makeRpc(args);

        return result.getOutput();
    }

    @Path("/executions/{executionId}/logs")
    @GET
    @ApiOperation(tags = "VTP Execution", value = "Retrieve test execution logs details", response = String.class)
    @Produces(MediaType.TEXT_PLAIN)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response getTestExecutionLogs(
             @ApiParam("Test execution Id") @PathParam("executionId") String executionId,
             @ApiParam("Test console reports, Options: out, err, debug") @DefaultValue("out")  @QueryParam("option") String option
             ) throws VTPException {
        if (!("out".equalsIgnoreCase(option) || "err".equalsIgnoreCase(option) || "debug".equalsIgnoreCase(option))) {
                option = "out";
        }

        return Response.ok(this.getTestExecutionLogsHandler(executionId, option), MediaType.TEXT_PLAIN).build();
    }
}
