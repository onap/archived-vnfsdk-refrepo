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
package org.onap.vtp.scenario;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class VTPScenarioResourceTest {

    VTPScenarioResource vtpScenarioResource;
    @Before
    public void setUp() throws Exception {
        vtpScenarioResource=new VTPScenarioResource();
    }
    @Test(expected = Exception.class)
    public void testListTestScenariosHandler() throws Exception{
        vtpScenarioResource.listTestScenariosHandler();
    }
    @Test(expected = Exception.class)
    public void testListTestSutiesHandler() throws Exception{
        vtpScenarioResource.listTestSutiesHandler("open-cli");
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