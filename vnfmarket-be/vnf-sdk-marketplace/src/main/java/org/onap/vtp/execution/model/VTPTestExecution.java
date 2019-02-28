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

package org.onap.vtp.execution.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.onap.vtp.VTPModelBase;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;

public class VTPTestExecution extends VTPModelBase{
    private String scenario;
    private String testCaseName;
    private String testSuiteName;
    private String executionId;
    private String requestId;
    private String profile;
    private JsonNode parameters = JsonNodeFactory.instance.objectNode();
    private JsonNode results = JsonNodeFactory.instance.objectNode();
    public static enum Status {
        IN_PROGRESS, COMPLETED, FAILED;
    }

    private String status = Status.FAILED.name();

    private String startTime;

    private String endTime;

    public String getProfile() {
        return profile;
    }
    public VTPTestExecution setProfile(String profile) {
        this.profile = profile;
        return this;
    }

    public String getTestSuiteName() {
        return testSuiteName;
    }
    public VTPTestExecution setTestSuiteName(String testSuiteName) {
        this.testSuiteName = testSuiteName;
        return this;
    }
    public String getTestCaseName() {
        return testCaseName;
    }
    public VTPTestExecution setTestCaseName(String testCaseName) {
        this.testCaseName = testCaseName;
        return this;
    }

    public String getExecutionId() {
        return executionId;
    }
    public VTPTestExecution setExecutionId(String executionId) {
        this.executionId = executionId;
        return this;
    }

    public JsonNode getResults() {
        return results;
    }
    public VTPTestExecution setResults(JsonNode results) {
        this.results = results;
        return this;
    }

    public String getStatus() {
        return status;
    }

    public VTPTestExecution setStatus(String status) {
        this.status = status;
        return this;
    }

    public String getStartTime() {
        return startTime;
    }

    public VTPTestExecution setStartTime(String startTime) {
        this.startTime = startTime;
        return this;
    }

    public String getEndTime() {
        return endTime;
    }

    public VTPTestExecution setEndTime(String endTime) {
        this.endTime = endTime;
        return this;
    }

    public String getScenario() {
        return scenario;
    }
    public void setScenario(String scenario) {
        this.scenario = scenario;
    }

    public String getRequestId() {
        return requestId;
    }
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public JsonNode getParameters() {
        return parameters;
    }
    public void setParameters(JsonNode parameters) {
        this.parameters = parameters;
    }

    public static class VTPTestExecutionList extends VTPModelBase {
        List <VTPTestExecution> executions = new ArrayList<>();

        public List<VTPTestExecution> getExecutions() {
            return executions;
        }

        public VTPTestExecutionList setExecutions(List<VTPTestExecution> executions) {
            this.executions = executions;
            return this;
        }
    }
}
