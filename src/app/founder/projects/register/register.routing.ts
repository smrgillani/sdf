import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectRegisterOverviewComponent } from './overview/overview.component';
import { ProjectEntitySelectionComponent } from 'app/founder/projects/register/entity-selection/entity-selection.component';
import { RegistrationStageStorage } from 'app/founder/projects/register/questionnaire/RegistrationStageStorage';
import { StageComponent } from './stage/stage.component';
import { PlaceOrderComponent } from './stage/placeorder/placeorder.component';
import { ProjectregisteredComponent } from 'app/founder/projects/register/stage/projectregistered/projectregistered.component';
import { IsTemporaryUser } from 'app/auth/permissions';


const routes: Routes = [
  {
    path: 'register',
    component: ProjectRegisterOverviewComponent,
  },
  {
    path: '',
    redirectTo: 'entity', pathMatch: 'full',
  },
  {
    path: 'entity',
    component: ProjectEntitySelectionComponent,
    canActivate: [IsTemporaryUser]
  },
  {
    path: 'register/about_business',
    component: StageComponent,
    data: {
      title: 'About Business',
      subtitle: 'Let\'s explain your business.',
      stage: 'about_business',
      next: 'name_and_address'
    }
  },
  {
    path: 'register/name_and_address',
    component: StageComponent,
    data: {
      title: 'Name & Address',
      subtitle: 'Let\'s mention your contact details',
      stage: 'name_and_address',
      previous: 'register/about_business',
      next: 'owners_and_mgmt'
    }
  },
  {
    path: 'register/owners_and_mgmt',
    component: StageComponent,
    data: {
      title: 'Owners & Mgmt',
      subtitle: 'Owners & Mgmt Questions',
      stage: 'owners_and_mgmt',
      previous: 'register/name_and_address',
      next: 'tax_setup'
    }
  },
  {
    path: 'register/tax_setup',
    component: StageComponent,
    data: {
      title: 'Tax Setup',
      subtitle: 'Tax Setup Questions',
      stage: 'tax_setup',
      previous: 'register/owners_and_mgmt',
      next: 'business_setup'
    }
  },
  {
    path: 'register/business_setup',
    component: StageComponent,
    data: {
      title: 'Business Setup',
      subtitle: 'Business Setup Questions',
      stage: 'business_setup',
      previous: 'register/tax_setup',
      next: 'placeorder'
    }
  },
  {
    path: 'register/placeorder',
    component: PlaceOrderComponent,
    data: {
      title: 'Place Order',
      subtitle: '',
      stage: 'register/placeorder',
      previous: 'business_setup'
    }
  },
  {
    path: 'register/projectregistered',
    component: ProjectregisteredComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RegistrationStageStorage]
})
export class RegisterRoutingModule { }
