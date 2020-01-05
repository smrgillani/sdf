import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  IsAuthenticated,
  IsRegularUser,
  AccessTokenCheck,
  HasNoHome,
  IsTemporaryUser,
} from './auth/permissions';

import { AppElementsModule } from './elements/elements.module'; /* TODO: delete after finishing EditDrawingComponent */
import { EditDrawingComponent } from './elements/edit-drawing/edit-drawing.component'; /* TODO: delete after finishing EditDrawingComponent */
import { NotificationsComponent } from './elements/notifications/notifications.component';
import { CancelPaymentComponent } from './cancel-payment.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [AccessTokenCheck],
  },
  {
    path: 'founder',
    loadChildren: './founder/founder.module#FounderModule',
    canActivate: [IsAuthenticated],
  },
  {
    path: 'backer',
    loadChildren: './backer/backer.module#BackerModule',
    canActivate: [IsAuthenticated],
  },
  {
    path: 'employee',
    loadChildren: './employee/employee.module#EmployeeModule',
    canActivate: [IsAuthenticated],
  },
  {
    path: 'test',
    loadChildren: './test/test.module#TestModule',
  },
  {
    path: 'cancelpayment',
    component: CancelPaymentComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  /* TODO: delete after finishing EditDrawingComponent */
  {
    path: 'drawing',
    component: EditDrawingComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AppElementsModule, /* TODO: delete after finishing EditDrawingComponent */
  ],
  exports: [RouterModule],
  providers: [
    IsAuthenticated,
    IsRegularUser,
    AccessTokenCheck,
    HasNoHome,
    IsTemporaryUser,
  ],
})
export class AppRoutingModule {
}
