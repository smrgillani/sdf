import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppElementsModule } from 'app/elements/elements.module';
import { EmployeeRatingComponent } from './employee-rating/employee-rating.component';
import { MyPrimeNgModule } from 'app/my-prime-ng.module';
import { NavbarModule } from 'app/core/navbar/navbar.module';

import {
  NgbModule,
  NgbCollapseModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TaskAttributesComponent } from './employee-rating/task-attributes/task-attributes.component';
import { EmployeeRatingService } from '../projects/employee-rating.service';
import { WalletComponent } from './wallet/wallet.component';
import { BankAccountComponent } from './wallet/bank-account/bank-account.component';
import { TransactionsComponent } from './wallet/transactions/transactions.component';
import { TradeHistoryComponent } from './wallet/trade-history/trade-history.component';
import { PendingTransactionsComponent } from './wallet/transactions/pending-transactions/pending-transactions.component';
import { CompletedTransactionsComponent } from './wallet/transactions/completed-transactions/completed-transactions.component';
import { TradePendingTransactionsComponent } from './wallet/trade-history/trade-pending-transactions/trade-pending-transactions.component';
import {
  TradeCompletedTransactionsComponent,
} from './wallet/trade-history/trade-completed-transactions/trade-completed-transactions.component';
import { FundingDetailsComponent } from './wallet/trade-history/funding-details/funding-details.component';
import { BankAccountService } from './services/bank-account.service';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './services/transaction.service';
import { DepositWithdrawFundComponent } from './wallet/transactions/deposit-withdraw-fund/deposit-withdraw-fund.component';
import { LinkInitializeDirective } from 'app/common/wallet/bank-account/link-initialize.directive';
import { TransferMoneyComponent } from './wallet/transactions/transfer-money/transfer-money.component';
import { TransferOverviewComponent } from './wallet/transactions/transfer-money/transfer-overview/transfer-overview.component';
import { SendMoneyListComponent } from './wallet/transactions/transfer-money/transfer-overview/send-money-list/send-money-list.component';
import {
  ReceivedMoneyListComponent,
} from './wallet/transactions/transfer-money/transfer-overview/received-money-list/received-money-list.component';
import { TransferWalletMoneyComponent } from './wallet/transactions/transfer-money/transfer-wallet-money/transfer-wallet-money.component';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import {
  TransferToSelfComponent,
} from './wallet/transactions/transfer-money/transfer-overview/transfer-to-self/transfer-to-self.component';


@NgModule({
  imports: [
    CommonModule,
    AppElementsModule,
    NgbModule,
    FormsModule,
    MyPrimeNgModule,
    NavbarModule,
    NgbCollapseModule,
    RouterModule,
    AppPipesModule,
  ],
  exports: [
    LinkInitializeDirective,
  ],
  declarations: [
    EmployeeRatingComponent,
    TaskAttributesComponent,
    WalletComponent,
    BankAccountComponent,
    TransactionsComponent,
    TradeHistoryComponent,
    PendingTransactionsComponent,
    CompletedTransactionsComponent,
    TradePendingTransactionsComponent,
    TradeCompletedTransactionsComponent,
    FundingDetailsComponent,
    DepositWithdrawFundComponent,
    LinkInitializeDirective,
    TransferMoneyComponent,
    TransferOverviewComponent,
    SendMoneyListComponent,
    ReceivedMoneyListComponent,
    TransferWalletMoneyComponent,
    BalanceSheetComponent,
    TransferToSelfComponent,
  ],
  providers: [EmployeeRatingService, BankAccountService, TransactionService],
})
export class CommonComponentModule {
}
