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

public class VTPTestSuite extends VTPModelBase{
    private String name;

    private String description;

    public String getDescription() {
        return description;
    }

    public VTPTestSuite setDescription(String description) {
        this.description = description;
        return this;
    }
    public String getName() {
        return name;
    }

    public VTPTestSuite setName(String name) {
        this.name = name;
        return this;
    }

    public static class VTPTestSuiteList extends VTPModelBase {
        List <VTPTestSuite> suites = new ArrayList<>();

        public List<VTPTestSuite> getSuites() {
            return suites;
        }

        public VTPTestSuiteList setSuites(List<VTPTestSuite> suites) {
            this.suites = suites;
            return this;
        }
    }
}
