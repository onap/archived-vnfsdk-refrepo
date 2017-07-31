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
package org.openo.vnfsdk.marketplace.msb;

import org.openo.vnfsdk.marketplace.common.FileUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MsbDetailsHolder 
{
    private static final Logger logger = LoggerFactory.getLogger(MsbDetailsHolder.class);
    private static final String MSB_DETAILS_PATH = "etc/conf/restclient.json";
    private static MsbDetails msbDetails = null;

    private MsbDetailsHolder(){       
    }
    
    public static synchronized MsbDetails getMsbDetails() 
    {
       MsbDetailsHolder.loadMsbDetails();
       return msbDetails;
    }

    private static synchronized void loadMsbDetails () 
    {      
        if(null != msbDetails) {
            return;
        }
        
        msbDetails = (MsbDetails)FileUtil.readJsonDatafFromFile(MSB_DETAILS_PATH, MsbDetails.class);
        if (null == msbDetails) 
        {
            logger.error("Failed to Load MSB Details !!!");
        }
    }
}
