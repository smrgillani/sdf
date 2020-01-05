import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './stage/stage.component';
import { EditPhotoComponent } from './stage/edit-photo/edit-photo.component';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';

const routes: Routes = [
  {
    path: '',
    component: StageComponent,
    data: {
      title: 'Basic Info',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'basicinfo',
      next: 'professionalinfo'
    }
  },
  {
    path: 'basicinfo',
    component: StageComponent,
    data: {
      title: 'Basic Info',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'basicinfo',
      next: 'professionalinfo'
    }
  },
  {
    path: 'professionalinfo',
    component: StageComponent,
    data: {
      title: 'Professional Info',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'professionalinfo',
      previous: 'basicinfo',
      next: 'employmentinfo'
    }
  },
  {
    path: 'employmentinfo',
    component: StageComponent,
    data: {
      title: 'Employment Info',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'employmentinfo',
      previous: 'professionalinfo',
      next: 'worksample'
    }
  },
  {
    path: 'worksampleinfo',
    component: StageComponent,
    data: {
      title: 'Work Sample',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'worksampleinfo',
      previous: 'employmentinfo',
      next: 'availabilityinfo'
    }
  },
  {
    path: 'availabilityinfo',
    component: StageComponent,
    data: {
      title: 'Availability Info',
      subtitle: 'Let\'s get the foundations right.',
      stage: 'availabilityinfo',
      previous: 'worksampleinfo',
      next: 'contactinfo'
    }
  },
  {
    path: 'edit',
    component: StageComponent,
  },
  {
    path: 'photo',
    component: EditPhotoComponent,
  }
    // {
  //   path: 'contactinfo',
  //   component: StageComponent,
  //   data: {
  //     title: 'Contact Info',
  //     subtitle: 'Let\'s get the foundations right.',
  //     stage: 'contactinfo',
  //     previous: 'availabilityinfo'
  //   }
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [StageStorage]
})
export class EditRoutingModule { }
