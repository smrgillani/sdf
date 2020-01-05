import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumOverviewModule } from './forum-overview/forum-overview.module';

@NgModule({
  imports: [
    CommonModule,
    ForumOverviewModule,
    ForumRoutingModule
  ]
})
export class ForumModule { }
