import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { ChatService } from 'app/collaboration/chat.service';
import TaskModel from 'app/core/models/TaskModel';
import { ChatRoomModel } from 'app/collaboration/models';
import { TasksService } from 'app/projects/tasks.service';
import { WebRTCService } from 'app/common/services/webRTC.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-processes-chat',
  templateUrl: './chat.component.html',
  styleUrls: [
    'chat.component.scss',
  ],
  providers: [PaginationMethods],
})
export class DocumentChatComponent implements OnInit, AfterViewChecked {
  isProcessesOpen = false;
  process: TaskModel;
  isChatOpen = false;
  activeMobileView: null | 'chat' | 'menu' | 'documents' = null;
  popUpForShowInterestModalRef: NgbModalRef;
  is_complete = false;
  activityFeedList: any;
  count: number;
  pageSize = 5;
  chatWidth = 300;
  chatRoom: ChatRoomModel = null;
  chatFilters: _.Dictionary<any>;

  @ViewChild('getActionButtonActivityLog') private getActionButtonActivityLog: any;
  @ViewChild('popUpForConfirmationMessage') private popUpForConfirmationMessage;
  @ViewChild('process_details') private processDetails: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private webRTCService: WebRTCService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.process = new TaskModel();
      const processId = params['processId'];
      this.activeMobileView = params['view'] || null;

      this.tasksService.get(processId).flatMap((process) => {
        this.process = process;
        this.tasksService.getDepend((process.id)).subscribe((info) => {
          this.is_complete = info.is_complete;
        });
        return this.chatService.getChatRoom(process.id);
      }).subscribe((chatRoom: ChatRoomModel) => {
        this.chatRoom = chatRoom;
      });
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  openChat() {
    this.isChatOpen = !this.isChatOpen;
    // setTimeout(() => {
    //   this.scrollbar.directiveRef.scrollToBottom();
    // }, 1);
  }

  goToAccount() {
    this.popUpForShowInterestModalRef.close();
    this.router.navigate(['founder/account/edit']);
  }

  reassignProcessEvent(event) {
    this.process.is_reassign = true;
    this.tasksService.reassignTask({users: event, task: this.process.id}).subscribe((taskInfo) => {
      this.popUpForShowInterestModalRef.close();
    });
  }

  isProcessComplete(event) {
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForConfirmationMessage, {backdrop: false});
  }

  isComplete() {
    if (this.is_complete) {
      this.process.is_complete = this.is_complete;
      this.process.is_creator = true;
      this.tasksService.updateTask(this.process.id, this.process).subscribe((taskInfo) => {
        this.popUpForShowInterestModalRef.close();
      });
    }
  }

  startVideoCall() {
    // this.webRTCService.webRTCRoomId.next(this.chatRoom.room_id.toString());
    this.webRTCService.videoCallData.next({
      roomId: this.chatRoom.room_id.toString(),
      autoStart: true,
      incomingMessage: null,
    });
  }

  actionButtonActivityLogPopup() {
    this.popUpForShowInterestModalRef = this.modalService.open(this.getActionButtonActivityLog, {size: 'lg'});
    this.actionButtonActivityLogData(1);

  }

  actionButtonActivityLogData(newPage) {
    this.chatService.getTaskGroupActivity(this.process.id, newPage, this.pageSize)
      .subscribe((activity) => {
        this.count = activity.count;
        this.activityFeedList = activity.results;
      });
  }

  setChatWidth(width) {
    if (width < 300) {
      if (width < 29) {
        this.chatWidth = 0;
        this.isProcessesOpen = true;
      } else if (this.isProcessesOpen === false) {
        this.chatWidth = 300;
      }
    } else {
      this.chatWidth = width;
      this.isProcessesOpen = false;
    }
  }

  fixChatWidth(moved?: boolean) {
    if (moved === false) {
      this.setChatWidth(this.chatWidth === 0 ? 300 : 0);
    } else if (this.chatWidth > this.processDetails.nativeElement.offsetWidth) {
      this.chatWidth = this.processDetails.nativeElement.offsetWidth;
    }
  }

  onChatFiltersChanged(filters: _.Dictionary<any>) {
    this.chatFilters = Object.assign({}, filters);
  }
}
