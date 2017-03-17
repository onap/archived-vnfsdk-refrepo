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
import { Component, OnInit, Input } from '@angular/core';
import { RuleModel } from '../correlation-ruleList/alarmRule';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlarmRuleService } from '../correlation-ruleList/alarmRule.service';
import { Http, Response, Headers } from '@angular/http';
import { ModalService } from '../correlation-modal/modal.service';
import { NgModel } from '@angular/forms';
declare var $: any;
@Component({
    selector: 'RuleInfo',
    templateUrl: './ruleInfo.component.html'
})
export class RuleInfo implements OnInit {
    formModel: RuleModel;
    queryRule: RuleModel;
    id: number;
    addBottonStatus: boolean;
    constructor(private modalService: ModalService, private route: ActivatedRoute, private router: Router, private alarmRuleService: AlarmRuleService, http: Http) { };

    update() {
        this.queryRule.enabled = $('input:radio:checked').val();
        if (!this.queryRule.content.startsWith("package ")) {
            let msg = { title: "exception_content_error", message: "exception_package_error" };
            this.modalService.getmodalObservable.next(msg);
        } else {

            this.alarmRuleService.checkContent(this.queryRule.content)
                .then(res => {
                    if (res.status == 200) {
                        this.alarmRuleService.updateRule(this.queryRule)
                            .then(res => {
                                if (res.status == 200) {
                                    let msg = { title: "modalTitleUpdate", message: "message_update_rule_success" };
                                    this.modalService.getmodalObservable.next(msg);
                                    this.router.navigate(['alarmRule']);
                                } else if (res.status == 499) {
                                    let msg = { title: "modalTitleUpdate", message: "message_exception_rule_fail" };
                                    this.modalService.getmodalObservable.next(msg);
                                } else {
                                    let msg = { title: "modalTitleUpdate", message: "message_other_exception_rule_fail" };
                                    this.modalService.getmodalObservable.next(msg);
                                }
                            }).catch(
                            res => {
                                let msg = { title: "modalTitleUpdate", message: "message_other_exception_rule_fail" };
                                this.modalService.getmodalObservable.next(msg);
                            }
                            );

                    } else if (res.status == 499) {
                        let msg = { "title": "modalTitleCheck", message: "message_rule_content_repeat_error" };
                        this.modalService.getmodalObservable.next(msg);
                        return false;
                    } else {
                        let msg = { "title": "modalTitleCheck", message: "message_other_exception_rule_fail" };
                        this.modalService.getmodalObservable.next(msg);
                        return false;
                    }
                })
        }
    }

    onSubmit(obj: NgModel) {
        this.save();
    }

    save() {
        if (!this.queryRule.content.startsWith("package ")) {
            let msg = { title: "exception_content_error", message: "exception_package_error" };
            this.modalService.getmodalObservable.next(msg);
        } else {
            this.alarmRuleService.checkContent(this.queryRule.content).then(res => {
                if (res.status == 200) {
                    this.alarmRuleService.save(this.queryRule).then(res => {
                        if (res.status == 200) {
                            let msg = { title: "modalTitleDefault", message: "message_add_rule_success" };
                            this.modalService.getmodalObservable.next(msg);
                            this.router.navigate(['alarmRule']);
                        } else if (res.status == 499) {
                            let msg = { title: "modalTitleDefault", message: "message_rule_name_repeat_error" };
                            this.modalService.getmodalObservable.next(msg);
                        } else {
                            let msg = { "title": "modalTitleCheck", message: "message_other_exception_rule_fail" };
                            this.modalService.getmodalObservable.next(msg);
                        }

                    }).catch(error => {
                        let msg = { title: "modalTitleDefault", message: "message_rule_name_repeat_error" };
                        this.modalService.getmodalObservable.next(msg);
                    });
                    return true;
                } else if (res.status == 499) {
                    let msg = { "title": "modalTitleCheck", message: "message_rule_content_repeat_error" };
                    this.modalService.getmodalObservable.next(msg);
                    return false;
                } else {
                    let msg = { "title": "modalTitleCheck", message: "message_other_exception_rule_fail" };
                    this.modalService.getmodalObservable.next(msg);
                    return false;
                }
            })
        }
    }

    getRuleInfo(id: string): void {
        this.route.params.switchMap((params: Params) => this.alarmRuleService.search(id))
            .subscribe(rule => {
                rule[0].enabled = "" + rule[0].enabled;
                this.queryRule = rule[0]
            })
    }

