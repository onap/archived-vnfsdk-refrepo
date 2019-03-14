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
package org.onap.vtp.scenario.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

public class VTPTestCaseTest {
    VTPTestCase vtpTestCase;
    @Before
    public void setUp() throws Exception {
        vtpTestCase =new VTPTestCase();
    }
    @Test
    public void testGetterSetter() throws Exception
    {   ObjectMapper mapper = new ObjectMapper();
        JsonNode actualObj = mapper.readTree("{\"k1\":\"v1\"}");
        List<VTPTestCase.VTPTestCaseInput> list= new ArrayList<>();
        List<VTPTestCase.VTPTestCaseOutput> list1=new ArrayList<>();
        vtpTestCase.setAuthor("abc");
        vtpTestCase.setDescripton("abc");
        vtpTestCase.setInputs(null);
        vtpTestCase.setOutputs(null);
        vtpTestCase.setScenario("abc");
        vtpTestCase.setTestCaseName("abc");
        vtpTestCase.setTestSuiteName("abc");
        assertEquals(vtpTestCase.getAuthor(),"abc");
        assertEquals(vtpTestCase.getDescripton(),"abc");
        assertNull(vtpTestCase.getInputs());
        assertNull(vtpTestCase.getOutputs());
        assertEquals(vtpTestCase.getTestCaseName(),"abc");
        assertEquals(vtpTestCase.getTestSuiteName(),"abc");

        VTPTestCase.VTPTestCaseInput vtpTestCaseInput=new VTPTestCase.VTPTestCaseInput();
        vtpTestCaseInput.setDefaultValue("abc");
        vtpTestCaseInput.setDescription("abc");
        vtpTestCaseInput.setIsOptional(true);

        vtpTestCaseInput.setMetadata(actualObj);
        vtpTestCaseInput.setName("abc");
        vtpTestCaseInput.setType("abc");
        assertEquals(vtpTestCaseInput.getDefaultValue(),"abc");
        assertEquals(vtpTestCaseInput.getDescription(),"abc");
        assertEquals(vtpTestCaseInput.getIsOptional(),true);
        assertEquals(vtpTestCaseInput.getMetadata(),actualObj);
        assertEquals(vtpTestCaseInput.getName(),"abc");
        assertEquals(vtpTestCaseInput.getType(),"abc");
//
        VTPTestCase.VTPTestCaseOutput vtpTestCaseOutput=new VTPTestCase.VTPTestCaseOutput();
        vtpTestCaseOutput.setDescription("abc");
        vtpTestCaseOutput.setName("abc");
        vtpTestCaseOutput.setType("abc");
        assertEquals(vtpTestCaseOutput.getDescription(),"abc");
        assertEquals(vtpTestCaseOutput.getName(),"abc");
        assertEquals(vtpTestCaseOutput.getType(),"abc");

    }
}