/**
 *
 * "Copyright, European Software Marketing Ltd.,, 2017
 * [the year/s in which the code was created]
 * ===================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License"
 */
package org.onap.vnfsdk.marketplace.resource;

import org.onap.validation.csar.ValidationException;
import org.onap.vnfsdk.marketplace.common.CommonErrorResponse;
import org.onap.vnfsdk.marketplace.exception.CoreException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class DefaultExceptionMapper implements ExceptionMapper<Exception> {
    private static final Logger LOG = LoggerFactory.getLogger(DefaultExceptionMapper.class);
    @Override
    public Response toResponse(Exception e) {
        LOG.error("Error during restful service.", e);
        if (e instanceof NotFoundException) {
            return Response.status(Status.NOT_FOUND).build();
        }
        if (e instanceof InternalServerErrorException) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }
        if (e instanceof BadRequestException) {
            return toResponse(Status.BAD_REQUEST, e.getMessage());
        }
        if (e instanceof ClientErrorException) {
            return toResponse(Response.Status.NOT_FOUND, e.getMessage());
        }
        if (e instanceof ValidationException) {
            return toResponse(Response.Status.BAD_REQUEST, e.getMessage());
        }
        if (e instanceof CoreException) {
            return transform((CoreException) e);
        }
        return transform(e);
    }

    private static Response toResponse(Response.Status status, String message) {
        return Response
                .status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(new CommonErrorResponse(message))
                .build();
    }

    private Response transform(CoreException e) {
        CoreException.ErrorCategory errorCategory = e.getErrorCategory();
        if (errorCategory == CoreException.ErrorCategory.VALIDATION) {
            return toResponse(Response.Status.BAD_REQUEST, e.getMessage());
        }
        return toResponse(Response.Status.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    private Response transform(Exception e) {
        return toResponse(Response.Status.INTERNAL_SERVER_ERROR, e.getMessage());
    }
}
