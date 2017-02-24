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
import { Component,OnInit } from '@angular/core';
import {TranslateService} from 'ng2-translate';
@Component({
    selector: 'remote-config',
    templateUrl: './pages/remote.component.html',
})
export class AppComponent implements OnInit{
     constructor(private translate:TranslateService){}
     getLanguage():string{
        let rtnLanguage = localStorage.getItem("language-option");
        if( rtnLanguage == "null" || rtnLanguage == null ){
            rtnLanguage =window.navigator.language;
        }
        if( rtnLanguage.startsWith('en') ){
            return "en-US";
        }
        return rtnLanguage;
    }

    ngOnInit():void {
        this.translate.addLangs(["en", "zh"]);
        this.translate.setDefaultLang('zh');
        let language = this.getLanguage();
        this.translate.use(language);
    }
}