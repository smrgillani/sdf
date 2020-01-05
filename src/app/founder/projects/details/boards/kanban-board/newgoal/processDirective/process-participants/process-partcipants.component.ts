import {Component, Input, ElementRef, ViewChild, OnInit, Output, EventEmitter} from '@angular/core';

import {AccountService} from 'app/founder/account/account.service';
import TaskModel from 'app/core/models/TaskModel';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
  NgbPopover
} from '@ng-bootstrap/ng-bootstrap';
import { ParticipantProfileComponent } from './participant-profile/participant-profile.component';


/**
 * Component that include participants user list for kanban process
 * <app-process-participants [subtask]="subtask"></app-process-participants>
 */

@Component({
  selector: 'app-process-participants',
  templateUrl: 'process-participants.component.html',
  styleUrls: [
    'process-participants.component.scss'
  ],
  providers: [AccountService]
})

export class ProcessParticipantsComponent implements OnInit {

  /**
   * @Input() subtask: TaskModel - include data object for kanban task
   *
   */
  @Input() subtask: TaskModel;
  @Output() hideCalendar: EventEmitter<any> = new EventEmitter();
  confirmDelete: NgbModalRef;
  assignedUsers = [];
  users: any;
  searchText = '';
  searchInputActive: boolean;

  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private accountService: AccountService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    this.accountService.getEmployees().subscribe(
      (data) => {
        this.users = data;
        if (this.subtask.participants) {
          this.assignedUsers = this.users.filter(this.filterList, this).map((participants) => {
            return {userImage: participants.photo_crop, user_id: participants.user_id};
          });
        }
      }
    );
  };

  filterList(user) {
    for (let i = 0; i < this.subtask.participants.length; i++) {
      if (this.subtask.participants[i] === user.user_id) {
        return user;
      }
    }
  }

  showSearchInput() {
    this.searchInputActive = true;
    this.hideCalendar.emit(this.searchInputActive);

    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
  };

  hideSearchInput() {
    this.searchInputActive = false;
    this.hideCalendar.emit(this.searchInputActive);
  };

  confirmDeleteTask(template) {
    this.confirmDelete = this.modal.open(template, {backdrop: false});
  }

  unassignUser(user_id) {
    this.subtask['participants'] = this.subtask['participants'].filter((item) => {
      return item !== user_id;
    });
    this.assignedUsers = this.assignedUsers.filter((item) => {
      return item.user_id !== user_id;
    });
    this.confirmDelete.close();
  }

  assignUser(user) {
    if (this.subtask['participants']) {
      this.subtask['participants'].push(user.user_id);
    } else {
      this.subtask['participants'] = [user.user_id];
    }

    this.assignedUsers.push({
      userImage: user.photo_crop,
      user_id: user.user_id,
    });
  };

  getParticipentProfile(id) {
    const modalRef = this.modal.open(ParticipantProfileComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel'
    });
    modalRef.componentInstance.employeeId = id;
  }

}
