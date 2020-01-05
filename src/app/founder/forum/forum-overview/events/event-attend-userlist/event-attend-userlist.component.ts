import { Component, OnInit, Input } from '@angular/core';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ForumService } from 'app/projects/forum.service';
import { InviteFriendsModel } from 'app/projects/models/event-info-model';

@Component({
  selector: 'app-event-attend-userlist',
  templateUrl: './event-attend-userlist.component.html',
  styleUrls: ['./event-attend-userlist.component.scss'],
  providers: [PaginationMethods]
})
export class EventAttendUserlistComponent implements OnInit {

  @Input() selectedEventId: number = 0;
  @Input() listFor: string;
  count: number;
  pageSize = 5;
  searchText: string;
  inviteFriendsInfoList: InviteFriendsModel[];

  constructor(private forumService: ForumService, private paginationMethods: PaginationMethods) {
    this.inviteFriendsInfoList = [];

  }

  ngOnInit() {
  }

  getAttenedUserList(newPage) {
    if (newPage) {
      this.forumService.getAttendUserList(newPage, this.pageSize, this.searchText, this.selectedEventId, this.listFor).subscribe((listInfo) => {
        this.inviteFriendsInfoList = listInfo['results'];
        this.count = listInfo['count'];
        
      });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getAttenedUserList(1);
    }
  }

}
