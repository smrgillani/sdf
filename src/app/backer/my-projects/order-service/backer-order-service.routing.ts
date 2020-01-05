import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackerServiceOverviewComponent } from './overview/backer-service-overview.component';

const routes: Routes = [
  {
    path: '',
    component: BackerServiceOverviewComponent
  },
  {
    path: ':orderid/work-area',
    loadChildren: 'app/backer/my-projects/order-service/backer-service-work-area/backer-service-work-area.module#BackerServiceWorkAreaModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackerOrderServiceRouting { }
