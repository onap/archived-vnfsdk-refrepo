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
package org.openo.vnfsdk.marketplace.onboarding.hooks.functiontest;

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

public class FunctionTestHook 
{
    private static final Logger logger = LoggerFactory.getLogger(FunctionTestHook.class);

    /**
     * Start Executing Function test
     * @param onBoradingReq
     * @return
     */
    public int exec(OnBoradingRequest onBoradingReq)
    {       
        logger.info("OnboradingRequest received for Package:" + onBoradingReq.getCsarId() + " Path:"+ onBoradingReq.getPackagePath());

        buildResultPath(onBoradingReq);
        
        OnBoardingResult oFuncTestResult = new OnBoardingResult();
        buildFunctResponse(onBoradingReq,oFuncTestResult);
        updateResult(oFuncTestResult);

        //STEP 1:Check Package Exists
        //---------------------------      
        if(!FileUtil.checkFileExists(onBoradingReq.getPackagePath()))
        {
            logger.info("Package Not Found at Path:" + onBoradingReq.getPackagePath() + ", Package Id:" + onBoradingReq.getCsarId());                      
            oFuncTestResult.setOperFinished(true);
            oFuncTestResult.setOperStatus(EnumResult.FAIL.getIndex());
            buildFuncTestResponse(oFuncTestResult,CommonConstant.functionTest.FUNCTEST_PACKAGE_EXISTS,EnumOperationStatus.FAILED.getIndex());
            updateResult(oFuncTestResult);            
            return EnumResult.FAIL.getIndex();
        }       

        buildFuncTestResponse(oFuncTestResult,CommonConstant.functionTest.FUNCTEST_PACKAGE_EXISTS,EnumOperationStatus.SUCCESS.getIndex());
        updateResult(oFuncTestResult);

        //STEP 2:Handle function test for Package
        //---------------------------------------
        String functestResultKey = FunctionTestExceutor.execFunctionTest(onBoradingReq);
        if(null == functestResultKey)
        {          
            oFuncTestResult.setOperFinished(true);
            oFuncTestResult.setOperStatus(EnumResult.FAIL.getIndex());            
            buildFuncTestResponse(oFuncTestResult,CommonConstant.functionTest.FUNCTEST_EXEC,EnumOperationStatus.FAILED.getIndex());
            updateResult(oFuncTestResult);           
            return EnumResult.FAIL.getIndex();
        }       

        oFuncTestResult.setOperFinished(true);
        oFuncTestResult.setOperStatus(EnumResult.SUCCESS.getIndex());
        buildFuncTestResponse(oFuncTestResult,CommonConstant.functionTest.FUNCTEST_EXEC,EnumOperationStatus.SUCCESS.getIndex());
        updateResult(oFuncTestResult);

        //STEP 3:Store FuncTest key to get FuncTest Results
        //-------------------------------------------------
        storeFuncTestResultKey(onBoradingReq,functestResultKey);

        return (oFuncTestResult.getOperStatus() == EnumResult.SUCCESS.getIndex()) 
                ? EnumResult.SUCCESS.getIndex() : EnumResult.FAIL.getIndex();
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
     * 
     * @param packageData
     * @return
     */
    public static String getFuncTestResults(PackageData packageData) 
    {
        logger.info("Function Test results request for Package:" + packageData.getCsarId());
        ResultKey keydata = getFuncTestResultKey(packageData);
        if(null == keydata || keydata.getKey().isEmpty())
        {
            logger.info("Function Test key Not Found for Package Id:",packageData.getCsarId());
            return null;
        }        
        return  FunctionTestExceutor.getTestResultsByFuncTestKey(keydata.getKey());
    }

    /**
     * Store Function Test Result key
     * @param onBoradingReq
     * @param resultKey
     */
    private void storeFuncTestResultKey(OnBoradingRequest onBoradingReq,String resultKey) 
    {
        //Currently we will make JSON and Store JSON to Package Path)
        //-------------------------------------------------------------------------------
        String filePath = getResultStorePath() + File.separator + onBoradingReq.getCsarId() + File.separator + "functestResultKey.json";        

        logger.info("Function test Results Key for Package Id:" + onBoradingReq.getCsarId() + ", Key:" + resultKey + " Path" + filePath);
        
        ResultKey oResultKey = new ResultKey();
        oResultKey.setCsarId(onBoradingReq.getCsarId());
        oResultKey.setOperTypeId(CommonConstant.functionTest.FUNCTEST_OPERTYPE_ID);
        oResultKey.setKey(resultKey);

        FileUtil.writeJsonDatatoFile(filePath,oResultKey);
    }

    /**
     * Store Function test Execution Results
     * @param oFuncTestResult
     */
    private void updateResult(OnBoardingResult oFuncTestResult) 
    {   
        //STore Results to DB(Currently we will make JSON and Store JSON to Package Path)
        //-------------------------------------------------------------------------------
        logger.info("Function test Status for Package Id:" + oFuncTestResult.getCsarId() + ", Result:" + ToolUtil.objectToString(oFuncTestResult));
        String filePath = getResultStorePath()  + File.separator  + oFuncTestResult.getCsarId() + File.separator + "functionTest.json";        
        FileUtil.writeJsonDatatoFile(filePath,oFuncTestResult);
    }

    /**
     * Build Function Test Response
     * @param onBoradingReq
     * @param oFuncTestResult
     */
    private void buildFunctResponse(OnBoradingRequest onBoradingReq, OnBoardingResult oFuncTestResult) 
    {
        oFuncTestResult.setOperFinished(false);
        oFuncTestResult.setCsarId(onBoradingReq.getCsarId());
        oFuncTestResult.setOperTypeId(CommonConstant.functionTest.FUNCTEST_OPERTYPE_ID);

        OnBoardingOperResult oPackageExists = new OnBoardingOperResult();
        oPackageExists.setOperId(CommonConstant.functionTest.FUNCTEST_PACKAGE_EXISTS);
        oPackageExists.setStatus(EnumOperationStatus.NOTSTARTED.getIndex());

        OnBoardingOperResult functTesExec = new OnBoardingOperResult();
        functTesExec.setOperId(CommonConstant.functionTest.FUNCTEST_EXEC);
        functTesExec.setStatus(EnumOperationStatus.NOTSTARTED.getIndex());

        List<OnBoardingOperResult> operResult = new ArrayList<OnBoardingOperResult>();
        operResult.add(oPackageExists);
        operResult.add(functTesExec); 

        oFuncTestResult.setOperResult(operResult);
    }

    public static OnBoardingResult getOnBoardingResult(PackageData packageData) 
    {
        String filePath = getResultStorePath()  + File.separator + packageData.getCsarId() +File.separator + "functionTest.json"; 
        logger.info("On Boarding Status for Package Id:" + packageData.getCsarId() + ", Result Path:" + filePath);

        return (OnBoardingResult)FileUtil.readJsonDatafFromFile(filePath,OnBoardingResult.class);
    }

    private static ResultKey getFuncTestResultKey(PackageData packageData) 
    {
        String fileName = getResultStorePath() + File.separator + packageData.getCsarId() + File.separator + "functestResultKey.json";
        
        logger.info("Func Test Result key for Package Id:" + packageData.getCsarId() + ", Result Path:" + fileName);
        return (ResultKey) FileUtil.readJsonDatafFromFile(fileName,ResultKey.class);       
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
