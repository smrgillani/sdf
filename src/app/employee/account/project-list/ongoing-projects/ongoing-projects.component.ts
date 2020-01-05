import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { StageStorage as EmployeeProjectService } from 'app/employeeprofile/stage-storage.service';
import { ChatService } from 'app/collaboration/chat.service';


@Component({
  selector: 'app-ongoing-projects',
  templateUrl: './ongoing-projects.component.html',
  styleUrls: ['./ongoing-projects.component.scss'],
   providers: [PaginationMethods]
})
export class OngoingProjectsComponent implements OnInit {
  pageSize = 5;
  count: number;
  projectList: any;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;
  
  constructor(private paginationMethods: PaginationMethods,
    private employeeProjectService: EmployeeProjectService,
    private chatService: ChatService, private modalService: NgbModal,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    //location.reload()
  }

  getOngoingProjects(newPage) {
    if (newPage) {
      this.employeeProjectService.getOngoingProjectList(newPage, this.pageSize)
      .subscribe((projectList:any) => {
          this.projectList = projectList['results'];
          this.count = projectList['count'];
        });
    }
  }

  onWork(id: number) {
    this.router.navigate([`../${id}/collaboration`], {relativeTo: this.route});
  }

  projectMessage(projectId) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(projectId).subscribe(result => {
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

  metrices(id) {
    this.router.navigate(['employee/account', id, 'process', 'ongoing-projects']);
  }
  
}
