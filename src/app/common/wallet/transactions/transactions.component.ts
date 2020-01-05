import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { TransactionService } from '../../services/transaction.service';
import { RoleService } from 'app/core/role.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  is_fund = false;
  selectedType = '';
  walletAmount: number;
  selectedProject: string;
  selectedProjectTitle = 'Personal';
  is_changeProject = false;
  currentUserProjectList: SelectItem[] = [];
  currentRole: any;

  constructor(
    private _location: Location,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
  ) {
  }

  ngOnInit() {
    this.getTransactionList(1);
    this.getCurrentUserProjectList();
    this.getUserRole();
  }

  selectedFundType(fundType: string) {
    this.selectedType = fundType;
    this.is_fund = !this.is_fund;
  }

  navToTransferFund() {
    this.router.navigate([`../transfer-money`], {relativeTo: this.route});
  }

  onSelectedProject() {
    this.getTransactionList(1);
    this.selectedProjectTitle = _.find(this.currentUserProjectList, (q) => q.value === this.selectedProject).label;
    this.is_changeProject = false;
  }

  getTransactionList(newPage) {
    if (newPage) {
      this.transactionService.getTransactionList(newPage, 5, null, null, this.selectedProject)
        .subscribe((transactionList: any) => {
          this.walletAmount = transactionList.wallet;
        });
    }
  }

  onCanceled() {
    this.selectedType = '';
    this.is_fund = false;
  }

  private getCurrentUserProjectList() {
    this.transactionService.getUserProjectList().subscribe(Projects => {
      this.currentUserProjectList = [];
      this.currentUserProjectList.push({
        label: 'Personal', value: undefined,
      });
      Projects.forEach(value => {
        this.currentUserProjectList.push({
          value: value.id, label: value.title,
        });
      });
    });
  }

  private getUserRole() {
    this.currentRole = this.roleService.getCurrentRole();
  }

  onBack() {
    if (!this.is_fund) {
      this._location.back();
    } else {
      this.is_fund = !this.is_fund;
    }
  }
}
