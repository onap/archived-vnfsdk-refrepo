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
import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from './modal.service';
import { Msg } from './msg';
declare var $: any;
@Component({

    selector: 'sif-modal',
    templateUrl: './modal.component.html',

})
export class SifModalComponent implements OnInit {
    constructor(private modalServer: ModalService) { };
    modalTitle: string = "modalTitleDefault";
    modalBodyMessage: string = "modalBodyMessageDefault";
    closeBtnTitle: string = "closeBtnTitleDefault";

    ngOnInit(): void {
        console.log('init');
        this.modalServer.getmodalObservable.subscribe((msg: Msg) => {
            console.log('receive ' + msg);
            this.modalTitle = msg.title || this.modalTitle;
            this.modalBodyMessage = msg.message || this.modalBodyMessage;
            this.closeBtnTitle = msg.btn || this.closeBtnTitle;
            $('#myModal').modal('show');
        });
    }


}
