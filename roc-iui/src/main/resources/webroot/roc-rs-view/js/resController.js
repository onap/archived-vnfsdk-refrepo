/*
 * Copyright (C) 2015 ZTE, Inc. and others. All rights reserved. (ZTE)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var vm = avalon
    .define({
        $id : "resController",
        boxVisible : true,
        emptyVisible : false,
        resource : {
            nsInfo : [],
            vnfInfo : [],
            vnfcInfo : [],
            vduInfo : [],
            hostInfo : [],
            cpInfo : [],
            vimInfo : [],
            vnfmInfo : [],
            sdnInfo : [],
            vnffgInfo : [],
            nfpInfo : [],
            rsDetail : "",
            relationInfo : [],
            ifHaveRelation : false
        },
        customPara : {
            LOGINPROTOCOL : "",
            LOGINPORT : "",
            PROXYIP : "",
            LOGINUSER : ""
        },
        $Status : {
            active : "active",
            inactive : "inactive",
            terminated : "terminated",
            normal : "normal"
        },
        resType : "none",
        resTypeList : [{
                cond_value : 'NS',
                name : "NS"
            }, {
                cond_value : 'VNF',
                name : "VNF"
            }, {
                cond_value : 'VNFC',
                name : "VNFC"
            }, {
                cond_value : 'VDU',
                name : "VDU"
            }, {
                cond_value : 'HOST',
                name : "HOST"
            }, {
                cond_value : 'CP',
                name : "CP"
            }, {
                cond_value : 'VIM',
                name : "VIM"
            }, {
                cond_value : 'VNFM',
                name : "VNFM"
            }, {
                cond_value : 'SDN',
                name : "SDN"
            }, {
                cond_value : 'VNFFG',
                name : "VNFFG"
            }, {
                cond_value : 'NFP',
                name : "NFP"
            }
        ],
        url : {
            $queryResInfoUrl : '../../api/roc/v1/resource/instances'
        },
        $initTable : function () {

            resUtil.queryResource();

        },
        queryRes : function () {
            vm.nodesDetail.isShow = "none";
        },
        nodesDetail : {
            detailTitle : "",
            isShow : "none",
            detailIndex : 0,
            detailData : [{
                    id : "general",
                    name : $.i18n.prop("com_zte_ums_eco_roc_rsview_info"),
                    isActive : true
                }, {
                    id : "relationShips",
                    name : $.i18n.prop("com_zte_ums_eco_roc_rsview_relation"),
                    isActive : false
                }
            ],
            $showDetails : function (isShow, sn, name) {
                vm.nodesDetail.isShow = isShow;
                vm.nodesDetail.detailCondChange(0);
                if (isShow == "block") {
                    vm.nodesDetail.detailTitle = name + "-" + $.i18n.prop("com_zte_ums_eco_roc_rsview_rsDetail"),
                    $('#' + vm.nodesDetail.detailData[0].id).click();
                    vm.nodesDetail.detailData[0].isActive = true;
                    vm.nodesDetail.$initNodeDetailTable(sn);
                }
            },
            detailCondChange : function (index) {
                vm.nodesDetail.detailIndex = index;
                for (var i = 0; i < vm.nodesDetail.detailData.length; i++) {
                    vm.nodesDetail.detailData[i].isActive = false;
                }
                vm.nodesDetail.detailData[index].isActive = true;
            },
            $initNodeDetailTable : function (sn) {
                switch (vm.resType) {
                case 'NS':
                    vm.resource.rsDetail = vm.resource.nsInfo[sn];
                    vm.resource.relationInfo = [];

                    var vnfs = vm.resource.rsDetail.vnfIds;
                    for (var i = 0; i < vnfs.length; i++) {
                        var relation = new Object();
                        relation.oid = vnfs[i];
                        relation.name = vm.queryVnfName(vnfs[i]);
                        relation.type = "VNF";
                        vm.resource.relationInfo.push(relation);
                    }

                    vm.resource.ifHaveRelation = true;
                    break;
                case 'VNF':
                    vm.resource.rsDetail = vm.resource.vnfInfo[sn];
                    vm.resource.relationInfo = [];

                    var nss = vm.resource.rsDetail.nsId;
                    for (var i = 0; i < nss.length; i++) {
                        var relation = new Object();
                        relation.oid = nss[i];
                        relation.name = vm.queryNsName(nss[i]);
                        relation.type = "NS";
                        vm.resource.relationInfo.push(relation);
                    }
                    vm.resource.ifHaveRelation = true;
                    break;
                case 'VNFC':
                    vm.resource.rsDetail = vm.resource.vnfcInfo[sn];
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                case 'VDU':
                    vm.resource.rsDetail = vm.resource.vduInfo[sn];
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                case 'HOST':
                    vm.resource.rsDetail = vm.resource.hostInfo[sn];

                    if (vm.resource.rsDetail.customPara != "") {
                        var customPara = JSON.parse(vm.resource.rsDetail.customPara);
                        vm.customPara.PROXYIP = customPara.PROXYIP;
                        vm.customPara.LOGINPROTOCOL = customPara.LOGINPROTOCOL;
                        vm.customPara.LOGINPORT = customPara.LOGINPORT;
                        vm.customPara.LOGINUSER = customPara.LOGINUSER;
                    }
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                case 'CP':
                    vm.resource.rsDetail = vm.resource.cpInfo[sn];
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                case 'VIM':
                    vm.resource.rsDetail = vm.resource.vimInfo[sn];
                    vm.resource.relationInfo = [];

                    var vnfms = vm.resource.rsDetail.vnfmIds;
                    for (var i = 0; i < vnfms.length; i++) {
                        var relation = new Object();
                        relation.oid = vnfms[i];
                        relation.name = vm.queryVnfmName(vnfms[i]);
                        relation.type = "VNFM";
                        vm.resource.relationInfo.push(relation);
                    }
                    vm.resource.ifHaveRelation = true;
                    break;
                case 'VNFM':
                    vm.resource.rsDetail = vm.resource.vnfmInfo[sn];
                    vm.resource.relationInfo = [];

                    var vims = vm.resource.rsDetail.vimIds;
                    for (var i = 0; i < vims.length; i++) {
                        var relation = new Object();
                        relation.oid = vims[i];
                        relation.name = vm.queryVimName(vims[i]);
                        relation.type = "VIM";
                        vm.resource.relationInfo.push(relation);
                    }
                    vm.resource.ifHaveRelation = true;
                    break;
                case 'SDN':
                    vm.resource.rsDetail = vm.resource.sdnInfo[sn];
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                case 'VNFFG':
                    vm.resource.rsDetail = vm.resource.vnffgInfo[sn];
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                case 'NFP':
                    vm.resource.rsDetail = vm.resource.nfpInfo[sn];
                    vm.resource.ifHaveRelation = false;
                    vm.resource.relationInfo = [];
                    break;
                }

            }
        },
        queryVimName : function (id) {
            if (id == "")
                return "";
            for (var i = 0; i < vm.resource.vimInfo.length; i++) {
                if (vm.resource.vimInfo[i].oid == id) {
                    return vm.resource.vimInfo[i].name;
                }

            }

        },
        queryVnfmName : function (id) {
            if (id == "")
                return "";
            for (var i = 0; i < vm.resource.vnfmInfo.length; i++) {
                if (vm.resource.vnfmInfo[i].oid == id) {
                    return vm.resource.vnfmInfo[i].name;
                }

            }

        },
        queryVnfName : function (id) {
            if (id == "")
                return "";
            for (var i = 0; i < vm.resource.vnfInfo.length; i++) {
                if (vm.resource.vnfInfo[i].oid == id) {
                    return vm.resource.vnfInfo[i].name;
                }

            }

        },
        queryVduName : function (id) {
            if (id == "")
                return "";
            for (var i = 0; i < vm.resource.vduInfo.length; i++) {
                if (vm.resource.vduInfo[i].oid == id) {
                    return vm.resource.vduInfo[i].name;
                }

            }

        },
        queryHostName : function (id) {
            if (id == "")
                return "";
            for (var i = 0; i < vm.resource.hostInfo.length; i++) {
                if (vm.resource.hostInfo[i].oid == id) {
                    return vm.resource.hostInfo[i].name;
                }

            }

        },
        queryNsName : function (id) {
            if (id == "")
                return "";
            for (var i = 0; i < vm.resource.nsInfo.length; i++) {
                if (vm.resource.nsInfo[i].oid == id) {
                    return vm.resource.nsInfo[i].name;
                }

            }

        },
        clickDisplayGraphAlink : function () {
            vm.boxVisible = !vm.boxVisible;
        },

    });
avalon.scan();
vm.$initTable();
