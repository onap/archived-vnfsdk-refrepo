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

public class OnBoradingRequest {
	
	// VNF package ID
	private String csarId;
	
	// VNF package name
	private String packageName;
	
	// Path of package (local path)
	private String packagePath;
	
	// csarId to be sent to catalogue module
	private String csarIdCatalouge;

	public String getPackagePath() {
		return packagePath;
	}

	public void setPackagePath(String packagePath) {
		this.packagePath = packagePath;
	}

	public String getCsarId() {
		return csarId;
	}

	public void setCsarId(String csarId) {
		this.csarId = csarId;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getCsarIdCatalouge() {
		return csarIdCatalouge;
	}

	public void setCsarIdCatalouge(String csarIdCatalouge) {
		this.csarIdCatalouge = csarIdCatalouge;
	}

}
