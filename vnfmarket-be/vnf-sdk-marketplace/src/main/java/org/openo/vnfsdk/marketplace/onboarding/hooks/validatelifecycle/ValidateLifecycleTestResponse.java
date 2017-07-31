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
package org.openo.vnfsdk.marketplace.onboarding.hooks.validatelifecycle;

public class ValidateLifecycleTestResponse 
{
    private String jobId;
    private String validate_status;
    private String lifecycle_status;
    private VnfInfo vnf_info;
    public String getJobId() {
        return jobId;
    }
    public void setJobId(String jobId) {
        this.jobId = jobId;
    }
    public String getValidate_status() {
        return validate_status;
    }
    public void setValidate_status(String validate_status) {
        this.validate_status = validate_status;
    }
    public String getLifecycle_status() {
        return lifecycle_status;
    }
    public void setLifecycle_status(String lifecycle_status) {
        this.lifecycle_status = lifecycle_status;
    }
    public VnfInfo getVnf_info() {
        return vnf_info;
    }
    public void setVnf_info(VnfInfo vnf_info) {
        this.vnf_info = vnf_info;
    }
}
