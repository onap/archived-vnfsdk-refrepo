/**
 * Copyright 2020 Huawei Technologies Co., Ltd.
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

package org.onap.vtp.profile;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import mockit.Expectations;
import mockit.Mock;
import mockit.MockUp;
import mockit.Mocked;
import org.junit.Before;
import org.junit.Test;
import org.onap.vtp.VTPResource;
import org.onap.vtp.error.VTPError;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import org.eclipse.jetty.http.HttpStatus;

import static org.junit.Assert.assertEquals;


public class VTPProfileResourceTest {

    VTPProfileResource vtpProfileResource;
    @Before
    public void setUp() {
        vtpProfileResource=new VTPProfileResource();
    }

    private void mockVTPResource(String jsonValue){
        new MockUp<VTPResource>() {
            @Mock
            protected JsonElement makeRpcAndGetJson(List<String> args, int timeout) throws VTPError.VTPException, IOException {
                JsonElement jsonNode = new JsonParser().parse(jsonValue);
                return jsonNode;
            }
        };
    }

    private void mockGetInputStream(HttpServletRequest request) throws IOException {
        new Expectations(){{
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                    ("{\"name\":\"https\",\"properties\":[{\"testCaseName\":\"weather-report\"," +
                            " \"testSuiteName\":\"tutorial\", \"scenario\":\"learning\"," +
                            " \"inputParameterName\":\"zipcod\",\"value\":\"412\"}]}").getBytes());
            request.getInputStream();
            result =  new ServletInputStream(){
                public int read() throws IOException {
                    return byteArrayInputStream.read();
                }
                @Override
                public boolean isFinished() {
                    return true;
                }
                @Override
                public boolean isReady() {
                    return true;
                }
                @Override
                public void setReadListener(ReadListener arg0) {
                }
            };
        }};
    }

    @Test
    public void testListTestProfiles() throws IOException, VTPError.VTPException {
        String jsonValue = "[{\"profile\":\"https\"}]";
        mockVTPResource(jsonValue);
        assertEquals(HttpStatus.OK_200,vtpProfileResource.listTestProfiles().getStatus());
    }

    @Test
    public void testGetTestProfile() throws IOException, VTPError.VTPException {
        String jsonValue = "[{\"profile\":\"https\",\"parameter\":\"tutorial\"," +
                "\"value\":\"value\",\"service\":\"service\",\"command\":\"command\"" +
                ",\"product\":\"product\"}]";
        mockVTPResource(jsonValue);
        assertEquals(HttpStatus.OK_200,vtpProfileResource.getTestProfile("https").getStatus());
    }

    @Test
    public void testCreateProfile(@Mocked HttpServletRequest request) throws IOException, VTPError.VTPException {
        mockGetInputStream(request);
        mockVTPResource("[]");
        Response response= vtpProfileResource.createProfile(request);
        assertEquals(HttpStatus.OK_200,response.getStatus());
    }

    @Test(expected = VTPError.VTPException.class)
    public void testCreateProfile2(@Mocked HttpServletRequest request) throws IOException, VTPError.VTPException {
        String jsonValue = "[{\"profile\":\"https\"}]";
        mockGetInputStream(request);
        mockVTPResource(jsonValue);
        vtpProfileResource.createProfile(request);
    }

}