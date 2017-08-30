/**
 * Copyright 2017 Huawei Technologies Co., Ltd.
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
package org.onap.vnfsdk.marketplace.onboarding.entity;

import java.util.List;

public class OperationResult 
{
	private String csarId;
    private String operTypeId;
    private boolean operFinished;
    private int operStatus;
    
    private List<OnBoardingOperResult> operResult;
    
    public String getOperTypeId() {
        return operTypeId;
    }
    public void setOperTypeId(String operTypeId) {
        this.operTypeId = operTypeId;
    }
    public boolean isOperFinished() {
        return operFinished;
    }
    public void setOperFinished(boolean operFinished) {
        this.operFinished = operFinished;
    }

    public List<OnBoardingOperResult> getOperResult() {
        return operResult;
    }
    public void setOperResult(List<OnBoardingOperResult> operResult) {
        this.operResult = operResult;
    }
    public int getOperStatus() {
        return operStatus;
    }
    public void setOperStatus(int operStatus) {
        this.operStatus = operStatus;
    }
	public String getCsarId() {
		return csarId;
	}
	public void setCsarId(String csarId) {
		this.csarId = csarId;
	}
}
