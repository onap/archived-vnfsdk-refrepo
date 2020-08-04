/*
 * Copyright 2020 Huawei Technologies Co., Ltd.
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

CREATE DATABASE marketplaceDB;

USE marketplaceDB;

DROP TABLE IF EXISTS CSAR_PACKAGE_TABLE;

CREATE TABLE CSAR_PACKAGE_TABLE (
	CSARID                   VARCHAR(200)       NOT NULL,
	DOWNLOADURI              VARCHAR(200)       NULL,
	REPORT		             VARCHAR(200)       NULL,
	SIZE                     VARCHAR(100)       NULL,
	FORMAT                   VARCHAR(100)       NULL,
	CREATETIME               VARCHAR(100)       NULL,
	DELETIONPENDING          VARCHAR(100)       NULL,
	MODIFYTIME               VARCHAR(100)       NULL,
	SHORTDESC	             TEXT		        NULL,
	NAME                     VARCHAR(100)       NULL,
	VERSION                  VARCHAR(20)        NULL,
	PROVIDER                 VARCHAR(300)       NULL,
	TYPE                     VARCHAR(300)       NULL,
	DETAILS		             TEXT			    NULL,
	REMARKS		             TEXT			    NULL,
	DOWNLOADCOUNT            INT                NULL,
	CONSTRAINT csar_package_table_pkey PRIMARY KEY (CSARID)
);
