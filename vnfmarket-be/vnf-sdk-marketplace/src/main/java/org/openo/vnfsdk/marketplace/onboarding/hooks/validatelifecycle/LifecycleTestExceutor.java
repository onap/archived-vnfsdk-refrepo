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

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.openo.vnfsdk.marketplace.common.CommonConstant;
import org.openo.vnfsdk.marketplace.common.JsonUtil;
import org.openo.vnfsdk.marketplace.msb.MsbDetails;
import org.openo.vnfsdk.marketplace.msb.MsbDetailsHolder;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.openo.vnfsdk.marketplace.rest.RestConstant;
import org.openo.vnfsdk.marketplace.rest.RestResponse;
import org.openo.vnfsdk.marketplace.rest.RestfulClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class LifecycleTestExceutor 
{
    private static final Logger logger = LoggerFactory.getLogger(LifecycleTestExceutor.class);    
    public static final String CATALOUGE_UPLOAD_URL_IN = "{0}:{1}/openoapi/catalog/v1/csars";

    private LifecycleTestExceutor()
    {}

    /**
     * Interface to Send Request to Start Function test 
     * @param onBoradFuncTestReq
     * @return
     */
    @SuppressWarnings("unchecked")
    public static String uploadPackageToCatalouge(OnBoradingRequest onBoradFuncTestReq)
    {            
        String packagePath = onBoradFuncTestReq.getPackagePath() + File.separator + onBoradFuncTestReq.getPackageName();
        logger.info("Package file path uploadPackageToCatalouge:" + packagePath);

        String catalougeCsarId = null;       
        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails)
        {
            logger.error("Failed to get MSB details during uploadPackageToCatalouge !!!");
            return catalougeCsarId;
        }
        
        File fileData = new File (packagePath);
        
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();            
        builder.addBinaryBody("file", fileData, ContentType.MULTIPART_FORM_DATA, onBoradFuncTestReq.getPackageName());
            
        //IP and Port needs to be configured !!!
        RestResponse rsp = RestfulClient.post(oMsbDetails.getDefaultServer().getHost(),Integer.parseInt(oMsbDetails.getDefaultServer().getPort()),CommonConstant.CATALOUGE_UPLOAD_URL,builder.build());
        if(!checkValidResponse(rsp))
        {
            logger.error("Failed to upload package to catalouge:" + rsp.getStatusCode());
            return catalougeCsarId;
        }

        logger.info("Response for uploadPackageToCatalouge :" +  rsp.getResult());
        catalougeCsarId = getCsarIdValue(rsp.getResult());
        
        logger.info("CSARID for uploadPackageToCatalouge :" + catalougeCsarId);
        return catalougeCsarId;               
    }




    public static String execlifecycleTest(OnBoradingRequest onBoradFuncTestReq, LifeCycleTestReq oLifeCycleTestReq)
    {            
        String packagePath = onBoradFuncTestReq.getPackagePath() + File.separator + onBoradFuncTestReq.getPackageName();
        logger.info("Package file path Function test:" + packagePath);

        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails) {
            logger.error("Failed to get MSB details during execlifecycleTest !!!");
            return null;
        }

        String rawDataJson = JsonUtil.toJson(oLifeCycleTestReq);
        if(null == rawDataJson) {
            logger.error("Failed to convert LifeCycleTestReq object to Json String !!!");
            return null;
        }

        RestResponse oResponse = RestfulClient.sendPostRequest(oMsbDetails.getDefaultServer().getHost(),
                oMsbDetails.getDefaultServer().getPort(),
                CommonConstant.LifeCycleTest.LIFECYCLE_TEST_URL, rawDataJson);

        if(!checkValidResponse(oResponse)) { 
            logger.error("execlifecycleTest response is faliure :"+ oResponse.getStatusCode());
            return null;
        }
        logger.info("Response execlifecycleTest :"+ oResponse.getResult());
        return oResponse.getResult();               
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
    
    /**
     * 
     * @param strJsonData
     * @return
     */
    private static String getCsarIdValue(String strJsonData) 
    {
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        Map<String, String> dataMap = null;
        try 
        {
            dataMap = (Map<String, String>)mapper.readValue(strJsonData, Map.class);
        } catch(JsonParseException e) {
            logger.error("JsonParseException:Failed to upload package to catalouge:");
        } catch(JsonMappingException e) {
            logger.error("JsonMappingException:Failed to upload package to catalouge:");
        } catch(IOException e) {
            logger.error("IOException:Failed to upload package to catalouge:");
        }
        return dataMap.get("csarId");
    }
}
