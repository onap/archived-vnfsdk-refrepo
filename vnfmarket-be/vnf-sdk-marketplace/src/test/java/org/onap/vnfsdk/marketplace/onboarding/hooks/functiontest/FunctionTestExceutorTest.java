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
package org.onap.vnfsdk.marketplace.onboarding.hooks.functiontest;

import mockit.Mock;
import mockit.MockUp;
import org.junit.Before;
import org.junit.Test;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.msb.MsbDetails;
import org.onap.vnfsdk.marketplace.msb.MsbDetailsHolder;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

public class FunctionTestExceutorTest {
    FunctionTestExceutor functionTestExceutor;
    OnBoradingRequest onBoradingRequest;
    MsbDetails msbDetails;

    @Before
    public void setUp() throws Exception {
        onBoradingRequest = mock(OnBoradingRequest.class);
        msbDetails = mock(MsbDetails.class);
    }

    @Test
    public void testExecFunctionTest() {
        new MockUp<FileUtil>() {
            @Mock
            public boolean validatePath(String path) {
                return true;
            }
        };
        FunctionTestExceutor.execFunctionTest(onBoradingRequest);

    }

    @Test
    public void testExecFunctionTest2() {
        new MockUp<MsbDetailsHolder>() {
            @Mock
            public MsbDetails getMsbDetails() {
                return msbDetails;
            }
        };
        FunctionTestExceutor.execFunctionTest(onBoradingRequest);

    }

}