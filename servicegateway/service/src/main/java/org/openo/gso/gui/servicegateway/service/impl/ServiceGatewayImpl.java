/*
 * Copyright (c) 2016, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.openo.gso.gui.servicegateway.service.impl;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.openo.baseservice.remoteservice.exception.ExceptionArgs;
import org.openo.baseservice.remoteservice.exception.ServiceException;
import org.openo.baseservice.roa.util.restclient.RestfulFactory;
import org.openo.baseservice.roa.util.restclient.RestfulParametes;
import org.openo.baseservice.roa.util.restclient.RestfulResponse;
import org.openo.baseservice.util.RestUtils;
import org.openo.gso.gui.servicegateway.constant.Constant;
import org.openo.gso.gui.servicegateway.exception.HttpCode;
import org.openo.gso.gui.servicegateway.service.inf.IServiceGateway;
import org.openo.gso.gui.servicegateway.util.json.JsonUtil;
import org.openo.gso.gui.servicegateway.util.validate.ValidateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * ServiceGateway service class.<br/>
 * <p>
 * </p>
 * 
 * @author
 * @version GSO 0.5 2016/8/4
 */
public class ServiceGatewayImpl implements IServiceGateway {

    /**
     * Log service.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceGatewayImpl.class);


    /**
     * Create service instance.<br/>
     * 
     * @param reqContent content of request
     * @param httpRequest http request
     * @throws ServiceException when operate DB or parameter is wrong.
     * @since GSO 0.5
     */
    @SuppressWarnings("unchecked")
    @Override
    public String createService(String reqContent, HttpServletRequest httpRequest) throws ServiceException {
    	// check the value
    	if(StringUtils.isEmpty(reqContent))
    	{
    		LOGGER.error("ServiceGatewayImpl createService reqContent is null.");
    		throw new ServiceException("ServiceGatewayImpl createService reqContent is null.");    		
    	}
    	
    	// Parse request
        Map<String, Object> requestBody = JsonUtil.unMarshal(reqContent, Map.class);
        Map<String, Object> service = (Map<String, Object>)requestBody.get(Constant.SERVICE_INDENTIFY);
        if(null == service)
        {
        	service = requestBody;
        }
        ValidateUtil.assertObjectNotNull(requestBody);

        // Validate data
        String gatewayUri = (String)service.get(Constant.SERVICE_GATEWAY_URI);
        ValidateUtil.assertStringNotNull(gatewayUri);
        service.remove(Constant.SERVICE_GATEWAY_URI);

        // call the restful 
        String id = null;
        try {
        	LOGGER.info("Send the cretation RESTful request to orchestrator.The Body is"+ requestBody.toString());
        	RestfulResponse restfulRsp = RestfulFactory.getRestInstance("http").post(gatewayUri,
                    getRestfulParameters(JsonUtil.marshal(requestBody)));
        	LOGGER.info("Receive the cretation RESTful response from orchestrator.The status is:"+restfulRsp.getStatus()+" the content is:"+ 
                    restfulRsp.getResponseContent());
            if (null != restfulRsp) 
            {
                // Record the result of registration
                // (201:success;415:Invalid Parameter;500:Internal Server Error)
            	LOGGER.info("restful call result:"+ restfulRsp.getStatus());
            	if(restfulRsp.getStatus() == HttpCode.RESPOND_ACCEPTED || restfulRsp.getStatus() == HttpCode.RESPOND_OK || restfulRsp.getStatus() == HttpCode.CREATED_OK)
            	{       
	                Map<String,Object> rspBody = JsonUtil.unMarshal(restfulRsp.getResponseContent(),Map.class);
	                id = (String)rspBody.get(Constant.SERVICE_ID);
	                id = (null == id) ? (String)rspBody.get(Constant.NS_INSTANCE_ID) : id;
	                id = (null == id) ? (String)rspBody.get(Constant.JOB_ID) : id;
            	}
            	else
            	{       		
            		ExceptionArgs args = new ExceptionArgs();
                    args.setDescArgs(new String[] {"Fail to create service:" + restfulRsp.getResponseContent()});  		
                    throw new ServiceException(ServiceException.DEFAULT_ID, restfulRsp.getStatus(), args);
            	}
            }
        } catch(ServiceException e) {
        	LOGGER.error("service gateway create restful call result:", e);
            throw e;
        }

        return id;
    }
    
    /**
     * get the parameters for restful<br/>
     * 
     * @author
     * @param bodyData
     *            Json Body
     * @return the RestfulParametes Instance
     * @since GSO 0.5, 2016-8-9
     */
    private static RestfulParametes getRestfulParameters(final String bodyData) {
        RestfulParametes param = new RestfulParametes();
        param.putHttpContextHeader(Constant.HEAD_ERMAP_TYPE, Constant.HEAD_ERMAP_VALUE);
        param.setRawData(bodyData);
        return param;
    }

    /**
     * Delete service instances.<br/>
     * 
     * @param serviceId service instance ID
     * @param httpRequest http request
     * @throws ServiceException operate DB or parameter is wrong.
     * @since GSO 0.5
     */
    @Override
    public Map<String, Object> deleteService(String serviceId, String reqContent, HttpServletRequest httpRequest) throws ServiceException {
    	if(httpRequest == null)
    	{    		
    		LOGGER.error("ServiceGatewayImpl.deleteService httpRequest is null");
    		throw new ServiceException("ServiceGatewayImpl.deleteService httpRequest is null");
    	}
        // Parse request
        Map<String, Object> requestBody = JsonUtil.unMarshal(reqContent, Map.class);
        ValidateUtil.assertObjectNotNull(requestBody);

        // Validate data
        String gatewayUri = (String)requestBody.get(Constant.SERVICE_GATEWAY_URI);
        ValidateUtil.assertStringNotNull(gatewayUri);
        requestBody.remove(Constant.SERVICE_GATEWAY_URI);

        String operation = (String) requestBody.get(Constant.SERVICE_OPERATION);
        ValidateUtil.assertStringNotNull(operation);
        requestBody.remove(Constant.SERVICE_OPERATION);

        // call the restful
        try {
            RestfulResponse restfulRsp = null;
            Map<String, Object> result = new HashMap<String, Object>();
            if(Constant.SERVICE_DELETE_OPERATION.equalsIgnoreCase(operation)) {
                restfulRsp = RestfulFactory.getRestInstance("http").delete(gatewayUri,
                        getRestfulParameters(JsonUtil.marshal(requestBody)));
                result.put(Constant.RESPONSE_STATUS, "success");
                result.put(Constant.RESPONSE_STATUS_DESCRIPTION, "It is deleting.");
                result.put(Constant.RESPONSE_ERRORCODE, "202");
            } else {
                restfulRsp = RestfulFactory.getRestInstance("http").post(gatewayUri,
                        getRestfulParameters(JsonUtil.marshal(requestBody)));
                if (null != restfulRsp) {
	                Map<String,Object> rspBody = JsonUtil.unMarshal(restfulRsp.getResponseContent(),Map.class);
                    String jobId = (String)rspBody.get(Constant.JOB_ID);
                    result.put(Constant.JOB_ID, jobId);
                }
            }
            if (null != restfulRsp) {
                LOGGER.info("restful call result: {}", restfulRsp.getStatus());
                LOGGER.info("restful call content:{}", restfulRsp.getResponseContent());
            }
            return result;
        } catch(ServiceException e) {
            LOGGER.error("service gateway delete restful call result:", e);
            throw e;
        }
    }

}
