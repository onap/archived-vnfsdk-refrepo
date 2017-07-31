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

package org.openo.vnfsdk.marketplace.db.impl;

import java.util.List;

import javax.persistence.PersistenceException;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.openo.vnfsdk.marketplace.db.connection.ConnectionUtil;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.db.inf.IMarketplaceDao;
import org.openo.vnfsdk.marketplace.db.mapper.IMarketplaceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class is the implementation for the DAO Layer for Driver Manager.
 * <br/>
 * 
 * @author
 * @version  
 */
public class MarketplaceDaoImpl implements IMarketplaceDao {

    private static final Logger LOGGER = LoggerFactory.getLogger(MarketplaceDaoImpl.class);

    private SqlSessionFactory sqlSessionFactory = null;

    /**
     * 
     * Constructor<br/>
     * <p>
     * </p>
     * 
     * @since   
     */
    public MarketplaceDaoImpl() {
        sqlSessionFactory = ConnectionUtil.getSession();
    }

    /**
     * get all package data.
     * <br/>
     * 
     * @return
     * @since    
     */
    public List<PackageData> getAllPackageData() {
        SqlSession session = sqlSessionFactory.openSession();
        List<PackageData> csars = null; 
        try {
            IMarketplaceMapper mapper = session.getMapper(IMarketplaceMapper.class);
            csars = mapper.getAllPackageData();
            session.commit();
        } catch(PersistenceException e) {
            LOGGER.error("Exception caught {}", e);
//            throw new DriverManagerException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
//                    ErrorCode.INVALID_DB);
        } finally {
            session.close();
        }
        return csars;
    }

    /**
     * saving the package data object to the DB using the mybatis.
     * <br/>
     * 
     * @param dirverInstance
     * @since    
     */
	public void savePackageData(PackageData lPackageData) {
		SqlSession session = sqlSessionFactory.openSession();
        try {
            IMarketplaceMapper mapper = session.getMapper(IMarketplaceMapper.class);
            mapper.savePackageData(lPackageData);
            session.commit();
        } catch(PersistenceException e) {
            LOGGER.error("Exception caught {}", e);
//            throw new DriverManagerException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
//                    ErrorCode.INVALID_DB);
        } finally {
            session.close();
        }
		
	}

	public List<PackageData> getPackageData(String csarId) {
        SqlSession session = sqlSessionFactory.openSession();
        List<PackageData> csars = null; 
        try {
            IMarketplaceMapper mapper = session.getMapper(IMarketplaceMapper.class);
            csars = mapper.getPackageData(csarId);
            session.commit();
        } catch(PersistenceException e) {
            LOGGER.error("Exception caught {}", e);
//            throw new DriverManagerException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
//                    ErrorCode.INVALID_DB);
        } finally {
            session.close();
        }
        return csars;
	}

	public void deletePackageData(String csarId) {
	 SqlSession session = sqlSessionFactory.openSession();
        try {
            IMarketplaceMapper mapper = session.getMapper(IMarketplaceMapper.class);
            mapper.deletePackageData(csarId);
            session.commit();
        } catch(PersistenceException e) {
            LOGGER.error("Exception caught {}", e);
//	            throw new DriverManagerException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
//	                    ErrorCode.INVALID_DB);
        } finally {
            session.close();
        }
		
	}

    public void updatePackageData(PackageData oPackageData) {
        SqlSession session = sqlSessionFactory.openSession();
        try {
            IMarketplaceMapper mapper = session.getMapper(IMarketplaceMapper.class);
            mapper.updatePackageData(oPackageData);
            session.commit();
        } catch(PersistenceException e) {
            LOGGER.error("Exception caught {}", e);
        } finally {
            session.close();
        }
        
    }    
}
