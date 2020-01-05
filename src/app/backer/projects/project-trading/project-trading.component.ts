import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ProjectsService} from 'app/projects/projects.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import {AuthService} from 'app/auth/auth.service';
import ProjectModel from 'app/projects/models/ProjectModel';

@Component({
  selector: 'app-project-trading',
  templateUrl: './project-trading.component.html',
  styleUrls: ['./project-trading.component.scss'],
  providers: [
    ProjectsService
  ],
})
export class ProjectTradingComponent implements OnInit {

  projectId: number;
  project: ProjectModel;

  constructor(
    private projectsService: ProjectsService,
    private location: Location,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.projectId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.project = new ProjectModel();
  }

  ngOnInit(
  ): void {
  
    this.getProject();
   
  }
  getProject() {
    this.projectsService.getPublished(this.projectId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
      });
  }

}
