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

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class VTPTestScenarioTest {
    VTPTestScenario vtpTestScenario= new VTPTestScenario();
    @Test
    public void testGetterSetters()
    {
        vtpTestScenario.setDescription("abc");
        vtpTestScenario.setName("abc");
        assertEquals(vtpTestScenario.getDescription(),"abc");
       assertEquals(vtpTestScenario.getName(),"abc");
        VTPTestScenario.VTPTestScenarioList vtpTestScenarioList= new VTPTestScenario.VTPTestScenarioList();
        vtpTestScenarioList.setScenarios(null);
        assertEquals(vtpTestScenarioList.getScenarios(),null);
    }

}