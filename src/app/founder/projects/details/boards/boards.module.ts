import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarModule } from 'app/core/navbar/navbar.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { AppPipesModule } from 'app/pipes/pipes.module';
import { AppProjectsModule } from 'app/projects/projects.module';
import { ProjectsService } from 'app/projects/projects.service';

import { FounderProjectsDetailsBoardsRoutingModule } from './boards.routing';
import { FounderProjectDetailsBoardsComponent } from './boards.component';
import { KanbanBoardModule } from './kanban-board/kanban-board.module';


@NgModule({
  imports: [
    CommonModule,
    NgbPopoverModule,
    FormsModule,
    NavbarModule,
    AppElementsModule,
    AppPipesModule,
    AppProjectsModule,
    FounderProjectsDetailsBoardsRoutingModule,
    KanbanBoardModule,
  ],
  declarations: [
    FounderProjectDetailsBoardsComponent,
  ],
  providers: [
    ProjectsService,
  ],
})
export class FounderProjectsDetailsBoardsModule {
}
