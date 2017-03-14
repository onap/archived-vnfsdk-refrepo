/*
 Copyright 2017 ZTE Corporation.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalService } from '../correlation-modal/modal.service';
import { RuleModel } from './alarmRule';
import { RuleRequest } from './ruleRequest';
import { Router } from '@angular/router';
import { Http, Response, Jsonp, Headers, RequestOptions } from '@angular/http';
import { AlarmRuleService } from './alarmRule.service';
declare var jQuery: any;

@Component({
    selector: 'alarmRule',
    templateUrl: './alarmRule.component.html',

})
export class AlarmRule implements OnInit {
    ruleModel: RuleModel;
    rules: RuleModel[];
    queryRule: RuleModel;
    activeText: string;
    ruleName: string;
    enable_on = "enabled";
    enable_off = "disabled"
    totalcount: number;
    model: any;
    ruleRequest: RuleRequest;
    solution = 'ANGULAR';
    selection = 'A'
    activeStatus = ["option_all", "common_enabled", "common_disabled"];

    constructor(public _alarmRuleService: AlarmRuleService, private modalService: ModalService,
        private router: Router) { };

    switch(select: string): void {
        console.log(select);
        if (select == "common_enabled") {
            this.ruleModel.enabled = 1;
        } else if (select == "common_disabled") {
            this.ruleModel.enabled = 0;
        } else {

            this.ruleModel.enabled = null;
        }
        this.setActiveText();
    };

    setActiveText(): void {
        if (this.ruleModel.enabled == 1) {
            this.activeText = "common_enabled";
            this.ruleRequest.enabled = 1;
        }
        else if (this.ruleModel.enabled == 0) {
            this.activeText = "common_disabled";
            this.ruleRequest.enabled = 0;
        } else {
            this.activeText = "option_all";
            this.ruleRequest.enabled = null;
        }
    };

    getRules(): Promise<any> {
        return this._alarmRuleService
            .getRules()
            .then(rules => {
                this.rules = rules.rules;
                this.totalcount = rules.totalcount;
            });
    }

    searchRules(): void {
        if (this.ruleModel.enabled == null) {
            this.ruleRequest.enabled = null;
        }
        this.ruleRequest.rulename = this.ruleModel.rulename;
        console.log(this.ruleRequest.enabled, this.ruleRequest.rulename);

        this._alarmRuleService
            .searchrules(this.ruleRequest)
            .then(rules => {
                this.rules = rules;
                this.totalcount = rules.length;
            });
    }
    updateRule(rule: RuleModel): void {
        this.router.navigate(['ruleInfo/', rule.ruleid]);
    }

    delete(rule: RuleModel): void {
        rule.enabled == 1 ? this.deleteActiveRule(rule) : this.deleteModel(rule.ruleid, this._alarmRuleService, this);
    }

    on_off(rule: RuleModel) {
        rule.enabled == 0 ? rule.enabled = 1 : rule.enabled = 0;
        this._alarmRuleService
            .updateRule(rule)
            .then(res => {
                rule = res;
            });
    }

    reset(): void {
        this.ruleModel.rulename = null;
        this.activeText = "option_all";
        this.ruleModel.enabled = null;
        this.getRules();
    }

    deleteActiveRule(rule: RuleModel): void {
        jQuery("#" + rule.ruleid).popModal({
            html: jQuery('#deleteActiveRuleContent'),
            placement: 'leftTop',
            showCloseBut: false,
            onDocumentClickClose: true,
            onOkBut: function () {
            },
        });
    }
    deleteModel(ruleid: string, alarm: AlarmRuleService, obj: any): void {
        jQuery("#" + ruleid).popModal({
            html: jQuery('#deleteTimingTaskContent'),
            placement: 'leftTop',
            showCloseBut: false,
            onDocumentClickClose: true,
            onOkBut: function () {
                jQuery("#deleteTimingTaskDlg").append(jQuery('#deleteTimingTaskContent'));
                alarm.delete(ruleid);
                obj.getRules();
            },
            onCancelBut: function () {
            }
        });
    }

    ngOnInit(): void {
        this.activeText = "option_all";
        this.ruleModel = {
            ruleid: null,
            rulename: null,
            description: "",
            content: null,
            createtime: null,
            creator: null,
            updatetime: null,
            modifier: null,
            enabled: 0,
        }
        this.ruleRequest = {
            ruleid: null,
            rulename: null,
            creator: null,
            modifier: null,
            enabled: null,
        }
        this.getRules();
    }
}
