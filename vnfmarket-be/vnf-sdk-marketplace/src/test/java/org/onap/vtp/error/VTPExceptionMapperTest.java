/**
 * Copyright 2019 Huawei Technologies Co., Ltd.
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

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class VTPExceptionMapperTest {

    VTPExceptionMapper vtpExceptionMapper;

    @Before
    public void setUp() throws Exception {
        vtpExceptionMapper = new VTPExceptionMapper();
    }

    @Test
    public void testToResponse() {
        VTPError error = new VTPError();
        error.setHttpStatus(200);
        error.setMessage("0xc002:: error found");
        error.setCode("0xc002");
        assertNotNull(vtpExceptionMapper.toResponse(new Exception()));
        assertNotNull(vtpExceptionMapper.toResponse(new VTPError.VTPException(error)));
    }
}