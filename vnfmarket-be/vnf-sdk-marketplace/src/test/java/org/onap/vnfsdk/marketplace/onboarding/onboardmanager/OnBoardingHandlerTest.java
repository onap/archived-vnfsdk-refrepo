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


package org.onap.vnfsdk.marketplace.onboarding.onboardmanager;

import org.junit.Before;
import org.junit.Test;
import org.onap.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.onap.vnfsdk.marketplace.onboarding.hooks.validatelifecycle.LifecycleTestHook;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class OnBoardingHandlerTest {
    private OnBoradingRequest onBoardingReq;
    private OnBoardingHandler onboardinghandler;

    @Before
    public void setUp() {
        onBoardingReq = mock(OnBoradingRequest.class);
        onboardinghandler = new OnBoardingHandler();
    }
    @Test
    public void testhandleOnBoardingReq() {
        onboardinghandler.handleOnBoardingReq(null);
        onboardinghandler.handleOnBoardingReq(onBoardingReq);
        when(onBoardingReq.getPackageName()).thenReturn("abc");
        when(onBoardingReq.getPackagePath()).thenReturn("com.java.snippets.core");
        onboardinghandler.handleOnBoardingReq(onBoardingReq);
        when(onBoardingReq.getCsarId()).thenReturn("com.java.snippets.core");
        /*onboardinghandler.handleOnBoardingReq(onBoardingReq);
        LifecycleTestHook lifecycleTestHook = mock(LifecycleTestHook.class);
        when(lifecycleTestHook.exec(onBoardingReq)).thenReturn(200);
        assertEquals(lifecycleTestHook.exec(onBoardingReq),200);*/
    }

}