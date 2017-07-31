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
package org.openo.vnfsdk.marketplace.filemanage;

import org.openo.vnfsdk.marketplace.filemanage.http.HttpFileManagerImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileManagerFactory {
  private static final Logger logger = LoggerFactory.getLogger(FileManagerFactory.class);

  private static FileManager getHttpFileManager() {
    return new HttpFileManagerImpl();
  }

  /**
   * create file manager.
   * @return FileManager
   */
  public static FileManager createFileManager() {
    switch (getType()) {
      case http:
        return getHttpFileManager();
      case ftp:
        return null;
      default:
        return getHttpFileManager();
    }
  }

  private static FileManagerType getType() {
    String type = System.getenv("useFtp");
    logger.info("read environment varibale uesFtp:" + type);
    if (type != null && "true".equals(type)) {
      return FileManagerType.ftp;
    } else {
      return FileManagerType.http;
    }
  }
}
