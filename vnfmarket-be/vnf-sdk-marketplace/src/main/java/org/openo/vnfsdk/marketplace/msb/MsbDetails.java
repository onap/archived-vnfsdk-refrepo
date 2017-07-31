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

public class MsbDetails 
{
    private MsbServer defaultServer;
    private String ConnectTimeout;
    private String thread;
    private String idletimeout;
    private String timeout;
    
    public MsbServer getDefaultServer() {
        return defaultServer;
    }
    public void setDefaultServer(MsbServer defaultServer) {
        this.defaultServer = defaultServer;
    }
    public String getConnectTimeout() {
        return ConnectTimeout;
    }
    public void setConnectTimeout(String connectTimeout) {
        ConnectTimeout = connectTimeout;
    }
    public String getThread() {
        return thread;
    }
    public void setThread(String thread) {
        this.thread = thread;
    }
    public String getIdletimeout() {
        return idletimeout;
    }
    public void setIdletimeout(String idletimeout) {
        this.idletimeout = idletimeout;
    }
    public String getTimeout() {
        return timeout;
    }
    public void setTimeout(String timeout) {
        this.timeout = timeout;
    }

}
