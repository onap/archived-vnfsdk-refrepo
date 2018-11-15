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

package org.onap.vnfsdk.marketplace.resource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.eclipse.jetty.http.HttpStatus;
import org.onap.vnfsdk.marketplace.common.ToolUtil;
import org.onap.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenRemoteCli;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.gson.internal.LinkedTreeMap;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;


@Path("/vtp")
@Api(tags = { "VNF Test Platform" })
public class VTPResource {
    @Path("/tests")
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

    @Path("/tests/{testName}/run")
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

        ObjectMapper mapper = new ObjectMapper();
        JsonNode resultJson = mapper.readTree(result.getOutput());

        ((ObjectNode)resultJson).put("build_tag", System.getenv("BUILD_TAG"));

        return Response.ok(resultJson.toString(), MediaType.APPLICATION_JSON).build();
    }
}
