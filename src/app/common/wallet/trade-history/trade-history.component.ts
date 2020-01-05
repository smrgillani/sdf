import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { TransactionService } from 'app/common/services/transaction.service';
import { RoleService } from 'app/core/role.service';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss']
})
export class TradeHistoryComponent implements OnInit {

  walletAmmount: number;
  currentRole: any;

  constructor(private _location: Location, private router: Router, private transactionService: TransactionService, private roleService: RoleService) { }

  ngOnInit() {
    this.getWalletAmounr(1);
    this.getUserRole();
  }

  getWalletAmounr(newPage) {
    if (newPage) {
      this.transactionService.getTransactionList(newPage, 5, null, null)
        .subscribe((transactionList: any) => {
          this.walletAmmount = transactionList.wallet;
        });
    }
  }

  getUserRole() {
    this.currentRole = this.roleService.getCurrentRole();
  }

}
