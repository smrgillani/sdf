import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Location} from '@angular/common';
import { NotarizeResponse, ProjectNotarizationModel } from '../../../projects/models/project-notarization-model';

@Component({
  selector: 'app-sent-notarization',
  templateUrl: './sent-notarization.component.html',
  styleUrls: ['./sent-notarization.component.scss']
})
export class SentNotarizationComponent implements OnInit {

  projectId: number;
  project: ProjectModel;
  notarizeResponse: NotarizeResponse;
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
      this.notarizeResponse = obj;
    },
      (errorMsg: any) => {
      }
    );
  }

  sendProjectNotarizeInfo() {
    let value: ProjectNotarizationModel = new ProjectNotarizationModel();
    value.documents = this.notarizeResponse.uploaded_documents;
    value.email = this.notarizeResponse.email
    value.id = this.notarizeResponse.id;
    value.project = this.projectId;
    value.transaction_id = this.notarizeResponse.transaction_id;
    value.is_draft = false;
    this.projectsService.postNotarizationDoc(value).subscribe((obj) => {
      this.notarizeResponse = obj;
    }, (errorMsg: any) => {
    });
  }

}
