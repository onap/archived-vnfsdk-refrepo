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
package org.openo.vnfsdk.marketplace.filemanage.http;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.openo.vnfsdk.marketplace.common.HttpServerPathConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ToolUtil {
  private static final Logger LOGGER = LoggerFactory.getLogger(ToolUtil.class);

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
    if (!srcDir.exists()) {
      return false;
    } else if (!srcDir.isDirectory()) {
      return false;
    }

    if (!destDirName.endsWith(File.separator)) {
      destDirName = destDirName + File.separator;
    }
    File destDir = new File(destDirName);
    if (destDir.exists()) {
      if (overlay) {
        new File(destDirName).delete();
      } else {
        return false;
      }
    } else {
      if (!destDir.mkdirs()) {
        return false;
      }
    }
    boolean flag = true;
    File[] files = srcDir.listFiles();
    for (int i = 0; i < files.length; i++) {
      if (files[i].isFile()) {
        flag = copyFile(files[i].getAbsolutePath(), destDirName + files[i].getName(), true);
        if (!flag) {
          break;
        }
      } else if (files[i].isDirectory()) {
        flag = copyDirectory(files[i].getAbsolutePath(), destDirName + files[i].getName(), overlay);
        if (!flag) {
          break;
        }
      }
    }
    if (!flag) {
      String message = "Copy catagory " + srcDirName + " to " + destDirName + " failed!";
      LOGGER.error(message);
      return false;
    } else {
      return true;
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

    if (!srcFile.exists()) {
      String message = "Source file : " + srcFileName + " not exist !";
      LOGGER.error(message);
      return false;
    } else if (!srcFile.isFile()) {
      return false;
    }

    File destFile = new File(destFileName);
    if (destFile.exists()) {
      if (overlay) {
        new File(destFileName).delete();
      }
    } else {
      if (!destFile.getParentFile().exists()) {
        if (!destFile.getParentFile().mkdirs()) {
          return false;
        }
      }
    }

    int byteread = 0;
    InputStream in = null;
    OutputStream out = null;

    try {
      in = new FileInputStream(srcFile);
      out = new FileOutputStream(destFile);
      byte[] buffer = new byte[1024];

      while ((byteread = in.read(buffer)) != -1) {
        out.write(buffer, 0, byteread);
      }
      return true;
    } catch (FileNotFoundException e1) {
      return false;
    } catch (IOException e1) {
      return false;
    } finally {
      try {
        if (out != null) {
          out.close();
        }
        if (in != null) {
          in.close();
        }
      } catch (IOException e1) {
        e1.printStackTrace();
      }
    }
  }

  /**
   * create directory.
   * @param destDirName target directory name
   * @return boolean
   */
  public static boolean createDir(String destDirName) {
    File dir = new File(destDirName);
    if (dir.exists()) {
      dir.delete();
    }
    if (!destDirName.endsWith(File.separator)) {
      destDirName = destDirName + File.separator;
    }
    if (dir.mkdirs()) {
      return true;
    } else {
      return false;
    }
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
