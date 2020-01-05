import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { BackerKanbanboardRoutingModule } from './backer-kanbanboard-routing.module';
import { KanbanHomeComponent } from './kanban-home/kanban-home.component';
import { KanbanDynamicComponent } from './kanban-dynamic/kanban-dynamic.component';
import { NavbarModule } from 'app/core/navbar/navbar.module';
import { AppElementsModule } from 'app/elements/elements.module';
import { CommonKanbanModule } from 'app/common-kanban/common-kanban.module';

@NgModule({
  imports: [
    CommonModule,
    NavbarModule,
    AppElementsModule,
    BackerKanbanboardRoutingModule,
    NgbDropdownModule,
    NgbPopoverModule,
    CommonKanbanModule
  ],
declarations: [KanbanHomeComponent, KanbanDynamicComponent]
})
export class BackerKanbanboardModule { }
