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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

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


    public VTPTestExecutionList executeHandler(VTPTestExecutionList executions, String requestId) throws VTPException, IOException {
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
            ObjectMapper mapper = new ObjectMapper();
            Map<String,String> m = output.getAttrsMap();
            if ((m.containsKey("error")) && (!StringUtils.equals(m.get("error"), "{}"))) {
              execution.setResults(mapper.readTree(m.get("error")));
            }
            else if (m.containsKey("results")) {
              execution.setResults(mapper.readTree(m.get("results")));
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
             @FormDataParam("executions") String executionsJson) throws VTPException, IOException {

        VTPTestExecutionList executions = new VTPTestExecution.VTPTestExecutionList();
        Map<String, String> map = this.storeTestCaseInputFiles(bodyParts);

        for (Map.Entry<String, String> entry: map.entrySet()) {
            if (executionsJson.contains("file://" + entry.getKey())) {
                executionsJson = executionsJson.replaceAll("file://" + entry.getKey(), entry.getValue());
            }
        }

        if (executionsJson.contains("file://")) {
            VTPError err = new VTPError()
                    .setMessage("Some file form-data is missing as executions has input parameter tagged with file://")
                    .setHttpStatus(HttpStatus.BAD_REQUEST_400);
            throw new VTPException(err);

        }

        executions.setExecutions(
                    new ObjectMapper().readValue(executionsJson, new TypeReference<List<VTPTestExecution>>(){}));

        executions = this.executeHandler(executions, requestId);

        for (Map.Entry<String, String> entry: map.entrySet()) {
            FileUtils.forceDelete(new File(entry.getValue()));
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
            String endTime) throws VTPException, IOException{
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

        JsonNode results = this.makeRpcAndGetJson(args);

        VTPTestExecutionList list = new VTPTestExecutionList();

        if (results != null && results.isArray()) {
            ArrayNode resultsArray = (ArrayNode)results;
            if (resultsArray.size() >= 0) {
                for (Iterator<JsonNode> it = resultsArray.iterator(); it.hasNext();) {
                    JsonNode n = it.next();
                    if (n.elements().hasNext()) {
                        VTPTestExecution exec = new VTPTestExecution();
                        if (n.get(START_TIME) != null)
                            exec.setStartTime(n.get(START_TIME).asText());

                        if (n.get(END_TIME) != null)
                            exec.setEndTime(n.get(END_TIME).asText());

                        if (n.get(EXECUTION_ID) != null)
                            exec.setExecutionId(n.get(EXECUTION_ID).asText());

                        if (n.get(REQUEST_ID) != null)
                            exec.setRequestId(n.get(REQUEST_ID).asText());

                        if (n.get(PRODUCT) != null)
                            exec.setScenario(n.get(PRODUCT).asText());

                        if (n.get(SERVICE) != null)
                            exec.setTestSuiteName(n.get(SERVICE).asText());

                        if (n.get(COMMAND) != null)
                            exec.setTestCaseName(n.get(COMMAND).asText());

                        if (n.get(PROFILE) != null)
                            exec.setProfile(n.get(PROFILE).asText());

                        if (n.get(STATUS) != null)
                            exec.setStatus(n.get(STATUS).asText());

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
             ) throws VTPException, IOException {

        return Response.ok(this.listTestExecutionsHandler(
                requestId, scenario, testsuiteName, testcaseName, profileName, startTime, endTime).getExecutions().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestExecution getTestExecutionHandler(
            String executionId) throws VTPException, IOException{
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "execution-show", "--execution-id", executionId, "--format", "json"
                }));


        JsonNode result = this.makeRpcAndGetJson(args);

        VTPTestExecution exec = new VTPTestExecution();

        if (result != null && result.elements().hasNext()) {
            if (result.get(START_TIME) != null)
                exec.setStartTime(result.get(START_TIME).asText());

            if (result.get(END_TIME) != null)
                exec.setEndTime(result.get(END_TIME).asText());

            if (result.get(EXECUTION_ID) != null)
                exec.setExecutionId(result.get(EXECUTION_ID).asText());
            if (result.get(REQUEST_ID) != null)
                exec.setExecutionId(result.get(REQUEST_ID).asText());

            if (result.get(PRODUCT) != null)
                exec.setScenario(result.get(PRODUCT).asText());
            if (result.get(SERVICE) != null)
                exec.setTestSuiteName(result.get(SERVICE).asText());
            if (result.get(COMMAND) != null)
                exec.setTestCaseName(result.get(COMMAND).asText());
            if (result.get(PROFILE) != null)
                exec.setExecutionId(result.get(PROFILE).asText());
            if (result.get(STATUS) != null)
                exec.setStatus(result.get(STATUS).asText());
            if (result.get(INPUT) != null) {
                exec.setParameters(result.get(INPUT));
            }
            if (result.get(OUTPUT) != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode resultJson = null;
                try {
                    resultJson = mapper.readTree(result.get(OUTPUT).asText());

                    //workarround, sometimes its null.
                    if (resultJson == null) {
                        resultJson = mapper.readTree(result.get(OUTPUT).toString());
                    }
                } catch (Exception e) {
                    ObjectNode node = JsonNodeFactory.instance.objectNode();
                    node.put("error", result.get(OUTPUT).asText());
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
             ) throws VTPException, IOException {

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
             ) throws VTPException, IOException {
        if (!("out".equalsIgnoreCase(option) || "err".equalsIgnoreCase(option) || "debug".equalsIgnoreCase(option))) {
                option = "out";
        }

        return Response.ok(this.getTestExecutionLogsHandler(executionId, option), MediaType.TEXT_PLAIN).build();
    }
}
