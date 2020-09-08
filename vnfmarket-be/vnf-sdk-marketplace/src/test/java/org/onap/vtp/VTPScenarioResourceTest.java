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

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.apache.commons.io.FileUtils;
import org.glassfish.jersey.media.multipart.BodyPartEntity;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.file.FileDataBodyPart;
import org.glassfish.jersey.message.internal.HttpHeaderReader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.jvnet.mimepull.MIMEMessage;
import org.jvnet.mimepull.MIMEPart;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.onap.vtp.error.VTPError;
import org.onap.vtp.execution.VTPExecutionResource;
import org.onap.vtp.scenario.VTPScenarioResource;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import javax.ws.rs.core.MediaType;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

//@RunWith(MockitoJUnitRunner.class)
public class VTPScenarioResourceTest {

    VTPScenarioResource vtpScenarioResource;

    @Before
    public void setUp() throws Exception {

        MockitoAnnotations.initMocks(this);
        vtpScenarioResource=new VTPScenarioResource();
        //vtpScenarioResource2= Mockito.spy(new VTPScenarioResource());

    }
    @Test(expected = Exception.class)
    public void testListTestScenariosHandler() throws Exception{
        vtpScenarioResource.listTestScenariosHandler();
    }
    @Test(expected = Exception.class)
    public void testListTestSutiesHandler() throws Exception{
        VTPScenarioResource vtpScenarioResource2=mock(VTPScenarioResource.class);
        List<String> args = new ArrayList<>();
        args.add("abc");
        JsonParser jsonParser = new JsonParser();
        JsonElement actualObj = jsonParser.parse("{\"k1\":\"v1\"}");
        vtpScenarioResource.listTestSutiesHandler("abc");
      // when(vtpScenarioResource2.makeRpcAndGetJson(args)).thenReturn(actualObj);
        //vtpScenarioResource.listTestSutiesHandler("VTP Scenario 1");

       // doReturn(actualObj).when((VTPResource)vtpScenarioResource2).makeRpcAndGetJson(args);
      //  vtpScenarioResource2.makeRpc(args);
       //verify(vtpScenarioResource2).makeRpcAndGetJson(args);

    }
    @Test(expected = Exception.class)
    public void testListTestcasesHandler() throws Exception
    {
        vtpScenarioResource.listTestcasesHandler("testsuite","open-cli");
    }
    @Test(expected = Exception.class)
    public void testListTestcases() throws Exception
    {
        vtpScenarioResource.listTestcases("open-cli","testsuite");
    }
    @Test(expected = Exception.class)
    public void testGetTestcase() throws Exception
    {
        vtpScenarioResource.getTestcase("open-cli","testsuit","testcase");
    }
    @Test(expected = Exception.class)
    public void testGetTestcaseHandler() throws Exception
    {
        vtpScenarioResource.getTestcaseHandler("open-cli","testsuit","testcase");
    }

    @Test(expected = Exception.class)
    public void testStorageScenarios() throws Exception
    {
        List<FormDataBodyPart> bodyParts = new ArrayList<>();
        FormDataContentDisposition fileDetail = FormDataContentDisposition.name("fileName").fileName("demo-registry.yaml").build();
        FormDataBodyPart bodyPart = new FormDataBodyPart(fileDetail, new BodyPartEntity(null), MediaType.APPLICATION_OCTET_STREAM_TYPE);
        bodyParts.add(bodyPart);
        vtpScenarioResource.storageScenarios(bodyParts);
    }

    @Test
    public void testDeleteScenario() throws Exception
    {
        vtpScenarioResource.deleteScenario("demo-registry.yaml");
    }

    @Test(expected = Exception.class)
    public void testStorageTestcases_yaml() throws Exception
    {
        List<FormDataBodyPart> bodyParts = new ArrayList<>();
        FormDataContentDisposition fileDetail = FormDataContentDisposition.name("fileName").fileName("demo.yaml").build();
        FormDataBodyPart bodyPart = new FormDataBodyPart(fileDetail, new BodyPartEntity(null), MediaType.APPLICATION_OCTET_STREAM_TYPE);
        bodyParts.add(bodyPart);
        vtpScenarioResource.storageTestcases(bodyParts);
    }

    @Test(expected = Exception.class)
    public void testStorageTestcases_script() throws Exception
    {
        List<FormDataBodyPart> bodyParts = new ArrayList<>();
        FormDataContentDisposition fileDetail = FormDataContentDisposition.name("fileName").fileName("demo.py").build();
        FormDataBodyPart bodyPart = new FormDataBodyPart(fileDetail, new BodyPartEntity(null), MediaType.APPLICATION_OCTET_STREAM_TYPE);
        bodyParts.add(bodyPart);
        vtpScenarioResource.storageTestcases(bodyParts);
    }
}