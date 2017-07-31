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
package org.openo.vnfsdk.marketplace.wrapper;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import org.openo.vnfsdk.marketplace.common.CommonConstant;
import org.openo.vnfsdk.marketplace.common.FileUtil;
import org.openo.vnfsdk.marketplace.common.MsbAddrConfig;
import org.openo.vnfsdk.marketplace.common.ToolUtil;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.openo.vnfsdk.marketplace.db.resource.PackageManager;
import org.openo.vnfsdk.marketplace.entity.EnumType;
import org.openo.vnfsdk.marketplace.entity.request.PackageBasicInfo;
import org.openo.vnfsdk.marketplace.entity.response.PackageMeta;
import org.openo.vnfsdk.marketplace.model.parser.EnumPackageFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.internal.LinkedTreeMap;


public class PackageWrapperUtil {
  private static final Logger LOG = LoggerFactory.getLogger(PackageWrapperUtil.class);

  public static long getPacakgeSize(String fileLocation) {
    File file = new File(fileLocation);
    return file.length();
  }

  /**
   * change package metadata to fix database.
   * @param meta package metadata
 * @param details 
   * @return package data in database 
   */
  public static PackageData getPackageData(PackageMeta meta) {
    PackageData packageData = new PackageData();
    packageData.setCreateTime(meta.getCreateTime());
    packageData.setDeletionPending(String.valueOf(meta.isDeletionPending()));
    packageData.setDownloadUri(meta.getDownloadUri());
    packageData.setFormat(meta.getFormat());
    packageData.setModifyTime(meta.getModifyTime());
    packageData.setName(meta.getName());
    packageData.setCsarId(meta.getCsarId());
    packageData.setProvider(meta.getProvider());
    String fileSize = meta.getSize();
    packageData.setSize(fileSize);
    packageData.setType(meta.getType());
    packageData.setVersion(meta.getVersion());
   	packageData.setDetails(meta.getDetails());
   	packageData.setShortDesc(meta.getShortDesc());
   	packageData.setRemarks(meta.getRemarks());
    return packageData;
  }

  /**
   * judge wether is the end of upload package.
   * @param contentRange package sise range
   * @param csarName package name
   * @return boolean
   */
  public static boolean isUploadEnd(String contentRange, String csarName) {
    String range = contentRange;
    range = range.replace("bytes", "").trim();
    range = range.substring(0, range.indexOf("/"));
    String size =
        contentRange.substring(contentRange.indexOf("/") + 1, contentRange.length()).trim();
    int fileSize = Integer.parseInt(size);
    String[] ranges = range.split("-");
    int startPosition = Integer.parseInt(ranges[0]);
    if (startPosition == 0) {
      // delPackageBySync(csarName);
    }
    // index start from 0
    int endPosition = Integer.parseInt(ranges[1]) + 1;
    if (endPosition >= fileSize) {
      return true;
    }
    return false;
  }

  /**
   * get package detail by package id.
   * @param csarId package id
   * @return package detail
   */
  public static PackageData getPackageInfoById(String csarId) {
    PackageData result = new PackageData();
    ArrayList<PackageData> packageDataList = new ArrayList<PackageData>();
    try {
      packageDataList = PackageManager.getInstance().queryPackageByCsarId(csarId);
      if (packageDataList != null && packageDataList.size() > 0) {
        result = PackageManager.getInstance().queryPackageByCsarId(csarId).get(0);
      }
    } catch (MarketplaceResourceException e1) {
      LOG.error("query package by csarId from db error ! " + e1.getMessage());
    }
    return result;
  }

