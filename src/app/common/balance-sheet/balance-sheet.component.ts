import { AfterViewInit, Component } from '@angular/core';
import * as moment from 'moment';

import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss'],
})
export class BalanceSheetComponent implements AfterViewInit {
  fromDate: Date = moment(new Date()).add(-1, 'months').toDate();
  toDate: Date = new Date();

  income = 0;
  expenses = 0;
  error: string = null;

  constructor(
    private transactionService: TransactionService,
  ) { }

  ngAfterViewInit() {
    this.fetchPreviewBalanceSheet();
  }

  onStartDateChange(from_date: Date) {
    if (this.toDate < from_date) {
      this.toDate = moment(from_date).add(1, 'months').toDate();
    }

    this.fetchPreviewBalanceSheet();
  }

  onEndDateChange(to_Date: Date) {
    if (this.fromDate > to_Date) {
      this.fromDate = moment(to_Date).add(-1, 'months').toDate();
    }

    this.fetchPreviewBalanceSheet();
  }

  fetchPreviewBalanceSheet() {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.toDate).format('YYYY-MM-DD');

    this.transactionService.getBalanceSheet(fromDate, toDate).subscribe((data: {income: number, expenses: number}) => {
      this.income = data.income;
      this.expenses = data.expenses;
      this.error = null;
    }, (error: {records: string}) => {
      this.income = 0;
      this.expenses = 0;
      this.error = error.records;
    });
  }

  generateBalanceSheet(f) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.toDate).format('YYYY-MM-DD');

    this.transactionService.getBalanceSheetFile(fromDate, toDate).subscribe(obj => {
      const link = document.createElement('a');
      link.download = 'balance_sheet.pdf';

      const fileReader = new FileReader();
      const blob = new Blob([obj._body], {type: 'contentType'});

      fileReader.readAsDataURL(blob);
      fileReader.onloadend = (event: ProgressEvent) => {
        if (event.target['result']) {
          link.href = event.target['result'];

          link.click();
        }
      };

    }, (errorMsg: any) => {
      this.income = 0;
      this.expenses = 0;
      this.error = errorMsg;
    });
  }
}
