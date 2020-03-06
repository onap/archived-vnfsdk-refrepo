/**
 * Copyright 2018 Huawei Technologies Co., Ltd.
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
package org.onap.vnfsdk.marketplace.onboarding.hooks.validatelifecycle;

import mockit.Mock;
import mockit.MockUp;
import org.apache.http.HttpEntity;
import org.junit.Before;
import org.junit.Test;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.msb.MsbDetails;
import org.onap.vnfsdk.marketplace.msb.MsbDetailsHolder;
import org.onap.vnfsdk.marketplace.msb.MsbServer;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.rest.RestResponse;
import org.onap.vnfsdk.marketplace.rest.RestfulClient;

import static org.mockito.Mockito.mock;

public class LifecycleTestExceutorTest {
   private LifecycleTestExceutor lifecycleTestExceutor;
    private OnBoradingRequest onBoradingRequest;
    LifeCycleTestReq lifeCycleTestReq;
    @Before
    public void setUp()
    {
       // lifecycleTestExceutor = new LifecycleTestExceutor();
        lifeCycleTestReq = mock(LifeCycleTestReq.class);
    }

    @Test
    public void testupLoadPackageToCatalougeForGson()
    {
        new MockUp<FileUtil>(){
            @Mock
            public boolean validatePath(String path) {
                return true;
            }
        };
        new MockUp<LifecycleTestExceutor>(){
            @Mock
            private boolean checkValidResponse(RestResponse rsp) {
                return true;
            }
        };
        new MockUp<RestResponse>(){
            @Mock
            public String getResult() {
                return "{\"csarId\":\"huawei\"}";
            }
        };
        new MockUp<MsbDetails>(){
            @Mock
            public MsbServer getDefaultServer() {
                MsbServer msbServer = new MsbServer();
                msbServer.setHost("0.0.0.0");
                msbServer.setPort("5005");
                return msbServer;
            }
        };
        new MockUp<RestfulClient>(){
            @Mock
            public RestResponse post(String ip, int port, String url, HttpEntity requestBody) {
                RestResponse rsp = new RestResponse();
                rsp.setStatusCode(200);
                rsp.setResult("OK");
                return rsp;
            }
        };
        new MockUp<MsbServer>(){
            @Mock
            public String getHost() {
                return "0.0.0.0";
            }
            @Mock
            public String getPort() {
                return "5005";
            }
        };
        new MockUp<MsbDetailsHolder>(){
            @Mock
            public synchronized MsbDetails getMsbDetails(){
                MsbDetails msbDetails = new MsbDetails();
                return msbDetails;
            }
        };
        onBoradingRequest = new OnBoradingRequest();
        onBoradingRequest.setCsarId("huawei");
        onBoradingRequest.setPackagePath("");
        onBoradingRequest.setPackageName("huawei");
        onBoradingRequest.setCsarIdCatalouge("catalog");
        LifecycleTestExceutor.uploadPackageToCatalouge(onBoradingRequest);
    }
    public void testExeclifecycleTest()
    {
        LifecycleTestExceutor.execlifecycleTest(onBoradingRequest,lifeCycleTestReq);

    }


}
