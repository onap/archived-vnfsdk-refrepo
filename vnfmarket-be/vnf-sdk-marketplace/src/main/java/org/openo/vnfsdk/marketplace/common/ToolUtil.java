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
package org.openo.vnfsdk.marketplace.common;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;



/**
 * common utility class.
 * 
 */
public class ToolUtil {
  private static final Logger LOG = LoggerFactory.getLogger(ToolUtil.class);

  public static final String CATALOGUE_CSAR_DIR_NAME = "csar";

  public static final String CATALOGUE_IMAGE_DIR_NAME = "image";

  public static final int FILE_PERCENT = 1024 * 1024; // 1M

  public static boolean isEmptyString(String val) {
    return val == null || "".equals(val);
  }

  public static boolean isTrimedEmptyString(String val) {
    return val == null || "".equals(val.trim());
  }

  public static boolean isTrimedEmptyArray(String[] val) {
    return val == null || val.length == 0;
  }

  /**
   * trimed string.
   * 
   * @param val string array to trim
   * @return String[]
   */
  public static String[] trimedStringArray(String[] val) {
    if (isTrimedEmptyArray(val)) {
      return val;
    }

    String[] rets = new String[val.length];
    for (int i = 0; i < val.length; i++) {
      rets[i] = val[i].trim();
    }
    return rets;
  }

  public static boolean isEmptyCollection(Collection<?> coll) {
    return null == coll || coll.isEmpty();
  }

  /**
   * store chunk file to local temp directory.
   * 
   * @param dirName directory name
   * @param fileName file name
   * @param uploadedInputStream upload input stream
   * @return String
   * @throws IOException e
   */
  public static String storeChunkFileInLocal(String dirName, String fileName,
      InputStream uploadedInputStream) throws IOException {
    File tmpDir = new File(dirName);
    LOG.info("tmpdir = " + File.separator + dirName);
    if (!tmpDir.exists()) {
      tmpDir.mkdirs();
    }
    File file = new File(tmpDir + File.separator + fileName);
    OutputStream os = null;
    try {
      int read = 0;
      byte[] bytes = new byte[1024];
      os = new FileOutputStream(file, true);
      while ((read = uploadedInputStream.read(bytes)) != -1) {
        os.write(bytes, 0, read);
      }
      os.flush();
      return file.getAbsolutePath();
    } finally {
      if (os != null) {
        os.close();
      }
    }
  }

  /**
   * get temp dirctory when upload package.
   * 
   * @param dirName temp directory name
   * @param fileName package name
   * @return String
   */
  public static String getTempDir(String dirName, String fileName) {
    // File tmpDir = new File(File.separator + dirName);
    return Thread.currentThread().getContextClassLoader().getResource("/").getPath() + dirName + File.separator
        + fileName.replace(".csar", "");
  }

  public static String getUnzipDir(String dirName) {
    File tmpDir = new File(File.separator + dirName);
    return tmpDir.getAbsolutePath().replace(".csar", "");
  }

  /**
   * delete file.
   * 
   * @param dirName the directory of file
   * @param fileName file name
   * @return boolean
   */
  public static boolean deleteFile(String dirName, String fileName) {
    File tmpDir = new File(getCataloguePath() + File.separator + dirName);
    if (!tmpDir.exists()) {
      return true;
    }
    File file = new File(tmpDir.getAbsolutePath() + File.separator + fileName);
    if (file.exists()) {
      return file.delete();
    }
    return true;
  }

  public static String getCataloguePath() {
//    return Config.getConfigration().getCataloguePath();
	  return "";
  }

  public static String getCatalogueCsarPath() {
    return getCataloguePath() + File.separator + CATALOGUE_CSAR_DIR_NAME;
  }

  public static String getCatalogueImagePath() {
    return getCataloguePath() + File.separator + CATALOGUE_IMAGE_DIR_NAME;
  }

  /**
   * get file size.
   * 
   * @param file file which to get the size
   * @param fileUnit file unit
   * @return String file size
   */
  public static String getFileSize(File file, int fileUnit) {
    String fileSize = "";
    DecimalFormat format = new DecimalFormat("#0.00");
    if (file.exists()) {
      fileSize = format.format((double) file.length() / fileUnit) + "M";
    }
    return fileSize;
  }

