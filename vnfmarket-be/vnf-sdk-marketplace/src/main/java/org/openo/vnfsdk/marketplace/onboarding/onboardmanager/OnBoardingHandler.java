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
package org.openo.vnfsdk.marketplace.onboarding.onboardmanager;

import org.openo.vnfsdk.marketplace.common.FileUtil;
import org.openo.vnfsdk.marketplace.db.resource.PackageManager;
import org.openo.vnfsdk.marketplace.entity.EnumResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.openo.vnfsdk.marketplace.onboarding.hooks.functiontest.FunctionTestHook;
import org.openo.vnfsdk.marketplace.onboarding.hooks.validatelifecycle.LifecycleTestHook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class OnBoardingHandler
{
    private static final Logger logger = LoggerFactory.getLogger(OnBoardingHandler.class);

    public void handleOnBoardingReq(OnBoradingRequest onBoradingReq) 
    {               
        //Handle Package Life cycle/Validation
        //------------------------------------
        LifecycleTestHook oLifecycleTestHook = new LifecycleTestHook();
        int iLifeCycleResponse = oLifecycleTestHook.exec(onBoradingReq);        
        if(EnumResult.SUCCESS.getIndex() != iLifeCycleResponse)
        {
            logger.error("Onboarding falied for Package Id during Lifecycle Test:" + onBoradingReq.getCsarId());
        } 
        
        //Handle Package FunctionTest
        //-------------------------
        FunctionTestHook oFunctionTestHook = new FunctionTestHook();
        int iFuncTestResponse = oFunctionTestHook.exec(onBoradingReq);          
        if(EnumResult.SUCCESS.getIndex() != iFuncTestResponse)
        {
            logger.error("Onboarding falied for Package Id during Function Test:" + onBoradingReq.getCsarId());
            return;
        }      
        
        FileUtil.deleteDirectory(onBoradingReq.getPackagePath());    
        try 
        {
            PackageManager.getInstance().updateDwonloadCount(onBoradingReq.getCsarId());
        } 
        catch (Exception e) 
        {
            logger.error("Download count udate failed for Package:" + onBoradingReq.getPackagePath() ,e);
        }
    }

}
