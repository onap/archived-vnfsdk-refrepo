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

public class OnBoardingStep 
{
    private String operTypeName;
    private String operTypeId;
    private List<OperationDetails> oper;
    
    public String getOperTypeName() {
        return operTypeName;
    }
    public void setOperTypeName(String operTypeName) {
        this.operTypeName = operTypeName;
    }
    public String getOperTypeId() {
        return operTypeId;
    }
    public void setOperTypeId(String operTypeId) {
        this.operTypeId = operTypeId;
    }
    public List<OperationDetails> getOper() {
        return oper;
    }
    public void setOper(List<OperationDetails> oper) {
        this.oper = oper;
    }
}
