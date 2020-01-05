import { Component, OnInit, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { TransactionService } from '../../../services/transaction.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankAccountModel } from '../../../models/bank-account-model';
import { TransactionModel } from '../../../models/transaction-model';
import { RoleService } from 'app/core/role.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-deposit-withdraw-fund',
  templateUrl: './deposit-withdraw-fund.component.html',
  styleUrls: ['./deposit-withdraw-fund.component.scss'],
})
export class DepositWithdrawFundComponent implements OnInit, AfterViewInit {
  bankAccountList: SelectItem[] = [];
  currentUserProjectList: SelectItem[] = [];
  transactionInfo = new TransactionModel();
  objKeyMessage: any;
  showSuccessMessage = false;
  currentRole: any;
  authorizeNetUrl = environment.authorizeNetUrl;
  token: string;
  _bankMode = false;
  iframeHeight = '550px';
  private bankAccountInfoList: BankAccountModel[] = [];
  private bankAccountInfo = new BankAccountModel();
  private _creditMode = false;

  @Input() selectedType;
  @Output() private completedTransaction = new EventEmitter<number>();
  @Output() private canceled = new EventEmitter<void>();

  @ViewChild('form') private form: ElementRef;
  @ViewChild('dummylabel') private dummylabel: ElementRef;

  constructor(
    private transactionService: TransactionService,
    private bankAccountService: BankAccountService,
    private zone: NgZone,
    private roleService: RoleService,
  ) {
  }

  ngOnInit() {
    this.getUserRole();

    if (this.selectedType !== 'deposit') {
      this._bankMode = true;
      this.getBankInfo();
    }

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

  ngAfterViewInit() {
    window['CommunicationHandler'] = {};
    window['CommunicationHandler'].onReceiveCommunication = (argument) => {
      console.log('iFrame argument: ' + JSON.stringify(argument));
      // Get the parameters from the argument.
      const params = this.parseQueryString(argument.qstr);

      switch (params['action']) {
        case 'resizeWindow':
          // {"qstr":"action=resizeWindow&width=551&height=825","parent":"https://test.authorize.net/customer/addPayment"}
          // We can use this to resize the window, if needed. Just log it for now.
          this.iframeHeight = `${+params['height'] + 50}px`;
          console.log(this.iframeHeight);
          // if (this.config.isDevEnvironment()) {
          //   message = 'resizeWindow from iframe\n';
          //   message += 'Width: ' + params['width'] + '\n';
          //   message += 'Height: ' + params['height'];
          //   console.log(message);
          // }
          break;
        case 'successfulSave':
          console.log('successful save');
          // {"qstr":"action=successfulSave","parent":"https://test.authorize.net/customer/addPayment"}
          // if (this.config.isDevEnvironment()) { console.log('successfulSave from iframe'); }
          // this.AddCardSuccessful();
          break;
        case 'cancel':
          console.log('cancel event');
          this.hideIframe();
          // {"qstr":"action=cancel","parent":"https://test.authorize.net/customer/addPayment"}
          // if (this.config.isDevEnvironment()) { console.log('cancel from iframe'); }
          // this.CancelAddCard();
          break;
        case 'transactResponse':
          // if (this.config.isDevEnvironment()) { console.log('transactResponse from iframe'); }
          // sessionStorage.removeItem("HPTokenTime");
          console.log('transaction complete');
          const transResponse = JSON.parse(params['response']);
          this.postAuthorizeNetResponse(transResponse);
          break;
        default:
          console.log('Unknown action from iframe. Action: ' + params['action']);
          break;
      }
    };
  }

  selectMode(mode: string) {
    this.token = null;
    this.transactionInfo.amount.amount = null;

    this._bankMode = mode === 'bank';
    this._creditMode = mode === 'credit';

    if (this._bankMode) {
      this.getBankInfo();
    }
  }

  proceedToPayByCC() {
    // amount should be pass from here
    this.bankAccountService.getACHFormToken(this.transactionInfo.amount.amount).subscribe((data) => {
      this.token = data.token;
      // access the form by viewchild and do submit to generate the CC details area
      setTimeout(() => {
        const el: HTMLFormElement = this.form.nativeElement as HTMLFormElement;
        el.submit();
      }, 500);
    });
  }

  getSelectedBankCurrency(value?) {
    this.bankAccountInfo = this.bankAccountInfoList.filter(a => a.id === value)[0];
    this.transactionInfo.amount.currency = this.bankAccountInfo.currency;
  }

  saveTransactionInfo(form) {
    this.transactionInfo.mode = this.selectedType;
    this.transactionInfo.is_external = true;
    console.log(this.transactionInfo);

    this.transactionService.postTransaction(this.transactionInfo).subscribe(() => {
      this.transactionInfo.amount.amount = null;
      this.transactionInfo.mode = this.selectedType;
      this.transactionInfo.remark = '';
      this._bankMode = false;
      this._creditMode = false;
      this.setDefaultBank();
      this.completedTransaction.emit(1);
      this.successMessage();
    }, (errorMsg: any) => {
      console.log(errorMsg);
      this.checkForErrors(errorMsg, form);
    });
  }

  cancel() {
    this._bankMode = false;
    this._creditMode = false;
    this.transactionInfo.amount.amount = null;
    this.canceled.emit();
  }

  private parseQueryString(str) {
    const vars = [];
    const arr = str.split('&');
    let pair;

    for (let i = 0; i < arr.length; i++) {
      pair = arr[i].split('=');
      // vars[pair[0]] = unescape(pair[1]);
      vars[pair[0]] = pair[1];
    }

    return vars;
  }

  private hideIframe() {
    this._creditMode = false;
    this._bankMode = false;
    this.token = null;
    this.transactionInfo.amount.amount = null;
    setTimeout(() => {
      const el: HTMLDivElement = this.dummylabel.nativeElement as HTMLDivElement;
      el.click();
    }, 500);
  }

  private getBankInfo() {
    // checking if bank account already filed.
    if (this.bankAccountList.length === 0) {
      this.bankAccountService.getBankAccounts().subscribe((bankAccounts) => {
        this.bankAccountInfoList = bankAccounts;
        this.setDefaultBank();
        this.bankAccountInfoList.forEach(value => {
          this.bankAccountList.push({label: value.bank_name, value: value.id});
        });
      });
    }
  }

  private getUserRole() {
    this.currentRole = this.roleService.getCurrentRole();
  }

  private postAuthorizeNetResponse(transResponse: any) {
    transResponse.project = this.transactionInfo.project;
    this.bankAccountService.postAuthorizeNetResponse(transResponse).subscribe((data) => {
      console.log('recieve data from python', data);
      this.completedTransaction.emit(1);
      this.successMessage();
      this.hideIframe();
    });
  }

  private setDefaultBank() {
    this.bankAccountInfo = this.bankAccountInfoList.filter(a => a.is_default === true)[0];
    if (this.bankAccountInfo) {
      this.transactionInfo.amount.currency = this.bankAccountInfo.currency;
      this.transactionInfo.bank_account = this.bankAccountInfo.id;
    }
  }

  private successMessage() {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
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
