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

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.openo.vnfsdk.marketplace.common.CommonConstant;
import org.openo.vnfsdk.marketplace.common.JsonUtil;
import org.openo.vnfsdk.marketplace.rest.RestResponse;
import org.openo.vnfsdk.marketplace.rest.RestfulClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class MsbRegistration {
    private static final Logger LOGGER = LoggerFactory.getLogger(MsbRegistration.class);
    
    private static MsbRegistration oMsbRegistration = new MsbRegistration();
    
    private static final String MSB_REGISTION_FILE = "etc/microservice/marketplace_rest.json";
    private static final String MSB_REGISTION_URL = "/openoapi/microservices/v1/services?createOrUpdate=false";
    private static final String MSB_UN_REGISTION_URL = "/openoapi/microservices/v1/services/{0}/version/{1}/nodes/{2}/{3}";
    private static final String NODES = "nodes";
    private static final String IP = "ip";
    private static final String PORT = "port";
    private static final String SERVICE_NAME = "serviceName";
    private static final String VERSION = "version";
   
    private boolean bRegistrationStatus = false;
    
    private MsbRegistration () {
    }
    
    public static MsbRegistration getInstance()
    {
        return oMsbRegistration;
    }
    /**
     * Interface to handle MSB Registration
     * @return
     */
    public int register() 
    {               
        File file = new File(MSB_REGISTION_FILE);
        if(!file.exists()) 
        {
            LOGGER.info("Stop registering as can't find msb registion file:" + file.getAbsolutePath());          
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FILE_NOT_EXISTS;
        }

        Map<?, ?> msbRegistionBodyMap = getMsbRegistrationData();
        if(null == msbRegistionBodyMap)
        {
            LOGGER.info("Reading data from msb registion file failed:" + file.getAbsolutePath()); 
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FILE_NOT_EXISTS;
        }

        LOGGER.info("Registering body: " + JsonUtil.toJson(msbRegistionBodyMap));

        bRegistrationStatus = sendRequest(msbRegistionBodyMap);
        
        return bRegistrationStatus 
                ? CommonConstant.MsbRegisterCode.MSDB_REGISTER_SUCESS 
                        : CommonConstant.MsbRegisterCode.MSDB_REGISTER_FAILED;
    }

    private Map<?, ?> getMsbRegistrationData() 
    {        
        Map<?, ?> msbRegistionBodyMap = null;
        try 
        {
            ObjectMapper mapper = new ObjectMapper();
            byte[] bytes = Files.readAllBytes(Paths.get(MSB_REGISTION_FILE));
            msbRegistionBodyMap = mapper.readValue(bytes, Map.class);
            
            replaceLocalIp(msbRegistionBodyMap);
        } 
        catch(IOException e) 
        {
            LOGGER.error("Failed to get microservice bus registration body, " + e);
        }
        return msbRegistionBodyMap;
    }

    /**
     * Send MSB Registration request
     * @param msbRegistionBodyMap
     * @return
     */
    private boolean sendRequest(Map<?, ?> msbRegistionBodyMap)  
    {
        LOGGER.info("Start registering to microservice bus");
        String rawData = JsonUtil.toJson(msbRegistionBodyMap);       
        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails) {
            LOGGER.info("MSB Details is NULL , Registration Failed !!!");
            return false;
        }        
        RestResponse oResponse = RestfulClient.sendPostRequest(oMsbDetails.getDefaultServer().getHost(),
                                oMsbDetails.getDefaultServer().getPort(),
                                MSB_REGISTION_URL, rawData);
        
        if(null == oResponse){
            LOGGER.info("Null Unregister Response for  " + MSB_REGISTION_URL);
            return false;
        }        
        LOGGER.info("Response Code Received for MBS Registration:" + oResponse.getStatusCode());        
        return isSuccess(oResponse.getStatusCode()) ? true : false;
    }
    
    public int unRegister() 
    {
        if(!bRegistrationStatus){
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_SUCESS; 
        }
        
        MsbDetails oMsbDetails =  MsbDetailsHolder.getMsbDetails();
        if(null == oMsbDetails){
            LOGGER.info("MSB Details is NULL , Registration Failed !!!");
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FAILED;
        }
        
        File file = new File(MSB_REGISTION_FILE);
        if(!file.exists()){
            LOGGER.info("Stop registering as can't find msb registion file:" + file.getAbsolutePath());          
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FILE_NOT_EXISTS;
        }
        
        Map<?, ?> msbRegistionBodyMap = getMsbRegistrationData();
        if(null == msbRegistionBodyMap){
            LOGGER.info("Reading data from msb registion file failed:" + file.getAbsolutePath()); 
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FILE_NOT_EXISTS;
        }
        
        String serviceName = (String)msbRegistionBodyMap.get(SERVICE_NAME);
        String version = (String)msbRegistionBodyMap.get(VERSION);
       
        @SuppressWarnings("unchecked")
        List<Map<String, String>> nodes = (List<Map<String, String>>)msbRegistionBodyMap.get(NODES);       
        if((null == serviceName ) || (null == version ) || (null == nodes )) 
        {
            LOGGER.info("Readed data is Invalid from msb registion file:" + file.getAbsolutePath()); 
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FILE_NOT_EXISTS;
        }
        
        Map<String, String> node = nodes.get(0);
        String ip = node.get(IP);
        String port = node.get(PORT);

        String url = MessageFormat.format(MSB_UN_REGISTION_URL, serviceName, version, ip, port);
        LOGGER.info("Start Unregister to microservice bus, url: " + url);
        
        RestResponse oResponse = RestfulClient.delete(oMsbDetails.getDefaultServer().getHost(),
                                    Integer.parseInt(oMsbDetails.getDefaultServer().getPort()),url);
        
        if(null == oResponse) {
            LOGGER.info("Null Unregister Response for  " + url);
            return CommonConstant.MsbRegisterCode.MSDB_REGISTER_FAILED;
        }        
        LOGGER.info("Unregister Response " + oResponse.getStatusCode());        
        return isSuccess(oResponse.getStatusCode()) ? 
                CommonConstant.MsbRegisterCode.MSDB_REGISTER_SUCESS : 
                    CommonConstant.MsbRegisterCode.MSDB_REGISTER_FAILED;
    }

    @SuppressWarnings("unchecked")
    private void replaceLocalIp(Map<?, ?> msbRegistionBodyMap) 
    {
        List<Map<String, String>> nodes = (List<Map<String, String>>)msbRegistionBodyMap.get(NODES);
        Map<String, String> node = nodes.get(0);
        if(StringUtils.isNotEmpty(node.get(IP))) {
            return;
        }

        try
        {
            InetAddress addr = InetAddress.getLocalHost();
            String ipAddress = addr.getHostAddress();
            node.put(IP, ipAddress);

            LOGGER.info("Local ip: " + ipAddress);
        } 
        catch(UnknownHostException e) 
        {
            LOGGER.error("Unable to get IP address, " + e);
        }
    }

    private boolean isSuccess(int httpCode) 
    {
        return (httpCode == 200 || httpCode == 201) ? true : false;
    }
}
