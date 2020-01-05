import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import ProjectModel from 'app/projects/models/ProjectModel';
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import ProjectPaginationModel from 'app/projects/models/ProjectPaginationModel';
import { SelectItem } from 'primeng/primeng';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.scss',
    './overview.component.medium.scss',
  ],
  providers: [PaginationMethods],
})
export class FounderProjectsOverviewComponent implements OnInit {
  projects: ProjectModel[];
  count: number;
  pageSize = 5;
  paginationReset = false;
  // newPage=1;
  stage: '' | 'idea' | 'startup' = '';
  projectStages = {
    idea: 'Idea Stage',
    startup: 'Startup Stage',
  };
  searchText: '';
  projectType: SelectItem[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private projectsService: ProjectsService,
  ) {
    this.projectType = [
      {label: 'All', value: ''},
      {label: 'Idea', value: 'idea'},
      {label: 'Startup', value: 'startup'},
      {label: 'Company', value: 'company'},
      {label: 'Funded', value: 'funded'},
      {label: 'Completed', value: 'completed'},
    ];
  }

  ngOnInit() {}

  getNewProjectList(newPage) {
    if (newPage) {
      this.projectsService.list(newPage, this.pageSize, this.stage, this.searchText)
        .subscribe((data: ProjectPaginationModel) => {
          this.count = data.count;

          if (this.stage.indexOf('completed') !== -1) {
            this.projects = [];

            for (let i = 0, p; p = data.results[i]; i++) {
              if (toInteger(p.progress) === 100) {
                this.projects.push(p);
              }
            }
          } else {
            this.projects = data.results;
          }
        });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText === '') {
      this.getNewProjectList(1);
    }
  }

  setVisibility(project, isVisible: boolean) {
    this.projectsService.setVisibility({id: project.id, is_visible: isVisible})
      .subscribe((updatedProject: ProjectModel) => {
        _.extend(project, updatedProject);
      });
  }

  openProject(project) {
    // this.router.navigate(['.', project.id], {relativeTo: this.route});
    this.router.navigate(['.', project.id, 'services'], {relativeTo: this.route});
  }

  openNotarize(project) {
    // this.router.navigate(['.', project.id, 'notarization'], {relativeTo: this.route});
    this.projectsService.getNotarizeResponse(project.id).subscribe((obj) => {
      if (obj && obj.transaction_id && obj.transaction_id !== '') {
        this.router.navigate(['.', project.id, 'sentnotarization'], {relativeTo: this.route.parent});
      } else {
        this.router.navigate(['.', project.id, 'notarization'], {relativeTo: this.route.parent});
      }
    }, (errorMsg: any) => {
      this.router.navigate(['.', project.id, 'notarization'], {relativeTo: this.route.parent});
    });
  }

  openRegister(project) {
    this.router.navigate([project.id, 'register'], {relativeTo: this.route});
  }

  openSummary(project) {
    this.router.navigate([project.id, 'summary'], {relativeTo: this.route});

    // if (project.progress === 100) {
    //   this.router.navigate([project.id, 'summary'], {relativeTo: this.route});
    // } else if (project.stage === 'idea') {
    //   this.router.navigate(['/founder/idea', 'realization', {idea: project.id, new: false}], {relativeTo: this.route});
    // } else {
    //   this.router.navigate(['/founder/startup', project.id], {relativeTo: this.route});
    // }
  }
}
