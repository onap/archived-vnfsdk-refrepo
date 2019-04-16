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

import com.fasterxml.jackson.databind.JsonNode;

public class VTPTestCase extends VTPModelBase{
    private String scenario;
    private String testCaseName;
    private String testSuiteName;
    private String description;
    private String author;
    private List<VTPTestCaseInput> inputs = new ArrayList<>();
    private List<VTPTestCaseOutput> outputs = new ArrayList<>();

    public String getTestSuiteName() {
        return testSuiteName;
    }
    public VTPTestCase setTestSuiteName(String testSuiteName) {
        this.testSuiteName = testSuiteName;
        return this;
    }
    public String getTestCaseName() {
        return testCaseName;
    }
    public VTPTestCase setTestCaseName(String testCaseName) {
        this.testCaseName = testCaseName;
        return this;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<VTPTestCaseInput> getInputs() {
        return inputs;
    }
    public VTPTestCase setInputs(List<VTPTestCaseInput> inputs) {
        this.inputs = inputs;
        return this;
    }

    public List<VTPTestCaseOutput> getOutputs() {
        return outputs;
    }
    public VTPTestCase setOutputs(List<VTPTestCaseOutput> outputs) {
        this.outputs = outputs;
        return this;
    }

    public String getScenario() {
        return scenario;
    }
    public VTPTestCase setScenario(String scenario) {
        this.scenario = scenario;
        return this;
    }

    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }

    public static class VTPTestCaseList extends VTPModelBase {
        List <VTPTestCase> testCases = new ArrayList<>();

        public List<VTPTestCase> getTestCases() {
            return testCases;
        }

        public VTPTestCaseList setTestCases(List<VTPTestCase> testCases) {
            this.testCases = testCases;
            return this;
        }
    }

    public static class VTPTestCaseInput extends VTPModelBase {
        private String name;
        private String description;
        private String type;
        private String defaultValue;
        private Boolean isOptional;
        private JsonNode metadata;

        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }
        public String getType() {
            return type;
        }
        public void setType(String type) {
            this.type = type;
        }
        public String getDefaultValue() {
            return defaultValue;
        }
        public void setDefaultValue(String defaultValue) {
            this.defaultValue = defaultValue;
        }
        public Boolean getIsOptional() {
            return isOptional;
        }
        public void setIsOptional(Boolean isOptional) {
            this.isOptional = isOptional;
        }
        public JsonNode getMetadata() {
            return metadata;
        }
        public void setMetadata(JsonNode metadata) {
            this.metadata = metadata;
        }
    }

    public static class VTPTestCaseOutput extends VTPModelBase {
        private String name;
        private String description;
        private String type;

        public String getName() {
            return this.name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }
        public String getType() {
            return type;
        }
        public void setType(String type) {
            this.type = type;
        }
    }
}
