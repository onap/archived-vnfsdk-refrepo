====
    Copyright (C) 2015 ZTE, Inc. and others. All rights reserved. (ZTE)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
====

二次开发方式：
1、在此目录新建web-app-i18n-en-US.properties、web-app-i18n-zh-CN.properties两个文件（注意：文件名不能修改;文件编码格式设置为UTF-8），分别存放可以进行二次开发的中英文国际化。
2、将需要二次开发的键值对拷贝到对应的中（英）文文件里，并修改value值即可。
   例如：
   "ICT管理系统"需要做二次开发，就将  com_zte_ums_ict_framework_ui_main_title=ICT管理系统  拷贝到web-app-i18n-zh-CN.properties文件，将"ICT管理系统"修改为所需名称。
                                      com_zte_ums_ict_framework_ui_main_title=ICT          拷贝到web-app-i18n-en-US.properties文件，将"ICT"修改为所需名称。
2、以下是中文目前可以进行二次开发的key-value：
   com_zte_ums_ict_framework_ui_main_title=ICT管理系统
   com_zte_ums_ict_framework_ui_page_title=ICT管理系统-统一网管场景
   com_zte_ums_ict_framework_ui_page_title_1=ICT管理系统-ICT监控场景
   com_zte_ums_ict_framework_ui_page_title_2=ICT管理系统-基础版本场景
   com_zte_ums_ict_framework_ui_page_title_3=ICT管理系统-GIS应用场景
   com_zte_ums_ict_portal_login_title=ICT管理系统
   com_zte_ums_ict_portal_login_companyName=2014 @ zte 中兴通讯股份有限公司
3、以下是英文目前可以进行二次开发的key-value：
   com_zte_ums_ict_framework_ui_main_title=ICT
   com_zte_ums_ict_framework_ui_page_title=ICT Management System-Unified Network Management Scenarios
   com_zte_ums_ict_framework_ui_page_title_1=ICT Management System-ICT Monitor Scenarios
   com_zte_ums_ict_framework_ui_page_title_2=ICT Management System-Base Scenarios
   com_zte_ums_ict_framework_ui_page_title_3=ICT Management System-GIS Scenarios
   com_zte_ums_ict_portal_login_title=ICT Management System
   com_zte_ums_ict_portal_login_companyName=Corporation
