import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import * as moment from 'moment';

import { ApiService } from 'app/core/api/api.service';
import { HasId } from 'app/core/interfaces';
import { TransactionModel } from '../models/transaction-model';

export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

@Injectable()
export class TransactionService {

  transactionInfoDataSubcritption: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedProjectDataSubcritption: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private api: ApiService) { }

  getTransactionList(startPage?, pageSize?, stage?, search?, project?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('user/transaction-list', {offset: offset, limit: pageSize, stage: stage, search: search, project: project});
    }
    return this.api.get<any[]>('user/transaction-list');
  }

  getPendingTransactionList(startPage?, pageSize?, stage?, search?, project?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('user/pending-transaction-list', {offset: offset, limit: pageSize, stage: stage, search: search, project: project});
    }
    return this.api.get<any[]>('user/pending-transaction-list');
  }

  getCurrencyForSelectedBank(bank): Observable<string> {
    return this.api.get<string>(`user/bank-accounts/${bank}`);
  }

  postTransaction(transactionInfo: TransactionModel): Observable<TransactionModel>{
    return this.api.post('transactions', transactionInfo);
  }

  getWalletData(project = undefined): Observable<any> {
    return this.api.get<string>(`wallet-amount`, {project: project});
  }

  getUserList(term): Observable<any> {
    if (term === '') {
      return Observable.of([]);
    }

    return this.api.get(`user-list`, { search: term })
      .map((response) => response);
  }

  getUserInfo(id): Observable<any> {
    return this.api.get(`user-list/${id}`);
  }

  getTransferSendList(startPage?, pageSize?, stage?, search?, project?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      if (project){
        return this.api.get<any[]>('user/send-money-list', {offset: offset, limit: pageSize, stage: stage, search: search, project: project});
      }
      return this.api.get<any[]>('user/send-money-list', {offset: offset, limit: pageSize, stage: stage, search: search});
    }
    return this.api.get<any[]>('user/send-money-list');
  }

  getTransferReceivedList(startPage?, pageSize?, stage?, search?, project?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      if (project){
        return this.api.get<any[]>('user/received-money-list', {offset: offset, limit: pageSize, stage: stage, search: search, project: project});
      }
      return this.api.get<any[]>('user/received-money-list', {offset: offset, limit: pageSize, stage: stage, search: search});
    }
    return this.api.get<any[]>('user/received-money-list');
  }

  /*putTransaction<T extends HasId>(transactionInfo: T): Observable<TransactionModel>{
    return this.api.put<T, TransactionModel>(`transactions/${transactionInfo.id}`, transactionInfo);
  }

  deleteTransaction<T extends HasId>(transactionInfo: T): Observable<any> {
    return this.api.delete(`transactions/${transactionInfo.id}`);
  }*/

  getFundingDetailsList(startPage?, pageSize?, search?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('fund/project-backer-fund/details', {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<any[]>('fund/project-backer-fund/details');
  }

  getPendingTransList(startPage?, pageSize?, search?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('trading/pending-transactions', {offset: offset, limit: pageSize, q: search});
    }
    return this.api.get<any[]>('trading/pending-transactions');
  }

  getCompleteTransList(startPage?, pageSize?, search?): Observable<any[]>{
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('trading/complete-transactions', {offset: offset, limit: pageSize, q: search});
    }
    return this.api.get<any[]>('trading/complete-transactions');
  }

  getBalanceSheet(from_date: any, to_date: any): Observable<any> {
    return this.api.get('trading/balance-sheet', {from_date: from_date, to_date: to_date});
  }

  getBalanceSheetFile(from_date: any, to_date: any): Observable<any> {
    return this.api.postForFile('trading/balance-sheet', {from_date: from_date, to_date: to_date});
  }

  getUserProjectList(): Observable<any[]>{
    return this.api.get<any[]>('current-user/projects');
  }

}
