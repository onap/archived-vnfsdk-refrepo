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
package org.onap.vnfsdk.marketplace.onboarding.hooks.validatelifecycle;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.common.ToolUtil;
import org.onap.vnfsdk.marketplace.entity.EnumOperationStatus;
import org.onap.vnfsdk.marketplace.entity.EnumResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoardingOperResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoardingResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.onboarding.entity.ResultKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* It executes the life cycle (create, delete) test for the VNF on the specified VM and collects the result 
 * and return result to the caller and then uploads package to the catalogue 
 *  
 * OnBoardingHandler --> LifecycleTestHook---> LifecycleTestExecutor */

public class LifecycleTestHook {
	private static final Logger logger = LoggerFactory.getLogger(LifecycleTestHook.class);

	/**
	 * Start Executing Life cycle test
	 * 
	 * @param onBoradingReq
	 * @return
	 */
	public int exec(OnBoradingRequest onBoradingReq) {
		logger.info("OnboardingRequest Lifecycle Request received for Package:" + onBoradingReq.getCsarId() + " Path:"
				+ onBoradingReq.getPackagePath());

		// STEP 1: Validate Input and Build result
	    // ---------------------------------------------------------
		buildResultPath(onBoradingReq);

		OnBoardingResult olifecycleTestResult = new OnBoardingResult();
		buildlifecycleTestResponse(onBoradingReq, olifecycleTestResult);
		updateResult(olifecycleTestResult);

		if (null == onBoradingReq.getCsarIdCatalouge() || onBoradingReq.getCsarIdCatalouge().isEmpty()) {
			olifecycleTestResult.setOperFinished(true);
			olifecycleTestResult.setOperStatus(EnumResult.FAIL.getIndex());
			buildFuncTestResponse(olifecycleTestResult, CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC,
					EnumOperationStatus.FAILED.getIndex());
			updateResult(olifecycleTestResult);
			return EnumResult.FAIL.getIndex();
		}

		LifeCycleTestReq oLifeCycleTestReq = new LifeCycleTestReq();
		populateLifeCycleReq(onBoradingReq, oLifeCycleTestReq);

		// STEP 2: Execute Life Cycle Test and Get Result Back !!!!
		// ---------------------------------------------------------
		String lifecycleTestResultKey = LifecycleTestExceutor.execlifecycleTest(onBoradingReq, oLifeCycleTestReq);
		if (null == lifecycleTestResultKey) {
			olifecycleTestResult.setOperFinished(true);
			olifecycleTestResult.setOperStatus(EnumResult.FAIL.getIndex());
			buildFuncTestResponse(olifecycleTestResult, CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC,
					EnumOperationStatus.FAILED.getIndex());
			updateResult(olifecycleTestResult);
			return EnumResult.FAIL.getIndex();
		}

		olifecycleTestResult.setOperFinished(true);
		olifecycleTestResult.setOperStatus(EnumResult.SUCCESS.getIndex());
		buildFuncTestResponse(olifecycleTestResult, CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC,
				EnumOperationStatus.SUCCESS.getIndex());
		updateResult(olifecycleTestResult);

		// STEP 3: Store Lifecycle test key to get Life cycle Test Results
		// -------------------------------------------------
		storelifecycleResultKey(onBoradingReq, lifecycleTestResultKey);

		return (olifecycleTestResult.getOperStatus() == EnumResult.SUCCESS.getIndex()) ? EnumResult.SUCCESS.getIndex()
				: EnumResult.FAIL.getIndex();
	}

	private void populateLifeCycleReq(OnBoradingRequest onBoradingReq, LifeCycleTestReq oLifeCycleTestReq) {
		
		// Input error handling is done by lifecycle module, not need validate here
		oLifeCycleTestReq.setCsarId(onBoradingReq.getCsarId());
		oLifeCycleTestReq.setLabVimId(oLifeCycleTestReq.getLabVimId());

		// Currently this is not populated, only lavVimId is sufficient
		List<String> vimIds = new ArrayList<>();
		oLifeCycleTestReq.setVimIds(vimIds);
	}

	/**
	 * Build result path where result is stored as a file
	 * @param onBoradingReq
	 */
	private void buildResultPath(OnBoradingRequest onBoradingReq) {
		String filePath = getResultStorePath() + File.separator + onBoradingReq.getCsarId();
		if (!FileUtil.checkFileExists(filePath)) {
			FileUtil.createDirectory(filePath);
		}
	}

	/**
	 * Store Function test Execution Results
	 * 
	 * @param oFuncTestResult
	 */
	private void updateResult(OnBoardingResult oFuncTestResult) {
		// STore Results to DB(Currently we will make JSON and Store JSON to
		// Package Path)
		// -------------------------------------------------------------------------------
		logger.info("Lifecycle test Status for Package Id:" + oFuncTestResult.getCsarId() + ", Result:"
				+ ToolUtil.objectToString(oFuncTestResult));
		String filePath = getResultStorePath() + File.separator + oFuncTestResult.getCsarId() + File.separator
				+ "lifecycleTest.json";
		FileUtil.writeJsonDatatoFile(filePath, oFuncTestResult);
	}

	/**
	 * Build Function Test Response
	 * 
	 * @param onBoradingReq
	 * @param oFuncTestResult
	 */
	private void buildlifecycleTestResponse(OnBoradingRequest onBoradingReq, OnBoardingResult oTestResult) {
		oTestResult.setOperFinished(false);
		oTestResult.setCsarId(onBoradingReq.getCsarId());
		oTestResult.setOperTypeId(CommonConstant.LifeCycleTest.LIFECYCLE_TEST_OPERTYPE_ID);

		OnBoardingOperResult lifecycleTestExec = new OnBoardingOperResult();
		lifecycleTestExec.setOperId(CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC);
		lifecycleTestExec.setStatus(EnumOperationStatus.NOTSTARTED.getIndex());

		List<OnBoardingOperResult> operResult = new ArrayList<>();
		operResult.add(lifecycleTestExec);
		oTestResult.setOperResult(operResult);
	}


	/**
	 * Store Lifecycle Test Result key
	 * 
	 * @param onBoradingReq
	 * @param resultKey
	 */
	private void storelifecycleResultKey(OnBoradingRequest onBoradingReq, String resultKey) {
		// Currently we will make JSON and Store JSON to Package Path)
		// -------------------------------------------------------------------------------
		String filePath = getResultStorePath() + File.separator + onBoradingReq.getCsarId() + File.separator
				+ "lifecycleTestResultKey.json";

		logger.debug("Function test Results Key for Package Id:" + onBoradingReq.getCsarId() + ", Key:" + resultKey
				+ " Path" + filePath);

		ResultKey oResultKey = new ResultKey();
		oResultKey.setCsarId(onBoradingReq.getCsarId());
		oResultKey.setOperTypeId(CommonConstant.LifeCycleTest.LIFECYCLE_TEST_OPERTYPE_ID);
		oResultKey.setKey(resultKey);

		FileUtil.writeJsonDatatoFile(filePath, oResultKey);
	}

	private static String getResultStorePath() {
		// Using full path due to compilation issue
		return org.onap.vnfsdk.marketplace.filemanage.http.ToolUtil.getHttpServerAbsolutePath();
	}

	private void buildFuncTestResponse(OnBoardingResult oFuncTestResult, String opreKey, int operStatusVal) {
		List<OnBoardingOperResult> operStatusList = oFuncTestResult.getOperResult();
		for (OnBoardingOperResult operObj : operStatusList) {
			if (operObj.getOperId().equalsIgnoreCase(opreKey)) {
				operObj.setStatus(operStatusVal);
				break;
			}
		}
	}
}
