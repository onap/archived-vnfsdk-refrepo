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
package org.openo.vnfsdk.marketplace.db.resource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.openo.vnfsdk.marketplace.db.common.Parameters;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.openo.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.openo.vnfsdk.marketplace.db.wrapper.PackageHandler;
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

    private PackageManager() {}

    /**
     * add package.
     * @param packageData package data
     * @return PackageData
     * @throws MarketplaceResourceException e
     */
    public PackageData addPackage(PackageData packageData) throws MarketplaceResourceException {
        LOGGER.info("start add package info  to db.info:" + MarketplaceDbUtil.objectToString(packageData));
        PackageData data = handler.create(packageData);
        LOGGER.info(" package info  to db end.info:" + MarketplaceDbUtil.objectToString(data));
        return data;
    }

    /**
     * query package by package id.
     * @param csarId package id
     * @return package data list
     * @throws MarketplaceResourceException e
     */
    public ArrayList<PackageData> queryPackageByCsarId(String csarId)
            throws MarketplaceResourceException {
        LOGGER.info("start query package info by csarid." + csarId);
        ArrayList<PackageData> data = handler.queryByID(csarId);
        LOGGER.info("query package info end.size:" + data.size() + "detail:"
                + MarketplaceDbUtil.objectToString(data));
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
    public ArrayList<PackageData> queryPackage(String name, String provider, String version,
            String deletionPending, String type) throws MarketplaceResourceException {
        LOGGER.info("start query package info.name:" + name + " provider:" + provider + " version:"
                + version + " type:" + type);
        Map<String, String> queryParam = new HashMap<String, String>();
        if (MarketplaceDbUtil.isNotEmpty(name)) {
            queryParam.put(Parameters.name.name(), name);
        }
        if (MarketplaceDbUtil.isNotEmpty(version)) {
            queryParam.put(Parameters.version.name(), version);
        }
        if (MarketplaceDbUtil.isNotEmpty(deletionPending)) {
            queryParam.put(Parameters.deletionPending.name(), deletionPending);
        }
        if (MarketplaceDbUtil.isNotEmpty(type)) {
            queryParam.put(Parameters.type.name(), type);
        }
        if (MarketplaceDbUtil.isNotEmpty(provider)) {
            queryParam.put(Parameters.provider.name(), provider);
        }
        ArrayList<PackageData> data = handler.query(queryParam);
        LOGGER.info("query package info end.size:" + data.size() + "detail:"
                + MarketplaceDbUtil.objectToString(data));
        return data;
    }

    /**
     * delete package according package id.
     * @param packageId package id
     * @throws MarketplaceResourceException e
     */
    public void deletePackage(String packageId) throws MarketplaceResourceException {
        LOGGER.info("start delete package info by id." + packageId);
        handler.delete(packageId);
        LOGGER.info(" delete package info end id." + packageId);
    }

    /**
     * update download count of package according package id.
     * @param packageId package id
     * @throws MarketplaceResourceException e
     */
    public void updateDwonloadCount(String packageId) throws MarketplaceResourceException
    {
        LOGGER.info("Request received for Updating down load count for ID:" + packageId);

        //STEP 1: Get the Existing download  count from DB
        //-------------------------------------------------
        ArrayList<PackageData> data = handler.queryByID(packageId);
        if(data.isEmpty())
        {
            LOGGER.info("Package Info not foun for ID:" + packageId);
            return;
        }

        //STEP 2: Increment download Count in DB
        //--------------------------------------
        PackageData oPackageData = data.get(0);
        int idownloadcount = oPackageData.getDownloadCount();
        oPackageData.setDownloadCount(++idownloadcount);

        handler.update(oPackageData);

        LOGGER.info("Download count updated to :" + idownloadcount);
    }
}
