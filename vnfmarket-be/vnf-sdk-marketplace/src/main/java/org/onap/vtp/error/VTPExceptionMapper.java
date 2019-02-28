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

package org.onap.vtp.error;

import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.apache.http.HttpStatus;
import org.onap.vtp.error.VTPError.VTPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Provider
@Singleton
public class VTPExceptionMapper implements ExceptionMapper<Exception> {
    private static final Logger LOG = LoggerFactory.getLogger(VTPExceptionMapper.class);

    public Response toResponse(Exception e) {
         LOG.error(e.toString(), e);

         if (e instanceof VTPException) {
             VTPException ex = (VTPException) e;
             return Response.status(ex.getVTPError().getHttpStatus()).entity(ex.getVTPError().toString()).build();
         } else {
             ObjectNode node = JsonNodeFactory.instance.objectNode();
             node.put("message", e.getMessage());
             node.put("code", "UNKNOWN");
             return Response.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).entity(node.toString()).build();
         }

    }
}
