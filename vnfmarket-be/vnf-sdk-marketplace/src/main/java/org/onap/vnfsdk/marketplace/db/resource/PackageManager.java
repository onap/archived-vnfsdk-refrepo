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
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.onap.vnfsdk.marketplace.db.common.Parameters;
import org.onap.vnfsdk.marketplace.db.entity.PackageData;
import org.onap.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.onap.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.onap.vnfsdk.marketplace.db.wrapper.PackageHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

        LOGGER.info("start add package info  to db.info:{}", (jsonPackageData));

        PackageData data = handler.create(packageData);
        String jsonData = MarketplaceDbUtil.objectToString(data);

        LOGGER.info(" package info  to db end.info:{}", (jsonData));

        return data;
    }

    private String loggerPatternBreaking(String loggerInput) {
        return Objects.nonNull(loggerInput) ? loggerInput.replaceAll("[\n\r\t]", "_") : StringUtils.EMPTY;

    }

    /**
     * query package by package id.

     * @param csarId package id
     * @return package data list
     * @throws MarketplaceResourceException e
     */
    public List<PackageData> queryPackageByCsarId(String csarId) throws MarketplaceResourceException {
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("start query package info by csarid.{}", loggerPatternBreaking(csarId));
        }
        List<PackageData> data = handler.queryByID(csarId);
        String jsonData = MarketplaceDbUtil.objectToString(data);

        LOGGER.info("query package info end.size:{} detail:{}", data.size(), (jsonData));

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
                                          String deletionPending,String type) throws MarketplaceResourceException {
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("start query package info.name:{} provider:{} version:{} type:{}", loggerPatternBreaking(name),loggerPatternBreaking(provider), loggerPatternBreaking(version), loggerPatternBreaking(type));
        }
        Map<String, String> queryParam = new HashMap<>();
        if (MarketplaceDbUtil.isNotEmpty(name)) {
            queryParam.put(Parameters.NAME.name(), name);
        }
        if (MarketplaceDbUtil.isNotEmpty(version)) {
            queryParam.put(Parameters.VERSION.name(), version);
        }
        if (MarketplaceDbUtil.isNotEmpty(deletionPending)) {
            queryParam.put(Parameters.DELETIONPENDING.name(), deletionPending);
        }
        if (MarketplaceDbUtil.isNotEmpty(type)) {
            queryParam.put(Parameters.TYPE.name(), type);
        }
        if (MarketplaceDbUtil.isNotEmpty(provider)) {
            queryParam.put(Parameters.PROVIDER.name(), provider);
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
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("start delete package info by id.{}", loggerPatternBreaking(packageId));
        }
        handler.delete(packageId);
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info(" delete package info end id.{}", loggerPatternBreaking(packageId));
        }
    }

    /**
     * update download count of package according package id.

     * @param packageId package id
     * @throws MarketplaceResourceException e
     */
    public void updateDownloadCount(String packageId) throws MarketplaceResourceException {
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("Request received for Updating down load count for ID:{}", loggerPatternBreaking(packageId));
        }

        // STEP 1: Get the Existing download count from DB
        // -------------------------------------------------
        List<PackageData> data = handler.queryByID(packageId);
        if (data.isEmpty()) {
            if (LOGGER.isInfoEnabled()) {
                LOGGER.info("Package Info not foun for ID:{}", loggerPatternBreaking(packageId));
            }
            return;
        }

        // STEP 2: Increment download Count in DB
        // --------------------------------------
        PackageData oPackageData = data.get(0);
        int idownloadcount = oPackageData.getDownloadCount();
        oPackageData.setDownloadCount(++idownloadcount);

        handler.update(oPackageData);

        LOGGER.info("Download count updated to :{}", idownloadcount);
    }
}