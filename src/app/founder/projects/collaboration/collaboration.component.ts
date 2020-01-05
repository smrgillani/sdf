import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProjectsService } from 'app/projects/projects.service';
import { MilestonesService } from 'app/projects/milestones.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import ProjectModel from 'app/projects/models/ProjectModel';

import { DocumentTypeFilterComponent } from 'app/collaboration/document-explorer/document-type-filter/document-type-filter.component';
import { ChatParticipantsComponent } from './document-explorer/chat-participants/chat-participants.component';


@Component({
  templateUrl: './collaboration.component.html',
  entryComponents: [DocumentTypeFilterComponent, ChatParticipantsComponent],
  providers: [MilestonesService],
})
export class ProjectCollaborationComponent implements OnInit {
  project: ProjectModel;
  milestones: MilestoneModel[];
  projectId: number;

  constructor(
    private milestonesService: MilestonesService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
  ) {
    this.project = new ProjectModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = parseInt(params['id']);

      this.milestonesService.list(this.projectId)
        .subscribe((milestones: MilestoneModel[]) => {
          this.milestones = milestones;
        });

      this.projectsService.get(this.projectId)
        .subscribe((response) => {
          this.project = response;
        });
    });
  }
}
