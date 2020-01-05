import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Location } from '@angular/common';
import * as _ from 'lodash';

import { TransactionService } from 'app/common/services/transaction.service';
import { RoleService } from 'app/core/role.service';

@Component({
  selector: 'app-transfer-money',
  templateUrl: './transfer-money.component.html',
  styleUrls: ['./transfer-money.component.scss'],
})
export class TransferMoneyComponent implements OnInit {
  walletAmount: number;
  selectedProject: string;
  selectedProjectTitle = 'Personal Wallet';
  is_changeProject = false;
  currentUserProjectList: SelectItem[];
  currentRole: any;

  constructor(
    private _location: Location,
    private transactionService: TransactionService,
    private roleService: RoleService,
  ) {
    this.getWalletData();
    this.currentUserProjectList = [];
  }

  ngOnInit() {
    this.transactionService.transactionInfoDataSubcritption.subscribe((info) => {
      if (info) {
        this.getWalletData();
      }
      this.getCurrentUserProjectList();
      this.getUserRole();
    });

    this.transactionService.selectedProjectDataSubcritption.next(null);
  }

  onSlectedProject() {
    this.getWalletData();
    this.selectedProjectTitle = _.find(this.currentUserProjectList, q => q.value === this.selectedProject).label;
    this.transactionService.selectedProjectDataSubcritption.next(this.selectedProject);
    this.is_changeProject = false;
  }

  getWalletData() {
    this.transactionService.getWalletData(this.selectedProject)
      .subscribe((info: any) => {
        this.walletAmount = info.wallet;
      });
  }

  getCurrentUserProjectList() {
    this.transactionService.getUserProjectList().subscribe(Projects => {
      this.currentUserProjectList = [];

      this.currentUserProjectList.push({
        label: 'Personal Wallet', value: undefined,
      });

      Projects.forEach(value => {
        this.currentUserProjectList.push({
          value: value.id, label: value.title,
        });
      });
    });
  }

  getUserRole() {
    this.currentRole = this.roleService.getCurrentRole();
  }
}
