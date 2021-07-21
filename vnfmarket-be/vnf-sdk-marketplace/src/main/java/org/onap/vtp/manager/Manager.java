/**
 * Copyright 2021 Huawei Technologies Co., Ltd.
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
package org.onap.vtp.manager;

import com.google.gson.JsonElement;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.manager.model.Tester;
import org.onap.vtp.scenario.model.VTPTestCase;
import org.onap.vtp.scenario.model.VTPTestScenario;
import org.onap.vtp.scenario.model.VTPTestSuite;
import org.open.infc.grpc.Result;

import java.util.List;

public interface Manager {
    Tester httpRequestTestcase(String testSuite, String scenario, String testCase);
    void postDataToManager(String executionId, String id, String testerId);
    JsonElement getExecutionJson(int count, int index);
    Result getExecutionDetails(String vtpTestCenterIp, int vtpTestCenterPort, List<String> args, int timeout) throws VTPError.VTPException;
    Tester httpRequestExecutions(String executionId);
    VTPTestSuite.VTPTestSuiteList getSuiteListFromManager(String url);
    VTPTestScenario.VTPTestScenarioList getScenarioListFromManager(String url);
    VTPTestCase.VTPTestCaseList getTestCaseListFromManager(String url);
}
