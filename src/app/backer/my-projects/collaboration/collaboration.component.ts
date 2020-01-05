import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MilestonesService } from 'app/projects/milestones.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import { DocumentTypeFilterComponent } from 'app/collaboration/document-explorer/document-type-filter/document-type-filter.component';

import { ChatParticipantsComponent } from './document-explorer/chat-participants/chat-participants.component';

@Component({
  templateUrl: './collaboration.component.html',
  entryComponents: [DocumentTypeFilterComponent, ChatParticipantsComponent],
  providers: [MilestonesService],
})
export class CollaborationComponent implements OnInit {
  projectId: number;
  milestones: MilestoneModel[];

  constructor(
    private milestonesService: MilestonesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = parseInt(params['id']);

      this.milestonesService.backerMilestonelist(this.projectId)
        .subscribe((milestones: MilestoneModel[]) => {
          this.milestones = milestones;
        });
    });
  }
}
