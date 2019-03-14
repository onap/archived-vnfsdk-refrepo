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
package org.onap.vtp;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.onap.vtp.scenario.VTPScenarioResource;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
//@RunWith(MockitoJUnitRunner.class)
public class VTPScenarioResourceTest {

    VTPScenarioResource vtpScenarioResource;

    @Before
    public void setUp() throws Exception {

        MockitoAnnotations.initMocks(this);
        vtpScenarioResource=new VTPScenarioResource();
        //vtpScenarioResource2= Mockito.spy(new VTPScenarioResource());

    }
    @Test(expected = Exception.class)
    public void testListTestScenariosHandler() throws Exception{
        vtpScenarioResource.listTestScenariosHandler();
    }
    @Test(expected = Exception.class)
    public void testListTestSutiesHandler() throws Exception{
        VTPScenarioResource vtpScenarioResource2=mock(VTPScenarioResource.class);
        List<String> args = new ArrayList<>();
        args.add("abc");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode actualObj = mapper.readTree("{\"k1\":\"v1\"}");
        vtpScenarioResource.listTestSutiesHandler("abc");
      // when(vtpScenarioResource2.makeRpcAndGetJson(args)).thenReturn(actualObj);
        //vtpScenarioResource.listTestSutiesHandler("VTP Scenario 1");

       // doReturn(actualObj).when((VTPResource)vtpScenarioResource2).makeRpcAndGetJson(args);
      //  vtpScenarioResource2.makeRpc(args);
       //verify(vtpScenarioResource2).makeRpcAndGetJson(args);

    }
    @Test(expected = Exception.class)
    public void testListTestcasesHandler() throws Exception
    {
        vtpScenarioResource.listTestcasesHandler("testsuite","open-cli");
    }
    @Test(expected = Exception.class)
    public void testListTestcases() throws Exception
    {
        vtpScenarioResource.listTestcases("open-cli","testsuite");
    }
    @Test(expected = Exception.class)
    public void testGetTestcase() throws Exception
    {
        vtpScenarioResource.getTestcase("open-cli","testsuit","testcase");
    }
    @Test(expected = Exception.class)
    public void testGetTestcaseHandler() throws Exception
    {
        vtpScenarioResource.getTestcaseHandler("open-cli","testsuit","testcase");
    }
}