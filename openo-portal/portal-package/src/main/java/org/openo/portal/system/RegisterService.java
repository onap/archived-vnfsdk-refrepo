/*
 * Copyright 2016-2017, CMCC Technologies Co., Ltd.
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
package org.openo.portal.system;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.commons.httpclient.HttpStatus;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.openo.portal.bean.MsbRegisterBean;
import org.openo.portal.bean.ServiceNodeBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RegisterService {

    private final static Logger logger = LoggerFactory.getLogger(RegisterService.class);

    public static HashMap<String, String> msbHostMap = new HashMap<String, String>();
    public static List<HashMap<String, String>> registerList = new ArrayList<HashMap<String, String>>();

    public static void registerMsb(String configPath) {
        File inputXml = new File(configPath);
        SAXReader saxReader = new SAXReader();

        try {
            Document document = saxReader.read(inputXml);
            Element rootNode = document.getRootElement();
            getMsbHostInfo(rootNode);
            getRegisterList(rootNode);

            String url = msbHostMap.get("hostIp") + Constants.MARK_COLON + msbHostMap.get("hostPort") + msbHostMap.get("msbApiRootDomain");
            for (int i = 0; i < registerList.size(); i++) {
                HashMap<String, String> registerInfo = registerList.get(i);

                ServiceNodeBean serviceNode = new ServiceNodeBean();
                serviceNode.setIp(registerInfo.get("ip"));
                serviceNode.setPort(registerInfo.get("port"));
                serviceNode.setTtl(Integer.valueOf(registerInfo.get("ttl")));
                List<ServiceNodeBean> nodeList =  new ArrayList<ServiceNodeBean>();
                nodeList.add(serviceNode);

                MsbRegisterBean registerBean = new MsbRegisterBean();
                registerBean.setNodes(nodeList);
                registerBean.setServiceName(registerInfo.get("serviceName"));
                registerBean.setUrl(registerInfo.get("url"));
                registerBean.setProtocol(registerInfo.get("protocol"));
                registerBean.setVisualRange(registerInfo.get("visualRange"));
                registerBean.setLb_policy(registerInfo.get("lb_policy"));

                JSONObject registerObj = JSONObject.fromObject(registerBean);
                String registerResponse = registerPortalService(registerBean.getServiceName(), url, registerObj, "");
            }
            logger.info("open-o portal register task succeeded.");
        } catch (Exception e){
            logger.error("open-o portal register task failed.");
            logger.error(e.getMessage());
        }
    }

    private static void getMsbHostInfo(Element rootNode) {
        Element msbHostNode = rootNode.element("msbHost");
        Iterator iter = msbHostNode.elementIterator();

        while (iter.hasNext()) {
            Element element = (Element) iter.next();
            msbHostMap.put(element.getName(), element.getText());
        }
    }

    private static void getRegisterList(Element rootNode) {
        Element registerListNode = rootNode.element("registerList");
        Iterator iRegisterList = registerListNode.elementIterator();

        while (iRegisterList.hasNext()) {
            HashMap<String, String> registerMap = new HashMap<String, String>();
            Element registerInfo = (Element) iRegisterList.next();
            Iterator iRegisterInfo = registerInfo.elementIterator();

            while (iRegisterInfo.hasNext()) {
                Element element = (Element) iRegisterInfo.next();
                registerMap.put(element.getName(), element.getText());
            }
            registerList.add(registerMap);
        }
    }

    private static String registerPortalService(String serviceName, String url, JSONObject json, String token) {
        DefaultHttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(url);
        String response = null;

        try {
            if (null != json) {
                StringEntity s = new StringEntity(json.toString());
                s.setContentEncoding("UTF-8");
                s.setContentType("application/json");
                post.setEntity(s);
            }
            if (!CommonUtil.isEmpty(token)) {
                post.addHeader("X-Auth-Token", token);
            }
            HttpResponse res = client.execute(post);
            if (res.getStatusLine().getStatusCode() == HttpStatus.SC_OK
                    || res.getStatusLine().getStatusCode() == HttpStatus.SC_CREATED) {
                String result = EntityUtils.toString(res.getEntity());
                if (!CommonUtil.isEmpty(result)) {
                    response = result;
                } else {
                    response = null;
                }
            }
            logger.info("register task [" + serviceName + "] completed successfully.");
        } catch (Exception e) {
            logger.error("register task [" + serviceName + "] failed because of errors.");
            logger.error(e.getMessage());
        }

        return response;
    }
}
