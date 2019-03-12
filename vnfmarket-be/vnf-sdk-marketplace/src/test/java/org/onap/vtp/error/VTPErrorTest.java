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

public class VTPErrorTest
{
    VTPError vtpError;
    @Before
    public void setUp()
    {
     vtpError =new VTPError();
    }
    @Test
    public void testCode()
    {
        vtpError.setCode("0xc002");
        assertEquals(vtpError.getCode(),"0xc002");
    }
    @Test
    public void testmessage()
    {
        vtpError.setMessage("0xc002 ::error found");
        assertEquals(vtpError.getMessage(),"error found");
    }
    @Test
    public void testHttpStatus()
    {
        vtpError.setHttpStatus(200);
        assertEquals(vtpError.getHttpStatus(),200);
    }
    @Test
    public void testInnerClassMethods()
    {
        VTPError.VTPException vtpException=new VTPError.VTPException(vtpError);
        assertNotNull(vtpException.getMessage());
        assertNotNull(vtpException.getVTPError());
    }

}