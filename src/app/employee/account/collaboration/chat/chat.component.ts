import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { ChatService } from 'app/collaboration/chat.service';
import TaskModel from 'app/core/models/TaskModel';
import { ChatRoomModel } from 'app/collaboration/models';
import { TasksService } from 'app/projects/tasks.service';
import { WebRTCService } from 'app/common/services/webRTC.service';
import { switchMap } from 'rxjs/operators';

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
  popUpForShowInterestModalRef: NgbModalRef;
  chatWidth = 300;
  chatRoom: ChatRoomModel = null;
  chatFilters: _.Dictionary<any>;
  private rateFor = 'creator';

  @ViewChild('popUpForExtensionMessage') private popUpForExtensionMessage;
  @ViewChild('popUpForRateCreatorMessage') private popUpForRateCreatorMessage;
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
    this.route.params.pipe(
      switchMap(routeParams => {
        this.process = new TaskModel();
        const processId = routeParams['processId'];
        this.activeMobileView = routeParams['view'] || null;

        return this.tasksService.get(processId).flatMap((process) => {
          this.process = process;
          return this.chatService.getChatRoom(process.id);
        });
      }),
    ).subscribe(chatRoom => {
      this.chatRoom = chatRoom;
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

  isComplete(event) {
    if (event.target.checked) {
      this.process.is_complete = event.target.checked;
      this.process.is_creator = false;
      this.tasksService.updateTask(this.process.id, this.process).subscribe((taskInfo) => {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForRateCreatorMessage, {backdrop: false});
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

  extendProcessReques(id) {
    this.tasksService.checkExtensionRequest(id).subscribe((obj) => {
      console.log(obj);
      if (!obj.id) {
        this.router.navigate([{
          outlets: {documents: ['extension', id]},
        }], {relativeTo: this.route.parent});
      } else {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForExtensionMessage, {backdrop: false});
      }
    });
  }

  redirectToRating() {
    if (this.popUpForShowInterestModalRef) {
      this.popUpForShowInterestModalRef.close();
    }
    this.router.navigate(['./employee/account', this.process.owner, this.process.id, this.rateFor]);
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
