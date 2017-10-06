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
package org.onap.vnfsdk.marketplace.wrapper;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.onap.vnfsdk.marketplace.common.CommonConstant;
import org.onap.vnfsdk.marketplace.common.FileUtil;
import org.onap.vnfsdk.marketplace.common.MsbAddrConfig;
import org.onap.vnfsdk.marketplace.common.ToolUtil;
import org.onap.vnfsdk.marketplace.db.entity.PackageData;
import org.onap.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.onap.vnfsdk.marketplace.db.resource.PackageManager;
import org.onap.vnfsdk.marketplace.entity.EnumType;
import org.onap.vnfsdk.marketplace.entity.request.PackageBasicInfo;
import org.onap.vnfsdk.marketplace.entity.response.PackageMeta;
import org.onap.vnfsdk.marketplace.model.parser.EnumPackageFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.internal.LinkedTreeMap;


public class PackageWrapperUtil {
  private static final Logger LOG = LoggerFactory.getLogger(PackageWrapperUtil.class);

  private PackageWrapperUtil() {
  }

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
  public static boolean isUploadEnd(String contentRange) {
    String range = contentRange;
    range = range.replace("bytes", "").trim();
    range = range.substring(0, range.indexOf("/"));
    String size =
        contentRange.substring(contentRange.indexOf("/") + 1, contentRange.length()).trim();
    int fileSize = Integer.parseInt(size);
    String[] ranges = range.split("-");
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
    List<PackageData> packageDataList = new ArrayList<>();
    try {
      packageDataList = PackageManager.getInstance().queryPackageByCsarId(csarId);
      if (packageDataList != null && ! packageDataList.isEmpty()) {
        result = PackageManager.getInstance().queryPackageByCsarId(csarId).get(0);
      }
    } catch (MarketplaceResourceException e1) {
      LOG.error("query package by csarId from db error ! " + e1.getMessage(), e1);
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
  public static PackageMeta getPackageMeta(String packageId, String fileName, String fileLocation,
    PackageBasicInfo basic, String details) {
    PackageMeta packageMeta = new PackageMeta();
    long size = getPacakgeSize(fileLocation);
    packageMeta.setFormat(basic.getFormat());
    String usedPackageId = packageId;
    if(null == packageId)
    {
        usedPackageId = ToolUtil.generateId();
    }

    packageMeta.setCsarId(usedPackageId);

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
    List<PackageData> packageList = new ArrayList<>();
    String downloadUri = null;
    try {
      packageList = PackageManager.getInstance().queryPackageByCsarId(csarId);
      downloadUri = packageList.get(0).getDownloadUri();
    } catch (MarketplaceResourceException e1) {
      LOG.error("Query CSAR package by ID failed ! csarId = " + csarId, e1);
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
   
    return ftpUrl.substring(index);
  }

  /**
   * translate package data from database to package metadata.
   * @param dbResult data from database
   * @return package metadata list
   */
  public static List<PackageMeta> packageDataList2PackageMetaList(
      List<PackageData> dbResult) {
    ArrayList<PackageMeta> metas = new ArrayList<>();
    if (! dbResult.isEmpty()) {
      for (int i = 0; i < dbResult.size(); i++) {
        PackageData data = dbResult.get(i);
        PackageMeta meta = packageData2PackageMeta(data);
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
    String url = getDownloadUriHead();
    if (url.endsWith("/") && uri.startsWith("/")) {
      url += uri.substring(1);
    } else {
      url += uri;
    }
    return url.replace("\\", "/");
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
      List<String> unzipFiles = FileUtil.unzip(fileLocation, tempfolder);
      if (unzipFiles.isEmpty()) {
        isXmlCsar = true;
      }
      for (String unzipFile : unzipFiles) {
        if (unzipFile.endsWith(CommonConstant.MANIFEST)) {
          basicInfo = readManifest(unzipFile);
        }
        
        if (unzipFile.endsWith(CommonConstant.CSAR_META)) {
            basicInfo = readMetaData(unzipFile);
        }
        
        if (ToolUtil.isYamlFile(new File(unzipFile))) {
          isXmlCsar = false;
        }
      }
    } catch (IOException e1) {
      LOG.error("judge package type error ! " + e1.getMessage(), e1);
    }
    if (isXmlCsar) {
      basicInfo.setFormat(CommonConstant.PACKAGE_XML_FORMAT);
    } else {
      basicInfo.setFormat(CommonConstant.PACKAGE_YAML_FORMAT);
    }
    return basicInfo;
  }

  /**
   * Reads the manifest file in the package and fills the basic infor about package
   * @param unzipFile
   * @return basic infor about package
   */
  private static PackageBasicInfo readMetaData(String unzipFile) {

    // Fix the package type to CSAR, temporary
    PackageBasicInfo basicInfo = new PackageBasicInfo();
    basicInfo.setType(EnumType.CSAR);

    File file = new File(unzipFile);
    try (BufferedReader reader = new BufferedReader(new FileReader(file))) {

      for(String tempString; (tempString = reader.readLine()) != null;)
      {
          // If line is empty, ignore
          if ("".equals(tempString)) {
            continue;
          }

          int count1 = tempString.indexOf(":");
          String meta = tempString.substring(0, count1).trim();

          // Check for the package provider name
          if (meta.equalsIgnoreCase(CommonConstant.CSAR_PROVIDER_META)) {
            int count = tempString.indexOf(":") + 1;
            basicInfo.setProvider(tempString.substring(count).trim());
          }

          // Check for package version
          if (meta.equalsIgnoreCase(CommonConstant.CSAR_VERSION_META)) {
            int count = tempString.indexOf(":") + 1;
            basicInfo.setVersion(tempString.substring(count).trim());
          }
          
       // Check for package type
          if (meta.equalsIgnoreCase(CommonConstant.CSAR_TYPE_META)) {
            int count = tempString.indexOf(":") + 1;
           
            basicInfo.setType(getEnumType(tempString.substring(count).trim()));
          }
      }

      reader.close();
    } catch (IOException e) {
      LOG.error("Exception while parsing manifest file" + e, e);
    }

    return basicInfo;
  }
  
  private static EnumType getEnumType (String type)
  {
	  EnumType vnfType = EnumType.CSAR;
	  if (type == "CSAR")
	  {
		  vnfType = EnumType.CSAR;
	  }
	  
	  if (type == "GSAR")
	  {
		  vnfType = EnumType.GSAR;
	  }
	  
	  if (type == "NSAR")
	  {
		  vnfType = EnumType.NSAR;
	  }
	  
	  if (type == "SSAR")
	  {
		  vnfType = EnumType.SSAR;
	  }
	  
	  if (type == "NFAR")
	  {
		  vnfType = EnumType.NFAR;
	  }
	  
	  return vnfType;
  }
  
  private static PackageBasicInfo readManifest(String unzipFile) {

	    // Fix the package type to CSAR, temporary
	    PackageBasicInfo basicInfo = new PackageBasicInfo();
	    basicInfo.setType(EnumType.CSAR);

	    File file = new File(unzipFile);
	    try (BufferedReader reader = new BufferedReader(new FileReader(file))) {

	      for(String tempString; (tempString = reader.readLine()) != null;)
	      {
	          // If line is empty, ignore
	          if ("".equals(tempString)) {
	            continue;
	          }

	          int count1 = tempString.indexOf(":");
	          String meta = tempString.substring(0, count1).trim();

	          // Check for the package provider name
	          if (meta.equalsIgnoreCase(CommonConstant.MF_PROVIDER_META)) {
	            int count = tempString.indexOf(":") + 1;
	            basicInfo.setProvider(tempString.substring(count).trim());
	          }

	          // Check for package version
	          if (meta.equalsIgnoreCase(CommonConstant.MF_VERSION_META)) {
	            int count = tempString.indexOf(":") + 1;
	            basicInfo.setVersion(tempString.substring(count).trim());
	          }
	      }

	      reader.close();
	    } catch (IOException e) {
	      LOG.error("Exception while parsing manifest file" + e, e);
	    }

	    return basicInfo;
	  }
  /**
   * get package format enum.
   * @param format package format
   * @return package format enum
   */
  public static EnumPackageFormat getPackageFormat(String format) {
    if ("xml".equals(format)) {
      return EnumPackageFormat.TOSCA_XML;
    } else if ("yml".equals(format) || "yaml".equals(format)) {
      return EnumPackageFormat.TOSCA_YAML;
    } else {
      return null;
    }
  }
}

