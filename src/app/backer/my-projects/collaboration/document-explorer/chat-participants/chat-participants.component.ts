import {Component, Input, OnInit} from '@angular/core';

import TaskModel from 'app/core/models/TaskModel';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {AccountService} from 'app/founder/account/account.service';
import { WebSocketService } from 'app/common/services/webSocket.service';


@Component({
  selector: 'app-chat-participants',
  template: `
    <div class="participants">
      <div *ngFor="let participant of participants">
        <div class="profile-icon" *ngIf="showParticipantActive(participant.id)">
          <img class="photo" *ngIf="participant.photo_crop" [src]="participant.photo_crop || ''"/>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .participants {
      display: flex;
      align-items: center;
      height: 38px;
    }
    .photo {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }
    @media only screen and (max-width: 992px) {
      .participants {
        height: 24px;
      }
      .photo {
        height: 24px;
        width: 24px;
        margin-left: -12px;
      }
    }
  `]
})
export class ChatParticipantsComponent implements OnInit {
  @Input() process: TaskModel;
  @Input() showActivity = true;

  participants: UserProfileModel[];
  activeParticipants: number[] = [];

  constructor(
      private accountService: AccountService,
      private ws: WebSocketService
  ) {
    this.activeParticipants = this.ws.activeParticipants;
    this.ws.participants$.subscribe(
      update => {
        this.activeParticipants = update;
      }
    );
  }

  ngOnInit() {
    this.accountService.getEmployees().subscribe((employees: UserProfileModel[]) => {
      this.participants = employees.filter((employee) => this.process.participants.includes(employee.id));
    });
  }

  showParticipantActive(userID) {
    return !this.showActivity || this.activeParticipants.includes(userID);
  }
}
