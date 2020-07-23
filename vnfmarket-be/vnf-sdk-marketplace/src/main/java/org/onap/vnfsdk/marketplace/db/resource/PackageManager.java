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
package org.onap.vnfsdk.marketplace.db.resource;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.onap.vnfsdk.marketplace.db.common.Parameters;
import org.onap.vnfsdk.marketplace.db.entity.PackageData;
import org.onap.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.onap.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.onap.vnfsdk.marketplace.db.wrapper.PackageHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.onap.vnfsdk.marketplace.common.ToolUtil;

public class PackageManager {
    private static final Logger LOGGER = LoggerFactory.getLogger(PackageManager.class);
    private static PackageManager manager;
    PackageHandler handler = new PackageHandler();

    /**
     * get PackageManager instance.
     * @return PackageManager instance
     */
    public static synchronized PackageManager getInstance() {
        if (manager == null) {
            manager = new PackageManager();
        }
        return manager;
    }

    /**
     * private PackageManager() {}

     * add package.
     * @param packageData package data
     * @return PackageData
     * @throws MarketplaceResourceException e
     */
    public PackageData addPackage(PackageData packageData) throws MarketplaceResourceException {
        String jsonPackageData = MarketplaceDbUtil.objectToString(packageData);
        LOGGER.info("start add package info  to db.info:{}" , jsonPackageData);
        PackageData data = handler.create(packageData);
        String jsonData = MarketplaceDbUtil.objectToString(data);
        LOGGER.info(" package info  to db end.info:{}" , jsonData);
        return data;
    }

    /**
     * query package by package id.
     * @param csarId package id
     * @return package data list
     * @throws MarketplaceResourceException e
     */
    public List<PackageData> queryPackageByCsarId(String csarId)
            throws MarketplaceResourceException {
        String sanitisedCsarId = ToolUtil.sanitizeInput(csarId);
        LOGGER.info("start query package info by csarid.{}" , sanitisedCsarId);
        List<PackageData> data = handler.queryByID(sanitisedCsarId);
        String jsonData = MarketplaceDbUtil.objectToString(data);
        LOGGER.info("query package info end.size:{} detail:{}", data.size(), jsonData);
        return data;
    }

    /**
     * query package by condition.
     * @param name package name
     * @param provider package provider
     * @param version package version
     * @param deletionPending deletionPending
     * @param type package type
     * @return package data list
     * @throws MarketplaceResourceException e
     */
    public List<PackageData> queryPackage(String name, String provider, String version,
            String deletionPending, String type) throws MarketplaceResourceException {
        String sanitisedName = ToolUtil.sanitizeInput(name);
        String sanitisedProvider = ToolUtil.sanitizeInput(provider);
        String sanitisedVersion = ToolUtil.sanitizeInput(version);
        String sanitisedType = ToolUtil.sanitizeInput(type);
        LOGGER.info("start query package info.name:{} provider:{} version:{} type:{}", sanitisedName , sanitisedProvider , sanitisedVersion, sanitisedType);
        Map<String, String> queryParam = new HashMap<>();
        if (MarketplaceDbUtil.isNotEmpty(sanitisedName)) {
            queryParam.put(Parameters.NAME.name(), sanitisedName);
        }
        if (MarketplaceDbUtil.isNotEmpty(sanitisedVersion)) {
            queryParam.put(Parameters.VERSION.name(), sanitisedVersion);
        }
        if (MarketplaceDbUtil.isNotEmpty(deletionPending)) {
            queryParam.put(Parameters.DELETIONPENDING.name(), deletionPending);
        }
        if (MarketplaceDbUtil.isNotEmpty(sanitisedType)) {
            queryParam.put(Parameters.TYPE.name(), sanitisedType);
        }
        if (MarketplaceDbUtil.isNotEmpty(sanitisedProvider)) {
            queryParam.put(Parameters.PROVIDER.name(), sanitisedProvider);
        }
        List<PackageData> data = handler.query(queryParam);
        String jsonData = MarketplaceDbUtil.objectToString(data);
        LOGGER.info("query package info end.size:{} detail:{}", data.size(), jsonData);
        return data;
    }

    /**
     * delete package according package id.
     * @param packageId package id
     * @throws MarketplaceResourceException e
     */
    public void deletePackage(String packageId) throws MarketplaceResourceException {
        String sanitisedPackageId = ToolUtil.sanitizeInput(packageId);
        LOGGER.info("start delete package info by id.{}" , sanitisedPackageId);
        handler.delete(sanitisedPackageId);
        LOGGER.info(" delete package info end id.{}" , sanitisedPackageId);
    }

    /**
     * update download count of package according package id.
     * @param packageId package id
     * @throws MarketplaceResourceException e
     */
    public void updateDownloadCount(String packageId) throws MarketplaceResourceException
    {
        String sanitisedPackageId = ToolUtil.sanitizeInput(packageId);
        LOGGER.info("Request received for Updating down load count for ID:{}" , sanitisedPackageId);

        //Get the Existing download  count from DB and Increment in DB
        getExistingDownloadCountFromDB(sanitisedPackageId);

    }

    /**
     * Get the Existing download count from DB
     * @param sanitisedPackageId
     * @throws MarketplaceResourceException
     */
    public void getExistingDownloadCountFromDB(String sanitisedPackageId) throws MarketplaceResourceException {

        List<PackageData> data = handler.queryByID(sanitisedPackageId);
        if(data.isEmpty())
        {
            LOGGER.info("Package Info not found for ID:{}" , sanitisedPackageId);
            return;
        }

        //Increment download Count in DB
        incrementDownloadCountInDB(data);
    }

    /**
     * Increment download Count in DB
     * @param data
     */
    public void incrementDownloadCountInDB(List<PackageData> data){
        PackageData oPackageData = data.get(0);
        int idownloadcount = oPackageData.getDownloadCount();
        oPackageData.setDownloadCount(++idownloadcount);

        handler.update(oPackageData);

        LOGGER.info("Download count updated to :{}" , idownloadcount);
    }
}

