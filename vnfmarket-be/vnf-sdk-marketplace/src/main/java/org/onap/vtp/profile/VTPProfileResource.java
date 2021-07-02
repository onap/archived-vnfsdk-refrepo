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

package org.onap.vtp.profile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.eclipse.jetty.http.HttpStatus;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.error.VTPError.VTPException;
import org.onap.vtp.profile.model.VTPTestProfile;
import org.onap.vtp.profile.model.VTPTestProfile.VTPTestProfileList;
import org.onap.vtp.profile.model.VTPTestProfile.VTPTestProfileProperty;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@Path("/vtp")
@Api(tags = {"VTP Envrionment Profile"})
public class VTPProfileResource extends VTPResource {

    public VTPTestProfileList listTestProfilesHandler()  throws VTPException, IOException{
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "profile-list", "--format", "json"
                }));

        JsonArray results = this.makeRpcAndGetJson(args).getAsJsonArray();

        VTPTestProfileList list = new VTPTestProfileList();

       if (results != null && results.isJsonArray() && results.getAsJsonArray().size() > 0) {
       	 JsonArray resultsArray = results.getAsJsonArray();
            for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                JsonElement jsonElement = it.next();
                JsonObject n = jsonElement.getAsJsonObject();
                if (n.has("profile")){
                    list.getTestProfiles().add(new VTPTestProfile().setName(n.get("profile").getAsString()));
                }
            }
        }

        return list;
    }

    @Path("/profiles")
    @GET
    @ApiOperation(tags = "VTP Envrionment Profile", value = "List available profiles", response = VTPTestProfile.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response listTestProfiles() throws VTPException, IOException {
        return Response.ok(this.listTestProfilesHandler().getTestProfiles().toString(), MediaType.APPLICATION_JSON).build();
    }

    public VTPTestProfile getTestProfileHandler(String profileName) throws VTPException, IOException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                 "--product", "open-cli", "profile-show", "--profile", profileName, "--format", "json"
                }));
        JsonArray results = this.makeRpcAndGetJson(args).getAsJsonArray();

        VTPTestProfile profile = new VTPTestProfile();
        profile.setName(profileName);

        if (results != null && results.size() > 1 && results.isJsonArray() && results.getAsJsonArray().size() > 0) {
          	 JsonArray resultsArray = results.getAsJsonArray();
               for (Iterator<JsonElement> it = resultsArray.iterator(); it.hasNext();) {
                   JsonElement jsonElement = it.next();
                   JsonObject n = jsonElement.getAsJsonObject();
                    VTPTestProfileProperty prp = new VTPTestProfileProperty();

                    prp.setInputParameterName(n.get("parameter").getAsString());
                    prp.setValue(n.get("value").getAsString());

                    if (n.get("service") != null && !n.get("service").getAsString().equals("*"))
                        prp.setTestSuiteName(n.get("service").getAsString());

                    if (n.get("command") != null && !n.get("command").getAsString().equals("*"))
                        prp.setTestCaseName(n.get("command").getAsString());

                    if (n.get("product") != null && !n.get("product").getAsString().equals("*"))
                        prp.setScenario(n.get("product").getAsString());

                    profile.getProperties().add(prp);
            }
            return profile;
        }
        else {
             throw new VTPException(
                    new VTPError().setMessage("Test profile does not exist").setHttpStatus(HttpStatus.NOT_FOUND_404));
        }
    }

    @Path("/profiles/{profileName}")
    @GET
    @ApiOperation(tags = "VTP Envrionment Profile", value = " Retrieve profile details", response = VTPTestProfile.class)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation", response = VTPError.class),
            @ApiResponse(code = HttpStatus.NOT_FOUND_404,
                    message = "Test profile does not exist", response = VTPError.class)})
    public Response getTestProfile(
            @ApiParam(value = "Test profile name") @PathParam("profileName") String profileName)
                    throws IOException, VTPException {
        return Response.ok(this.getTestProfileHandler(profileName).toString(), MediaType.APPLICATION_JSON).build();
    }

    public void setPofileHanlder(VTPTestProfile profile) throws VTPException, IOException {
        List<String> args = new ArrayList<>();


        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "profile-set", "--format", "json", "--profile", profile.getName()
                }));

        Map<String, List<String>> productVsProfile = new HashMap<>();

        for (VTPTestProfileProperty prp: profile.getProperties()) {
            String scenario = prp.getScenario();

            if (prp.getScenario() == null ) {
                scenario = "__global__";
            }

            if (productVsProfile.get(scenario) == null) {
                productVsProfile.put(scenario, new ArrayList<String>());
            }

            if ((prp.getInputParameterName() != null) && !prp.getInputParameterName().isEmpty() &&
                    (prp.getValue() != null) && !prp.getValue().isEmpty()) {

                String paramName = "";
                if (prp.getTestSuiteName() != null && !prp.getTestSuiteName().isEmpty()) {
                    paramName += prp.getTestSuiteName() + ":";

                    if (prp.getTestCaseName() != null && !prp.getTestCaseName().isEmpty()) {
                        paramName += prp.getTestCaseName() + ":";
                    }
                }

                paramName += prp.getInputParameterName();

                productVsProfile.get(scenario).add("--parameter");
                productVsProfile.get(scenario).add(paramName + "=" + prp.getValue());
            }
        }

        for (String scenario: productVsProfile.keySet()) {
            List<String> arguments = new ArrayList<>();
            arguments.addAll(args);
            arguments.addAll(productVsProfile.get(scenario));

            if (!scenario.equals("__global__")) { //profile is set across.
                arguments.add("--product");
                arguments.add(scenario);
            }

            this.makeRpcAndGetJson(arguments);
        }
    }

    public void unsetPofileHanlder(VTPTestProfile profile) throws VTPException, IOException {
        List<String> args = new ArrayList<>();


        args.addAll(Arrays.asList(new String[] {
                "--product", "open-cli", "profile-unset", "--format", "json", "--profile", profile.getName()
                }));

        Map<String, List<String>> productVsProfile = new HashMap<>();

        for (VTPTestProfileProperty prp: profile.getProperties()) {
            String scenario = prp.getScenario();

            if (prp.getScenario() == null ) {
                scenario = "__global__";
            }

            if (productVsProfile.get(scenario) == null) {
                productVsProfile.put(scenario, new ArrayList<String>());
            }

            if ((prp.getInputParameterName() != null) && !prp.getInputParameterName().isEmpty() &&
                    ((prp.getValue() == null) || prp.getValue().isEmpty())) {

                String paramName = "";
                if (prp.getTestSuiteName() != null && !prp.getTestSuiteName().isEmpty()) {
                    paramName += prp.getTestSuiteName() + ":";

                    if (prp.getTestCaseName() != null && !prp.getTestCaseName().isEmpty()) {
                        paramName += prp.getTestCaseName() + ":";
                    }
                }

                paramName += prp.getInputParameterName();

                productVsProfile.get(scenario).add("--parameter");
                productVsProfile.get(scenario).add(paramName);
            }
        }

        for (String scenario: productVsProfile.keySet()) {

            if (productVsProfile.get(scenario).size() == 0) continue;

            List<String> arguments = new ArrayList<>();
            arguments.addAll(args);
            arguments.addAll(productVsProfile.get(scenario));

            if (!scenario.equals("__global__")) { //profile is set across.
                arguments.add("--product");
                arguments.add(scenario);
            }

            this.makeRpcAndGetJson(arguments);
        }
    }

    @Path("/profiles")
    @POST
    @ApiOperation(tags = "VTP Envrionment Profile", value = "Create profile.")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class),
            @ApiResponse(code = HttpStatus.CONFLICT_409,
            message = "Test profile does already exist with given name", response = VTPError.class) })
    public Response createProfile(@Context HttpServletRequest request) throws VTPException, IOException {

        VTPTestProfile profile = new Gson().fromJson(IOUtils.toString(request.getInputStream()), VTPTestProfile.class);

        for (VTPTestProfile p: this.listTestProfilesHandler().getTestProfiles()) {
            if (p.getName().equalsIgnoreCase(profile.getName())) {
                throw new VTPException(
                        new VTPError().setMessage("Test profile does already exist with given name").setHttpStatus(HttpStatus.CONFLICT_409));
            }
        }

        this.setPofileHanlder(profile);

        return Response.ok().build();
    }

    @Path("/profiles/{profileName}")
    @PUT
    @ApiOperation(tags = "VTP Envrionment Profile", value = "Update profile. To remove a profile parameter, set its value to null or empty.")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation",
                    response = VTPError.class) })
    public Response updateProfile(
            @ApiParam(value = "Test profile name") @PathParam("profileName") String profileName,
            @Context HttpServletRequest request) throws VTPException, IOException {

        VTPTestProfile profile = new Gson().fromJson(IOUtils.toString(request.getInputStream()), VTPTestProfile.class);
        if (profile.getName() != null && !profile.getName().equalsIgnoreCase(profileName)) {
            //TODO: rename profile
        }

        profile.setName(profileName);

        //Unset those params which value is null or empty.
        this.unsetPofileHanlder(profile);

        //Set profile
        this.setPofileHanlder(profile);

        return Response.ok().build();
    }

    public void deleteProfileHandler(String profileName) throws VTPException, IOException {
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(new String[] {
                 "--product", "open-cli", "profile-delete", "--profile", profileName, "--format", "json"
                }));
        this.makeRpcAndGetJson(args);
    }

    @Path("/profiles/{profileName}")
    @DELETE
    @ApiOperation(tags = "VTP Envrionment Profile", value = "Delete profile")
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500,
                    message = "Failed to perform the operation", response = VTPError.class),
            @ApiResponse(code = HttpStatus.NOT_FOUND_404,
                    message = "Test profile does not exist", response = VTPError.class)})
    public Response deleteProfile(
            @ApiParam(value = "Test profile name") @PathParam("profileName") String profileName)
                    throws IOException, VTPException {

        this.deleteProfileHandler(profileName);

        return Response.status(HttpStatus.NO_CONTENT_204).build();
    }
}
