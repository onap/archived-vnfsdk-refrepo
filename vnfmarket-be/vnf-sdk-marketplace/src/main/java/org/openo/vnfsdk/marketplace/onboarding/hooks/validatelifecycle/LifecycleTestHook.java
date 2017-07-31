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
import java.util.ArrayList;
import java.util.List;

import org.openo.vnfsdk.marketplace.common.CommonConstant;
import org.openo.vnfsdk.marketplace.common.FileUtil;
import org.openo.vnfsdk.marketplace.common.ToolUtil;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.entity.EnumOperationStatus;
import org.openo.vnfsdk.marketplace.entity.EnumResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoardingOperResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoardingResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.openo.vnfsdk.marketplace.onboarding.entity.ResultKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LifecycleTestHook 
{
    private static final Logger logger = LoggerFactory.getLogger(LifecycleTestHook.class);

    /**
     * Start Executing Function test
     * @param onBoradingReq
     * @return
     */
    public int exec(OnBoradingRequest onBoradingReq)
    {       
        logger.info("OnboradingRequest Lifecycle Request received for Package:" + onBoradingReq.getCsarId() + " Path:"+ onBoradingReq.getPackagePath());

        buildResultPath(onBoradingReq);
        
        OnBoardingResult olifecycleTestResult = new OnBoardingResult();
        buildlifecycleTestResponse(onBoradingReq,olifecycleTestResult);
        updateResult(olifecycleTestResult);
        
        if(null == onBoradingReq.getCsarIdCatalouge() || onBoradingReq.getCsarIdCatalouge().isEmpty())
        {          
            olifecycleTestResult.setOperFinished(true);
            olifecycleTestResult.setOperStatus(EnumResult.FAIL.getIndex());            
            buildFuncTestResponse(olifecycleTestResult,CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC,EnumOperationStatus.FAILED.getIndex());
            updateResult(olifecycleTestResult);           
            return EnumResult.FAIL.getIndex();
        }
      
        LifeCycleTestReq oLifeCycleTestReq = new LifeCycleTestReq();
        populateLifeCycleReq(onBoradingReq,oLifeCycleTestReq);

        
        //STEP 2: Execute Life Cycle Test and Get Result Back !!!!
        //---------------------------------------------------------
        String lifecycleTestResultKey = LifecycleTestExceutor.execlifecycleTest(onBoradingReq,oLifeCycleTestReq);
        if(null == lifecycleTestResultKey)
        {          
            olifecycleTestResult.setOperFinished(true);
            olifecycleTestResult.setOperStatus(EnumResult.FAIL.getIndex());            
            buildFuncTestResponse(olifecycleTestResult,CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC,EnumOperationStatus.FAILED.getIndex());
            updateResult(olifecycleTestResult);           
            return EnumResult.FAIL.getIndex();
        }

        olifecycleTestResult.setOperFinished(true);
        olifecycleTestResult.setOperStatus(EnumResult.SUCCESS.getIndex());
        buildFuncTestResponse(olifecycleTestResult,CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC,EnumOperationStatus.SUCCESS.getIndex());
        updateResult(olifecycleTestResult);

        //STEP 3: Store FuncTest key to get FuncTest Results
        //-------------------------------------------------
        storelifecycleResultKey(onBoradingReq,lifecycleTestResultKey);

        return (olifecycleTestResult.getOperStatus() == EnumResult.SUCCESS.getIndex()) 
                ? EnumResult.SUCCESS.getIndex() : EnumResult.FAIL.getIndex();
    }

    private void populateLifeCycleReq(OnBoradingRequest onBoradingReq, LifeCycleTestReq oLifeCycleTestReq) 
    {            
        oLifeCycleTestReq.setCsarId(onBoradingReq.getCsarId());
        oLifeCycleTestReq.setLabVimId(oLifeCycleTestReq.getLabVimId());
        
        List<String> vimIds = new ArrayList<String>();
        oLifeCycleTestReq.setVimIds(vimIds);
    }

    /**
     * 
     * @param onBoradingReq
     */
    private void buildResultPath(OnBoradingRequest onBoradingReq) 
    {
        String filePath = getResultStorePath() + File.separator + onBoradingReq.getCsarId();
        if(!FileUtil.checkFileExists(filePath))
        {
            FileUtil.createDirectory(filePath);
        }
    }

    /**
     * Store Function test Execution Results
     * @param oFuncTestResult
     */
    private void updateResult(OnBoardingResult oFuncTestResult) 
    {   
        //STore Results to DB(Currently we will make JSON and Store JSON to Package Path)
        //-------------------------------------------------------------------------------
        logger.info("Lifecycle test Status for Package Id:" + oFuncTestResult.getCsarId() + ", Result:" + ToolUtil.objectToString(oFuncTestResult));
        String filePath = getResultStorePath()  + File.separator  + oFuncTestResult.getCsarId() + File.separator + "lifecycleTest.json";        
        FileUtil.writeJsonDatatoFile(filePath,oFuncTestResult);
    }

    /**
     * Build Function Test Response
     * @param onBoradingReq
     * @param oFuncTestResult
     */
    private void buildlifecycleTestResponse(OnBoradingRequest onBoradingReq, OnBoardingResult oTestResult) 
    {
        oTestResult.setOperFinished(false);
        oTestResult.setCsarId(onBoradingReq.getCsarId());
        oTestResult.setOperTypeId(CommonConstant.LifeCycleTest.LIFECYCLE_TEST_OPERTYPE_ID);

        OnBoardingOperResult lifecycleTestExec = new OnBoardingOperResult();
        lifecycleTestExec.setOperId(CommonConstant.LifeCycleTest.LIFECYCLE_TEST_EXEC);
        lifecycleTestExec.setStatus(EnumOperationStatus.NOTSTARTED.getIndex());

        List<OnBoardingOperResult> operResult = new ArrayList<OnBoardingOperResult>();
        operResult.add(lifecycleTestExec); 
        oTestResult.setOperResult(operResult);
    }

    public static OnBoardingResult getOnBoardingResult(PackageData packageData) 
    {
        String filePath = getResultStorePath()  + File.separator + packageData.getCsarId() +File.separator + "lifecycleTest.json"; 
        logger.info("On Boarding Status for Package Id:" + packageData.getCsarId() + ", Result Path:" + filePath);

        return (OnBoardingResult)FileUtil.readJsonDatafFromFile(filePath,OnBoardingResult.class);
    }

    /**
     * Store Function Test Result key
     * @param onBoradingReq
     * @param resultKey
     */
    private void storelifecycleResultKey(OnBoradingRequest onBoradingReq,String resultKey) 
    {
        //Currently we will make JSON and Store JSON to Package Path)
        //-------------------------------------------------------------------------------
        String filePath = getResultStorePath() + File.separator + onBoradingReq.getCsarId() + File.separator + "lifecycleTestResultKey.json";        

        logger.info("Function test Results Key for Package Id:" + onBoradingReq.getCsarId() + ", Key:" + resultKey + " Path" + filePath);
        
        ResultKey oResultKey = new ResultKey();
        oResultKey.setCsarId(onBoradingReq.getCsarId());
        oResultKey.setOperTypeId(CommonConstant.LifeCycleTest.LIFECYCLE_TEST_OPERTYPE_ID);
        oResultKey.setKey(resultKey);

        FileUtil.writeJsonDatatoFile(filePath,oResultKey);
    }
    
    private static String getResultStorePath() 
    {
        return org.openo.vnfsdk.marketplace.filemanage.http.ToolUtil.getHttpServerAbsolutePath();
    }

    private void buildFuncTestResponse(OnBoardingResult oFuncTestResult, String opreKey, int operStatusVal) 
    {        
        List<OnBoardingOperResult>  operStatusList = oFuncTestResult.getOperResult();
        for(OnBoardingOperResult operObj: operStatusList)
        {
            if(operObj.getOperId().equalsIgnoreCase(opreKey))
            {
                operObj.setStatus(operStatusVal);
                break;
            }
        }
    }
}
