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
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { RuleModel } from './alarmRule';
import { RuleRequest } from './ruleRequest'
import { Router } from '@angular/router';
import { ModalService } from '../correlation-modal/modal.service';

@Injectable()
export class AlarmRuleService {
    private ruleUrl = "/api/correlation-mgt/v1/rule";
    private headers = new Headers({ 'Content-Type': 'application/json' });
    constructor(private http: Http, private modalService: ModalService, private router: Router) { }

    getRules(): Promise<any> {
        return this.http.get(this.ruleUrl)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error._body || error);
    }

    search(ruleid: string): Promise<RuleModel> {
        if (typeof (ruleid) == "string") {
            let rule = [{
                ruleid: null,
                rulename: null,
                description: null,
                content: null,
                createtime: null,
                creator: null,
                updatetime: null,
                modifier: null,
                enabled: 0,
            }]
        }
        let data = { 'ruleid': ruleid };
        var queryrequest = JSON.stringify(data);
        const url = `${this.ruleUrl}?queryrequest=${queryrequest}`;
        return this.http.get(url, this.headers)
            .toPromise()
            .then(res => res.json().rules as RuleModel)
            .catch(this.handleError);
    }

    searchrules(rule: RuleRequest): Promise<RuleModel[]> {
        let data = { rulename: rule.rulename, enabled: rule.enabled }
        console.log(JSON.stringify(data));
        const url = `${this.ruleUrl}?queryrequest=${JSON.stringify(data)}`
        return this.http.get(url, { body: data, headers: this.headers })
            .toPromise()
            .then(res => res.json().rules as RuleModel[])
            .catch(this.handleError);
    }

    checkContent(ruleContent: string): Promise<any> {
        const url = "/api/correlation-engine/v1/rule";
        let data = { content: ruleContent };
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(res => res)
            .catch(error => error);
    }

    updateRule(rule: RuleModel): Promise<any> {
        let rules = {
            "ruleid": rule.ruleid,
            "description": rule.description,
            "content": rule.content,
            "enabled": rule.enabled
        }
        const url = `${this.ruleUrl}`
        return this.http
            .post(url, JSON.stringify(rules), { headers: this.headers })
            .toPromise()
            .then(res => res)
            .catch(error => error)
    }

    save(rule: RuleModel): Promise<any> {
        let ruledata = {
            "description": rule.description,
            "content": rule.content,
            "enabled": rule.enabled,
            "rulename": rule.rulename
        }
        return this.http.put(this.ruleUrl, JSON.stringify(ruledata), { headers: this.headers })
            .toPromise()
            .then(res => res)
            .catch(error => error);
    }

    public delete(ruleid: string): Promise<void> {
        let ru = { 'ruleid': ruleid };
        const url = `${this.ruleUrl}`;
        return this.http.delete(url, { body: JSON.stringify(ru), headers: this.headers })
            .toPromise()
            .then(res => {
               
            })
            .catch(this.handleError);
    }
}