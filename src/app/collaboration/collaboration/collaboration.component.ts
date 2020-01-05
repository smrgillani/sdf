import { Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';

import TaskModel from 'app/core/models/TaskModel';
import { LunchRoomInfo } from 'app/projects/models/lunch-room-info.model';
import MilestoneModel from 'app/projects/models/MilestoneModel';
import { FolderNavigation } from 'app/elements/document-explorer/FolderNavigation';
import { ProjectsService } from 'app/projects/projects.service';
import { BotQuestionAnswer } from 'app/projects/models/bot-question-answer.model';
import { DocumentExplorerItem } from 'app/elements/document-explorer/DocumentExplorerItem';

import { GoalItem } from '../document-explorer/GoalItem';
import { ProcessItem } from '../document-explorer/ProcessItem';
import { MilestoneItem } from '../document-explorer/MilestoneItem';
import { ChatService } from '../chat.service';
import { ChatWebsocketService } from 'app/chat/chat-websocket/chat.websocket.service';
import { VideoCallData } from 'app/common/models/web-rtc.model';
import { WebRTCService } from 'app/common/services/webRTC.service';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-collaboration',
  templateUrl: './collaboration.component.html',
  styleUrls: [
    './collaboration.component.scss',
    './collaboration.component.mobile.scss',
  ],
})
export class CollaborationComponent implements OnInit, OnDestroy {
  selectedProcess: ProcessItem = null;
  isProcessesOpen = true;
  activeMobileView: null | 'chat' | 'menu' | 'documents' = 'menu';
  popUpForShowInterestModalRef: NgbModalRef;
  lunchRoomInfo: LunchRoomInfo = new LunchRoomInfo();
  userInfoList: SelectItem[] = [];
  botQuestionAnswerInfo: BotQuestionAnswer = new BotQuestionAnswer();
  errorMessage: string;
  showErrorMessage = false;
  lunchRoomListInfo: LunchRoomInfo[] = [];
  publicRoomListInfo: LunchRoomInfo[] = [];
  callData: Observable<VideoCallData>;
  isExpanded = false;
  webRTCHeight = 200;
  isMilestoneListOpened = true;
  isDockedModeActive: Observable<boolean>;
  isCallStarted: Observable<boolean>;
  private selectedMilestoneId: number = null;
  private selectedGoal: GoalItem = null;
  private timerId: any;

  @Input() milestones: MilestoneModel[];
  @Input() allowAddingActivity = false;
  @Input() private projectId: number;

  @ViewChild('rightToolbar', {read: ViewContainerRef}) private toolbar: ViewContainerRef;
  @ViewChild('popUpForAddActivity') private popUpForAddActivity;
  @ViewChild('popUpActivityLogMessage') private popUpActivityLogMessage;
  @ViewChild('popUpForLunchRoom') private popUpForLunchRoom;
  @ViewChild('popUpForPublicRoom') private popUpForPublicRoom;
  @ViewChild('popUpToAddActivityLogMessage') private popUpToAddActivityLogMessage;
  @ViewChild('webRTCWrapper') private webRTCWrapper;

  constructor(
    private projectsService: ProjectsService,
    private folderNavigation: FolderNavigation,
    private resolver: ComponentFactoryResolver,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private chatWebsocketService: ChatWebsocketService,
    private webRTCService: WebRTCService,
  ) {
  }

