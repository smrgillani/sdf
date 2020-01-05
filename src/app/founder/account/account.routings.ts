import { NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ViewAccountComponent} from './detail/detail.component';
import {EditAccountComponent} from './edit/edit.component';
import {EditAccountPhotoComponent} from './edit-photo/edit-photo.component';
import {AccountComponent} from './account.component';



const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        component: ViewAccountComponent
      },
      {
        path: 'edit',
        component: EditAccountComponent
      },
      {
        path: 'edit/photo',
        component: EditAccountPhotoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FounderAccountRoutingModule {}
