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
package org.openo.vnfsdk.marketplace.db.wrapper;

import java.util.ArrayList;
import java.util.Map;

import org.openo.vnfsdk.marketplace.db.common.MarketplaceResourceType;
import org.openo.vnfsdk.marketplace.db.common.Parameters;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.openo.vnfsdk.marketplace.db.impl.MarketplaceDaoImpl;
import org.openo.vnfsdk.marketplace.db.inf.IMarketplaceDao;
import org.openo.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PackageHandler extends BaseHandler<PackageData> {
    private static final Logger logger = LoggerFactory.getLogger(PackageHandler.class);

    /**
     * create package data.
     * @param packageData package data to create
     * @return PackageData
     * @throws MarketplaceResourceException e1
     */
    public PackageData create(PackageData packageData) throws MarketplaceResourceException {
        logger.info("packageHandler:start create package info.");
        PackageData data = null;
        if (!MarketplaceDbUtil.isNotEmpty(packageData.getCsarId())) {

            logger.info("packageHandler:package info does not have csarid,generate UUID.");
            String id = MarketplaceDbUtil.generateId();
            packageData.setCsarId(id);
        }
        Object result = create(packageData, MarketplaceResourceType.PACKAGE.name());
        if (result != null) {
            data = (PackageData) result;
        } else {
            logger.info("packageHandler: query package info is null.");
        }
        logger.info("packageHandler: create package info end.");
        return data;
    }

    /**
     * delete data.
     * @param id package id
     * @throws MarketplaceResourceException e
     */
    public void delete(String id) throws MarketplaceResourceException {
        logger.info("packageHandler:start delete package info.");
        PackageData packageData = new PackageData();
        packageData.setCsarId(id);
        delete(packageData, MarketplaceResourceType.PACKAGE.name());
        logger.info("packageHandler: delete package info end.");
    }

    /**
     * query package data by map.
     * @param queryParam map data
     * @return PackageData list
     * @throws MarketplaceResourceException e
     */
    public ArrayList<PackageData> query(Map<String, String> queryParam)
            throws MarketplaceResourceException {
        logger.info("packageHandler:start query package info.");
        ArrayList<PackageData> data = new ArrayList<PackageData>();
        Object result = query(queryParam, MarketplaceResourceType.PACKAGE.name());
        if (result != null) {
            data = (ArrayList<PackageData>) result;
        } else {
            logger.info("packageHandler: query package info is null.");
        }
        logger.info("packageHandler: query package info end.");
        return data;
    }

    /**
     * query package data by map.
     * @param queryParam map data
     * @return PackageData list
     * @throws MarketplaceResourceException e
     */
    public ArrayList<PackageData> queryByID(String csarID)
            throws MarketplaceResourceException {
        logger.info("packageHandler:start query package info.");
        ArrayList<PackageData> data = new ArrayList<PackageData>();
        logger.info("packageHandler:start query data .info:" + csarID);
        IMarketplaceDao dao = new MarketplaceDaoImpl();
        Object result = dao.getPackageData(csarID);
        if (result != null) {
            data = (ArrayList<PackageData>) result;
        } else {
            logger.info("packageHandler: query package info is null.");
        }
        logger.info("packageHandler: query data end .info:" + MarketplaceDbUtil.objectToString(data));
        return data;
    }

    public void update(PackageData oPackageData) throws MarketplaceResourceException{
        update(oPackageData, MarketplaceResourceType.PACKAGE.name());
        logger.info("packageHandler: update package info end.");
    }

    @Override
    public void check(PackageData packageData) throws MarketplaceResourceException {

    }
}
