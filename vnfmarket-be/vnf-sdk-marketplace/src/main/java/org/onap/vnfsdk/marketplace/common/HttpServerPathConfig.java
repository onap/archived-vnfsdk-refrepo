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
package org.onap.vnfsdk.marketplace.common;

public class HttpServerPathConfig {
  protected static String httpServerPath;

  private HttpServerPathConfig() {
  }

  static
  {
    MsbAddrConfig.setMsbAddress(CommonConstant.DEFAULT_MSB_ADDRESS);
    HttpServerAddrConfig.setHttpServerAddress(CommonConstant.DEFAULT_MSB_ADDRESS);
    HttpServerPathConfig.setHttpServerPath("../tomcat/webapps/ROOT/");
  }

  public static String getHttpServerPath() {
    return httpServerPath;
  }

  public static void setHttpServerPath(String httpServerPath) {
    HttpServerPathConfig.httpServerPath = httpServerPath;
  }
}

