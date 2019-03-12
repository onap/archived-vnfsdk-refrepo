/**
 * Copyright 2019 Huawei Technologies Co., Ltd.
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
package org.onap.vtp;

import org.junit.Test;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

public class VTPResourceTest {
    @Test(expected = Exception.class)
    public void testGetStorePath() throws  Exception
    {
        VTPResource vtpResource= new VTPResource();
        String requestId = UUID.randomUUID().toString();
        List<String> args= new ArrayList<>();
        args.add("open-cli");
        args.add("abc");
        args.add("abc");
        args.add(requestId);
        vtpResource.makeRpc(args);
    }

}