  /**
   * get package metadata from basic info.
   * @param fileName package name
   * @param fileLocation the location of package
   * @param basic basic infomation of package. include version, type and provider
   * @return package metadata
   */
  public static PackageMeta getPackageMeta(String packageId,String fileName, String fileLocation,
    PackageBasicInfo basic, String details) {
    PackageMeta packageMeta = new PackageMeta();
    long size = getPacakgeSize(fileLocation);
    packageMeta.setFormat(basic.getFormat());
    
    if(null == packageId)
    {
        packageId = ToolUtil.generateId();
    }
    packageMeta.setCsarId(packageId);
    
    packageMeta.setName(fileName.replace(CommonConstant.CSAR_SUFFIX, ""));
    packageMeta.setType(basic.getType().toString());
    packageMeta.setVersion(basic.getVersion());
    packageMeta.setProvider(basic.getProvider());
    packageMeta.setDeletionPending(false);
    String sizeStr = ToolUtil.getFormatFileSize(size);
    packageMeta.setSize(sizeStr);
    SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String currentTime = sdf1.format(new Date());
    packageMeta.setCreateTime(currentTime);
    packageMeta.setModifyTime(currentTime);
    if(null != details)
    {
    	LinkedTreeMap<String,String> csarDetails = ToolUtil.fromJson(details, LinkedTreeMap.class);
    	packageMeta.setDetails(csarDetails.get("details"));
    	packageMeta.setShortDesc(csarDetails.get("shortDesc"));
    	packageMeta.setRemarks(csarDetails.get("remarks"));
    }
    return packageMeta;
  }

  /**
   * get downloadUri from package metadata.
   * @param csarId package id
   * @return download uri
   */
  public static String getPackagePath(String csarId) {
    ArrayList<PackageData> packageList = new ArrayList<PackageData>();
    String downloadUri = null;
    try {
      packageList = PackageManager.getInstance().queryPackageByCsarId(csarId);
      downloadUri = packageList.get(0).getDownloadUri();
    } catch (MarketplaceResourceException e1) {
      LOG.error("Query CSAR package by ID failed ! csarId = " + csarId);
    }
    return downloadUri;
  }


  /**
   * get package name from ftpUrl.
   * @param ftpUrl ftp url
   * @return package name
   */
  public static String getPackageName(String ftpUrl) {
    int index = ftpUrl.lastIndexOf("/");
    String packageName = ftpUrl.substring(index);
    return packageName;
  }

  /**
   * translate package data from database to package metadata.
   * @param dbResult data from database
   * @return package metadata list
   */
  public static ArrayList<PackageMeta> packageDataList2PackageMetaList(
      ArrayList<PackageData> dbResult) {
    ArrayList<PackageMeta> metas = new ArrayList<PackageMeta>();
    PackageMeta meta = new PackageMeta();
    if (dbResult.size() > 0) {
      for (int i = 0; i < dbResult.size(); i++) {
        PackageData data = dbResult.get(i);
        meta = packageData2PackageMeta(data);
        metas.add(meta);
      }
    }
    return metas;
  }

  public static PackageMeta packageData2PackageMeta(PackageData packageData) {
    PackageMeta meta = new PackageMeta();
    meta.setCsarId(packageData.getCsarId());
    meta.setCreateTime(packageData.getCreateTime());
    meta.setDeletionPending(Boolean.getBoolean(packageData.getDeletionPending()));
    String packageUri =
        packageData.getDownloadUri() + packageData.getName() + CommonConstant.CSAR_SUFFIX;
    String packageUrl = getUrl(packageUri);
    meta.setDownloadUri(packageUrl);
    meta.setReport(packageData.getReport());
    meta.setFormat(packageData.getFormat());
    meta.setModifyTime(packageData.getModifyTime());
    meta.setName(packageData.getName());
    meta.setDetails(packageData.getDetails());
    meta.setProvider(packageData.getProvider());
    meta.setSize(packageData.getSize());
    meta.setType(packageData.getType());
    meta.setShortDesc(packageData.getShortDesc());
    meta.setVersion(packageData.getVersion());
    meta.setRemarks(packageData.getRemarks());
    meta.setDownloadCount(packageData.getDownloadCount());
    return meta;
  }

