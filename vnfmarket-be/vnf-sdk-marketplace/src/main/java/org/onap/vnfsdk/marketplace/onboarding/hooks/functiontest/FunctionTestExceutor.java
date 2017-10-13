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

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.msb.MsbDetails;
import org.onap.vnfsdk.marketplace.msb.MsbDetailsHolder;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.rest.RestConstant;
import org.onap.vnfsdk.marketplace.rest.RestResponse;
import org.onap.vnfsdk.marketplace.rest.RestfulClient;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/* CALL Flow: onBoardingHandler --> FunctionTestHook--> FunctionTestExecutor */
public class FunctionTestExceutor {
	private static final Logger logger = LoggerFactory.getLogger(FunctionTestExceutor.class);

	private FunctionTestExceutor() {
		//Empty constructor
	}

	/**
	 * Interface to Send Request to Start Function test
	 * 
	 * @param onBoradFuncTestReq
	 * @return null (in case of failure) or function Test Id
	 */
	public static String execFunctionTest(OnBoradingRequest onBoradFuncTestReq) {

		String funcTestId = null;		

		String packagePath = onBoradFuncTestReq.getPackagePath() + File.separator + onBoradFuncTestReq.getPackageName();
		logger.info("Package file path Function test:" + packagePath);

		// Validate package path
		if (false == FileUtil.validatePath(packagePath)) {
			logger.error("Failed to validate  path");
			return funcTestId;
		}

		MsbDetails oMsbDetails = MsbDetailsHolder.getMsbDetails();
		if (null == oMsbDetails) {
			logger.error("Failed to get MSB details during execFunctionTest !!!");
			return funcTestId;
		}

		try (FileInputStream ifs = new FileInputStream(packagePath);
				InputStream inStream = new BufferedInputStream(ifs);) {

			// Validate input stream
			if (false == FileUtil.validateStream(ifs)) {
				logger.error("Failed to validate file stream");
				return funcTestId;
			}

			// IP and Port needs to be configured !!!
			RestResponse rsp = RestfulClient.post(oMsbDetails.getDefaultServer().getHost(),
					Integer.parseInt(oMsbDetails.getDefaultServer().getPort()),
					CommonConstant.functionTest.FUNCTEST_URL, buildRequest(inStream));
			if (!checkValidResponse(rsp)) {
				logger.error("Failed to validate response");
				return funcTestId;
			}

			funcTestId = rsp.getResult();
			logger.info("Response for Function Test :", funcTestId);

			return funcTestId.replaceAll("\"", "");
		} catch (NumberFormatException e) {
			logger.error("Invalid port number :", oMsbDetails.getDefaultServer().getPort());
		} catch (FileNotFoundException exp) {
			logger.error("File not found Exception for file:", onBoradFuncTestReq.getPackagePath());
			logger.error("File not found Exception for :", exp);
		} catch (IOException e) {
			logger.error("IOException:", e);
		}

		return funcTestId;
	}

	/**
	 * Interface to get Function Test Results
	 * 
	 * @param key
	 * @return null or resultkey
	 */
	public static String getTestResultsByFuncTestKey(String key) {

		// Input key cannot be null- no need to validate

		String result = null;
		MsbDetails oMsbDetails = MsbDetailsHolder.getMsbDetails();
		if (null == oMsbDetails) {
			logger.error("Failed to get MSB details during getTestResultsByFuncTestKey !!!");
			return result;
		}

		logger.info("GetTestResultsByFuncTestKey for Function Test Results for :" + key);
		RestResponse rspGet = RestfulClient.get(oMsbDetails.getDefaultServer().getHost(),
				Integer.parseInt(oMsbDetails.getDefaultServer().getPort()),
				CommonConstant.functionTest.FUNCTEST_RESULT_URL + key);
		if (false == checkValidResponse(rspGet)) {
			logger.error("Failed to convert String Json Response to TestResults list:" + rspGet.getResult());
			return result;
		}

		result = rspGet.getResult();
		logger.info("Function Test Results for Key:" + key + "Response:" + rspGet.getResult());
		return result;
	}

	/**
	 * Interface to get Function Test Results
	 * 
	 * @param strJsonRequest
	 * @return
	 */
	public static String executeFunctionTest(String strJsonRequest) {

		String result = null;
		if (null == strJsonRequest) {
			logger.error("Invalid input- Input is null");
			return result;
		}

		logger.info("ExecuteFunctionTest Test request Received:" + strJsonRequest);

		MsbDetails oMsbDetails = MsbDetailsHolder.getMsbDetails();
		if (null == oMsbDetails) {
			logger.error("Failed to get MSB details during getTestResultsByFuncTestKey !!!");
			return result;
		}

		logger.info("GetTestResultsByFuncTestKey for Function Test Results for :" + strJsonRequest);
		RestResponse rspGet = RestfulClient.sendPostRequest(oMsbDetails.getDefaultServer().getHost(),
				oMsbDetails.getDefaultServer().getPort(), CommonConstant.functionTest.FUNCTEST_RESULT_URL,
				strJsonRequest);
		if (false == checkValidResponse(rspGet)) {
			logger.error("Failed to convert String Json Response to TestResults list:" + rspGet.getResult());
			return result;
		}

		result = rspGet.getResult();
		logger.info("ExecuteFunctionTest Function Test Result: " + rspGet.getResult());
		return result;
	}

	/**
	 * Check Response is Valid
	 * 
	 * @param rsp
	 * @return valid or invalid
	 */
	private static boolean checkValidResponse(RestResponse rsp) {
		if ((null == rsp.getStatusCode()) || (null == rsp.getResult())
				|| (RestConstant.RESPONSE_CODE_200 != rsp.getStatusCode()
						&& RestConstant.RESPONSE_CODE_201 != rsp.getStatusCode())) {
			return false;
		}
		return true;
	}

	private static HttpEntity buildRequest(InputStream inputStream) throws FileNotFoundException {
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		builder.addBinaryBody("file", inputStream);
		return builder.build();
	}
}
