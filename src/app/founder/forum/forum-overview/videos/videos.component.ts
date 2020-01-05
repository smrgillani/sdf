import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../../../projects/forum.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import ProjectPaginationModel from 'app/projects/models/ProjectPaginationModel';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  providers: [PaginationMethods]
})
export class VideosComponent implements OnInit {
  pageSize: number = 9;
  searchText: string = '';
  count: number = 0;
  currentPage: number = 1;
  videos: { id: number, title: string, url: string }[];
  addVideo: { title: string, url: string } = { title: '', url: '' };
  serverSideErrors: any;
  showAddPanel:boolean = false;

  constructor(private forumService: ForumService) {

  }

  ngOnInit() {
    this.getVideosList(1);
  }

  getVideosList(newPage) {
    this.currentPage = newPage;
    this.forumService.getForumVideosList(newPage, this.pageSize, this.searchText).subscribe((data: ProjectPaginationModel) => {
      this.count = data.count;
      this.videos = data.results;
    });
  }

  AddVideo() {
    this.serverSideErrors = [];
    if(this.addVideo.title.trim() == ''){
      this.serverSideErrors.push('Please add title');
      setTimeout(() => { this.serverSideErrors = null }, 5000);
    }
    if(this.addVideo.url.indexOf('youtu')<0){
      this.serverSideErrors.push('Please add youtube url');
      setTimeout(() => { this.serverSideErrors = null }, 5000);
    }
    if(this.serverSideErrors.length>0){
      return;
    }

    let value = this.addVideo.url;
    let embedUrl: string = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = value.match(regExp);
    if (match && match[2]) {
      let sepratedID = match[2];
      embedUrl = encodeURI('https://www.youtube.com/embed/' + sepratedID);
      this.forumService.saveForumVideo({ title: this.addVideo.title, url: embedUrl }).subscribe(
        (data) => {
          this.addVideo.title = '';
          this.addVideo.url = '';
          this.getVideosList(1);
        },
        (errMsg: any) => {
          console.log(errMsg);
          if (Array.isArray(errMsg.url)) {
            this.serverSideErrors = errMsg.url;
            setTimeout(() => { this.serverSideErrors = null }, 5000);
          }
        });
    }
  }

  isArray(errors){
    return Array.isArray(errors);
 }

 toggleAdd(){
  this.showAddPanel = !this.showAddPanel
  if(this.showAddPanel){
    this.addVideo.title = '';
    this.addVideo.url = '';
  }
 }

  valueChange() {
    this.getVideosList(this.currentPage);
  }
}
