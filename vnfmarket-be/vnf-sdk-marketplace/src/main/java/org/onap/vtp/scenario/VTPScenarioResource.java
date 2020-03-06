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

package org.onap.vtp.scenario;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.jetty.http.HttpStatus;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.error.VTPError.VTPException;
import org.onap.vtp.scenario.model.VTPTestCase;
import org.onap.vtp.scenario.model.VTPTestScenario;
import org.onap.vtp.scenario.model.VTPTestSuite;
import org.onap.vtp.scenario.model.VTPTestCase.VTPTestCaseInput;
import org.onap.vtp.scenario.model.VTPTestCase.VTPTestCaseList;
import org.onap.vtp.scenario.model.VTPTestCase.VTPTestCaseOutput;
import org.onap.vtp.scenario.model.VTPTestScenario.VTPTestScenarioList;
import org.onap.vtp.scenario.model.VTPTestSuite.VTPTestSuiteList;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Path("/vtp")
@Api(tags = {"VTP Scenario"})
public class VTPScenarioResource extends VTPResource{
    private static final String DESCRIPTION = "description";
    public VTPTestScenarioList listTestScenariosHandler() throws VTPException {
        List<String> args = new ArrayList<>();

        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "product-list", "--format", "json"
                }));

        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error("IOException occurs",e);
        }

        VTPTestScenarioList list = new VTPTestScenarioList();

        if (results != null && results.isJsonArray() && results.getAsJsonArray().size()>0) {
            JsonArray resultsArray = results.getAsJsonArray();
            if (resultsArray.size() >= 0) {
                for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                    JsonElement jsonElement = it.next();
                    JsonObject n = jsonElement.getAsJsonObject();
                    if (n.entrySet().iterator().hasNext()) {
                        String name = n.get("product").getAsString();

                        if ("open-cli".equalsIgnoreCase(name))
                            continue;

                        list.getScenarios().add(new VTPTestScenario().setName(name).setDescription(
                                n.get(DESCRIPTION).getAsString()));
                    }
                }
            }
        }

        return list;
    }

    @Path("/scenarios")
    @GET
    @ApiOperation(tags = "VTP Scenario", value = " List available test scenarios", response = VTPTestScenario.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response listTestScenarios() throws VTPException {
        return Response.ok(this.listTestScenariosHandler().getScenarios().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestSuiteList listTestSutiesHandler(String scenario) throws VTPException {
        List<String> args = new ArrayList<>();

        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "service-list", "--product", scenario, "--format", "json"
                }));

        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error("IOException occurs",e);
        }

        VTPTestSuiteList list = new VTPTestSuiteList();

        if (results != null && results.isJsonArray() && results.getAsJsonArray().size()>0) {
            JsonArray resultsArray = results.getAsJsonArray();
            if (resultsArray.size() >= 0) {
                for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                    JsonElement jsonElement = it.next();
                    JsonObject n = jsonElement.getAsJsonObject();
                    if (n.entrySet().iterator().hasNext()) {
                        list.getSuites().add(new VTPTestSuite().setName(n.get("service").getAsString()).setDescription(
                                n.get(DESCRIPTION).getAsString()));
                    }
                }
            }
        }

        return list;
    }

    @Path("/scenarios/{scenario}/testsuites")
    @GET
    @ApiOperation(tags = "VTP Scenario",  value = " List available test suties in given scenario", response = VTPTestSuite.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response listTestSuties(
            @ApiParam("Test scenario name") @PathParam("scenario") String scenario) throws VTPException {

        return Response.ok(this.listTestSutiesHandler(scenario).getSuites().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestCaseList listTestcasesHandler(String testSuiteName, String scenario) throws VTPException {
        List<String> args = new ArrayList<>();

        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "schema-list", "--product", scenario, "--format", "json"
                }));
        if (testSuiteName != null) {
            args.add("--service");
            args.add(testSuiteName);
        }

        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error("IOException occurs",e);
        }

        VTPTestCaseList list = new VTPTestCaseList();

        if (results != null && results.isJsonArray()) {
            JsonArray resultsArray = results.getAsJsonArray();
            if (resultsArray.size() >= 0) {
                for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                    JsonElement jsonElement = it.next();
                    JsonObject n = jsonElement.getAsJsonObject();
                    if (n.entrySet().iterator().hasNext())
                        list.getTestCases().add(
                                new VTPTestCase().setTestCaseName(
                                        n.get("command").getAsString()).setTestSuiteName(
                                                n.get("service").getAsString()));
                }
            }
        }

        return list;
    }

    @Path("/scenarios/{scenario}/testcases")
    @GET
    @ApiOperation(tags = "VTP Scenario", value = " List available test cases", response = VTPTestCase.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response listTestcases(
             @ApiParam("Test scenario name") @PathParam("scenario") String scenario,
             @ApiParam("Test suite name") @QueryParam("testSuiteName") String testSuiteName
             ) throws VTPException {

        return Response.ok(this.listTestcasesHandler(testSuiteName, scenario).getTestCases().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestCase getTestcaseHandler(String scenario, String testSuiteName, String testCaseName) throws VTPException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                 "--product", "open-cli", "schema-show", "--product", scenario, "--service", testSuiteName, "--command", testCaseName , "--format", "json"
                }));
        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error("IOException occurs",e);
        }

        JsonObject schema = results.getAsJsonObject().getAsJsonObject("schema");

        VTPTestCase tc = new VTPTestCase();
        tc.setTestCaseName(schema.get("name").getAsString());
        tc.setDescription(schema.get(DESCRIPTION).getAsString());
        tc.setTestSuiteName(schema.get("service").getAsString());
        tc.setAuthor(schema.get("author").getAsString());
        JsonElement inputsJson = schema.get("inputs");
        if (inputsJson != null && inputsJson.isJsonArray()) {
            for (final JsonElement jsonElement: inputsJson.getAsJsonArray()) {
                JsonObject inputJson  = jsonElement.getAsJsonObject();
                VTPTestCaseInput input = new VTPTestCaseInput();

                input.setName(inputJson.get("name").getAsString());
                input.setDescription(inputJson.get(DESCRIPTION).getAsString());
                input.setType(inputJson.get("type").getAsString());

                if (inputJson.get("is_optional") != null)
                    input.setIsOptional(inputJson.get("is_optional").getAsBoolean());

                if (inputJson.get("default_value") != null)
                    input.setDefaultValue(inputJson.get("default_value").getAsString());

                if (inputJson.get("metadata") != null)
                    input.setMetadata(inputJson.get("metadata"));

                tc.getInputs().add(input);
            }
        }

        JsonElement outputsJson = schema.get("outputs");
        if (outputsJson != null && outputsJson.isJsonArray() && outputsJson.getAsJsonArray().size()>0) {
            for (final JsonElement jsonElement: outputsJson.getAsJsonArray()) {
                JsonObject outputJson = jsonElement.getAsJsonObject();
                VTPTestCaseOutput output = new VTPTestCaseOutput();
                output.setName(outputJson.get("name").getAsString());
                output.setDescription(outputJson.get(DESCRIPTION).getAsString());
                output.setType(outputJson.get("type").getAsString());

                tc.getOutputs().add(output);
            }
        }

        return tc;
    }

    @Path("/scenarios/{scenario}/testsuites/{testSuiteName}/testcases/{testCaseName}")
    @GET
    @ApiOperation(tags = "VTP Scenario",  value = "Retrieve test cases details like inputs outputs and test suite name", response = VTPTestCase.class)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation", response = VTPError.class),
            @ApiResponse(code = HttpStatus.NOT_FOUND_404,
                    message = "Test case does not exist", response = VTPError.class)})
    public Response getTestcase(
            @ApiParam("Test scenario name") @PathParam("scenario") String scenario,
            @ApiParam(value = "Test case name") @PathParam("testSuiteName") String testSuiteName,
            @ApiParam(value = "Test case name") @PathParam("testCaseName") String testCaseName)
                    throws VTPException {

        return Response.ok(this.getTestcaseHandler(scenario, testSuiteName, testCaseName).toString(), MediaType.APPLICATION_JSON).build();
    }
}
