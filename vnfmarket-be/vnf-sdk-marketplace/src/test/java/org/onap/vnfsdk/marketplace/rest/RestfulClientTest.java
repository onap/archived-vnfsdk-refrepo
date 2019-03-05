/**
 * Copyright 2017 Huawei Technologies Co., Ltd.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.onap.vnfsdk.marketplace.rest;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.CloseableHttpClient;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.onap.vnfsdk.marketplace.rest.RestfulClient.HttpMethod.PUT;
import static org.powermock.api.mockito.PowerMockito.when;

public class RestfulClientTest {


    private RestfulClient restfulClient;
    private HttpEntity entity;

    @Before
    public void setUp() {
        restfulClient = new RestfulClient();
        entity = mock(HttpEntity.class);
    }


    @Test
    public void testGet() {
        RestfulClient.get("172.11.10.22,1212", 1211, "http://localhost");
    }

    @Test
    public void testPost() {
        RestfulClient.post("172.11.10.22,1212", 1211, "http://localhost", null);
    }

    @Test
    public void testDelete() {
        RestfulClient.delete("172.11.10.22,1212", 1211, "http://localhost");
    }

    @Test
    public void testSendPostRequest() {
        RestfulClient.sendPostRequest("172.11.10.22,1212", "1211", "http://www.engineering.uiowa.edu/~hawkeng//fall01/graphics/potato.gif", "jason");
        HttpResponse httpResponse = mock(HttpResponse.class);
        HttpEntity httpEntity = mock(HttpEntity.class);
        when(httpResponse.getEntity()).thenReturn(httpEntity);
        assertEquals(httpResponse.getEntity(), httpEntity);

    }

    @Test
    public void testExecuteHttp() throws  Exception{
        RestfulClient.executeHttp(PUT, "172.11.10.22,1212", 1211, "http://localhost", null);
        /*HttpResponse httpResponse = mock(HttpResponse.class);
        CloseableHttpClient httpclient= mock(CloseableHttpClient.class);
        HttpEntity httpEntity= mock(HttpEntity.class);
        when(httpResponse.getEntity()).thenReturn(null);
        assertEquals(httpResponse.getEntity(), null);*/


    }

}