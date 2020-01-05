import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { ForumUserInfo, OwnerInfo } from 'app/projects/models/forum-info-model';
import { ForumService } from 'app/projects/forum.service';
import { ChatService } from 'app/collaboration/chat.service';
import { WebRTCService } from 'app/common/services/webRTC.service';

@Component({
  selector: 'app-forum-people',
  templateUrl: './forum-people.component.html',
  styleUrls: ['./forum-people.component.scss'],
  providers: [ChatService],
})
export class ForumPeopleComponent implements OnInit {
  forumUserInfoList: ForumUserInfo[] = [];
  selectedUserId = 0;
  ownerInfo: OwnerInfo;
  popUpForShowInterestModalRef: NgbModalRef;
  errorMessage: string;
  searchText = '';

  @ViewChild('popUpForAddEmailMessage') private popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') private popUpForCommonMessage;

  constructor(
    private forumService: ForumService,
    private chatService: ChatService,
    private webRTCService: WebRTCService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.forumService.getForumUserInfoList().subscribe((listInfo) => {
      this.forumUserInfoList = listInfo.user;
    });
  }

  selectedUser(id) {
    this.forumService.getForumUserThreadList(id).subscribe((info) => {
      this.ownerInfo = info;
      this.selectedUserId = id;
    });
  }

  peopleMessage(evt: { userId: number, isVideoCall: boolean }) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(null, evt.userId).subscribe(result => {
      const data = result.json();

      if (evt.isVideoCall) {
        this.webRTCService.videoCallData.next({
          roomId: data['room']['_id'],
          autoStart: true,
          incomingMessage: null,
        });
      } else {
        this.router.navigate([`founder/chat-rooms/${data['room']['_id']}`]);
      }
    }, (error) => {
      console.log(error);
      if (error['email'] === 'Email is Required.') {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddEmailMessage, {backdrop: false});
      } else if (error['_body']) {
        this.errorMessage = error['_body'];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      } else {
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
