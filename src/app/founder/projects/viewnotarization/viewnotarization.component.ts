import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';
import { NotarizeResponse } from '../../../projects/models/project-notarization-model';

@Component({
  selector: 'app-viewnotarization',
  templateUrl: './viewnotarization.component.html',
  styleUrls: ['./viewnotarization.component.scss']
})
export class ViewnotarizationComponent implements OnInit {

  projectId: number;
  project: ProjectModel;
  notarizeResponse: NotarizeResponse;
  previousFileSize: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
  ) { 
    this.project = new ProjectModel();
    this.notarizeResponse = new NotarizeResponse();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
      this.getProjectNotarizeInfo();
    });
  }
 
  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getProjectNotarizeInfo() {
    this.projectsService.getNotarizeResponse(this.projectId).subscribe((obj) => {
      this.getNotarizedInfo(obj.transaction_id);
      //console.log(obj);
    },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
  }

  getNotarizedInfo(transaction_id: string) {
    if (transaction_id != null && transaction_id && transaction_id != '')
    this.projectsService.getNotarizationDetails(transaction_id).subscribe((obj)=>{
      this.notarizeResponse = obj;
      //console.log(obj);
    },
    (errorMsg: any) => {
      console.log(errorMsg);
    });
  }

}