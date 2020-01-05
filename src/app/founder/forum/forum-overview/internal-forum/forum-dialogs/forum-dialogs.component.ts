import { Component, OnInit } from '@angular/core';
import { ForumInfoModel } from 'app/projects/models/forum-info-model';
import { ForumService } from 'app/projects/forum.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forum-dialogs',
  templateUrl: './forum-dialogs.component.html',
  styleUrls: ['./forum-dialogs.component.scss'],
  providers: [PaginationMethods]
})
export class ForumDialogsComponent implements OnInit {

  forumInfoModel: ForumInfoModel;
  internalCategoryList: SelectItem[];
  internalTopicList: SelectItem[];
  internalSortByList: SelectItem[];
  selectedThreadIndex: number;
  count: number;
  pageSize = 5;
  replyAgainstForumId: number = 0;
  replyAgainstPostId: number = 0;
  description: string;

  constructor(private forumService: ForumService, private paginationMethods: PaginationMethods,
    private router: Router, private route: ActivatedRoute) {
    this.forumInfoModel = new ForumInfoModel();
    this.internalCategoryList = [];
    this.internalSortByList = [];
  }

  ngOnInit() {
    this.getCategoryList();
    //this.forumInfoModel.isMostView = false;
    this.internalSortByList.push({ label: 'Most Recent', value: false }, { label: 'Most View', value: true });
  }

  getCategoryList() {
    this.forumService.getCategoryList().subscribe((listInfo) => {
      this.forumInfoModel.categoryInfoList = listInfo;
      listInfo.forEach(element => {
        this.internalCategoryList.push({ label: element.title, value: element.id });
      });
    });
  }

  getThreadInfoList(newPage) {
    if (newPage) {
      this.forumService.getThreadInfoList(this.forumInfoModel.selectedCategoryId, this.forumInfoModel.selectedTopicId, newPage, this.pageSize,
        this.forumInfoModel.searchText, this.forumInfoModel.isMostView).subscribe((listInfo) => {
          this.forumInfoModel.threadInfoList = listInfo['results'];
          this.count = listInfo['count'];
        });
    }
  }

  onCalegorySelect(value) {
    this.getTopicsList(value);
    this.getThreadInfoList(1);
  }

  getTopicsList(value) {
    this.forumService.getCategoryTopicInfoList(value).subscribe((listInfo) => {
      this.internalTopicList = [];
      listInfo.forEach(element => {
        this.internalTopicList.push({ label: element.title, value: element.id });
      });
    });
  }

  onTopicSelect(value) {
    this.getThreadInfoList(1);
  }

  onSortBySelect(value) {
    this.getThreadInfoList(1);
  }

  valueChange() {
    if (this.forumInfoModel.searchText.length > 2 || this.forumInfoModel.searchText == '') {
      this.getThreadInfoList(1);
    }
  }

  selectedThreadId(id) {
    this.forumService.setThreadViewCount(id).subscribe((obj) => {
      this.router.navigate([`../topics/${id}`], {relativeTo: this.route})
    });
  }

  replyAgainstThread(id: number) {
    this.replyAgainstForumId = id;
    this.description = '';
  }

  saveReply() {
    this.forumService.savePostsAgainstThread({
      thread: this.replyAgainstForumId,
      parent_comment: this.replyAgainstPostId != 0 ? this.replyAgainstPostId : null,
      text: this.description
      , subcomments: []
    }).subscribe((obj) => {
      this.getThreadInfoList(1);
      this.replyAgainstForumId = 0
      this.replyAgainstPostId = 0
    });

  }

  replyAgainstPost(threadId: number, postId: number) {
    this.replyAgainstPostId = postId;
    this.replyAgainstForumId = threadId;
    this.description = '';    
  }

}
