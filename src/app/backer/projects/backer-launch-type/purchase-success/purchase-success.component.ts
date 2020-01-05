import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
    selector: 'app-purchase-success',
    templateUrl: './purchase-success.component.html',
    styleUrls: ['./purchase-success.component.scss']
})
export class BackerPurchaseSuccessComponent implements OnInit {

    @Output() onDone = new EventEmitter();

    constructor(private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {

    }

    backToManageFunding() {
        this.onDone.emit();
    }
}