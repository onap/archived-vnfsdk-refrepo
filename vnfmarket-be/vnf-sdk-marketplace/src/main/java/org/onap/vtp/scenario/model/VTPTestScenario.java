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

import java.util.ArrayList;
import java.util.List;

import org.onap.vtp.VTPModelBase;

public class VTPTestScenario extends VTPModelBase{
    private String name;
    private String description;
    public String getName() {
        return name;
    }

    public VTPTestScenario setName(String name) {
        this.name = name;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public VTPTestScenario setDescription(String description) {
        this.description = description;
        return this;
    }

    public static class VTPTestScenarioList extends VTPModelBase {
        List <VTPTestScenario> scenarios = new ArrayList<>();

        public List<VTPTestScenario> getScenarios() {
            return scenarios;
        }

        public VTPTestScenarioList setScenarios(List<VTPTestScenario> scenarios) {
            this.scenarios = scenarios;
            return this;
        }
    }
}
