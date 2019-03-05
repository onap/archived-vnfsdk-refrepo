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

import org.junit.Before;
import org.junit.Test;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;

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


}