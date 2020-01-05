import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectsService } from 'app/projects/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';

import * as _ from 'lodash';
import { AuthService } from 'app/auth/auth.service';
import { AccountService } from 'app/founder/account/account.service';
import ProjectModel from 'app/projects/models/ProjectModel';

@Component({
  selector: 'app-nda-agreement',
  templateUrl: './nda-agreement.component.html',
  styleUrls: ['./nda-agreement.component.scss'],
  providers: [
    ProjectsService, AccountService
  ],
})
export class NdaAgreementComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  ndaData: any;
  defaultNDA: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private location: Location,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.projectId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.project = new ProjectModel();
    this.ndaData = { 'id': '', 'description': '', 'creator_email': '', 'docusign_status': '', 'backer_email': '', 'is_agree': false };
  }

  ngOnInit(
  ): void {
    this.getProject();
    this.fetchNda(this.projectId);
    this.getUserProfile();
  }

  getProject() {
    this.projectsService.getPublished(this.projectId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
      });
  }

  fetchNda(projectId: number) {
    this.projectsService.fetchNdaForBacker(projectId)
      .subscribe(
        data => {
          this.ndaData.id = (data.id == undefined) ? '' : data.id;
          if (this.ndaData.id === '') {
            this.defaultNDA = true;
          }
          else {
            this.ndaData.description = data.description;
          }
          this.ndaData.docusign_status = data.docusign_status;
        },
        error => {
          alert(error);
        }
      );
  }

  getUserProfile() {
    this.accountService.getProfile().subscribe((userProfile: any) => {
      this.ndaData.backer_email = userProfile.email;
    });
  }

  onSubmit() {
    this.updateNda(this.project.id, this.ndaData);
  }

  updateNda(id, ndaData) {
    const self = this;
    let pdf = new jsPDF('p', 'pt', 'letter');

    let specialElementHandlers = {
      // element with id of "bypass" - jQuery style selector      
      '#editor': function (element, renderer) {
        return true;
      },
      '.controls': function (element, renderer) {
        return true;
      }
    }
    let margins = {
      top: 80,
      bottom: 10,
      left: 40,
      right: 40,
      width: 522
    };


    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML
      (
      ndaData.description // HTML string or DOM elem ref.
      , margins.left // x coord
      , margins.top // y coord
      , {
        'width': margins.width // max width of content on PDF
        , 'elementHandlers': specialElementHandlers
      }
      , function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF
        // this allow the insertion of new lines after html
        ndaData.document = pdf.output('datauristring');
        ndaData.document_name = 'NDA.pdf';
        ndaData.creatorXposition = 50;
        ndaData.creatorYposition = 75;
        ndaData.backerXposition = 50;
        ndaData.backerYposition = 665;
        self.projectsService.updateNdaForBacker(id, ndaData)
          .subscribe(
            data => {
              self.location.back();
            },
            error => {
              //alert(error);
              console.log(error);
            }
          );
      }
      , margins);

  }
}
