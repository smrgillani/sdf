import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { TransactionService } from '../../../../../services/transaction.service';
import { TransactionModel } from '../../../../../models/transaction-model';

@Component({
  selector: 'app-transfer-to-self',
  templateUrl: './transfer-to-self.component.html',
  styleUrls: ['./transfer-to-self.component.scss'],
})
export class TransferToSelfComponent implements OnInit {
  walletAmount: number;
  @Output() private completedTransaction = new EventEmitter<number>();
  currentUserProjectList: SelectItem[] = [];
  transactionInfo = new TransactionModel();
  objKeyMessage: any;

  constructor(
    private transactionService: TransactionService,
  ) {
    this.transactionInfo.mode = 'withdrawal';
  }

  ngOnInit() {
    this.transactionService.getUserProjectList().subscribe(Projects => {
      this.currentUserProjectList = [];

      Projects.forEach(value => {
        this.currentUserProjectList.push({
          value: value.id, label: value.title,
        });
      });
    });

    this.transactionService.getWalletData()
      .subscribe((info: any) => {
        this.walletAmount = info.wallet;
      });
  }

  switchTransactionMode() {
    this.transactionInfo.mode === 'withdrawal' ? this.transactionInfo.mode = 'deposit' : this.transactionInfo.mode = 'withdrawal';
  }

  saveTransactionInfo(form) {
    this.transactionInfo.user_to_user = true;
    this.transactionService.postTransaction(this.transactionInfo).subscribe((objInfo) => {
      this.transactionInfo.amount.amount = null;
      this.transactionInfo.remark = null;
      this.transactionInfo.project = null;
      this.transactionInfo.mode = null;
      this.completedTransaction.emit(1);
      // this.successMessage();
      this.transactionService.transactionInfoDataSubcritption.next(true);
    }, (errorMsg: any) => {
      console.log(errorMsg);
      this.checkForErrors(errorMsg, form);
    });
  }

  reset() {
    this.transactionInfo.amount.amount = null;
    this.transactionInfo.project = null;
    this.transactionInfo.remark = null;
  }

  private checkForErrors(errorMsg, form?) {
    const newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : form.controls['non_field_errors'].setErrors(newErr);
    });
  }
}
