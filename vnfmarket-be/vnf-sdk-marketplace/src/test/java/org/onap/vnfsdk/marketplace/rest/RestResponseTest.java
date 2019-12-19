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

import com.google.gson.Gson;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.*;

public class RestResponseTest {

    private RestResponse restResponse;
    private Gson gson = null;

    @Before
    public void setUp() {
        restResponse = new RestResponse();
        gson = new Gson();
    }

    @Test
    public void testSetterGetter() {
        restResponse.setResult("huawei");
        assertEquals(restResponse.getResult(), "huawei");
        restResponse.setStatusCode(200);
        assertThat(restResponse.getStatusCode(), is(200));
    }

    @Test
    public void testRestResponseForUnknownFields() {
        String jsonValue = "{\"statusCode\":\"200\",\"testField\":\"Unknown\"}";
        RestResponse restResponse = gson.fromJson(jsonValue, RestResponse.class);
        assertEquals(200, restResponse.getStatusCode().intValue());

    }
}