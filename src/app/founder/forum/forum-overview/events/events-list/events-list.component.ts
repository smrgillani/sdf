import { Component, OnInit, TemplateRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { ForumService } from 'app/projects/forum.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { EventInfoModel } from 'app/projects/models/event-info-model';
import { EventInvitationStatusComponent } from 'app/elements/notifications/event-invitation-status/event-invitation-status.component';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  providers: [PaginationMethods]
})
export class EventsListComponent implements OnInit, AfterViewInit {

  count: number;
  pageSize = 5;
  searchText: string;
  eventInfoList: EventInfoModel[];
  modalRef: NgbModalRef;
  modalOptions: NgbModalOptions;
  selectedUserIds: number[];
  selectedEventId: number = 0;
  isCollapsedArray : boolean[] = [];
  showdetailindex: number = 0;
  listFor: string;
  invitationId: any;

  selectedEvent: EventInfoModel;

  constructor(private forumService: ForumService, private paginationMethods: PaginationMethods,
    private router: Router, private route: ActivatedRoute, private modal: NgbModal) { 
      this.eventInfoList = [];
      this.selectedUserIds = [];
    }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.invitationId)
      .subscribe(params => {
        this.invitationId = params.invitationId;
      }); 
  }

  ngAfterViewInit() {
    if (this.invitationId > 0) { // Show modal showing to accept event invitation
      var modalRef = this.modal.open(EventInvitationStatusComponent, {
        windowClass: 'interviewmodel modal-dialog-centered'
      });
  
      modalRef.componentInstance.eventId = this.invitationId;
    }
  }

  getEventList(newPage) {
    if (newPage) {
      this.forumService.getEventList( newPage, this.pageSize, this.searchText).subscribe((listInfo) => {
        this.eventInfoList = listInfo['results'];
        console.log('yakko event list', this.eventInfoList);
        this.count = listInfo['count'];
      });

      this.isCollapsedArray = [];
      this.showdetailindex = 0;
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getEventList(1);
    }
  }

  inviteFriendsPopUp(id: number, template: TemplateRef<any>, e: Event) {
    e.stopPropagation();
    this.selectedUserIds = [];
    this.selectedEventId = _.cloneDeep(id);
    this.modalRef = this.modal.open(template, this.modalOptions);
  }

  sendInvitation() {
    let data: any = [];
    this.selectedUserIds.forEach(element => {
      data.push({user: element});
    });
    this.forumService.postInviteFriends(data, this.selectedEventId).subscribe((obj) => {
      let index = this.eventInfoList.findIndex(a=>a.id == obj.id);
      this.eventInfoList[index] = obj;
      this.modalRef.close();
      //this.getEventList(1);
    });
  }

  // getEventDetails(e,x){
  //   let lastopen=this.isCollapsedArray[x];
  //   this.isCollapsedArray[x] = !lastopen;
  //   this.showdetailindex= x;
  //  }

  eventDetailsPopup(event:EventInfoModel, template:TemplateRef<any>){
     this.selectedEvent = event;
     console.log('this.selectedEvent:', this.selectedEvent);
     this.modalRef = this.modal.open(template, this.modalOptions);
  }

  updateEventInfoStatus(id: number,status: string, e: Event) {
    if (e != null) { e.stopPropagation(); }

    if (status == 'cancel') {
      alert('Not attending... to be updated');
      return false;
    }
    this.forumService.updateEventInfoStatus(id, status).subscribe((obj) => {
      let index = this.eventInfoList.findIndex(a=>a.id == obj.event);
      this.eventInfoList[index] = obj.event_details;
      if (this.modalRef != null) { this.modalRef.close(); }
    }, (error) => {
      console.log(error);
    });
  }

  AttendEvent(id: number, e: Event) {
    if (e != null) { e.stopPropagation(); }
   

    let data: { self_attend: boolean, status: string } = {
                self_attend: true,
                status: "accept"
            };
    this.forumService.postAttendEvent(data, id).subscribe((obj) => {
      let index = this.eventInfoList.findIndex(a=>a.id == obj.id);
      this.eventInfoList[index] = obj;
      if (this.modalRef != null) { this.modalRef.close(); }
    }, (error) => {
      console.log(error);
    });
  }

  attendedUserListPopUp(id: number,listFor: string, template: TemplateRef<any>, e: Event) {
    e.stopPropagation();
    this.listFor = listFor;
    this.selectedEventId = _.cloneDeep(id);
    this.modalRef = this.modal.open(template, this.modalOptions);
  }

  ngOnDestroy() {
    if (this.modalRef != null) { this.modalRef.close(); }
  }

}
