import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { EditComponent } from './account/edit/edit.component'
// import { IsEmployeeProfileComplete } from 'app/auth/permissions';
import { HomeComponent } from './home/home.component';
// import { FindWorkComponent } from 'app/employee/account/find-work/find-work.component';
// import { StageStorage as EmployeeService } from 'app/employeeprofile/stage-storage.service'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    //  loadChildren:'./account/account.module#AccountModule',
  },
  {
    path: 'account',
    // component: EditComponent,
    loadChildren: './account/account.module#AccountModule',
    // canActivate:[IsEmployeeProfileComplete]
  },
  {
    path: 'chat-rooms',
    loadChildren: 'app/chat/chat-rooms/chat-rooms.module#ChatRoomsModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class EmployeeRoutingModule {
}
