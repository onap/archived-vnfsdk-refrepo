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

package org.openo.vnfsdk.marketplace.db.connection;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class is the session factory for the database to be used in the Driver Manager.
 * <br/>
 * 
 * @author
 * @version  
 */
public class ConnectionUtil {

    private static SqlSessionFactory sqlSessionFactory;

    private static final Logger LOGGER = LoggerFactory.getLogger(ConnectionUtil.class);
    
    /**
     * Get the DB session for the myBaties.    
     * Constructor<br/>
     * <p>
     * </p>
     * 
     * @since   
     */
    private ConnectionUtil() {
        
    }

    static {
        InputStream inputStream;
        try {
            inputStream = Resources.getResourceAsStream("mybatis/configuration/configuration.xml");
            if(null == sqlSessionFactory) {
                LOGGER.error("begin generate");
                sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
                LOGGER.error("end generate = " + sqlSessionFactory);
            }
        } catch(FileNotFoundException ex) {
            LOGGER.error("File Not Found Exception caught", ex);

        } catch(IOException ex) {
            LOGGER.error("IO Exception caught", ex);
        } catch(Exception ex) {
            LOGGER.error("some exception", ex);
        }
    }

    public static SqlSessionFactory getSession() {
        return sqlSessionFactory;
    }
}
