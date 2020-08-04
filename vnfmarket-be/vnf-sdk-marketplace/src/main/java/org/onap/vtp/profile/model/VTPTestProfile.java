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

package org.onap.vtp.profile.model;

import java.util.ArrayList;
import java.util.List;

import org.onap.vtp.VTPModelBase;

public class VTPTestProfile extends VTPModelBase{
    private String name;
    private List<VTPTestProfileProperty> properties = new ArrayList<>();

    public String getName() {
        return name;
    }

    public VTPTestProfile setName(String name) {
        this.name = name;
        return this;
    }

    public List<VTPTestProfileProperty> getProperties() {
        return properties;
    }

    public VTPTestProfile setProperties(List<VTPTestProfileProperty> properties) {
        this.properties = properties;
        return this;
    }

    public static class VTPTestProfileList extends VTPModelBase {
        List <VTPTestProfile> testProfiles = new ArrayList<>();

        public List<VTPTestProfile> getTestProfiles() {
            return testProfiles;
        }

        public VTPTestProfileList setTestProfiles(List<VTPTestProfile> testProfiles) {
            this.testProfiles = testProfiles;
            return this;
        }
    }

    public static class VTPTestProfileProperty extends VTPModelBase {
        private String scenario;
        private String testSuiteName;
        private String testCaseName;
        private String inputParameterName;
        private String value;
        public String getTestSuiteName() {
            return testSuiteName;
        }
        public VTPTestProfileProperty setTestSuiteName(String testSuiteName) {
            this.testSuiteName = testSuiteName;
            return this;
        }
        public String getTestCaseName() {
            return testCaseName;
        }
        public VTPTestProfileProperty setTestCaseName(String testCaseName) {
            this.testCaseName = testCaseName;
            return this;
        }
        public String getInputParameterName() {
            return inputParameterName;
        }
        public VTPTestProfileProperty setInputParameterName(String inputParameterName) {
            this.inputParameterName = inputParameterName;
            return this;
        }
        public String getValue() {
            return value;
        }
        public VTPTestProfileProperty setValue(String value) {
            this.value = value;
            return this;
        }

        public String getScenario() {
            return scenario;
        }
        public VTPTestProfileProperty setScenario(String scenario) {
            this.scenario = scenario;
            return this;
        }
    }
}
