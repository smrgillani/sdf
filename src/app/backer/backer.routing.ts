import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackerHomeComponent } from './home/home.component';
import { IsRegularUser } from '../auth/permissions';

const routes: Routes = [
  {
    path: '',
    component: BackerHomeComponent,
  },
  {
    path: 'my-projects',
    loadChildren: 'app/backer/my-projects/my-projects.module#BackerMyProjectsModule',
    canActivate: [IsRegularUser],
  },
  {
    path: 'projects',
    loadChildren: 'app/backer/projects/projects.module#BackerProjectsModule',
    canActivate: [IsRegularUser],
  },
  {
    path: 'trading',
    loadChildren: 'app/backer/trading/trading.module#TradingModule',
    canActivate: [IsRegularUser],
  },
  {
    path: 'chat-rooms',
    loadChildren: 'app/chat/chat-rooms/chat-rooms.module#ChatRoomsModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackerRoutingModule {
}
