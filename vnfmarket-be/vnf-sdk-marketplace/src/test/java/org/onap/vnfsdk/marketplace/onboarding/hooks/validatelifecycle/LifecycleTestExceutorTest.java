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
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.rest.RestConstant;
import org.onap.vnfsdk.marketplace.rest.RestResponse;
import org.onap.vnfsdk.marketplace.rest.RestfulClient;

import java.io.File;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class LifecycleTestExceutorTest {
   private LifecycleTestExceutor lifecycleTestExceutor;
    private OnBoradingRequest onBoradingRequest;
    LifeCycleTestReq lifeCycleTestReq;
    @Before
    public void setUp()
    {
       // lifecycleTestExceutor = new LifecycleTestExceutor();
        onBoradingRequest  = mock(OnBoradingRequest.class);
        lifeCycleTestReq = mock(LifeCycleTestReq.class);
    }

    @Test
    public void testupLoadPackageToCatalouge()
    {
       // LifecycleTestExceutor.uploadPackageToCatalouge(onBoradingRequest);
    }
    @Test
    public void testExeclifecycleTest()
    {
        LifecycleTestExceutor.execlifecycleTest(onBoradingRequest,lifeCycleTestReq);

    }

    @Test
    public void testgetCsarIdValueForUnknownFields() {
        OnBoradingRequest onBoradingRequest = new OnBoradingRequest();
        onBoradingRequest
                .setPackagePath(
                        "/home/ubuntu/refrepo/vnfmarket-be/deployment/zip/src/main/release/etc/conf");
        onBoradingRequest.setPackageName("restclient.json");
        new MockUp<FileUtil>() {
            @Mock
            public boolean validatePath(String path) {
                return true;
            }
        };
        new MockUp<MsbDetailsHolder>() {

            @Mock
            public synchronized MsbDetails getMsbDetails() {
                onBoradingRequest.setPackagePath(
                        "vnfmarket-be/deployment/zip/src/main/release/etc/conf");
                onBoradingRequest.setPackageName("restclient.json");
                String restClientPath = System.getProperty("user.dir");
                MsbDetails msbDetails =
                        (MsbDetails) FileUtil
                                .readJsonDatafFromFile(restClientPath.substring(0, restClientPath.lastIndexOf("/") + 1) + File.separator + "/deployment/zip/src/main/release/etc/conf/restclient.json"
                                        , MsbDetails.class);
                return msbDetails;

            }
        };
        new MockUp<RestfulClient>() {
            @Mock
            public RestResponse post(String ip, int port, String url, HttpEntity requestBody) {
                RestResponse rsp = new RestResponse();
                rsp.setStatusCode(RestConstant.RESPONSE_CODE_200);
                String result = "{\"csarId\":\"123\",\"testField\":\"Unknown\"}";
                rsp.setResult(result);
                return rsp;
            }
        };
        String actual = LifecycleTestExceutor.uploadPackageToCatalouge(onBoradingRequest);
        assertEquals("123",actual);
    }

}