  public static String formatFileSize(double fileLength, int fileUnit) {
    DecimalFormat format = new DecimalFormat("#0.00");
    return format.format(fileLength / fileUnit) + "M";
  }

  /**
   * get file size by content.
   * 
   * @param contentRange content range
   * @return String
   */
  public static String getFileSizeByContent(String contentRange) {
    String size =
        contentRange.substring(contentRange.indexOf("/") + 1, contentRange.length()).trim();
    return formatFileSize(Double.parseDouble(size), FILE_PERCENT);
  }

  /**
   * fix package format.
   * 
   * @param csarId package ID
   * @return String
   */
  public static String formatCsar(String csarId) {
    String result = csarId;
    if (csarId.indexOf(".csar") < 0) {
      result += ".csar";
    }
    return result;
  }


  /**
   * delete the file and file directory.
   * 
   * @param dir file
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

  // public static boolean unZipCsar(String fileLocation) throws IOException {
  // String tempfolder=System.getProperty("java.io.tmpdir");
  // ArrayList<String> unzipFiles = FileUtil.unzip(fileLocation, tempfolder);
  // if(unzipFiles.isEmpty()){
  // return true;
  // }
  // }

  /**
   * judge the file's format is yaml or not.
   * 
   * @param file file to judge
   * @return boolean
   */
  public static boolean isYamlFile(File file) {
    if (!file.isDirectory() && file.getName().indexOf(".yaml") != -1) {
      return true;
    }
    return false;
  }

  /**
   * remove the csar suffix.
   * 
   * @param csarName package name
   * @return String
   */
  public static String removeCsarSuffix(String csarName) {
    return csarName.replaceAll(".csar", "");
  }

  /**
   * add the csar fuffix.
   * 
   * @param csarName package name
   * @return String
   */
  public static String addCsarSuffix(String csarName) {
    if (csarName.indexOf(".csar") == -1) {
      return csarName + ".csar";
    }
    return csarName;
  }

  /**
   * process file name.
   * 
   * @param fileName file's name
   * @return String
   */
  public static String processFileName(String fileName) {
    int index = fileName.indexOf(".zip");
    if (index == -1) {
      return fileName;
    }

    return addCsarSuffix(fileName.replaceAll(".zip", ""));
  }

  /**
   * exchange object to string.
   * 
   * @param obj object
   * @return String
   */
  public static String objectToString(Object obj) {
    if (obj == null) {
      return "";
    }
    Gson gson = new Gson();
    String str = gson.toJson(obj);
    return str;
  }

  public static String generateId() {
    return UUID.randomUUID().toString();
  }

  /**
   * get the size format according file size.
   * 
   * @param fileSize file size
   * @return size format
   */
  public static String getFormatFileSize(long fileSize) {
    long kb = 1024;
    long mb = kb * 1024;
    long gb = mb * 1024;

    if (fileSize >= gb) {
      return String.format("%.1f GB", (float) fileSize / gb);
    } else if (fileSize >= mb) {
      float fi = (float) fileSize / mb;
      return String.format(fi > 100 ? "%.0f MB" : "%.1f MB", fi);
    } else if (fileSize >= kb) {
      float fi = (float) fileSize / kb;
      return String.format(fi > 100 ? "%.0f KB" : "%.1f KB", fi);
    } else {
      return String.format("%d B", fileSize);
    }
  }

  /**
   * get gson from json.
   * @param jsonString json string
   * @param templateClass template class
   * @return Template
   */
  public static <T> T fromJson(String jsonString, Class<T> templateClass) {
    Gson gson = new Gson();
    return gson.fromJson(jsonString, templateClass);
  }

  /**
   * gson to json.
   * @param template class name
   * @return String
   */
  public static <T> String toJson(T template) {
    Gson gson = new Gson();
    return gson.toJson(template);
  }
  
  /**
   * @param value
   * @return
   */
  public static String getAsString(JsonElement value) {
    if (value.isJsonPrimitive()) {
      return value.getAsString();
    }

    return value.toString();
  }
  
}
