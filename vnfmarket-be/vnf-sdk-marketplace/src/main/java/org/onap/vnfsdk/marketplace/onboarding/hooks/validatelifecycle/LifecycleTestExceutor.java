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
import java.io.IOException;
import java.util.Map;

import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.common.JsonUtil;
import org.onap.vnfsdk.marketplace.msb.MsbDetails;
import org.onap.vnfsdk.marketplace.msb.MsbDetailsHolder;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.rest.RestConstant;
import org.onap.vnfsdk.marketplace.rest.RestResponse;
import org.onap.vnfsdk.marketplace.rest.RestfulClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/* CALL Flow: onBoardingHandler --> LifecycleTestHook--> LifecycleTestExecutor */
public class LifecycleTestExceutor {
	private static final Logger logger = LoggerFactory.getLogger(LifecycleTestExceutor.class);
	public static final String CATALOUGE_UPLOAD_URL_IN = "{0}:{1}/openoapi/catalog/v1/csars";

	private LifecycleTestExceutor() {
		// Empty constructor
	}

	/**
	 * Interface to upload package to catalogue
	 * 
	 * @param onBoradFuncTestReq
	 * @return- csarId or null (in case of failure)
	 */
	@SuppressWarnings("unchecked")
	public static String uploadPackageToCatalouge(OnBoradingRequest onBoradFuncTestReq) {
		String packagePath = onBoradFuncTestReq.getPackagePath() + File.separator + onBoradFuncTestReq.getPackageName();
		logger.info("Package file path uploadPackageToCatalouge:" + packagePath);

		String catalougeCsarId = null;

		// Validate package path
		if (false == FileUtil.validatePath(packagePath)) {
			logger.error("Failed to validate  package path");
			return catalougeCsarId;
		}

		MsbDetails oMsbDetails = MsbDetailsHolder.getMsbDetails();
		if (null == oMsbDetails) {
			logger.error("Failed to get MSB details during uploadPackageToCatalouge !!!");
			return catalougeCsarId;
		}

		File fileData = new File(packagePath);

		// Validate file
		if (false == FileUtil.validateFile(fileData)) {
			logger.error("Failed to validate file information");
			return catalougeCsarId;
		}

		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		builder.addBinaryBody("file", fileData, ContentType.MULTIPART_FORM_DATA, onBoradFuncTestReq.getPackageName());

		// IP and Port needs to be configured !!!
		RestResponse rsp = RestfulClient.post(oMsbDetails.getDefaultServer().getHost(),
				Integer.parseInt(oMsbDetails.getDefaultServer().getPort()), CommonConstant.CATALOUGE_UPLOAD_URL,
				builder.build());
		if (false == checkValidResponse(rsp)) {
			logger.error("Failed to upload package to catalouge:" + rsp.getStatusCode());
			return catalougeCsarId;
		}

		logger.info("Response for uploadPackageToCatalouge :" + rsp.getResult());
		catalougeCsarId = getCsarIdValue(rsp.getResult());

		logger.info("CSARID for uploadPackageToCatalouge :" + catalougeCsarId);
		return catalougeCsarId;
	}

	/**
	 * Interface to execute lifecycle test
	 * 
	 * @param onBoradFuncTestReq,
	 *            oLifeCycleTestReq
	 * @return result of the test or null (in case of failure)
	 */
	public static String execlifecycleTest(OnBoradingRequest onBoradFuncTestReq, LifeCycleTestReq oLifeCycleTestReq) {

		String result = null;
		if ((null == onBoradFuncTestReq.getPackagePath()) || (null == onBoradFuncTestReq.getPackageName())) {
			logger.error("Package path or name is invalid");
			return result;
		}

		String packagePath = onBoradFuncTestReq.getPackagePath() + File.separator + onBoradFuncTestReq.getPackageName();
		logger.info("Package file path Function test:" + packagePath);

		// Validate package path
		if (false == FileUtil.validatePath(packagePath)) {
			logger.error("Failed to validate  path");
			return result;
		}

		MsbDetails oMsbDetails = MsbDetailsHolder.getMsbDetails();
		if (null == oMsbDetails) {
			logger.error("Failed to get MSB details during execlifecycleTest !!!");
			return result;
		}

		String rawDataJson = JsonUtil.toJson(oLifeCycleTestReq);
		if (null == rawDataJson) {
			logger.error("Failed to convert LifeCycleTestReq object to Json String !!!");
			return result;
		}

		RestResponse oResponse = RestfulClient.sendPostRequest(oMsbDetails.getDefaultServer().getHost(),
				oMsbDetails.getDefaultServer().getPort(), CommonConstant.LifeCycleTest.LIFECYCLE_TEST_URL, rawDataJson);

		if (false == checkValidResponse(oResponse)) {
			logger.error("execlifecycleTest response is faliure :" + oResponse.getStatusCode());
			return result;
		}

		result = oResponse.getResult();
		logger.info("Response execlifecycleTest :" + oResponse.getResult());
		return result;
	}

	/**
	 * Check Response is Valid
	 * 
	 * @param rsp
	 * @return valid(true) or invalid(false)
	 */
	private static boolean checkValidResponse(RestResponse rsp) {
		if ((null == rsp.getStatusCode()) || (null == rsp.getResult())
				|| (RestConstant.RESPONSE_CODE_200 != rsp.getStatusCode()
						&& RestConstant.RESPONSE_CODE_201 != rsp.getStatusCode())) {
			return false;
		}
		return true;
	}

	/**
	 * Get csar Id value
	 *
	 * @param strJsonData
	 * @return empty(failure), or csarId(success)
	 */
	private static String getCsarIdValue(String strJsonData) {
		ObjectMapper mapper = new ObjectMapper();
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		Map<String, String> dataMap = null;

		try {
			dataMap = mapper.readValue(strJsonData, Map.class);
		} catch (JsonParseException e) {
			logger.error("JsonParseException:Failed to upload package to catalouge:", e);
		} catch (JsonMappingException e) {
			logger.error("JsonMappingException:Failed to upload package to catalouge:", e);
		} catch (IOException e) {
			logger.error("IOException:Failed to upload package to catalouge:", e);
		}
		try {
			if (null != dataMap) {
				return dataMap.get("csarId");
			}
		} catch (NullPointerException e) {
			logger.error("NullPointerException:Failed to get csarId", e);
		}
		return "";
	}
}
