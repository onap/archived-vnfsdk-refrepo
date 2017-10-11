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

package org.onap.vnfsdk.marketplace.filemanage;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;

import org.junit.Before;
import org.junit.Test;
import org.onap.vnfsdk.marketplace.filemanage.http.ToolUtil;

import mockit.Mock;
import mockit.MockUp;

public class FileManageTest {

    @Test
    public void testCreateFileManager() {
        new MockUp<FileManagerFactory>() {
            @Mock
            private FileManagerType getType()  {
                return FileManagerType.ftp;
            }
        };
        FileManager manager = FileManagerFactory.createFileManager();

        assertNull(manager);
    }

    @Test
    public void testFileManagerFactoryConstructor() {
        try {
            Constructor<FileManagerFactory> constructor = FileManagerFactory.class.getDeclaredConstructor();
            assertTrue(Modifier.isPrivate(constructor.getModifiers()));
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    @Before
    public void createTestFile()
    {
        String srcPath = "./srcPathForTest";
        String dstPath = "./dstPathForTest";
        File src = new File(srcPath);
        File dst = new File(dstPath);
        src.mkdir();
        dst.mkdir();
    }

    @Test
    public void testDelete() throws IOException {
        new MockUp<FileManagerFactory>() {
            @Mock
            private FileManagerType getType()  {
                return FileManagerType.http;
            }
        };

        FileManager ManagerImpl = FileManagerFactory.createFileManager();
        String srcPath = "./srcPathForTest";
        new MockUp<ToolUtil>() {
            @Mock
            private String getHttpServerAbsolutePath() {
                return null;
            }
        };
        new MockUp<ToolUtil>() {
            @Mock
            private boolean deleteDir(File dir) {
                return true;
            }
        };

        assertEquals(ManagerImpl.delete(srcPath), true);
    }

    @Test
    public void testUpload() throws IOException {
        new MockUp<FileManagerFactory>() {
            @Mock
            private FileManagerType getType()  {
                return FileManagerType.http;
            }
        };

        FileManager ManagerImpl = FileManagerFactory.createFileManager();
        String srcPath = "./srcPathForTest";
        String dstPath = "./dstPathForTest";
        new MockUp<ToolUtil>() {
            @Mock
            private String getHttpServerAbsolutePath() {
                return null;
            }
        };
        new MockUp<ToolUtil>() {
            @Mock
            private boolean copyDirectory(String srcDirName, String destDirName, boolean overlay) {
                return true;
            }
        };
        assertEquals(ManagerImpl.upload(srcPath, dstPath), true);

        File src = new File(srcPath);
        if (src.exists())
        {
            src.delete();
        }

        assertEquals(ManagerImpl.upload(srcPath, dstPath), false);
    }

}
