/*
 * Copyright 2016-2017, CMCC Technologies Co., Ltd.
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
var AlarmConds = function () {

    return {

        parseActiveConds2JSon: function (conds) {
            return this.parseConds2JSon(conds, 1);
        },
        parseHistoryConds2JSon: function (conds) {
            return this.parseConds2JSon(conds, 2);
        },

        /**
         *  传入的条件数组说明：
         *  每个条件都是一个对象，包含2个属性：type和data。type表示条件的类型，data是一个数组，每项都表示一个条件。
         *  下面是支持的所有条件的说明：
         *  1）网元
         *      {
			 *          type : 'Position',
			 *          data : [{   //支持多个
			 *               locationId : 'lId1',
			 *               oid : 'oid1',
			 *               isSelf : true //是否分组，true表示只包含自己，false表示分组
			 *           }
			 *          ]
			 *       }
         *  2）级别
         *      {
			 *          type : 'Severity',
			 *          data : [{  //支持多个
			 *               severity : 1 //1表示严重，2表示主要，3表示次要，4表示警告
			 *           }
			 *          ]
			 *       }
         *  3）确认状态
         *      {
			 *          type : 'AckState',
			 *          data : [{  //支持多个
			 *               ackState : 1 //1表示已确认，2表示未确认
			 *           }
			 *          ]
			 *      }
         *  4）可见性
         *      {
			 *          type : 'FilterState',
			 *          data : [{  //支持多个
			 *               filterState : 1 //1表示可见，0表示不可见
			 *           }
			 *          ]
			 *       }
         *  5）告警类型
         *      {
			 *          type : 'AlarmType',
			 *          data : [{  //支持多个
			 *               alarmType : 1 //0表示通信告警，1表示处理错误告警，2表示服务质量告警，3表示设备告警，4表示环境告警，5表示网管系统告警，6表示完整性告警，7表示可用性告警，8表示物理攻击告警，9表示安全攻击告警，10表示时限告警
			 *           }
			 *          ]
			 *       }
         *  6）告警码
         *      {
			 *          type : 'ProbableCause',
			 *          data : [{  //支持多个
			 *               systemType : 6,
			 *               code : 1001
			 *           }
			 *          ]
			 *       }
         *  7）发生时间
         *      {
			 *          type : 'RaisedTime',
			 *          data : [{  //支持一个
			 *               mode : 0, //0表示区间，1表示最近
			 *               start : 1399429229000, //mode为0时，表示开始时间，mode为1时，表示时间的毫秒值
			 *               end : 1399515601000  //mode为0时，表示结束时间，mode为1时，表示时间的毫秒值
			 *           }
			 *          ]
			 *       }
         *  8）确认时间
         *      {
			 *          type : 'AckTime',
			 *          data : [{  //支持一个
			 *               mode : 0, //0表示区间，1表示最近
			 *               start : 1399429229000, //mode为0时，表示开始时间，mode为1时，表示时间的毫秒值
			 *               end : 1399515601000  //mode为0时，表示结束时间，mode为1时，表示时间的毫秒值
			 *           }
			 *          ]
			 *       }
         *  9）清除时间
         *      {
			 *          type : 'ClearedTime',
			 *          data : [{  //支持一个
			 *               mode : 0, //0表示区间，1表示最近
			 *               start : 1399429229000, //mode为0时，表示开始时间，mode为1时，表示时间的毫秒值
			 *               end : 1399515601000  //mode为0时，表示结束时间，mode为1时，表示时间的毫秒值
			 *           }
			 *          ]
			 *       }
         *    10）告警ID
         *      {
			 *          type : 'AlarmId',
			 *          data : [{  //支持一个
			 *               id : 1412923648983
			 *           }
			 *          ]
			 *       }
         *    11）MOC
         *      {
			 *          type : 'Moc',
			 *          data : [{ //支持一个
			 *               moc : 'moc' //支持前缀匹配，如：'moc%'
			 *           }
			 *          ]
			 *       }
         *    12）ip地址
         *      {
			 *			type : 'NeIp',
			 *			data : [{ //支持一个
			 *				neIp : '10.74.165.57'
			 *			}
			 *         ]
			 *		}
         */
        parseConds2JSon: function (conds, ruleType) {
            var parser = {
                Position: function (cond) {
                    var condStr = "";
                    if (cond.type === "Position" && cond.data.length > 0) {
                        condStr = "<NewPositionCond OwnerType='Position' value='" + cond.data[0].locationId + "#" + cond.data[0].oid + "#" + cond.data[0].isSelf;
                        for (var i = 1; i < cond.data.length; i++) {
                            condStr += "∷" + cond.data[i].locationId + "#" + cond.data[i].oid + "#" + cond.data[i].isSelf;
                        }
                        condStr += "' />";
                    }
                    return condStr;
                },
                Severity: function (cond) {
                    var condStr = "";
                    if (cond.type === "Severity" && cond.data.length > 0) {
                        condStr = "<PerceivedSeverity value='" + cond.data[0].severity;
                        for (var i = 1; i < cond.data.length; i++) {
                            condStr += "," + cond.data[i].severity;
                        }
                        condStr += "' />";
                    }
                    return condStr;
                },
                AckState: function (cond) {
                    var condStr = "";
                    if (cond.type === "AckState" && cond.data.length > 0) {
                        condStr = "<AckState value='" + cond.data[0].ackState;
                        for (var i = 1; i < cond.data.length; i++) {
                            condStr += "," + cond.data[i].ackState;
                        }
                        condStr += "' />";
                    }
                    return condStr;
                },
                FilterState: function (cond) {
                    var condStr = "";
                    if (cond.type === "FilterState" && cond.data.length > 0) {
                        condStr = "<FilterState value='" + cond.data[0].filterState;
                        for (var i = 1; i < cond.data.length; i++) {
                            condStr += "," + cond.data[i].filterState;
                        }
                        condStr += "' />";
                    }
                    return condStr;
                },
                AlarmType: function (cond) {
                    var condStr = "";
                    if (cond.type === "AlarmType" && cond.data.length > 0) {
                        condStr = "<AlarmType value='" + cond.data[0].alarmType;
                        for (var i = 1; i < cond.data.length; i++) {
                            condStr += "," + cond.data[i].alarmType;
                        }
                        condStr += "' />";
                    }
                    return condStr;
                },
                ProbableCause: function (cond) {
                    var condStr = "";
                    if (cond.type === "ProbableCause" && cond.data.length > 0) {
                        condStr = "<ProbableCause value='" + cond.data[0].systemType + "#" + cond.data[0].code;
                        for (var i = 1; i < cond.data.length; i++) {
                            condStr += "," + cond.data[i].systemType + "#" + cond.data[i].code;
                        }
                        condStr += "' />";
                    }
                    return condStr;
                },
                RaisedTime: function (cond) {
                    var condStr = "";
                    if (cond.type === "RaisedTime" && cond.data.length === 1) {
                        condStr = "<RaisedTime model='" + cond.data[0].mode + "' start='" + cond.data[0].start + "' end= '" + cond.data[0].end + "' queryTimeZone='' condTimeZone='' />";
                    }
                    return condStr;
                },
                AckTime: function (cond) {
                    var condStr = "";
                    if (cond.type === "AckTime" && cond.data.length === 1) {
                        condStr = "<AckTime model='" + cond.data[0].mode + "' start='" + cond.data[0].start + "' end= '" + cond.data[0].end + "' queryTimeZone='' condTimeZone='' />";
                    }
                    return condStr;
                },
                ClearedTime: function (cond) {
                    var condStr = "";
                    if (cond.type === "ClearedTime" && cond.data.length === 1) {
                        condStr = "<ClearedTime model='" + cond.data[0].mode + "' start='" + cond.data[0].start + "' end= '" + cond.data[0].end + "' queryTimeZone='' condTimeZone='' />";
                    }
                    return condStr;
                },
                AlarmId: function (cond) {
                    var condStr = "";
                    if (cond.type === "AlarmId" && cond.data.length === 1) {
                        condStr = "<IDString value='" + cond.data[0].id + "'/>";
                    }
                    return condStr;
                },
                Moc: function (cond) {
                    var condStr = "";
                    if (cond.type === "Moc" && cond.data.length === 1) {
                        condStr = "<Moc Moc='" + cond.data[0].moc + "' SELECT_MODEL='false' MocSelf='true' />";
                    }
                    return condStr;
                },
                NeIp: function (cond) {
                    var condStr = "";
                    if (cond.type === "NeIp" && cond.data.length === 1) {
                        condStr = "<NeIp value='" + cond.data[0].neIp + "' />";
                    }
                    return condStr;
                }
            };

            var d = new Date();
            var JSonObj = {
                rule: {
                    ruleId: -1,
                    name: "Alarm",
                    creator: "admin",
                    createTime: d.getTime(),
                    modifier: "",
                    modifyTime: 0,
                    description: "",
                    state: true,
                    ruleType: ruleType,
                    ruleSort: 1,
                    owner: "",
                    attrs: "<Attrs/>"
                }
            };
            var condStr = "<CompoundCond>";
            for (var i = 0; i < conds.length; i++) {
                condStr += parser[conds[i].type](conds[i]);
            }
            JSonObj.rule.ruleData = condStr + "</CompoundCond>";
            //return JSON.stringify(JSonObj);
            return JSonObj;
        }

    };
}();