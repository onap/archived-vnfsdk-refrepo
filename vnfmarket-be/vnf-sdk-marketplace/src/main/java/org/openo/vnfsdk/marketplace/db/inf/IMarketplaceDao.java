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

package org.openo.vnfsdk.marketplace.db.inf;

import java.util.List;

import org.openo.vnfsdk.marketplace.db.entity.PackageData;

/**
 * DAO Layer for the Driver Manager Service.
 * <br/>
 * 
 * @author
 * @version  
 */
public interface IMarketplaceDao {

    /**
     * get all package instance.
     * <br/>
     * 
     * @return
     * @since   
     */
    List<PackageData> getAllPackageData();
    
    /**
     * saving the package instance object to the DB using the mybaties.
     * <br/>
     * 
     * @param packageInstance
     * @since   
     */
    void savePackageData(PackageData lPackageData);

    List<PackageData> getPackageData(String csarID);

	void deletePackageData(String csarId);	
	   
	void updatePackageData(PackageData oPackageData);

}
