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


public class ToolUtil {
  private static final Logger LOGGER = LoggerFactory.getLogger(ToolUtil.class);

  private ToolUtil() {
  }

  /**
   * copy in directory.
   * @param srcDirName source directory name
   * @param destDirName destination directory name
   * @param files file list in directory
   * @param overlay overwrite or not
   * @return boolean
   * @throws IOException e
   */
  public static boolean copyInDirectory(String srcDirName, String destDirName, File[] files, boolean overlay)
      throws IOException
  {
    for (int i = 0; i < files.length; i++) {
        boolean flag = false;
        if (files[i].isFile()) {
          flag = copyFile(files[i].getAbsolutePath(), destDirName + files[i].getName(), true);
        }
        if (files[i].isDirectory()) {
          flag = copyDirectory(files[i].getAbsolutePath(), destDirName + files[i].getName(), overlay);
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

    String useDestDirName = destDirName;
    if (!useDestDirName.endsWith(File.separator)) {
      useDestDirName += File.separator;
    }
    File destDir = new File(useDestDirName);
    if (destDir.exists() && overlay) {
        new File(destDirName).delete();
    } else if ((destDir.exists() && !overlay) || (!destDir.exists() && !destDir.mkdirs())) {
        return false;
    }

    File[] files = srcDir.listFiles();

    return copyInDirectory(srcDirName, destDirName, files, overlay);
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
      int byteread = 0;

      while ((byteread = in.read(buffer)) != -1) {
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
        new File(destFileName).delete();
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
      dir.delete();
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
    return dir.delete();
  }

  public static String getAppDeployPath()
  {
      return Thread.currentThread().getContextClassLoader().getResource("/").getPath();
  }
}