  ngOnInit() {
    this.chatWebsocketService.createChatWebSocket();
    this.populateDocumentExplorerItems(this.milestones);

    this.folderNavigation.opened.subscribe((item: DocumentExplorerItem) => {
      this.toolbar.clear();
      item.createToolbarComponent(this.toolbar, this.resolver);
    });

    if (this.allowAddingActivity) {
      this.getActivityLogQuestions();

      this.timerId = setInterval(() => {
        this.checkLocalTime();
      }, 1000);
    }

    this.getLunchRoomList();
    this.getPublicRoomList();
    this.getUserListForLunchRoom();

    this.isDockedModeActive = this.webRTCService.dockedModeStatus.asObservable().map(value => value.active);
    this.webRTCService.dockedModeStatus.next({registered: true, active: true});
    this.isCallStarted = this.webRTCService.videoCallSession.map(value => !!value);
    this.callData = this.webRTCService.videoCallData.asObservable().pipe(
      tap(callData => {
        if (callData === null) {
          this.webRTCService.dockedModeStatus.next({registered: true, active: true});
          this.isExpanded = false;
          this.webRTCHeight = 200;
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.allowAddingActivity) {
      clearInterval(this.timerId);
    }

    this.chatWebsocketService.destroyChatWebSocket();
    this.webRTCService.dockedModeStatus.next({registered: false, active: false});
  }

  openMilestone(milestone: MilestoneModel) {
    this.selectedMilestoneId = this.selectedMilestoneId !== milestone.id ? milestone.id : null;
  }

  isMilestoneSelected(milestone: MilestoneModel) {
    return this.selectedMilestoneId === milestone.id;
  }

  openGoal(goal: TaskModel) {
    this.folderNavigation.open(new GoalItem(goal));
  }

  isGoalSelected(goal: TaskModel) {
    return this.selectedGoal && goal.id === this.selectedGoal.resource.id
      || this.selectedProcess && goal.id === (this.selectedProcess.resource as TaskModel).parent_task;
  }

  openProcess(process: TaskModel) {
    this.folderNavigation.open(new ProcessItem(process));
  }

  isProcessSelected(process: TaskModel) {
    return this.selectedProcess && process.id === this.selectedProcess.resource.id;
  }

  openAddEditPublicRoomPopUp() {
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForPublicRoom, {
      size: 'sm',
      windowClass: 'appoitmentmodel interviewmodel modal-dialog-centered',
    });

    this.lunchRoomInfo = new LunchRoomInfo();
    this.lunchRoomInfo.is_public_channel = true;
    this.lunchRoomInfo.project = this.projectId;
  }

  navigateToLunchRoom(id) {
    this.router.navigate([{
      outlets: {chat: ['lunch-room', id]},
    }], {relativeTo: this.route});
  }

  openAddEditLunchRoomPopUp() {
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForLunchRoom, {
      size: 'sm',
      windowClass: 'appoitmentmodel interviewmodel modal-dialog-centered',
    });

    this.lunchRoomInfo = new LunchRoomInfo();
    this.lunchRoomInfo.is_public_channel = false;
    this.lunchRoomInfo.project = this.projectId;
  }

  getLunchRoomInfo(id) {
    this.projectsService.getLunchRoomInfo(id, this.projectId).subscribe((obj) => {
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForLunchRoom, {
        size: 'sm',
        windowClass: 'appoitmentmodel interviewmodel modal-dialog-centered',
      });

      this.lunchRoomInfo = obj;
      this.lunchRoomInfo.id = id;
      this.lunchRoomInfo.project = this.projectId;
    });
  }

  activateAddActivityPopUp() {
    this.popUpForShowInterestModalRef.close();
    this.addTodaysActivity();
  }

