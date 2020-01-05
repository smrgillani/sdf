import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

import ProjectModel from 'app/projects/models/ProjectModel';
import { ProjectsService } from 'app/projects/projects.service';

@Component({
  selector: 'app-backer-recruitment',
  templateUrl: './backer-recruitment.component.html',
  styleUrls: ['./backer-recruitment.component.scss']
})
export class BackerRecruitmentComponent implements OnInit {

  projectId: number;
  project: ProjectModel;
  isCollapsedArray : boolean[] = [];
  rateFor: string = 'employee';
  qaList: any[] =[
    {
      "panelname": "Proposals",
    },
    {
      "panelname": "My Employees",
    },
    {
      "panelname": "Previous Employees",
    }]

  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location) { 
      this.project = new ProjectModel();
    }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
    
    this.qaList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
  }

  loadProject() {
    this.projectsService.getForBacker(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  toggleAccordian(e,x){
    let lastopen=this.isCollapsedArray[x];
    this.qaList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
    this.isCollapsedArray[x] = !lastopen;
  }

}
