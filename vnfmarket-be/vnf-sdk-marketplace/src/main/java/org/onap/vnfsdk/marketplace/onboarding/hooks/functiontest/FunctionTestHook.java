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
package org.onap.vnfsdk.marketplace.onboarding.hooks.functiontest;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.common.ToolUtil;
import org.onap.vnfsdk.marketplace.db.entity.PackageData;
import org.onap.vnfsdk.marketplace.entity.EnumOperationStatus;
import org.onap.vnfsdk.marketplace.entity.EnumResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoardingOperResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoardingResult;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.onboarding.entity.ResultKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* It executes the function test (test cases in robot framework) test for the VNF on the specified VM and 
 * collects the result and return result to the caller  
 *  
 *  OnBoardingHandler --> FunctionTestHook---> FunctionTestExecutor    */

public class FunctionTestHook {
	private static final Logger logger = LoggerFactory.getLogger(FunctionTestHook.class);

	/**
	 * Start Executing Function test
	 * 
	 * @param onBoradingReq
	 * @return Failure or success, Onboarding result
	 */
	public int exec(OnBoradingRequest onBoradingReq) {		
		
		logger.info("OnboradingRequest received for Package:" + onBoradingReq.getCsarId() + " Path:"
				+ onBoradingReq.getPackagePath());

		buildResultPath(onBoradingReq);

		OnBoardingResult oFuncTestResult = new OnBoardingResult();
		buildFunctResponse(onBoradingReq, oFuncTestResult);
		updateResult(oFuncTestResult);

		// STEP 1:Check Package Exists
		// ---------------------------
		if (!FileUtil.checkFileExists(onBoradingReq.getPackagePath())) {
			logger.error("Package Not Found at Path:" + onBoradingReq.getPackagePath() + ", Package Id:"
					+ onBoradingReq.getCsarId());
			oFuncTestResult.setOperFinished(true);
			oFuncTestResult.setOperStatus(EnumResult.FAIL.getIndex());
			buildFuncTestResponse(oFuncTestResult, CommonConstant.functionTest.FUNCTEST_PACKAGE_EXISTS,
					EnumOperationStatus.FAILED.getIndex());
			updateResult(oFuncTestResult);
			return EnumResult.FAIL.getIndex();
		}

		buildFuncTestResponse(oFuncTestResult, CommonConstant.functionTest.FUNCTEST_PACKAGE_EXISTS,
				EnumOperationStatus.SUCCESS.getIndex());
		updateResult(oFuncTestResult);

		// STEP 2:Handle function test for Package
		// ---------------------------------------
		String functestResultKey = FunctionTestExceutor.execFunctionTest(onBoradingReq);
		if (null == functestResultKey) {
			oFuncTestResult.setOperFinished(true);
			oFuncTestResult.setOperStatus(EnumResult.FAIL.getIndex());
			buildFuncTestResponse(oFuncTestResult, CommonConstant.functionTest.FUNCTEST_EXEC,
					EnumOperationStatus.FAILED.getIndex());
			updateResult(oFuncTestResult);
			return EnumResult.FAIL.getIndex();
		}

		oFuncTestResult.setOperFinished(true);
		oFuncTestResult.setOperStatus(EnumResult.SUCCESS.getIndex());
		buildFuncTestResponse(oFuncTestResult, CommonConstant.functionTest.FUNCTEST_EXEC,
				EnumOperationStatus.SUCCESS.getIndex());
		updateResult(oFuncTestResult);

		// STEP 3:Store FuncTest key to get FuncTest Results
		// -------------------------------------------------
		storeFuncTestResultKey(onBoradingReq, functestResultKey);

		return (oFuncTestResult.getOperStatus() == EnumResult.SUCCESS.getIndex()) ? EnumResult.SUCCESS.getIndex()
				: EnumResult.FAIL.getIndex();
	}

	/**
	 * Build result path
	 *
	 * @param onBoradingReq
	 */
	private void buildResultPath(OnBoradingRequest onBoradingReq) {
		String filePath = getResultStorePath() + File.separator + onBoradingReq.getCsarId();
		if (!FileUtil.checkFileExists(filePath)) {
			FileUtil.createDirectory(filePath);
		}
	}

