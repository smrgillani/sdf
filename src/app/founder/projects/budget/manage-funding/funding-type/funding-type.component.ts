import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';

@Component({
  selector: 'app-funding-type',
  templateUrl: './funding-type.component.html',
  styleUrls: ['./funding-type.component.scss']
})
export class FundingTypeComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  value: Date;
 
  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,) {
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
