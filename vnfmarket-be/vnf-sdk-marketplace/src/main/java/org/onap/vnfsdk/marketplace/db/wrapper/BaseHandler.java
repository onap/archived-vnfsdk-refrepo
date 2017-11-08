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
package org.onap.vnfsdk.marketplace.db.wrapper;

import java.util.List;
import java.util.Map;

import org.onap.vnfsdk.marketplace.db.entity.BaseData;
import org.onap.vnfsdk.marketplace.db.entity.PackageData;
import org.onap.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.onap.vnfsdk.marketplace.db.impl.MarketplaceDaoImpl;
import org.onap.vnfsdk.marketplace.db.inf.IMarketplaceDao;
import org.onap.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



/**
 * an abstract class for NFV wrapper class.
 * provide the common methods to process the CRUD rest request.
 *
 */
public abstract class BaseHandler<T extends BaseData> {
  private static final Logger logger = LoggerFactory.getLogger(BaseHandler.class);


  /**
   * create date.
   * @param data data to create
   * @param resouceType resouce type
   * @return T
   * @throws MarketplaceResourceException e1
   */
  @SuppressWarnings({"unchecked", "rawtypes"})
  public PackageData create(PackageData data, String resouceType) throws MarketplaceResourceException {
    PackageData rtnData = null;
    logger.info("BaseHandler:start create data.info:" + MarketplaceDbUtil.objectToString(data));
    try {
      IMarketplaceDao dao = new MarketplaceDaoImpl();
      dao.savePackageData(data);
      rtnData = data;
    } catch (Exception e1) {
      logger.error("BaseHandler:error while creating " + resouceType, e1);
    }
    logger.info("BaseHandler:create data end.info:" + MarketplaceDbUtil.objectToString(data));
    return rtnData;
  }

  /**
   * delete data.
   * @param data data to delete
   * @param resouceType resource type
   * @throws MarketplaceResourceException e1
   */
  @SuppressWarnings({"rawtypes", "unchecked"})
  public void delete(T data) throws MarketplaceResourceException {
    logger.info("BaseHandler:start delete data.info:" + MarketplaceDbUtil.objectToString(data));
    IMarketplaceDao dao = new MarketplaceDaoImpl();
    dao.deletePackageData(((PackageData)data).getCsarId());
    logger.info("BaseHandler:delete data end");
  }

  /**
   * query data.
   * @param queryParam query parameter
   * @param resouceType resource type
   * @return T list
   * @throws MarketplaceResourceException e1
   */
  @SuppressWarnings({"rawtypes", "unchecked"})
  public List<PackageData> query(Map<String, String> queryParam)
      throws MarketplaceResourceException {
    logger.info("BaseHandler:start query data .info:" + MarketplaceDbUtil.objectToString(queryParam));
    IMarketplaceDao dao = new MarketplaceDaoImpl();
    List<PackageData> datas = dao.getPackageDataSubset(queryParam);
    logger.info("BaseHandler: query data end .info:" + MarketplaceDbUtil.objectToString(datas));
    return datas;
  }

  /**
   * union query.
   * @param filter filter
   * @param resouceType resource type
   * @return T list
   * @throws MarketplaceResourceException e1
   */
  @SuppressWarnings({"rawtypes", "unchecked"})
  public List<T> unionQuery(String filter) throws MarketplaceResourceException {
    logger.info("BaseHandler:start union query data.fliter:" + filter);
    List<T> datas = null;
    logger.info("BaseHandler:union query data end .info:" + MarketplaceDbUtil.objectToString(datas));
    return datas;
  }

  /**
   * union delete.
   * @param filter filter
   * @param resouceType resource type
   * @return int
   * @throws MarketplaceResourceException e1
   */
  @SuppressWarnings({"rawtypes", "unchecked"})
  public int unionDelete(String filter) throws MarketplaceResourceException {
    logger.info("BaseHandler:start delete query data.fliter:" + filter);
    int num=0;
    logger.info("BaseHandler:union delete data end .num:" + num);
    return num;
  }

  @SuppressWarnings({"rawtypes", "unchecked"})
  public void update(T data) throws MarketplaceResourceException {
    logger.info("BaseHandler:start update data.info:" + MarketplaceDbUtil.objectToString(data));
    IMarketplaceDao dao = new MarketplaceDaoImpl();
    dao.updatePackageData((PackageData)data);
    logger.info("update data end");
  }

  /**
   * check if the related object id exists in the system.
   *
   * @param data data to check
   * @throws MarketplaceResourceException e
   */
  public abstract void check(T data) throws MarketplaceResourceException;

}

