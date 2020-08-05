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
package org.onap.vnfsdk.marketplace.filemanage.http;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import org.onap.vnfsdk.marketplace.common.HttpServerPathConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ToolUtil {
  private static final Logger LOGGER = LoggerFactory.getLogger(ToolUtil.class);

  private ToolUtil() {
  }

  /**
   * simple copy directory
   * @param srcDirName source directory name
   * @param destDirName destination directory name
   * @param files file list in directory
   * @param overlay overwrite or not
   * @return boolean
   * @throws IOException e
   */
  public static boolean simpleCopyDirectory(String srcDirName, String destDirName)
      throws IOException
  {
    File srcDir = new File(srcDirName);
    File[] files = srcDir.listFiles();
    for (int i = 0; i < files.length; i++) {
        boolean flag = false;
        if (files[i].isFile()) {
          flag = copyFile(files[i].getAbsolutePath(), destDirName + files[i].getName(), true);
        }
        if (files[i].isDirectory()) {
          flag = simpleCopyDirectory(files[i].getAbsolutePath(), destDirName + files[i].getName());
        }
        if (!flag) {
          String message = "Copy catagory " + srcDirName + " to " + destDirName + " failed!";
          LOGGER.error(message);
          return false;
        }
     }
     return true;
  }

  /**
   * create destDir
   * @param destDirName destination directory name
   * @param overlay overwrite or not
   * @return boolean
   */
  public static boolean createDestDir(String destDirName, boolean overlay)
  {
    File destDir = new File(destDirName);
    if (destDir.exists() && overlay) {
      String fileAbsPath = destDir.getAbsolutePath();
      try {
        Files.delete(Paths.get(destDirName));
      } catch (IOException e) {
        LOGGER.error("fail to delete {} {} " , fileAbsPath, e);
      }
    } else if (destDir.exists() && !overlay) {
        return false;
    }

    return destDir.mkdirs();
  }

  /**
   * copy from directory.
   * @param srcDirName source directory name
   * @param destDirName destination directory name
   * @param overlay overwrite or not
   * @return boolean
   * @throws IOException e
   */
  public static boolean copyDirectory(String srcDirName, String destDirName, boolean overlay)
      throws IOException {
    File srcDir = new File(srcDirName);
    if (!srcDir.exists() || !srcDir.isDirectory()) {
      return false;
    }

    String fullDestDirName = destDirName;
    if (!fullDestDirName.endsWith(File.separator)) {
      fullDestDirName += File.separator;
    }

    if (!createDestDir(fullDestDirName, overlay))
    {
      return false;
    }

    return simpleCopyDirectory(srcDirName, fullDestDirName);
  }

  /**
   * copy byte.
   * @param srcFileName source file name
   * @param destFileName target file name
   * @return boolean
   */
  public static boolean copyByte(File srcFile,  File destFile)
  {
    try (
          InputStream in = new FileInputStream(srcFile);
          OutputStream out = new FileOutputStream(destFile);
      ) {

      byte[] buffer = new byte[1024];

      for (int byteread = 0; (byteread = in.read(buffer)) != -1;) {
        out.write(buffer, 0, byteread);
      }

      return true;
    } catch (IOException e) {
      LOGGER.error("IOException in copyFile", e);
      return false;
    }
  }

  /**
   * copy file.
   * @param srcFileName source file name
   * @param destFileName target file name
   * @param overlay overwrite or not
   * @return boolean
   */
  public static boolean copyFile(String srcFileName, String destFileName, boolean overlay) {
    File srcFile = new File(srcFileName);

    if (!srcFile.exists() || !srcFile.isFile()) {
      String message = "Source file : " + srcFileName + " not exist !";
      LOGGER.error(message);
      return false;
    }

    File destFile = new File(destFileName);
    if (destFile.exists() && overlay) {
      String fileAbsPath = destFile.getAbsolutePath();
      try {
        Files.delete(Paths.get(destFileName));
      } catch (IOException e) {
        LOGGER.error("fail to delete {} {} ", fileAbsPath, e);
      }
    } else if (!destFile.exists() && !destFile.getParentFile().exists() && !destFile.getParentFile().mkdirs()) {
        return false;
    }

    return copyByte(srcFile,  destFile);
  }

  /**
   * create directory.
   * @param destDirName target directory name
   * @return boolean
   */
  public static boolean createDir(String destDirName) {
    String useDestDirName = destDirName;
    if (!useDestDirName.endsWith(File.separator)) {
      useDestDirName += File.separator;
    }
    File dir = new File(useDestDirName);
    if (dir.exists()) {
      String fileAbsPath = dir.getAbsolutePath();
      try {
        Files.delete(Paths.get(useDestDirName));
      } catch (IOException e) {
        LOGGER.error("fail to delete {} {} ", fileAbsPath, e);
      }
    }

    return dir.mkdirs();
  }

  public static String getHttpServerAbsolutePath() {
    return Thread.currentThread().getContextClassLoader().getResource("/").getPath() +  HttpServerPathConfig.getHttpServerPath();
  }

  /**
   * delete directory.
   * @param dir file to delete
   * @return boolean
   */
  public static boolean deleteDir(File dir) {
    if (dir.isDirectory()) {
      String[] children = dir.list();
      for (int i = 0; i < children.length; i++) {
        boolean success = deleteDir(new File(dir, children[i]));
        if (!success) {
          return false;
        }
      }
    }
    boolean isFileDeleted=false;
    String fileAbsPath = dir.getAbsolutePath();
    try {
      Files.delete(Paths.get(dir.getPath()));
      isFileDeleted=true;
    } catch (IOException e) {
      LOGGER.error("fail to delete {} {} ", fileAbsPath, e);
    }
    return isFileDeleted;
  }

  public static String getAppDeployPath()
  {
      return Thread.currentThread().getContextClassLoader().getResource("/").getPath();
  }
}

