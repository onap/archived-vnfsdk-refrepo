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
package org.openo.portal.bean;

import java.util.List;

public class MsbRegisterBean {
    private String serviceName = "";

    private String lb_policy = "";

    private String url = "";

    private String protocol = "";

    private String visualRange = "";

    private List<ServiceNodeBean> nodes;

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getLb_policy() {
        return lb_policy;
    }

    public void setLb_policy(String lb_policy) {
        this.lb_policy = lb_policy;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getVisualRange() {
        return visualRange;
    }

    public void setVisualRange(String visualRange) {
        this.visualRange = visualRange;
    }

    public List<ServiceNodeBean> getNodes() {
        return nodes;
    }

    public void setNodes(List<ServiceNodeBean> nodes) {
        this.nodes = nodes;
    }
}
