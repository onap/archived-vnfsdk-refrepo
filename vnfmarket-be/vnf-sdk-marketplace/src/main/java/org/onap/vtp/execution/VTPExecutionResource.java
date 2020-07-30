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

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

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
    private static Gson gson = new Gson();

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
            JsonParser jsonParser = new JsonParser();
            Map<String,String> m = output.getAttrsMap();
            if ((m.containsKey(ERROR)) && (!StringUtils.equals(m.get(ERROR), "{}"))) {
                try {
                    execution.setResults(jsonParser.parse(m.get(ERROR)));
                } catch (Exception e) { //NOSONAR
                    LOG.error("Exception occurs",e);
                }
            }
            else if (m.containsKey("results")) {
                try {
                    execution.setResults(jsonParser.parse(m.get("results")));
                } catch (Exception e) { //NOSONAR
                    LOG.error("Exception occurs",e);
                }
            }
        }

        return executions;
    }

    private Map<String, String> storeTestCaseInputFiles(List<FormDataBodyPart> bodyParts) throws IOException {
        Map<String, String> map = new HashMap<>();
        if (bodyParts != null) {
            for (FormDataBodyPart part: bodyParts) {
                String name = part.getContentDisposition().getFileName();
                String path = VTP_EXECUTION_TEMP_STORE + "/" + name; //NOSONAR

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
                        gson.fromJson(executionsJson, new TypeToken<List<VTPTestExecution>>(){}.getType()));
        } catch (Exception e) { //NOSONAR
            LOG.error("Exception occurs",e);
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
            String endTime) throws VTPException, IOException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(
                "--product", "open-cli", "execution-list", "--format", "json"
                ));

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

        if (results != null && results.isJsonArray() && results.getAsJsonArray().size() > 0) {
            JsonArray resultsArray = results.getAsJsonArray();
                for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                    JsonElement jsonElement = it.next();
                    JsonObject n = jsonElement.getAsJsonObject();
                    if (n.entrySet().iterator().hasNext()) {
                        VTPTestExecution exec = new VTPTestExecution();
                        if (n.get(START_TIME) != null)
                            exec.setStartTime(n.get(START_TIME).getAsString());

                        if (n.get(END_TIME) != null)
                            exec.setEndTime(n.get(END_TIME).getAsString());

                        if (n.get(EXECUTION_ID) != null)
                            exec.setExecutionId(n.get(EXECUTION_ID).getAsString());

                        if (n.get(REQUEST_ID) != null)
                            exec.setRequestId(n.get(REQUEST_ID).getAsString());

                        if (n.get(PRODUCT) != null)
                            exec.setScenario(n.get(PRODUCT).getAsString());

                        if (n.get(SERVICE) != null)
                            exec.setTestSuiteName(n.get(SERVICE).getAsString());

                        if (n.get(COMMAND) != null)
                            exec.setTestCaseName(n.get(COMMAND).getAsString());

                        if (n.get(PROFILE) != null)
                            exec.setProfile(n.get(PROFILE).getAsString());

                        if (n.get(STATUS) != null)
                            exec.setStatus(n.get(STATUS).getAsString());

                        list.getExecutions().add(exec);
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
             ) throws VTPException, IOException  {

        return Response.ok(this.listTestExecutionsHandler(
                requestId, scenario, testsuiteName, testcaseName, profileName, startTime, endTime).getExecutions().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestExecution getTestExecutionHandler(
            String executionId) throws VTPException, IOException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(
                "--product", "open-cli", "execution-show", "--execution-id", executionId, "--format", "json"
                ));


        JsonElement result = this.makeRpcAndGetJson(args);

        VTPTestExecution exec = new VTPTestExecution();

        if (result != null && result.isJsonObject()) {

            JsonObject resultObj = result.getAsJsonObject();
            if (resultObj.entrySet().iterator().hasNext()){
                if (resultObj.get(START_TIME) != null)
                    exec.setStartTime(resultObj.get(START_TIME).getAsString());

                if (resultObj.get(END_TIME) != null)
                    exec.setEndTime(resultObj.get(END_TIME).getAsString());

                if (resultObj.get(EXECUTION_ID) != null)
                    exec.setExecutionId(resultObj.get(EXECUTION_ID).getAsString());
                if (resultObj.get(REQUEST_ID) != null)
                    exec.setExecutionId(resultObj.get(REQUEST_ID).getAsString());

                if (resultObj.get(PRODUCT) != null)
                    exec.setScenario(resultObj.get(PRODUCT).getAsString());
                if (resultObj.get(SERVICE) != null)
                    exec.setTestSuiteName(resultObj.get(SERVICE).getAsString());
                if (resultObj.get(COMMAND) != null)
                    exec.setTestCaseName(resultObj.get(COMMAND).getAsString());
                if (resultObj.get(PROFILE) != null)
                    exec.setExecutionId(resultObj.get(PROFILE).getAsString());
                if (resultObj.get(STATUS) != null)
                    exec.setStatus(resultObj.get(STATUS).getAsString());
                if (resultObj.get(INPUT) != null ) {
                    exec.setParameters(resultObj.get(INPUT));
                }
                if (resultObj.get(OUTPUT) != null) {
                    JsonParser jsonParser = new JsonParser();
                    JsonElement resultJson = null;
                    try {
                        resultJson = jsonParser.parse(resultObj.get(OUTPUT).getAsString());

                    //workarround, sometimes its null.
                        if (resultJson == null || resultJson.isJsonNull()) {
                            resultJson = jsonParser.parse(resultObj.get(OUTPUT).toString());
                        }
                    } catch (Exception e) {
                        LOG.error("Exception occurs", e);
                        JsonObject node = new JsonObject();
                        node.addProperty(ERROR, resultObj.get(OUTPUT).toString());
                        resultJson = node;
                    }

                    exec.setResults(resultJson);
                }
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
             ) throws VTPException, IOException  {

        return Response.ok(this.getTestExecutionHandler(executionId).toString(), MediaType.APPLICATION_JSON).build();
    }

    public String getTestExecutionLogsHandler(
            String executionId, String action) throws VTPException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(
                "--product", "open-cli", "execution-show-" + action, "--execution-id", executionId, "--format", "text"
                ));


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
