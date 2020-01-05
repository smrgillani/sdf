import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {SelectItem} from 'primeng/primeng';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import ProjectModel from 'app/projects/models/ProjectModel';
import {ProjectsService} from 'app/projects/projects.service';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import {SliceIndexModel} from '../../../elements/pagination/SliceIndexModel';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: [
    './overview.component.scss',
    './overview.component.medium.scss',
  ],
  providers: [PaginationMethods]
})
export class BackerProjectsOverviewComponent implements OnInit {
  projects: ProjectModel[];
  stage: '' | 'idea' | 'startup' = '';
  projectStages = {
    idea: 'Idea Stage',
    startup: 'Startup Stage'
  };
  searchText: '';
  pageSize = 5;
  count: number;
  
  itemsPerPage;
  sliceIndex: SliceIndexModel;
  projectType: SelectItem[];
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private projectsService: ProjectsService,
    private paginationMethods: PaginationMethods,
    private modalService: NgbModal,
    private chatService: ChatService
  ) {
    this.projectType = [
      {label: 'All', value: ''},
      {label: 'Idea', value: 'idea'},
      {label: 'Startup', value: 'startup'},
      {label: 'Company', value: 'company'},
      {label: 'Funded', value: 'funded'},
  ];
  }

  ngOnInit() {}

  getNewProjectList(newPage) {
    if (newPage) {
      this.projectsService.listPublished(newPage, this.pageSize, this.stage, this.searchText)
        .subscribe((projects: ProjectModel[]) => {
          this.projects = projects['results'];
          this.count = projects['count'];
        });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getNewProjectList(1);
    }
  }

  openProject(project) {
    this.router.navigate(['.', project.id], {relativeTo: this.route});
  }

  selectfunding(project){
    this.router.navigate([project.id, 'launch'], {relativeTo: this.route});
  }

  navigateTo(project) {
    this.router.navigate([project.id, 'summary'], {relativeTo: this.route});
  }

  projectMessage(project) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(project.id).subscribe(result => {
      const data = result.json();
      this.router.navigate(['../', 'chat-rooms', data['room']['_id']], { relativeTo: this.route.parent });
    }, (error) => {
      if(error['email'] == "Email is Required.") {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddEmailMessage, {backdrop: false});
      }
      else if(error['_body']) {
        this.errorMessage = error['_body'];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      }
      else {
        this.errorMessage = error[0];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      }
    });
  }

  goToAccount() {
    this.popUpForShowInterestModalRef.close();
    this.router.navigate(['founder/account/edit']);
  }
}
