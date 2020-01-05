import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdeaRoutingModule } from './idea.routing';
import { IdeaSharedModule } from './shared/shared.module';
import { ProjectsService } from 'app/projects/projects.service';
import { QuestionnaireService } from 'app/questionnaire/questionnaire.service';


@NgModule({
  imports: [
    CommonModule,
    IdeaRoutingModule,
    IdeaSharedModule,
  ],
  providers: [
    ProjectsService,
    QuestionnaireService,
  ],
})
export class IdeaModule {
}
