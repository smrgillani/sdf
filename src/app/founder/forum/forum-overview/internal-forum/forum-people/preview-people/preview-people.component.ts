import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ForumService } from 'app/projects/forum.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-preview-people',
  templateUrl: './preview-people.component.html',
  styleUrls: ['./preview-people.component.scss'],
  providers: [PaginationMethods],
})
export class PreviewPeopleComponent {
  @Input() ownerInfo: any;
  userThreadInfoList: any;
  count: number;
  pageSize = 5;
  @Output() getUserId = new EventEmitter<{ userId: number, isVideoCall: boolean }>();

  constructor(
    private forumService: ForumService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  selectedThreadId(id) {
    this.forumService.setThreadViewCount(id).subscribe((obj) => {
      this.router.navigate([`../topics/${id}`], {relativeTo: this.route});
    });
  }

  getThreadInfoList(newPage) {
    if (newPage) {
      this.forumService.getUserThreadInfoList(this.ownerInfo.user_id, newPage, this.pageSize).subscribe((infoList) => {
        this.userThreadInfoList = infoList['results'];
        this.count = infoList['count'];
      });
    }
  }

  selectedChat() {
    this.getUserId.emit({userId: this.ownerInfo.id, isVideoCall: false});
  }

  startVideoCall() {
    this.getUserId.emit({userId: this.ownerInfo.id, isVideoCall: true});
  }
}
