import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { ChatService } from 'app/collaboration/chat.service';
import TaskModel from 'app/core/models/TaskModel';
import { ChatRoomModel } from 'app/collaboration/models';
import { TasksService } from 'app/projects/tasks.service';
import { WebRTCService } from 'app/common/services/webRTC.service';

@Component({
  selector: 'app-processes-chat',
  templateUrl: './chat.component.html',
  styleUrls: [
    'chat.component.scss',
  ],
})
export class DocumentChatComponent implements OnInit, AfterViewChecked {
  isProcessesOpen = false;
  process: TaskModel;
  isChatOpen = false;
  activeMobileView: null | 'chat' | 'menu' | 'documents' = null;
  chatWidth = 300;
  chatRoom: ChatRoomModel = null;
  chatFilters: _.Dictionary<any>;

  @ViewChild('process_details') private processDetails: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef,
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

  startVideoCall() {
    // this.webRTCService.webRTCRoomId.next(this.chatRoom.room_id.toString());
    this.webRTCService.videoCallData.next({
      roomId: this.chatRoom.room_id.toString(),
      autoStart: true,
      incomingMessage: null,
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
