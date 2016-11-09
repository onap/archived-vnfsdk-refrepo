/*
 * Copyright 2016, CMCC Technologies Co., Ltd.
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
package org.openo.portal.system;

import java.io.File;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SystemListener implements ServletContextListener {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public void contextDestroyed(ServletContextEvent sce) {
    }

    public void contextInitialized(ServletContextEvent servletContextEvent) {
        logger.info("open-o portal register task begin.");
        String registerFilePath = SystemListener.class.getClassLoader().getResource("").getPath() + "portalConfig" + File.separator + "msb_register.xml";
        RegisterService.registerMsb(registerFilePath);
        logger.info("open-o portal register task ended.");
    }
}
