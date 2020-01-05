import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectsService } from 'app/projects/projects.service';
import { AccountService } from 'app/founder/account/account.service';
import { defaultNda } from './default-nda';


@Component({
  templateUrl: './nda.component.html',
  styleUrls: ['./nda.component.scss'],
})
export class NdaComponent implements OnInit {
  ndaData: any;
  private id: number;
  private defaultNDA = defaultNda;

  constructor(
    private route: ActivatedRoute, public location: Location,
    private accountService: AccountService, private projectService: ProjectsService,
  ) { }

  ngOnInit() {
    // this.ndaData = { 'id': '', 'description': '' };
    this.ndaData = {'id': '', 'description': '', 'creator_email': '', 'docusign_status': ''};
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getUserProfile();
    // this.fetchNda(this.id);
  }

  onSubmit() {
    if (this.ndaData.id === '') {
      this.insertNda(this.id, this.ndaData);
    } else {
      this.updateNda(this.id, this.ndaData);
    }
  }

  private getUserProfile() {
    this.accountService.getProfile().subscribe((userProfile: any) => {
      this.ndaData.creator_email = userProfile.email;
      this.fetchNda(this.id);
    });
  }

  private insertNda(id, ndaData) {
    const self = this;

    self.projectService.insertNda(id, ndaData)
      .subscribe(
        data => {
          self.location.back();
        },
        error => {
          console.log(error);
        });
  }

  private fetchNda(projectId: number) {
    this.projectService.fetchNda(projectId)
      .subscribe(
        data => {
          this.ndaData.id = (data.id === undefined) ? '' : data.id;
          if (this.ndaData.id === '') {
            this.ndaData.description = this.defaultNDA;
          } else {
            this.ndaData.description = data.description;
          }
          this.ndaData.docusign_status = data.docusign_status;
        },
        error => {
          alert(error);
        },
      );
  }

  private updateNda(id, ndaData) {
    this.projectService.updateNda(id, ndaData)
      .subscribe(
        data => {
          this.location.back();
        },
        error => {
          alert(error);
        },
      );
  }
}
