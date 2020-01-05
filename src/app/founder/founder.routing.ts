import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FounderHomeComponent } from './home/home.component';
import { IsTemporaryUser } from 'app/auth/permissions';
import { TextEditorComponent } from 'app/elements/text-editor/text-editor.component';
import { EmployeeRatingComponent } from 'app/common/employee-rating/employee-rating.component';
import { WalletComponent } from 'app/common/wallet/wallet.component';
import { BankAccountComponent } from 'app/common/wallet/bank-account/bank-account.component';
import { TransactionsComponent } from 'app/common/wallet/transactions/transactions.component';
import { TradeHistoryComponent } from 'app/common/wallet/trade-history/trade-history.component';
import { FundingDetailsComponent } from 'app/common/wallet/trade-history/funding-details/funding-details.component';
import { TransferMoneyComponent } from 'app/common/wallet/transactions/transfer-money/transfer-money.component';
import { TransferOverviewComponent } from 'app/common/wallet/transactions/transfer-money/transfer-overview/transfer-overview.component';
import {
  TransferWalletMoneyComponent,
} from 'app/common/wallet/transactions/transfer-money/transfer-wallet-money/transfer-wallet-money.component';
import { BalanceSheetComponent } from 'app/common/balance-sheet/balance-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: FounderHomeComponent,
  },
  {
    path: 'idea',
    loadChildren: './idea/idea.module#IdeaModule',
  },
  {
    path: 'projects',
    loadChildren: 'app/founder/projects/projects.module#FounderProjectsModule',
    // canActivate: [IsTemporaryUser]
  },
  {
    path: 'forum-overview',
    loadChildren: 'app/founder/forum/forum.module#ForumModule',
  },
  {
    path: 'account',
    loadChildren: 'app/founder/account/account.module#FounderAccountModule',
  },
  {
    path: 'startup/:id',
    loadChildren: './startup/startup.module#FounderStartupModule',
    // canActivate: [IsRegularUser]
  },
  {
    path: 'editor',
    component: TextEditorComponent,
  },
  {
    path: 'chat-rooms',
    loadChildren: 'app/chat/chat-rooms/chat-rooms.module#ChatRoomsModule',
  },
  {
    path: 'wallet',
    component: WalletComponent,
  },
  {
    path: 'balance-sheet',
    component: BalanceSheetComponent,
  },
  {
    path: 'bank-account',
    component: BankAccountComponent,
    canActivate: [IsTemporaryUser],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [IsTemporaryUser],
  },
  {
    path: 'transfer-money',
    component: TransferMoneyComponent,
    canActivate: [IsTemporaryUser],
    children: [
      {
        path: '', redirectTo: 'overview', pathMatch: 'full',
      },
      {
        path: 'overview',
        component: TransferOverviewComponent,
      },
      {
        path: ':user/transfer',
        component: TransferWalletMoneyComponent,
      },
    ],
  },
  {
    path: 'trade-history',
    component: TradeHistoryComponent,
    canActivate: [IsTemporaryUser],
  },
  {
    path: 'funding-details',
    component: FundingDetailsComponent,
  },
  {
    path: ':empId/employee-rating',
    component: EmployeeRatingComponent,
  },
  {
    path: ':empId/:rateFor',
    component: EmployeeRatingComponent,
  },
  {
    path: ':empId/:id/:rateFor',
    component: EmployeeRatingComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FounderRoutingModule {
}
