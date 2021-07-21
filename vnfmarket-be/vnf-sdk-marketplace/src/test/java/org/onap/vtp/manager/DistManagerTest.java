/**
 * Copyright 2018 Huawei Technologies Co., Ltd.
 * Copyright 2020 Nokia.
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

package org.onap.vtp.manager;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyList;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

import java.util.Arrays;

import javax.ws.rs.client.Client;

import org.junit.Test;
import org.mockito.Mockito;
import org.onap.vtp.manager.model.Tester;
import org.powermock.reflect.Whitebox;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
public class DistManagerTest {

    @Test
    public void testPrivateMethodGetTester() throws Exception {

        DistManager testedClassSpy = spy(new DistManager());
        String values = "[{\"tester_id\":\"1\", \"end-time\":\"end-time\", "
                + "\"iP\":\"localhost\", \"port\":\"55130\"," + "\"id\":\"1\", \"command\":\"command\", "
                + "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}]";
        JsonParser jsonParser = new JsonParser();
        JsonElement element = jsonParser.parse(values);


        String values2 = "{\"tester_id\":\"1\", \"end-time\":\"end-time\", "
                + "\"iP\":\"localhost\", \"port\":\"55130\"," + "\"id\":\"1\", \"command\":\"command\", "
                + "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}";
        JsonParser jsonParser1 = new JsonParser();
        JsonElement element1 = jsonParser1.parse(values2);

        Mockito.doReturn(element1).when(testedClassSpy).getResponseFromTester(any(Client.class),
                anyString(), anyString());

        Tester actual = Whitebox.invokeMethod(testedClassSpy, "getTester", element);
        assertEquals("1", actual.getId());
        assertEquals("localhost", actual.getIp());
        assertEquals(55130, actual.getPort());
        assertEquals("1", actual.getTesterId());


    }

    @Test(expected=Exception.class)
    public void testPrivateMethodGetTester_Exception() throws Exception {

        DistManager testedClassSpy = spy(new DistManager());
        String values = "[{\"tester_id\":\"1\", \"end-time\":\"end-time\", "
                + "\"iP\":\"localhost\", \"port\":\"55130\"," + "\"id\":\"1\", \"command\":\"command\", "
                + "\"profile\":\"profile\", \"status\":\"status\", \"execution-id\":\"123456\"}]";
        JsonParser jsonParser = new JsonParser();
        JsonElement element = jsonParser.parse(values);


     Whitebox.invokeMethod(testedClassSpy, "getTester", element);



    }

    @Test(expected=Error.class)
    public void testVoidMethodPostDataToManager_Exception() throws Exception {

        DistManager distManager = mock(DistManager.class);
           doCallRealMethod().when(distManager).postDataToManager(any(String.class), any(String.class) , any(String.class));
           distManager.postDataToManager("1234","345","675");



    }


}
