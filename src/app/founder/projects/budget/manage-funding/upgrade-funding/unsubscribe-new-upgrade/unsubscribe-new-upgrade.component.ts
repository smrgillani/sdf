import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {UpgradeModel, UpgradePackageModel} from 'app/projects/models/upgrade-model';

@Component({
  selector: 'app-unsubscribe-new-upgrade',
  templateUrl: './unsubscribe-new-upgrade.component.html',
  styleUrls: ['./unsubscribe-new-upgrade.component.scss']
})
export class UnsubscribeNewUpgradeComponent implements OnInit {

  @Input() currentPackage: UpgradePackageModel;
  @Output() emitService = new EventEmitter();

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  subscribe() {
    this.emitService.next(true);
    this.activeModal.close();
  }

}