    checkContent(judge: string): void {
        if (!this.queryRule.content.startsWith("package ")) {
            let msg = { title: "exception_content_error", message: "exception_package_error" };
            this.modalService.getmodalObservable.next(msg);
        } else {
            this.alarmRuleService.checkContent(this.queryRule.content)
                .then(res => {
                    if (res.status == 200) {
                        let msg = { "title": "modalTitleCheck", message: "message_checkContent_rule_success" };
                        this.modalService.getmodalObservable.next(msg);
                    } else if (res.status == 499) {
                        let msg = { "title": "modalTitleCheck", message: "message_rule_content_repeat_error" };
                        this.modalService.getmodalObservable.next(msg);
                        return false;
                    } else {
                        let msg = { "title": "modalTitleCheck", message: "message_other_exception_rule_fail" };
                        this.modalService.getmodalObservable.next(msg);
                        return false;
                    }
                });
        }
    }
    switch(): void {
        // alert(this.queryRule.enabled);
        this.queryRule.enabled == '0' ? this.queryRule.enabled = '1' : this.queryRule.enabled = '0';
    }


    initUpload(queryRule: RuleModel): void {
        $("#fileName").text("");
        $("#importFailTip").addClass("hide_panel");
        $("#fileupload").fileupload({

            dropZone: $('#dropzone'),
            maxNumberOfFiles: 1,
            maxChunkSize: 20000000,
            autoUpload: false,
            add: function (e, data) {
                var fileName = data.files[0].name;

                $("#importFailTip").addClass("hide_panel");
                let suffix = fileName.substring(fileName.lastIndexOf("."), fileName.length)

                if (suffix != ".txt") {
                    $("#importFailTip").removeClass("hide_panel");
                    return suffix;
                }

                $("#bar").css('width', '0%');
                $("#persent").text('0%');
                $("#fileName").text(fileName);
                $("#fileremove").attr("disabled", false);
                $("#filesubmit").attr("disabled", false);
                $("#filesubmit").click(function () {
                    this.file = data.files[0]
                    var reader = new FileReader();
                    reader.readAsText(this.file);
                    reader.onload = function (data) {
                        queryRule.content = this.result;
                    }
                    $("#fileremove").click();
                    $("#importDiv").hide();
                    e.stopPropagation();
                });

                $("#fileremove").click(function () {
                    $("#bar").css('width', '0%');
                    $("#persent").text("0%");
                    $("#fileName").text("");
                    $("#filesubmit").attr("disabled", true);
                    $("#fileremove").attr("disabled", true);
                });
            },
            done: function (e, data) {

            },
            fail: function (e, resp) {
            },
            always: function (e, data) {
                $(".progress").removeClass("active");
                $("#bar").css('width', '100%');
                $("#persent").text('100%');
            },
            progressall: function (e, data) {
            }
        });
    }

    initImportDiv(queryRule: RuleModel): void {
        this.initUpload(queryRule);
        var importDiv = $("#importDiv");
        $(function (arg) {
            $("#importBtn").click(function (e) {
                e.preventDefault();
                $("[data-toggle='tooltip']").tooltip();
                $("#importFailTip").addClass("hide_panel");
                showDiv();
                $(document).one("click", function (e) {
                    $(importDiv).hide();
                });
                e.stopPropagation();
            });
            $(importDiv).click(function (e) {
                e.stopPropagation();
            });
            $("#filesubmit").attr("disabled", true);
            $("#fileremove").attr("disabled", true);
        });
        function showDiv() {
            $("#bar").css('width', '0%');
            $("#persent").text('0%');
            $(importDiv).fadeIn();
        }
    }
    ngOnInit() {
        this.formModel = {
            ruleid: null,
            rulename: null,
            description: null,
            content: null,
            createtime: null,
            creator: null,
            updatetime: null,
            modifier: null,
            enabled: null,
        }
        this.queryRule = {
            ruleid: null,
            rulename: null,
            description: null,
            content: null,
            createtime: null,
            creator: null,
            updatetime: null,
            modifier: null,
            enabled: 0,
        }

        this.route.params.subscribe((params) => {

            let id = params['id'];
            if (typeof (id) == "string") {
                if (id.indexOf('&') == -1) {
                    $("#ruleNameInput").attr("disabled", true);
                    $("#saveLabel").hide();
                } else {
                    this.addBottonStatus = false;
                    $("#saveLabel").hide();
                    $("#checkLabel").hide();
                    $("#updateLabel").hide();
                }

                let str = id.split("&");
                this.getRuleInfo(str[0]);
            } else if (typeof (id) != "undefined") {
                this.getRuleInfo(id);
            } else {
                $("#updateLabel").hide();
            }
            if (typeof (this.queryRule.enabled) === "number") {
                this.queryRule.enabled = "" + this.queryRule.enabled;
            }
        })

        this.initImportDiv(this.queryRule);
    }

}