import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import TaskModel from 'app/core/models/TaskModel';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { AccountService } from 'app/founder/account/account.service';
import { WebSocketService } from 'app/common/services/webSocket.service';

@Component({
  selector: 'app-chat-participants',
  templateUrl: './chat-participants.component.html',
  styleUrls: ['./chat-participants.component.scss'],
})
export class ChatParticipantsComponent implements OnInit {
  popUpForShowInterestModalRef: NgbModalRef;
  participants: UserProfileModel[];
  processCompletedParticipants = [];
  selectedParticipants = [];
  private activeParticipants: number[] = [];

  @Input() process: TaskModel;
  @Input() private is_complete: boolean;
  @Input() private showActivity = true;
  @Output() private reassignProcess = new EventEmitter<any>();

  @ViewChild('popUpForConfirmationMessage') private popUpForConfirmationMessage;

  constructor(
    private accountService: AccountService,
    private modalService: NgbModal,
    private ws: WebSocketService,
  ) {
    this.ws.participants$.subscribe(
      update => {
        this.activeParticipants = update;
      },
    );
  }

  ngOnInit() {
    // this.accountService.getEmployees().subscribe((employees: UserProfileModel[]) => {
    //   this.participants = employees.filter((employee) => this.process.participants.includes(employee.id));
    // });
    this.activeParticipants = this.ws.activeParticipants;
    this.accountService.getParticipant(this.process.id).subscribe((userInfoList: UserProfileModel[]) => {
      this.participants = userInfoList;
    });
  }

  showConfirmationMessage() {
    this.accountService.getProcessCompletedParticipants(this.process.id).subscribe((obj: any[]) => {
      this.selectedParticipants = [];
      this.processCompletedParticipants = [];
      obj.forEach(element => {
        this.processCompletedParticipants.push({label: element.name, value: element.id});
      });
    });
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForConfirmationMessage, {
      backdrop: false,
      windowClass: 'interviewmodel modal-dialog-centered',
    });
  }

  reassignTask() {
    this.popUpForShowInterestModalRef.close();
    this.reassignProcess.emit(this.selectedParticipants);
  }

  showParticipantActive(userID) {
    return !this.showActivity || this.activeParticipants.includes(userID);
  }
}
