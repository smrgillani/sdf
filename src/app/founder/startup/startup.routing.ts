import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {FounderStartupOverviewComponent} from './overview/overview.component';
import {StartupStageComponent} from './stage/stage.component';
import {FinancesOutlineComponent} from './finances-outline/financesoutline.component';


const routes: Routes = [
  {
    path: '',
    component: FounderStartupOverviewComponent,
  },
  {
    path: 'operation_management',
    component: StartupStageComponent,
    data: {
      title: 'Operations Management',
      subtitle: '',
      stage: 'operation_management',
      next: 'finances_outline'
    }
  },
  {
    path: 'finances_outline',
    component: StartupStageComponent,
    data: {
      title: 'Finances Outline',
      subtitle: '',
      stage: 'finances_outline',
      previous: 'operation_management',
      next: 'sales_strategy'
    }
  },
  {
    path: 'sales_strategy',
    component: StartupStageComponent,
    data: {
      title: 'Sales Strategy',
      subtitle: '',
      stage: 'sales_strategy',
      previous: 'finances_outline',
      next: 'marketing_plan'
    }
  },
  {
    path: 'marketing_plan',
    component: StartupStageComponent,
    data: {
      title: 'Marketing Plan',
      subtitle: '',
      stage: 'marketing_plan',
      previous: 'sales_strategy',
    }
  },
  {
    path: 'finances-outline',
    component: FinancesOutlineComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartupRoutingModule {}
