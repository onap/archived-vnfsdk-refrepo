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
package org.openo.vnfsdk.marketplace.db.exception;

public class MarketplaceResourceException extends ErrorCodeException {
  private static final long serialVersionUID = 5699508780537383310L;


  public MarketplaceResourceException(int errcode) {
    super(errcode, "");
  }


  public MarketplaceResourceException(int errcode, Throwable cause) {
    super(cause, errcode);
  }


  public MarketplaceResourceException(int errcode, String message, Throwable cause) {
    super(cause, errcode, message);
  }


  public MarketplaceResourceException() {
    super(9999999, null);
  }


  public MarketplaceResourceException(String message) {
    super(9999999, message);
  }


  public MarketplaceResourceException(Throwable cause) {
    super(cause, 9999999);
  }


  public MarketplaceResourceException(String message, Throwable cause) {
    super(cause, 9999999, message);
  }


  /**
   * catalog resource exception.
   * @param source throwable source
   * @param errId error Id
   * @param debugMessage debug message
   * @param arguments arguments
   */
  public MarketplaceResourceException(Throwable source, int errId, String debugMessage,
      String[] arguments) {
    super(source, errId, debugMessage, arguments);
  }

  public MarketplaceResourceException(Throwable source, int category, int code, String debugMessage,
      String[] arguments) {
    super(source, category, code, debugMessage, arguments);
  }

  public int getErrcode() {
    return super.getErrorCode();
  }
}
