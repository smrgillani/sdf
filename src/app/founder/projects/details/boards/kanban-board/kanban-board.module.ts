import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NavbarModule } from './navbar/navbar.module';
import { KanbanBoardRoutingModule } from './kanban-board.routing';
import { KanbanboardNewGoalComponent } from './newgoal/newgoal.component';
import { KanbanboardEditGoalComponent } from './editgoal/editgoal.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DynamicKanbanBoardComponent } from './dynamic-kanban-board/dynamic-kanban-board.component';
import { AppPipesModule } from 'app/pipes/pipes.module';

import { FileDroppa } from 'file-droppa/lib/index';

import { NgbDropdownModule, NgbPopoverModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ProcessComponent } from './newgoal/processDirective/process.component';
import { ProcessParticipantsComponent } from './newgoal/processDirective/process-participants/process-partcipants.component';
import { AppElementsModule } from 'app/elements/elements.module';
import { DependencyComponent } from './newgoal/dependency/dependency.component';
import { DropdownModule } from 'primeng/primeng';
import { CommonKanbanModule } from 'app/common-kanban/common-kanban.module';
import {
  ParticipantProfileComponent
} from './newgoal/processDirective/process-participants/participant-profile/participant-profile.component';
import { SharedEmployeeModule } from 'app/shared/sharedEmployee.module';


@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    KanbanBoardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPopoverModule,
    AppElementsModule,
    AppPipesModule,
    DropdownModule,
    CommonKanbanModule,
    NgbCollapseModule,
    FileDroppa,
    SharedEmployeeModule,
  ],
  declarations: [
    KanbanboardNewGoalComponent,
    KanbanboardEditGoalComponent,
    KanbanBoardComponent,
    DynamicKanbanBoardComponent,
    ProcessComponent,
    ProcessParticipantsComponent,
    DependencyComponent,
    ParticipantProfileComponent,
  ],
  entryComponents: [ParticipantProfileComponent],
})
export class KanbanBoardModule {
}