  addTodaysActivity() {
    this.projectsService.getCanActivityLog(this.projectId).subscribe((info) => {
      if (info.status) {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddActivity, {
          size: 'lg',
          windowClass: 'appoitmentmodel',
        });

        this.botQuestionAnswerInfo.answerInfo = this.botQuestionAnswerInfo.answerInfoList[0];
        this.botQuestionAnswerInfo.answerInfo.index = 0;
      }
    }, (error) => {
      this.errorMessage = error.date;
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpActivityLogMessage, {backdrop: false});
    });
  }

  openChat() {
    this.router.navigate([{
      outlets: {
        chat: ['chat', this.selectedProcess.resource.id, {'view': this.activeMobileView}],
      },
    }], {relativeTo: this.route});
  }

  addEditPublicRoom(form) {
    this.projectsService.addEditLunchRoom(form.value).subscribe((info) => {
      this.popUpForShowInterestModalRef.close();
      this.getPublicRoomList();
    }, (error) => {
      console.error(error);
    });
  }

  addEditLunchRoom(form) {
    this.projectsService.addEditLunchRoom(form.value).subscribe((info) => {
      this.popUpForShowInterestModalRef.close();
      this.getLunchRoomList();
    }, (error) => {
      console.error(error);
    });
  }

  previousQuestion(index: number) {
    this.botQuestionAnswerInfo.answerInfo = this.botQuestionAnswerInfo.answerInfoList[index];
    this.botQuestionAnswerInfo.answerInfo.index = index;
  }

  nextQuestion(index: number) {
    if (this.validateQABot()) {
      this.botQuestionAnswerInfo.answerInfo = this.botQuestionAnswerInfo.answerInfoList[index];
      this.botQuestionAnswerInfo.answerInfo.index = index;
    }
  }

  saveActivityLog() {
    if (this.validateQABot()) {
      this.projectsService.postActivityLogQuestions(this.botQuestionAnswerInfo.answerInfoList).subscribe((info) => {
        this.popUpForShowInterestModalRef.close();
        this.navigateToActivity();
      }, (error) => {
        this.showErrorMessage = true;
        this.errorMessage = error[0];
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
      });
    }
  }

  navigateToActivity() {
    this.router.navigate([{
      outlets: {documents: ['activity-log']},
    }], {relativeTo: this.route});
  }

  setWebRTCHeight(height) {
    if (height >= 80) {
      this.webRTCHeight = height;
    }
  }

  fixWebRTCHeight() {
    if (this.webRTCHeight > this.webRTCWrapper.nativeElement.offsetHeight) {
      this.webRTCHeight = this.webRTCWrapper.nativeElement.offsetHeight;
    }
  }

  openFloatingMode() {
    this.webRTCService.dockedModeStatus.next({registered: true, active: false});
  }

  toggleMilestonesListOpened() {
    this.isMilestoneListOpened = !this.isMilestoneListOpened;
    this.selectedMilestoneId = null;
  }

  private populateDocumentExplorerItems(milestones: MilestoneModel[]) {
    for (const milestone of milestones) {
      const milestoneItem = new MilestoneItem(milestone);
      this.folderNavigation.addItem(milestoneItem);

      for (const task of milestone.tasks) {
        const goalItem = new GoalItem(task);
        goalItem.parent = milestoneItem;

        goalItem.open.subscribe(() => {
          this.navigateToGoal(goalItem);
        });

        this.folderNavigation.addItem(goalItem);

        for (const subtask of task.subtasks) {
          const processItem = new ProcessItem(subtask);
          processItem.parent = goalItem;

          processItem.open.subscribe(() => {
            this.navigateToProcess(processItem);
          });

          this.folderNavigation.addItem(processItem);
        }
      }
    }
  }

  private navigateToGoal(goalItem: GoalItem) {
    this.selectedGoal = goalItem;
    this.selectedProcess = null;

    this.router.navigate([{
      outlets: {documents: ['goal', goalItem.resource.id], chat: null},
    }], {relativeTo: this.route});
  }

  private navigateToProcess(processItem: ProcessItem) {
    this.selectedProcess = processItem;
    this.activeMobileView = null;

    this.router.navigate([{
      outlets: {
        documents: ['process', processItem.resource.id],
        chat: ['chat', processItem.resource.id],
      },
    }], {relativeTo: this.route});
  }

  private getActivityLogQuestions() {
    this.projectsService.getActivityLogQuestions().subscribe((obj) => {
      this.botQuestionAnswerInfo.questionInfoList = obj;

      obj.forEach((element, index) => {
        this.botQuestionAnswerInfo.answerInfoList.push(
          {
            question: element.id,
            title: element.title,
            response_text: '',
            question_type: element.question_type,
            boolean_text: element.question_type !== 'boolean' ? null : false,
            no_days: null,
            project: this.projectId,
            task: null,
            user: null,
            index: index,
          },
        );
      });
    });
  }

  private checkLocalTime() {
    const dateAsString = moment(new Date()).format('hh:mm:ss a').toString();

    if (dateAsString === '07:00:00 pm' || dateAsString === '12:00:00 pm') {
      this.errorMessage = 'Do you want to add activity log?';
      // this.popUpForShowInterestModalRef = this.modalService.open(this.popUpToAddActivityLogMessage, { backdrop: false });

      this.projectsService.getCanActivityLog(this.projectId).subscribe((info) => {
        if (info.status) {
          this.popUpForShowInterestModalRef = this.modalService.open(this.popUpToAddActivityLogMessage, {backdrop: false});
        }
      });
    }
  }

  private getLunchRoomList() {
    this.projectsService.getLunchRoomList(this.projectId, false).subscribe((obj) => {
      this.lunchRoomListInfo = obj;
    });
  }

  private getPublicRoomList() {
    this.projectsService.getLunchRoomList(this.projectId, true).subscribe((obj) => {
      this.publicRoomListInfo = obj;
    });
  }

  private getUserListForLunchRoom() {
    this.projectsService.getLunchRoomUserList(this.projectId).subscribe((obj) => {
      obj.forEach((element) => {
        this.userInfoList.push({label: element.name, value: element.id});
      });
    });
  }

  private validateQABot(): boolean {
    this.errorMessage = 'Please enter the required field.';
    if (this.botQuestionAnswerInfo.answerInfo.question_type === 'text') {
      if (this.botQuestionAnswerInfo.answerInfo.response_text === '') {
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
        return false;
      }
    } else if (this.botQuestionAnswerInfo.answerInfo.question_type === 'boolean') {
      if (this.botQuestionAnswerInfo.answerInfo.boolean_text && this.botQuestionAnswerInfo.answerInfo.boolean_text === true
        && (this.botQuestionAnswerInfo.answerInfo.no_days == null || this.botQuestionAnswerInfo.answerInfo.no_days === 0)) {
        this.showErrorMessage = true;
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 3000);
        return false;
      } else if (!this.botQuestionAnswerInfo.answerInfo.boolean_text) {
        this.botQuestionAnswerInfo.answerInfo.no_days = null;
        this.botQuestionAnswerInfo.answerInfo.response_text = '';
      }
    }

    return true;
  }

  // private publicChatRoom() {
  //   this.publicChatRoom = !this.publicChatRoom;
  // }
  //
  // private convertToDocumentItems(documents: DocumentModel[]) {
  //   return _.map(documents, (document) => new DocumentItem(document));
  // }
  // private navigateToPublic() {
  //   this.router.navigate([{
  //     outlets: { chat: ['public', 'channel'] }
  //   }], { relativeTo: this.route });
  // }
}
