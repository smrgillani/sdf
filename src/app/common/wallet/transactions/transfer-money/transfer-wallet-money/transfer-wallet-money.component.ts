import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TransactionService } from 'app/common/services/transaction.service';
import { TransactionModel } from 'app/common/models/transaction-model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transfer-wallet-money',
  templateUrl: './transfer-wallet-money.component.html',
  styleUrls: ['./transfer-wallet-money.component.scss']
})
export class TransferWalletMoneyComponent implements OnInit {

  id: number;
  userInfo: any;
  transactionInfo: TransactionModel;
  objKeyMessage: any;
  walletList: any[] = [];
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('confirmPopUp') confirmPopUp;
  @ViewChild('f') public userFrm: NgForm;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private modalService: NgbModal) {
    this.id = parseInt(this.route.snapshot.params["user"]);
    this.transactionInfo = new TransactionModel();
    this.transactionInfo.amount.amount = null;
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.transactionService.getUserInfo(this.id).subscribe((info)=>{
      this.userInfo =info;
      this.transactionInfo.next_user = info.user;
      this.transactionInfo.mode = 'withdrawal';
      this.transactionInfo.status = 'success';
      this.transactionInfo.is_external = false;
      this.transactionInfo.user_to_user = true;
      this.transactionInfo.wallet = info.wallet[0];
      this.walletList = info.wallet;
    });
  }

  confirmWalletTransfer(form) {
    //if (form.valid) {
      this.popUpForShowInterestModalRef = this.modalService.open(this.confirmPopUp, {backdrop: false});  
    //}
  }

  validateAllFormFields(formGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      if (!formGroup.controls[field].valid) {
        const control = formGroup.controls[field];
        control.markAsTouched({ onlySelf: true });        
      }

    });
  }

  preCallSubmit(f) {
    this.userFrm.ngSubmit.emit();
    this.saveTransferInfo(this.userFrm);
  }

  saveTransferInfo(form) {
    this.transactionService.postTransaction(this.transactionInfo).subscribe((objInfo) => {
      this.popUpForShowInterestModalRef.close();
      this.transactionService.transactionInfoDataSubcritption.next(true);
      this.router.navigate([`./`], {relativeTo: this.route.parent});
    }, (errorMsg: any) => {
      this.popUpForShowInterestModalRef.close();
      console.log(errorMsg);
      this.checkForErrors(errorMsg, form);
    });
  }

  checkForErrors(errorMsg, form?) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : console.log(err);//form.controls['non_field_errors'].setErrors(newErr);
    });
  }

  cancel(){
    this.transactionInfo.amount.amount = null;
  }

}