	/**Get Function Test result
	 *
	 * @param packageData
	 * @return null on failure, function test result on success
	 */
	public static String getFuncTestResults(PackageData packageData) {
		if (null == packageData) {
			logger.error("Package data is invalid - null");
			return null;
		}
		
		logger.info("Function Test results request for Package:" + packageData.getCsarId());
		ResultKey keydata = getFuncTestResultKey(packageData);
		if ((null == keydata) || (keydata.getKey().isEmpty())) {
			logger.error("Function Test key Not Found for Package Id:", packageData.getCsarId());
			return null;
		}
		return FunctionTestExceutor.getTestResultsByFuncTestKey(keydata.getKey());
	}

	/**
	 * Store Function Test Result key
	 * 
	 * @param onBoradingReq
	 * @param resultKey
	 */
	private void storeFuncTestResultKey(OnBoradingRequest onBoradingReq, String resultKey) {
		// Currently we will make JSON and Store JSON to Package Path)
		// -------------------------------------------------------------------------------
		StringBuffer filePath = new StringBuffer(getResultStorePath());
		filePath.append(File.separator);
		filePath.append(onBoradingReq.getCsarId());
		filePath.append(File.separator);
		filePath.append("functestResultKey.json");

		logger.debug("Function test Results Key for Package Id:" + onBoradingReq.getCsarId() + ", Key:" + resultKey
				+ " Path" + filePath.toString());

		ResultKey oResultKey = new ResultKey();
		oResultKey.setCsarId(onBoradingReq.getCsarId());
		oResultKey.setOperTypeId(CommonConstant.functionTest.FUNCTEST_OPERTYPE_ID);
		oResultKey.setKey(resultKey);

		FileUtil.writeJsonDatatoFile(filePath.toString(), oResultKey);
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
		logger.debug("Function test Status for Package Id:" + oFuncTestResult.getCsarId() + ", Result:"
				+ ToolUtil.objectToString(oFuncTestResult));
		
		StringBuffer filePath = new StringBuffer(getResultStorePath());
		filePath.append(File.separator);
		filePath.append(oFuncTestResult.getCsarId());
		filePath.append(File.separator);
		filePath.append("functionTest.json");
		
		FileUtil.writeJsonDatatoFile(filePath.toString(), oFuncTestResult);
	}

	/**
	 * Build Function Test Response
	 * 
	 * @param onBoradingReq
	 * @param oFuncTestResult
	 */
	private void buildFunctResponse(OnBoradingRequest onBoradingReq, OnBoardingResult oFuncTestResult) {
		oFuncTestResult.setOperFinished(false);
		oFuncTestResult.setCsarId(onBoradingReq.getCsarId());
		oFuncTestResult.setOperTypeId(CommonConstant.functionTest.FUNCTEST_OPERTYPE_ID);

		OnBoardingOperResult oPackageExists = new OnBoardingOperResult();
		oPackageExists.setOperId(CommonConstant.functionTest.FUNCTEST_PACKAGE_EXISTS);
		oPackageExists.setStatus(EnumOperationStatus.NOTSTARTED.getIndex());

		OnBoardingOperResult functTesExec = new OnBoardingOperResult();
		functTesExec.setOperId(CommonConstant.functionTest.FUNCTEST_EXEC);
		functTesExec.setStatus(EnumOperationStatus.NOTSTARTED.getIndex());

		List<OnBoardingOperResult> operResult = new ArrayList<>();
		operResult.add(oPackageExists);
		operResult.add(functTesExec);

		oFuncTestResult.setOperResult(operResult);
	}

	public static OnBoardingResult getOnBoardingResult(PackageData packageData) {

		if (null == packageData) {
			logger.error("Pacakage data is invalid-null");
			return null;
		}

		StringBuffer filePath = new StringBuffer(getResultStorePath());
		filePath.append(File.separator);
		filePath.append(packageData.getCsarId());
		filePath.append(File.separator);
		filePath.append("functionTest.json");

		logger.info("On Boarding Status for Package Id:" + packageData.getCsarId() + ", Result Path:" + filePath);

		return (OnBoardingResult) FileUtil.readJsonDatafFromFile(filePath.toString(), OnBoardingResult.class);
	}

	private static ResultKey getFuncTestResultKey(PackageData packageData) {
		StringBuffer fileName = new StringBuffer(getResultStorePath());
		fileName.append(File.separator);
		fileName.append(packageData.getCsarId());
		fileName.append(File.separator);
		fileName.append("functestResultKey.json");

		logger.info("Func Test Result key for Package Id:" + packageData.getCsarId() + ", Result Path:" + fileName);
		return (ResultKey) FileUtil.readJsonDatafFromFile(fileName.toString(), ResultKey.class);
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
