/**
 * Copyright 2018 Huawei Technologies Co., Ltd.
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

package org.onap.vtp.scenario;

import com.google.common.collect.Maps;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.swagger.annotations.*;
import org.apache.commons.io.FileUtils;
import org.apache.cxf.common.util.CollectionUtils;
import org.eclipse.jetty.http.HttpStatus;
import org.glassfish.jersey.media.multipart.BodyPartEntity;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.common.ToolUtil;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.error.VTPError.VTPException;
import org.onap.vtp.scenario.model.VTPTestCase;
import org.onap.vtp.scenario.model.VTPTestCase.VTPTestCaseInput;
import org.onap.vtp.scenario.model.VTPTestCase.VTPTestCaseList;
import org.onap.vtp.scenario.model.VTPTestCase.VTPTestCaseOutput;
import org.onap.vtp.scenario.model.VTPTestScenario;
import org.onap.vtp.scenario.model.VTPTestScenario.VTPTestScenarioList;
import org.onap.vtp.scenario.model.VTPTestSuite;
import org.onap.vtp.scenario.model.VTPTestSuite.VTPTestSuiteList;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.*;
import java.text.MessageFormat;
import java.util.*;
import java.util.regex.Matcher;

@Path("/vtp")
@Api(tags = {"VTP Scenario"})
public class VTPScenarioResource extends VTPResource {
    private static final String DESCRIPTION = "description";
    private static final String PRODUCT_ARG = "--product";
    private static final String OPEN_CLI = "open-cli";
    private static final String FORMAT = "--format";
    private static final String IO_EXCEPTION_OCCURS = "IOException occurs";
    private static final String SERVICE = "service";

    public VTPTestScenarioList listTestScenariosHandler() throws VTPException {
        List<String> args = new ArrayList<>();

        args.addAll(Arrays.asList(new String[]{
                PRODUCT_ARG, OPEN_CLI, "product-list", FORMAT, "json"
        }));

        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error(IO_EXCEPTION_OCCURS, e);
        }

        VTPTestScenarioList list = new VTPTestScenarioList();

        if (results != null && results.isJsonArray() && results.getAsJsonArray().size() > 0) {
            JsonArray resultsArray = results.getAsJsonArray();
            for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext(); ) {
                JsonElement jsonElement = it.next();
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.entrySet().iterator().hasNext()) {
                    String name = n.get("product").getAsString();

                    if (OPEN_CLI.equalsIgnoreCase(name)) {
                        continue;
                    }

                    list.getScenarios().add(new VTPTestScenario().setName(name).setDescription(
                            n.get(DESCRIPTION).getAsString()));
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
                    response = VTPError.class)})
    public Response listTestScenarios() throws VTPException {
        return Response.ok(this.listTestScenariosHandler().getScenarios().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestSuiteList listTestSutiesHandler(String scenario) throws VTPException {
        List<String> args = new ArrayList<>();

        args.addAll(Arrays.asList(new String[]{
                PRODUCT_ARG, OPEN_CLI, "service-list", PRODUCT_ARG, scenario, FORMAT, "json"
        }));

        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error(IO_EXCEPTION_OCCURS, e);
        }

        VTPTestSuiteList list = new VTPTestSuiteList();

        if (results != null && results.isJsonArray() && results.getAsJsonArray().size() > 0) {
            JsonArray resultsArray = results.getAsJsonArray();
            for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext(); ) {
                JsonElement jsonElement = it.next();
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.entrySet().iterator().hasNext()) {
                    list.getSuites().add(new VTPTestSuite().setName(n.get(SERVICE).getAsString()).setDescription(
                            n.get(DESCRIPTION).getAsString()));
                }
            }
        }

        return list;
    }

    @Path("/scenarios/{scenario}/testsuites")
    @GET
    @ApiOperation(tags = "VTP Scenario", value = " List available test suties in given scenario", response = VTPTestSuite.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class)})
    public Response listTestSuties(
            @ApiParam("Test scenario name") @PathParam("scenario") String scenario) throws VTPException {

        return Response.ok(this.listTestSutiesHandler(scenario).getSuites().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestCaseList listTestcasesHandler(String testSuiteName, String scenario) throws VTPException {
        List<String> args = new ArrayList<>();

        args.addAll(Arrays.asList(new String[]{
                PRODUCT_ARG, OPEN_CLI, "schema-list", PRODUCT_ARG, scenario, FORMAT, "json"
        }));
        if (testSuiteName != null) {
            args.add("--service");
            args.add(testSuiteName);
        }

        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error(IO_EXCEPTION_OCCURS, e);
        }

        VTPTestCaseList list = new VTPTestCaseList();

        if (results != null && results.isJsonArray() && results.getAsJsonArray().size() > 0) {
            JsonArray resultsArray = results.getAsJsonArray();
            for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext(); ) {
                JsonElement jsonElement = it.next();
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.entrySet().iterator().hasNext()) {
                    list.getTestCases().add(
                            new VTPTestCase().setTestCaseName(
                                    n.get("command").getAsString()).setTestSuiteName(
                                    n.get(SERVICE).getAsString()));
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
                    response = VTPError.class)})
    public Response listTestcases(
            @ApiParam("Test scenario name") @PathParam("scenario") String scenario,
            @ApiParam("Test suite name") @QueryParam("testSuiteName") String testSuiteName
    ) throws VTPException {

        return Response.ok(this.listTestcasesHandler(testSuiteName, scenario).getTestCases().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestCase getTestcaseHandler(String scenario, String testSuiteName, String testCaseName) throws VTPException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[]{
                PRODUCT_ARG, OPEN_CLI, "schema-show", PRODUCT_ARG, scenario, "--service", testSuiteName, "--command", testCaseName, FORMAT, "json"
        }));
        JsonElement results = null;
        try {
            results = this.makeRpcAndGetJson(args);
        } catch (IOException e) {
            LOG.error(IO_EXCEPTION_OCCURS, e);
        }

        JsonObject schema = results.getAsJsonObject().getAsJsonObject("schema");

        VTPTestCase tc = new VTPTestCase();
        tc.setTestCaseName(schema.get("name").getAsString());
        tc.setDescription(schema.get(DESCRIPTION).getAsString());
        tc.setTestSuiteName(schema.get(SERVICE).getAsString());
        tc.setAuthor(schema.get("author").getAsString());
        JsonElement inputsJson = schema.get("inputs");
        if (inputsJson != null && inputsJson.isJsonArray()) {
            for (final JsonElement jsonElement : inputsJson.getAsJsonArray()) {
                JsonObject inputJson = jsonElement.getAsJsonObject();
                VTPTestCaseInput input = new VTPTestCaseInput();

                input.setName(inputJson.get("name").getAsString());
                input.setDescription(inputJson.get(DESCRIPTION).getAsString());
                input.setType(inputJson.get("type").getAsString());

                if (inputJson.get("is_optional") != null) {
                    input.setIsOptional(inputJson.get("is_optional").getAsBoolean());
                }

                if (inputJson.get("default_value") != null) {
                    input.setDefaultValue(inputJson.get("default_value").getAsString());
                }

                if (inputJson.get("metadata") != null) {
                    input.setMetadata(inputJson.get("metadata"));
                }

                tc.getInputs().add(input);
            }
        }

        JsonElement outputsJson = schema.get("outputs");
        if (outputsJson != null && outputsJson.isJsonArray() && outputsJson.getAsJsonArray().size() > 0) {
            for (final JsonElement jsonElement : outputsJson.getAsJsonArray()) {
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
    @ApiOperation(tags = "VTP Scenario", value = "Retrieve test cases details like inputs outputs and test suite name", response = VTPTestCase.class)
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

    @Path("/scenarios/storage")
    @POST
    @ApiOperation(tags = "VTP Scenario", value = "Store available scenarios yaml")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "Failed to perform the operation", response = VTPError.class)})
    public Response storageScenarios(@ApiParam(value = "file form data body parts", required = true)
                                     @FormDataParam("files") List<FormDataBodyPart> bodyParts) throws VTPException {
        bodyParts.forEach(bodyPart -> {
            BodyPartEntity entity = (BodyPartEntity) bodyPart.getEntity();
            String fileName = bodyPart.getContentDisposition().getFileName();
            if (!ToolUtil.isYamlFile(new File(fileName))) {
                LOG.error("The fileName {} is not yaml !!!", fileName);
                return;
            }
            String scenario = fileName.substring(0, fileName.indexOf("-registry"));
            File scenarioDir = new File(VTP_YAML_STORE, scenario);
            File yamlFile = new File(VTP_YAML_STORE, fileName);

            // 1、store the scenario yaml file and create the scenario dir
            try {
                FileUtils.deleteQuietly(yamlFile);
                FileUtils.deleteDirectory(scenarioDir);
                FileUtils.copyInputStreamToFile(entity.getInputStream(), yamlFile);
                FileUtils.forceMkdir(scenarioDir);
            } catch (IOException e) {
                LOG.error("Save yaml {} failed", fileName, e);
            }

            // 2、create the testsuits dir and copy the testcase to current scenarios by commands
            try {
                Map<String, Object> yamlInfos = Maps.newHashMap();
                try (FileReader fileReader = new FileReader(yamlFile)) {
                    yamlInfos = snakeYaml().load(fileReader);
                }
                for (Object service : (List) yamlInfos.get("services")) {
                    Map<String, Object> serviceMap = (Map<String, Object>) service;
                    String testsuite = serviceMap.get("name").toString();
                    File testsuiteDir = new File(scenarioDir, testsuite);
                    FileUtils.forceMkdir(testsuiteDir);
                    if (!serviceMap.containsKey("commands")) {
                        continue;
                    }
                    for (Object cmd : (List) serviceMap.get("commands")) {
                        File source = new File(VTP_YAML_STORE, cmd.toString().replaceAll("::", Matcher.quoteReplacement(File.separator)));
                        if (!cn.hutool.core.io.FileUtil.isFile(source)) {
                            LOG.error("Source {} is not a yaml file !!!", source.getName());
                            continue;
                        }
                        File dest = new File(testsuiteDir, cmd.toString().substring(cmd.toString().lastIndexOf("::") + 2));
                        FileUtils.copyFile(source, dest);

                        // 3、modify the testcase scenario and testsuite
                        Map<String, Object> result = Maps.newHashMap();
                        try (FileReader fileReader = new FileReader(dest)) {
                            result = snakeYaml().load(fileReader);
                        }
                        Map<String, Object> info = (Map<String, Object>) result.get("info");
                        info.put("product", scenario);
                        info.put("service", testsuite);
                        try (FileWriter fileWriter = new FileWriter(dest)) {
                            snakeYaml().dump(result, fileWriter);
                        }
                    }
                }
            } catch (Exception e) {
                LOG.error("Parse testcase yaml failed !!!", e);
            }
        });
        return Response.ok("Save yaml success", MediaType.APPLICATION_JSON).build();
    }


    @Path("/scenarios/{filename}")
    @DELETE
    @ApiOperation(tags = "VTP Scenario", value = "Delete available scenario yaml")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "Failed to perform the operation", response = VTPError.class)})
    public Response deleteScenario(@ApiParam("Test scenario yaml") @PathParam("filename") String filename) throws VTPException {
        String scenario = filename.substring(0, filename.indexOf("-registry"));
        File scenarioDir = new File(VTP_YAML_STORE, scenario);
        List<File> yamls = cn.hutool.core.io.FileUtil.loopFiles(scenarioDir, new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                final String path = pathname.getPath();
                if (null != path && path.endsWith(CommonConstant.YAML_SUFFIX)) {
                    return true;
                }
                return false;
            }
        });
        if (!CollectionUtils.isEmpty(yamls)) {
            LOG.error("The scenario yaml {} has sub testcase yamls, delete failed", filename);
            throw new VTPException(
                    new VTPError().setMessage(MessageFormat.format("The scenario yaml {0} has sub testcase yamls, delete failed !!!", filename))
                            .setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR_500));
        }

        try {
            FileUtils.deleteQuietly(new File(VTP_YAML_STORE, filename));
            FileUtils.deleteDirectory(scenarioDir);
        } catch (IOException e) {
            LOG.error("Delete scenario yaml {} failed", filename, e);
            throw new VTPException(
                    new VTPError().setMessage("Delete yaml failed !!!").setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR_500));
        }
        return Response.ok("Delete yaml success", MediaType.APPLICATION_JSON).build();
    }

    @Path("/scenarios/testcases/storage")
    @POST
    @ApiOperation(tags = "VTP Scenario", value = "Store available testcases yaml")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "Failed to perform the operation", response = VTPError.class)})
    public Response storageTestcases(@ApiParam(value = "file form data body parts", required = true)
                                     @FormDataParam("files") List<FormDataBodyPart> bodyParts) throws VTPException {
        bodyParts.forEach(bodyPart -> {
            BodyPartEntity entity = (BodyPartEntity) bodyPart.getEntity();
            String fileName = bodyPart.getContentDisposition().getFileName();
            if (ToolUtil.isYamlFile(new File(fileName))) {
                // 1、store the testcase yaml file
                Map<String, Object> result = snakeYaml().load(entity.getInputStream());
                Map<String, Object> info = (Map<String, Object>) result.get("info");

                File yamlFile = new File(VTP_YAML_STORE, info.get("product") + File.separator + info.get("service") + File.separator + fileName);
                try {
                    FileUtils.deleteQuietly(yamlFile);
                    FileUtils.copyInputStreamToFile(entity.getInputStream(), yamlFile);
                } catch (IOException e) {
                    LOG.error("Save testcase yaml {} failed", yamlFile.getName(), e);
                }
            } else {
                // 2、store the testcase script file
                File scriptFile = new File(VTP_SCRIPT_STORE, fileName);
                try {
                    FileUtils.deleteQuietly(scriptFile);
                    FileUtils.copyInputStreamToFile(entity.getInputStream(), scriptFile);
                } catch (IOException e) {
                    LOG.error("Save testcase script {} failed", scriptFile.getName(), e);
                }
            }
        });
        return Response.ok("Save success", MediaType.APPLICATION_JSON).build();
    }
}
