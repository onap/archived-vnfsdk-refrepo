/**
 * Copyright 2017-18 Huawei Technologies Co., Ltd.
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

package org.onap.vnfsdk.marketplace.resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.eclipse.jetty.http.HttpStatus;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.common.ToolUtil;
import org.onap.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.onap.vnfsdk.marketplace.db.resource.PackageManager;
import org.onap.vnfsdk.marketplace.entity.response.CsarFileUriResponse;
import org.onap.vnfsdk.marketplace.entity.response.PackageMeta;
import org.onap.vnfsdk.marketplace.entity.response.UploadPackageResponse;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoardingResult;
import org.onap.vnfsdk.marketplace.rest.RestConstant;
import org.onap.vnfsdk.marketplace.rest.RestResponse;
import org.onap.vnfsdk.marketplace.rest.RestfulClient;
import org.onap.vnfsdk.marketplace.wrapper.PackageWrapper;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenRemoteCli;

import com.google.gson.internal.LinkedTreeMap;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;


@Path("/PackageResource")
@Api(tags = { "Package Resource" })
public class PackageResource {

    static {

    }
    @Path("/updatestatus")
    @POST
    @ApiOperation(value = "update validate and lifecycle test status", response = UploadPackageResponse.class)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "update  error", response = String.class) })
    public Response updateValidateStatus(@ApiParam(value = "http request body") @Context HttpServletRequest request,
            @ApiParam(value = "http header") @Context HttpHeaders head) throws IOException {
        InputStream input = request.getInputStream();
        return PackageWrapper.getInstance().updateValidateStatus(input);

    }

    @Path("/csars")
    @GET
    @ApiOperation(value = "get csar package list by condition", response = PackageMeta.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "resource grant error", response = String.class) })
    public Response queryPackageListByCond(@ApiParam(value = "csar name") @QueryParam("name") String name,
            @ApiParam(value = "csar provider") @QueryParam("provider") String provider,
            @ApiParam(value = "csar version") @QueryParam("version") String version,
            @ApiParam(value = "delay to delete") @QueryParam("deletionPending") String deletionPending,
            @ApiParam(value = "csar type") @QueryParam("type") String type) {
        return PackageWrapper.getInstance().queryPackageListByCond(name, provider, version, deletionPending, type);
    }

    @Path("/csars/{csarId}")
    @GET
    @ApiOperation(value = "get csar package list", response = PackageMeta.class, responseContainer = "List")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "resource grant error", response = String.class) })
    public Response queryPackageById(@ApiParam(value = "csar id") @PathParam("csarId") String csarId) {
        return PackageWrapper.getInstance().queryPackageById(csarId);
    }

    @Path("/csars")
    @POST
    @ApiOperation(value = "upload csar package", response = UploadPackageResponse.class)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "resource grant error", response = String.class) })
    public Response uploadPackage(
            @ApiParam(value = "file inputstream", required = true) @FormDataParam("file") InputStream uploadedInputStream,
            @FormDataParam("params") String details,
            @ApiParam(value = "file detail", required = false) @FormDataParam("file") FormDataContentDisposition fileDetail,
            @ApiParam(value = "http header") @Context HttpHeaders head)
            throws IOException, MarketplaceResourceException {
        return PackageWrapper.getInstance().uploadPackage(uploadedInputStream, fileDetail, details, head);
    }

    @Path("/vtp/tests")
    @GET
    @ApiOperation(value = "VTP Test cases", response = String.class)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "Failed to retrieve the tests", response = String.class) })
    public Response listTests() throws IOException, MarketplaceResourceException {
        Result result = null;
        try {
            result = OpenRemoteCli.run(new String[] { "-P", "open-cli", "schema-list", "--product", "onap-vtp", "--format", "json" });
        } catch (Exception e) {
            return Response.serverError().build();
        }

        if (result.getExitCode() != 0) {
            return Response.serverError().entity(result.getOutput()).build();
        }

        return Response.ok(result.getOutput(), MediaType.APPLICATION_JSON).build();
    }

    @Path("/vtp/tests/{testName}/run")
    @POST
    @ApiOperation(value = "Run VTP testcase")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "Test case not found", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "VTP internal failure", response = String.class) })
    public Response runTest(@ApiParam(value = "test Name") @PathParam("testName") String testName,
            @Context HttpServletRequest request)
            throws IOException, MarketplaceResourceException {
        String details = IOUtils.toString(request.getInputStream());
        Result result = null;
        try {
            List<String> cmdArgsList = new ArrayList<>();
            for (String defaultArg: new String[] { "-P", "onap-vtp", testName, "--format", "json" }) {
                cmdArgsList.add(defaultArg);
            }

            LinkedTreeMap<String, String> cmdArgs = ToolUtil.fromJson(details, LinkedTreeMap.class);
            for (Entry<String, String> arg : cmdArgs.entrySet()) {
                cmdArgsList.add("--" + arg.getKey());
                cmdArgsList.add(arg.getValue());
            }

            result = OpenRemoteCli.run(cmdArgsList.toArray(new String []{}));
        } catch (Exception e) {
            return Response.serverError().build();
        }

        if (result.getExitCode() != 0) {
            return Response.serverError().entity(result.getOutput()).build();
        }

        return Response.ok(result.getOutput(), MediaType.APPLICATION_JSON).build();
    }

    @Path("/csars/{csarId}")
    @DELETE
    @ApiOperation(value = "delete a package")
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "resource grant error", response = String.class) })
    public Response delPackage(@ApiParam(value = "csar Id") @PathParam("csarId") String csarId) {
        return PackageWrapper.getInstance().delPackage(csarId);
    }

    @Path("/csars/{csarId}/files")
    @GET
    @ApiOperation(value = "get csar file uri by csarId", response = CsarFileUriResponse.class)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "resource grant error", response = String.class) })
    public Response getCsarFileUri(@ApiParam(value = "csar Id", required = true) @PathParam("csarId") String csarId) {
        return PackageWrapper.getInstance().getCsarFileUri(csarId);
    }

    @Path("/csars/{csarId}/downloaded")
    @GET
    @ApiOperation(value = "update download count for a package", response = Response.class)
    public Response updateDwonloadCount(@ApiParam(value = "csar Id") @PathParam("csarId") String csarId) {
        return PackageWrapper.getInstance().updateDwonloadCount(csarId);
    }

    @Path("/csars/{csarId}/reupload")
    @POST
    @ApiOperation(value = "re-upload csar package", response = UploadPackageResponse.class)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @ApiResponses(value = {
            @ApiResponse(code = HttpStatus.NOT_FOUND_404, message = "microservice not found", response = String.class),
            @ApiResponse(code = HttpStatus.UNSUPPORTED_MEDIA_TYPE_415, message = "Unprocessable MicroServiceInfo Entity ", response = String.class),
            @ApiResponse(code = HttpStatus.INTERNAL_SERVER_ERROR_500, message = "resource grant error", response = String.class) })
    public Response reUploadPackage(@ApiParam(value = "csar Id") @PathParam("csarId") String csarId,
            @ApiParam(value = "file inputstream", required = true) @FormDataParam("file") InputStream uploadedInputStream,
            @FormDataParam("params") String details,
            @ApiParam(value = "file detail", required = false) @FormDataParam("file") FormDataContentDisposition fileDetail,
            @ApiParam(value = "http header") @Context HttpHeaders head)
            throws IOException, MarketplaceResourceException {
        return PackageWrapper.getInstance().reUploadPackage(csarId, uploadedInputStream, fileDetail, details, head);
    }

    @Path("/csars/{csarId}/onboardstatus")
    @GET
    @ApiOperation(value = "Get VNF OnBoarding Result", response = OnBoardingResult.class)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOnBoardingResult(@ApiParam("csar Id") @PathParam("csarId") String csarId,
            @ApiParam("operation type") @QueryParam("operTypeId") String operTypeId,
            @ApiParam("operation id") @QueryParam("operId") String operId) {
        return PackageWrapper.getInstance().getOnBoardingResult(csarId, operTypeId, operId);
    }

    @Path("/csars/{csarId}/operresult")
    @GET
    @ApiOperation(value = "Get VNF OnBoarded Opeartion Result", response = Response.class)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOperStatus(@ApiParam(value = "csar Id") @PathParam("csarId") String csarId,
            @ApiParam(value = "operation type") @QueryParam("operTypeId") String operTypeId) {
        return PackageWrapper.getInstance().getOperResultByOperTypeId(csarId, operTypeId);
    }

    @Path("/csars/onboardsteps")
    @GET
    @ApiOperation(value = "Get VNF OnBoarded Steps", response = Response.class)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOnBoardingSteps() {
        return PackageWrapper.getInstance().getOnBoardingSteps();
    }

    @Path("/healthcheck")
    @GET
    @ApiOperation(value = "Health for VNF Repository", response = Response.class)
    @Produces(MediaType.APPLICATION_JSON)
    public Response healthCheck() {

        // Step 1: Check whether tomcat server is up
        RestResponse resp = RestfulClient.get("127.0.0.1", CommonConstant.HTTP_PORT, CommonConstant.BASE_URL);
        if (RestConstant.RESPONSE_CODE_200 != resp.getStatusCode()) {
            return Response.serverError().build();
        }

        // Step 2: Check whether postgres database is up
        try {
            PackageManager.getInstance().queryPackageByCsarId("01");
        } catch (Exception e) {
            return Response.serverError().build();
        }

        return Response.ok().build();
    }

}
