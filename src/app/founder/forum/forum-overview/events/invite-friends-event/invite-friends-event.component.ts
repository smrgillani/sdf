import { Component, OnInit, Input } from '@angular/core';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ForumService } from 'app/projects/forum.service';
import { InviteFriendsModel } from 'app/projects/models/event-info-model';

@Component({
  selector: 'app-invite-friends-event',
  templateUrl: './invite-friends-event.component.html',
  styleUrls: ['./invite-friends-event.component.scss'],
  providers: [PaginationMethods]
})
export class InviteFriendsEventComponent implements OnInit {

  @Input() selectedUserIds: number[];
  @Input() selectedEventId: number = 0;
  count: number;
  pageSize = 5;
  searchText: string;
  inviteFriendsInfoList: InviteFriendsModel[];

  constructor(private forumService: ForumService, private paginationMethods: PaginationMethods) {
    this.inviteFriendsInfoList = [];

  }

  ngOnInit() {
    console.log('selectedUserIds ' + this.selectedUserIds);
    console.log('selectedEventId ' + this.selectedEventId);
  }

  getInviteFriendsList(newPage) {
    if (newPage) {
      this.forumService.getInviteFriendList(newPage, this.pageSize, this.searchText, this.selectedEventId).subscribe((listInfo) => {
        this.inviteFriendsInfoList = listInfo['results'];
        this.count = listInfo['count'];
        console.log(listInfo);
        this.inviteFriendsInfoList.forEach(element => {
          element.is_checked = this.selectedUserIds.findIndex(a=>a == element.user_id) != -1 ? true : false;
        });
        console.log(this.inviteFriendsInfoList);
      });
    }
  }

  isInviteFriends(event) {
    //console.log(event.currentTarget.checked);
    let selectedId = parseInt(event.currentTarget.value);
    event.currentTarget.checked ? this.selectedUserIds.push(selectedId) : this.selectedUserIds.splice(this.selectedUserIds.findIndex(a=>a == selectedId), 1);
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getInviteFriendsList(1);
    }
  }

}
