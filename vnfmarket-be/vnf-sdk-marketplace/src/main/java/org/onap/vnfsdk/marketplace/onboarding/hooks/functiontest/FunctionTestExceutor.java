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
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.msb.MsbDetails;
import org.onap.vnfsdk.marketplace.msb.MsbDetailsHolder;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.rest.RestConstant;
import org.onap.vnfsdk.marketplace.rest.RestResponse;
import org.onap.vnfsdk.marketplace.rest.RestfulClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FunctionTestExceutor
{
    private static final Logger logger = LoggerFactory.getLogger(FunctionTestExceutor.class);

    private FunctionTestExceutor()
    {}

    /**
     * Interface to Send Request to Start Function test
     * @param onBoradFuncTestReq
     * @return
     */
    public static String execFunctionTest(OnBoradingRequest onBoradFuncTestReq)
    {
        String packagePath = onBoradFuncTestReq.getPackagePath() + File.separator + onBoradFuncTestReq.getPackageName();
        logger.info("Package file path Function test:" + packagePath);

        String funcTestId = null;
        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails)
        {
            logger.error("Failed to get MSB details during execFunctionTest !!!");
            return funcTestId;
        }

        try (
            FileInputStream ifs = new FileInputStream(packagePath);
            InputStream inStream  = new BufferedInputStream(ifs);
        ) {


            //IP and Port needs to be configured !!!
            RestResponse rsp = RestfulClient.post(oMsbDetails.getDefaultServer().getHost(),
                                                    Integer.parseInt(oMsbDetails.getDefaultServer().getPort()),
                                                    CommonConstant.functionTest.FUNCTEST_URL,buildRequest(inStream));
            if(!checkValidResponse(rsp))
            {
                return funcTestId;
            }

            logger.error("Response for Function Test :" , rsp.getResult());
            funcTestId = rsp.getResult();
            return funcTestId.replaceAll("\"", "");
        }
        catch (FileNotFoundException exp)
        {
            logger.error("Fine not fond Exception for file:" , onBoradFuncTestReq.getPackagePath());
            logger.error("Fine not fond Exception for :" , exp);
        }
        catch (IOException e)
        {
            logger.error("IOException:" , e);
        }

        return funcTestId;
    }

    /**
     * Interface to get Function Test Results
     * @param key
     * @return
     */
    public static String getTestResultsByFuncTestKey(String key)
    {
        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails)
        {
            logger.error("Failed to get MSB details during getTestResultsByFuncTestKey !!!");
            return null;
        }

        logger.info("getTestResultsByFuncTestKey for Function Test Results for :" + key);
        RestResponse rspGet  = RestfulClient.get(oMsbDetails.getDefaultServer().getHost(),
                                Integer.parseInt(oMsbDetails.getDefaultServer().getPort()),
                                CommonConstant.functionTest.FUNCTEST_RESULT_URL + key);
        if(!checkValidResponse(rspGet))
        {
            logger.error("Failed to convert String Json Response to TestResults list:" + rspGet.getResult());
            return null;
        }
        logger.info("Function Test Results for Key:" + key + "Response:" + rspGet.getResult());
        return  rspGet.getResult();
    }

    /**
     * Interface to get Function Test Results
     * @param key
     * @return
     */
    public static String executeFunctionTest(String strJsonRequest)
    {
        logger.info("executeFunctionTest Test request Received:" + strJsonRequest);
        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails)
        {
            logger.error("Failed to get MSB details during getTestResultsByFuncTestKey !!!");
            return null;
        }

        logger.info("getTestResultsByFuncTestKey for Function Test Results for :" + strJsonRequest);
        RestResponse rspGet  = RestfulClient.sendPostRequest(oMsbDetails.getDefaultServer().getHost(),
                                                            oMsbDetails.getDefaultServer().getPort(),
                                                            CommonConstant.functionTest.FUNCTEST_RESULT_URL,
                                                            strJsonRequest);
        if(!checkValidResponse(rspGet))
        {
            logger.error("Failed to convert String Json Response to TestResults list:" + rspGet.getResult());
            return null;
        }
        logger.info("executeFunctionTest Function Test Result: " + rspGet.getResult());
        return  rspGet.getResult();
    }

    /**
     * Check Response is Valid
     * @param rsp
     * @return
     */
    private static boolean checkValidResponse(RestResponse rsp)
    {
        if (rsp.getStatusCode() == null || rsp.getResult() == null
                || (RestConstant.RESPONSE_CODE_200 != rsp.getStatusCode() && RestConstant.RESPONSE_CODE_201 != rsp.getStatusCode()))
        {
            return false;
        }
        return true;
    }

    @SuppressWarnings("deprecation")
    private static HttpEntity buildRequest(InputStream inputStream)
            throws FileNotFoundException {
          MultipartEntityBuilder builder = MultipartEntityBuilder.create();
          builder.seContentType(ContentType.MULTIPART_FORM_DATA);
          builder.addBinaryBody("file", inputStream);
          return builder.build();
        }
}

