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

package org.onap.vnfsdk.marketplace.resource;

import static org.junit.Assert.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Response;

import org.junit.Before;
import org.junit.Test;
import org.open.infc.grpc.Result;
import org.open.infc.grpc.client.OpenRemoteCli;

import mockit.Mock;
import mockit.MockUp;

public class VTPResourceTest {
    private VTPResource vtpResource = null;


    @Before
    public void setUp() {
        vtpResource = new VTPResource();
    }
    @Test
    public void testVtpGetTests() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(String[] args) {
                Result result = Result.newBuilder().
                        setExitCode(0).
                        setOutput("{}").
                        build();

                return result;
            }
        };

        Response result = vtpResource.listTests();
        assertEquals(200, result.getStatus());
    }

    @Test
    public void testVtpGetTestsFailure1() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(String[] args) {
                Result result = Result.newBuilder().
                        setExitCode(1).
                        build();

                return result;
            }
        };

        Response result = vtpResource.listTests();
        assertEquals(500, result.getStatus());
    }
    
    @Test
    public void testVtpGetTestsFailure2() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(String[] args) throws Exception {
                throw new Exception();
            }
        };

        Response result = vtpResource.listTests();
        assertEquals(500, result.getStatus());
    }
    
    @Test
    public void testVtpRunTests() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(String[] args) {
                Result result = Result.newBuilder().
                        setExitCode(0).
                        setOutput("{}").
                        build();

                return result;
            }
        };

        MockUp mockReq = new MockUp<HttpServletRequest>() {

            @Mock
            public ServletInputStream getInputStream() throws IOException {
                  ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                          "{\"csar\"=\"VoLTE.csar\"}".getBytes());

                  return new ServletInputStream(){
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
                }

        };

        Response result = vtpResource.runTest("csar-validate", (HttpServletRequest) mockReq.getMockInstance());
        assertEquals(200, result.getStatus());
    }
    
    @Test
    public void testVtpRunTestsFailure1() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(String[] args) {
                Result result = Result.newBuilder().
                        setExitCode(1).
                        build();

                return result;
            }
        };

        MockUp mockReq = new MockUp<HttpServletRequest>() {

            @Mock
            public ServletInputStream getInputStream() throws IOException {
                  ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                          "{\"csar\"=\"VoLTE.csar\"}".getBytes());

                  return new ServletInputStream(){
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
                }

        };

        Response result = vtpResource.runTest("csar-validate", (HttpServletRequest) mockReq.getMockInstance());
        assertEquals(500, result.getStatus());
    }
    
    @Test
    public void testVtpRunTestsFailure2() throws Exception {
        new MockUp<OpenRemoteCli>() {

            @Mock
            public Result run(String[] args) throws Exception {
                throw new Exception();
            }
        };

        MockUp mockReq = new MockUp<HttpServletRequest>() {

            @Mock
            public ServletInputStream getInputStream() throws IOException {
                  ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                          "{\"csar\"=\"VoLTE.csar\"}".getBytes());

                  return new ServletInputStream(){
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
                }

        };

        Response result = vtpResource.runTest("csar-validate", (HttpServletRequest) mockReq.getMockInstance());
        assertEquals(500, result.getStatus());
    }
}