  /**
   * add msb address as prefix to uri.
   * @param uri uri
   * @return url
   */
  public static String getUrl(String uri) {
    String url = null;
//    if ((MsbAddrConfig.getMsbAddress().endsWith("/")) && uri.startsWith("/")) {
//      url = MsbAddrConfig.getMsbAddress() + uri.substring(1);
//    }
//    url = MsbAddrConfig.getMsbAddress() + uri;
    if ((getDownloadUriHead().endsWith("/")) && uri.startsWith("/")) {
      url = getDownloadUriHead() + uri.substring(1);
    }
    url = getDownloadUriHead() + uri;
    String urlresult = url.replace("\\", "/");
    return urlresult;
  }
  
  public static String getDownloadUriHead() {
    return MsbAddrConfig.getMsbAddress() + "/files/catalog-http";
  }

  /**
   * get local path.
   * @param uri uri
   * @return local path
   */
  public static String getLocalPath(String uri) {
    File srcDir = new File(uri);
    String localPath = srcDir.getAbsolutePath();
    return localPath.replace("\\", "/");
  }

  /**
   * get package basic information.
   * @param fileLocation package location
   * @return package basic information
   */
  public static PackageBasicInfo getPacageBasicInfo(String fileLocation) {
    PackageBasicInfo basicInfo = new PackageBasicInfo();
    String unzipDir = ToolUtil.getUnzipDir(fileLocation);
    boolean isXmlCsar = false;
    try {
      String tempfolder = unzipDir;
      ArrayList<String> unzipFiles = FileUtil.unzip(fileLocation, tempfolder);
      if (unzipFiles.isEmpty()) {
        isXmlCsar = true;
      }
      for (String unzipFile : unzipFiles) {
        if (unzipFile.endsWith(CommonConstant.CSAR_META)) {
          basicInfo = readCsarMeta(unzipFile);
        }
        if (ToolUtil.isYamlFile(new File(unzipFile))) {
          isXmlCsar = false;
        }
      }
    } catch (IOException e1) {
      LOG.error("judge package type error ! " + e1.getMessage());
    }
    if (isXmlCsar) {
      basicInfo.setFormat(CommonConstant.PACKAGE_XML_FORMAT);
    } else {
      basicInfo.setFormat(CommonConstant.PACKAGE_YAML_FORMAT);
    }
    return basicInfo;
  }

  private static PackageBasicInfo readCsarMeta(String unzipFile) {
    PackageBasicInfo basicInfo = new PackageBasicInfo();
    File file = new File(unzipFile);
    BufferedReader reader = null;
    try {
      reader = new BufferedReader(new FileReader(file));
      String tempString = null;
      while ((tempString = reader.readLine()) != null) {
        if (!tempString.equals("")) {
          int count1 = tempString.indexOf(":");
          String meta = tempString.substring(0, count1).trim();
          if (meta.equalsIgnoreCase(CommonConstant.CSAR_TYPE_META)) {
            int count = tempString.indexOf(":") + 1;
            basicInfo.setType(EnumType.valueOf(tempString.substring(count).trim()));
          }
          if (meta.equalsIgnoreCase(CommonConstant.CSAR_PROVIDER_META)) {
            int count = tempString.indexOf(":") + 1;
            basicInfo.setProvider(tempString.substring(count).trim());
          }
          if (meta.equalsIgnoreCase(CommonConstant.CSAR_VERSION_META)) {
            int count = tempString.indexOf(":") + 1;
            basicInfo.setVersion(tempString.substring(count).trim());
          }
        }
      }
      reader.close();
    } catch (IOException e2) {
      e2.printStackTrace();
    } finally {
      if (reader != null) {
        try {
          reader.close();
        } catch (IOException e1) {
          LOG.error("close reader failed ! " + e1.getMessage());
        }
      }
    }
    return basicInfo;
  }
  
  /**
   * get package format enum.
   * @param format package format
   * @return package format enum
   */
  public static EnumPackageFormat getPackageFormat(String format) {
    if (format.equals("xml")) {
      return EnumPackageFormat.TOSCA_XML;
    } else if (format.equals("yml") || format.equals("yaml")) {
      return EnumPackageFormat.TOSCA_YAML;
    } else {
      return null;
    }
  }
}
