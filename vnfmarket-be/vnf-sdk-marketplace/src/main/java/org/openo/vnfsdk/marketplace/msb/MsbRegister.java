/*
 * Copyright 2016 Huawei Technologies Co., Ltd.
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

package org.openo.vnfsdk.marketplace.msb;

import org.openo.vnfsdk.marketplace.common.CommonConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MsbRegister
{
    private static final Logger logger = LoggerFactory.getLogger(MsbRegister.class);
    
    /**
     * Interface top handle MSB Registration
     */
    public static void handleMsbRegistration() 
    {
        logger.info("VNF-SDK Market Place microservice register start.");
        int retry = 0;
        while(CommonConstant.MsbRegisterCode.MSDB_REGISTER_RETRIES >= retry) 
        {                               
            int retCode = MsbRegistration.getInstance().register();
            if(CommonConstant.MsbRegisterCode.MSDB_REGISTER_FILE_NOT_EXISTS == retCode)
            {
                logger.info("microservice register failed, MSB Register File Not Exists !");
                break;
            }
            
            if(CommonConstant.MsbRegisterCode.MSDB_REGISTER_SUCESS != retCode) 
            {
                logger.warn("microservice register failed, try again after(ms):" + CommonConstant.MsbRegisterCode.MSDB_REGISTER_RETRY_SLEEP);
                threadSleep(CommonConstant.MsbRegisterCode.MSDB_REGISTER_RETRY_SLEEP);
            } 
            else 
            {
                logger.info("microservice register success !");
                break;
            }    
            
            retry++;
            logger.info("VNF-SDK Market Place microservice register [retry count]:" + retry);
        }
        logger.info("VNF-SDK Market Place microservice register end.");
    }
    
    public static void handleMsbUnRegistration() 
    {
        logger.info("VNF-SDK Market Place microservice handleMsbUnRegistration Start.");
        MsbRegistration.getInstance().unRegister();
        logger.info("VNF-SDK Market Place microservice handleMsbUnRegistration end.");
    }
    
    private static void threadSleep(int second) 
    {
        try 
        {
            Thread.sleep(second);
        } 
        catch(InterruptedException error) 
        {
            logger.error("thread sleep error.errorMsg:", error);
            Thread.currentThread().interrupt();
        }
    }
} 

