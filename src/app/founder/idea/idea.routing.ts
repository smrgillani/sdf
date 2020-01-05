import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StageStorage } from 'app/questionnaire/StageStorage';

const routes: Routes = [
  {
    path: 'realization',
    loadChildren: './realization/realization.module#RealizationModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [StageStorage],
})
export class IdeaRoutingModule {
}
