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
package org.onap.vnfsdk.marketplace.onboarding.onboardmanager;

import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.db.resource.PackageManager;
import org.onap.vnfsdk.marketplace.entity.EnumResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.onboarding.hooks.functiontest.FunctionTestHook;
import org.onap.vnfsdk.marketplace.onboarding.hooks.validatelifecycle.LifecycleTestHook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* Call Flow: PackageWrapper(package upload) --> OnBoardingHandler (package on boarding) */
public final class OnBoardingHandler {

	private static final Logger logger = LoggerFactory.getLogger(OnBoardingHandler.class);

	public void handleOnBoardingReq(OnBoradingRequest onBoardingReq) {

		// Step 0: Input validation
		// ------------------------------
		if (null == onBoardingReq) {
			logger.error("Invalid input:Onboarding request is null");
			return;
		}

		if ((null == onBoardingReq.getPackagePath()) || (null == onBoardingReq.getPackageName())) {
			logger.error("Package path or name is invalid");
			return;
		}
		
		if (null == onBoardingReq.getCsarId()) {
			logger.error("CsarId is invalid - null");
			return;
		}

		// Step 1:Handle Package Life cycle/Validation
		// ------------------------------------
		LifecycleTestHook oLifecycleTestHook = new LifecycleTestHook();
		int iLifeCycleResponse = oLifecycleTestHook.exec(onBoardingReq);
		if (EnumResult.SUCCESS.getIndex() != iLifeCycleResponse) {
			logger.error("Onboarding failed for Package Id during Lifecycle Test:" + onBoardingReq.getCsarId());
			// Note: We need to continue even if life cycle test fails as this
			// test is not mandatory
		}

		// Step 2: Handle Package FunctionTest
		// -------------------------
		FunctionTestHook oFunctionTestHook = new FunctionTestHook();
		int iFuncTestResponse = oFunctionTestHook.exec(onBoardingReq);
		if (EnumResult.SUCCESS.getIndex() != iFuncTestResponse) {
			logger.error("Onboarding failed for Package Id during Function Test:" + onBoardingReq.getCsarId());
			// Note: We need to continue even if function test fails as this
			// test is not mandatory
		}

		FileUtil.deleteDirectory(onBoardingReq.getPackagePath());
		try {
			PackageManager.getInstance().updateDownloadCount(onBoardingReq.getCsarId());
		} catch (Exception e) {
			logger.error("Download count update failed for Package:" + onBoardingReq.getPackagePath(), e);
		}
	}

}
