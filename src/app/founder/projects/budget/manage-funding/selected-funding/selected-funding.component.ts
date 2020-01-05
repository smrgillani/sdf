import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';


@Component({
  selector: 'app-selected-funding',
  templateUrl: './selected-funding.component.html',
  styleUrls: ['./selected-funding.component.scss']
})
export class SelectedFundingComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  isCollapsedArray : boolean[] = [];
  fundingsubmitted:boolean=false;
  qaList: any[] =[
    {
      "panelname": "Equity crowd funding / exchangeable equity",
    },
    {
      "panelname": "Debt financing / corporate bond long term debt instruments",
    },
  ]

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

      this.qaList.forEach((item, index) => {
        this.isCollapsedArray[index] = false;
      });
    }
    loadProject() {
      this.projectsService.get(this.projectId).subscribe((project) => {
        this.project = project;
      });
    }
    toggleAccordian(e,x){
      let lastopen=this.isCollapsedArray[x];
      this.qaList.forEach((item, index) => {
       // this.isCollapsedArray[index] = true;
      });
      this.isCollapsedArray[x] = !lastopen;
    
     }
     submitfunding()
     {
      this.fundingsubmitted=true;
     }
   
}
