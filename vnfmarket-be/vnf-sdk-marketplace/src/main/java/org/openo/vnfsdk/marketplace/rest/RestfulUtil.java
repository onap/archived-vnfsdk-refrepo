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

package org.openo.vnfsdk.marketplace.rest;

import java.util.HashMap;
import java.util.Map;

import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.roa.util.restclient.Restful;
import org.openo.baseservice.roa.util.restclient.RestfulFactory;
import org.openo.baseservice.roa.util.restclient.RestfulParametes;
import org.openo.baseservice.roa.util.restclient.RestfulResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RestfulUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(RestfulUtil.class);

    private RestfulUtil() {
    }

    /**
     * Interface for Sending Request via REST
     * @param paramsMap
     * @param params
     * @param queryParam
     * @return
     */
    public static RestfulResponse sendRestRequest(Map<String, String> paramsMap, String params,Map<String, String> queryParam)  
    {
        if(null == paramsMap) 
        {
            LOGGER.error("sendRestResponse : Input validation failed !");
            return null;
        }
        
        String url = paramsMap.get(RestConstant.HttpContext.URL);
        String methodType = paramsMap.get(RestConstant.HttpContext.METHOD_TYPE);

        RestfulResponse rsp = null;
        Restful rest = RestfulFactory.getRestInstance(RestfulFactory.PROTO_HTTP);
        
        try 
        {
            RestfulParametes restfulParametes = new RestfulParametes();
            Map<String, String> headerMap = new HashMap<String, String>(3);
            headerMap.put(RestConstant.HttpContext.CONTENT_TYPE, RestConstant.HttpContext.MEDIA_TYPE_JSON);
            restfulParametes.setHeaderMap(headerMap);

            if(null != params) 
            {
                restfulParametes.setRawData(params);
            }

            if(null != queryParam) 
            {
                for(Map.Entry<String, String> curEntity : queryParam.entrySet()) 
                {
                    restfulParametes.putHttpContextHeader(curEntity.getKey(), curEntity.getValue());
                }
            }          
            if(rest != null) 
            {
                if(RestConstant.MethodType.GET.equalsIgnoreCase(methodType)) 
                {
                    rsp = rest.get(url, restfulParametes, null);
                } 
                else if(RestConstant.MethodType.POST.equalsIgnoreCase(methodType)) 
                {
                    rsp = rest.post(url, restfulParametes, null);
                } 
                else if(RestConstant.MethodType.PUT.equalsIgnoreCase(methodType)) 
                {
                    rsp = rest.put(url, restfulParametes, null);
                } 
                else if(RestConstant.MethodType.DELETE.equalsIgnoreCase(methodType))
                {
                    rsp = rest.delete(url, restfulParametes, null);
                }
            }
        } 
        catch(ServiceException  e) 
        {
            LOGGER.error("sendRestResponse, get restful response catch exception {}", e);
        }
        return rsp;
    }
}
