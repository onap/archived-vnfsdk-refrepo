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
package org.openo.vnfsdk.marketplace.entity;

public class VnfPackage {
  private String vnfPackageId;
  private String name;
  private String version;
  private String provider;
  private String vnfd;
  private EnumOperationalState operationalState = EnumOperationalState.Disabled;
  private EnumUsageState usageState = EnumUsageState.InUse;
  private String deletionPending;
  private String vnfPackageUrl;

  public String getVnfPackageId() {
    return vnfPackageId;
  }

  public void setVnfPackageId(String vnfPackageId) {
    this.vnfPackageId = vnfPackageId;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public String getProvider() {
    return provider;
  }

  public void setProvider(String provider) {
    this.provider = provider;
  }

  public String getVnfd() {
    return vnfd;
  }

  public void setVnfd(String vnfd) {
    this.vnfd = vnfd;
  }

  public EnumOperationalState getOperationalState() {
    return operationalState;
  }

  public void setOperationalState(EnumOperationalState operationalState) {
    this.operationalState = operationalState;
  }

  public EnumUsageState getUsageState() {
    return usageState;
  }

  public void setUsageState(EnumUsageState usageState) {
    this.usageState = usageState;
  }

  public String getVnfPackageUrl() {
    return vnfPackageUrl;
  }

  public void setVnfPackageUrl(String vnfPackageUrl) {
    this.vnfPackageUrl = vnfPackageUrl;
  }

  public String getDeletionPending() {
    return deletionPending;
  }

  public void setDeletionPending(String deletionPending) {
    this.deletionPending = deletionPending;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
