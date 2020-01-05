import {Component, Input, OnInit} from '@angular/core';

import TaskModel from 'app/core/models/TaskModel';
import UserProfileModel from 'app/core/models/UserProfileModel';
import {AccountService} from 'app/founder/account/account.service';


@Component({
  selector: 'app-chat-participants',
  template: `
    <div class="participants">
      <div *ngFor="let participant of participants">
        <img class="photo" [src]="participant.photo_crop || ''"/>
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
      margin-left: 6px;
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

  participants: UserProfileModel[];

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.accountService.getEmployees().subscribe((employees: UserProfileModel[]) => {
      this.participants = employees.filter((employee) => this.process.participants.includes(employee.id));
    });
  }
}
