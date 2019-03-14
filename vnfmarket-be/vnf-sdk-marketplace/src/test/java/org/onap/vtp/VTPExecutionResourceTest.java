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

import com.fasterxml.jackson.core.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.onap.vtp.execution.VTPExecutionResource;
import org.onap.vtp.execution.model.VTPTestExecution;
import org.open.infc.grpc.Result;

import java.io.IOException;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class VTPExecutionResourceTest {

    @Mock
    FormDataBodyPart formDataBodyPart;
    @Mock
    ContentDisposition contentDisposition;
    String requestId;
    VTPExecutionResource vtpExecutionResource;
    @Before
    public void setUp() throws Exception {
        vtpExecutionResource= new VTPExecutionResource();
        requestId = UUID.randomUUID().toString();
    }
    @Test(expected = Exception.class)
    public void testExecuteHandler() throws Exception
    {
        VTPTestExecution.VTPTestExecutionList executions= new VTPTestExecution.VTPTestExecutionList();
        List<VTPTestExecution> list= new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();
        String jsonString = "{\"name\":\"Mahesh Kumar\", \"age\":\"nine\",\"verified\":\"false\"}";
        JsonNode rootNode = mapper.readTree(jsonString);

        VTPTestExecution vtp=new VTPTestExecution();
        vtp.setEndTime("2019-03-12T11:49:52.845");
        vtp.setProfile("open-cli-schema");
        vtp.setStatus("pass");
        vtp.setRequestId(requestId);
        vtp.setExecutionId("executionid");
        vtp.setParameters(rootNode);
        vtp.setResults(rootNode);
        vtp.setScenario("VTP Scenario 1");
        vtp.setStartTime("2019-04-12T11:49:52.845");
        vtp.setTestCaseName("s1.ts1.testcase-1");
        vtp.setTestSuiteName("testsuite-1");
        list.add(vtp);
        executions.setExecutions(list);
        System.out.println(executions.getExecutions());
        assertNotNull(executions.getExecutions());
       vtpExecutionResource.executeHandler(executions,null);
       //vtpExecutionResource.executeHandler(executions,requestId);
        //for handler
    }
    @Test(expected = Exception.class)
    public void testListTestExecutionsHandler() throws Exception
    {
        vtpExecutionResource.listTestExecutionsHandler(requestId,"VTP Scenario 1","testsuite-1","s1.ts1.testcase-1","open-cli-schema","2019-03-12T11:49:52.845","2020-03-12T11:49:52.845");
    }
//
//    @Test
//    public void testListTestExecutionsHandler1() throws Exception
//    {   VTPExecutionResource vtpExecutionResource1=mock(VTPExecutionResource.class);
//        List<String> list= new ArrayList<>();
//         list.add("abc");
//       Result result= Result.getDefaultInstance();
//
//    when(vtpExecutionResource1.makeRpc(list)).thenReturn(result);
//     verify(vtpExecutionResource1).makeRpc(list);
//
//    }

    @Test(expected = Exception.class)
    public void testListTestExecutions() throws Exception
    {
        vtpExecutionResource.listTestExecutions(requestId,"abc","abc","abc","abc","123","123");
    }
    @Test(expected = Exception.class)
    public void testGetTestExecution() throws Exception
    {
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        assertNotNull(vtpExecutionResource.getTestExecution("1234"));
    }
    @Test(expected = Exception.class)
    public void testGetTestExecutionHandler() throws Exception
    {
        //assertNotNull(vtpExecutionResource.getTestExecution("abc"));
        assertNotNull(vtpExecutionResource.getTestExecutionHandler("1234"));
    }

    @Test(expected = NullPointerException.class)
    public void testExecuteTestcases() throws Exception
    {

        List<FormDataBodyPart> bodyParts= new ArrayList<>();
        formDataBodyPart.setName("abc");
        formDataBodyPart.setValue("123");
        formDataBodyPart.setContentDisposition(contentDisposition);
        formDataBodyPart.getContentDisposition().getFileName();
        bodyParts.add(formDataBodyPart);
      vtpExecutionResource.executeTestcases(requestId,bodyParts,"exeJson") ;
    }
}