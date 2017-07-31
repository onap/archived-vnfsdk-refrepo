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
package org.openo.vnfsdk.marketplace.entity.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PackageResponse {
  private static final int STATUS_SUCCESS = 1;

  private int status;
  private String message;
  private String packageName;
  private String processId;
  private String exception;
  private String reportPath;

  public String getReportPath() {
	return reportPath;
}

public void setReportPath(String reportPath) {
	this.reportPath = reportPath;
}

public boolean isSuccess() {
    return this.status == STATUS_SUCCESS;
  }

  @Override
  public String toString() {
    return "DeployPackageResponse [status=" + status + ", message=" + message + ", packageName="
        + packageName + ", processId=" + processId + ", exception=" + exception + "]";
  }
  
}
