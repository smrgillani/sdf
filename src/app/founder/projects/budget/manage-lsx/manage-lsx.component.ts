import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';

@Component({
  selector: 'app-manage-lsx',
  templateUrl: './manage-lsx.component.html',
  styleUrls: ['./manage-lsx.component.scss']
})
export class ManageLsxComponent implements OnInit {

  projectId: number;
  project: ProjectModel;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
  ) { 
    this.project = new ProjectModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }
  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }
}
