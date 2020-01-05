import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ThreadInfo } from 'app/projects/models/forum-info-model';
import { ForumService } from 'app/projects/forum.service';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-thread',
  templateUrl: './new-thread.component.html',
  styleUrls: ['./new-thread.component.scss']
})
export class NewThreadComponent implements OnInit {

  threadInfoModel: ThreadInfo;
  internalCategoryList: SelectItem[];
  internalTopicList: SelectItem[];
  internalTypeList: SelectItem[];
  internalForumUserList: SelectItem[];
  AllCreatorForumUserList: SelectItem[];
  dropZoneTemplate: string = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
  objKeyMessage: any;
  isReadonly: boolean = false;

  constructor(private forumService: ForumService, private _location: Location,
    private router: Router, private route: ActivatedRoute) {
    this.threadInfoModel = new ThreadInfo();
    this.internalCategoryList = [];
    this.internalTopicList = [];
    this.internalTypeList = [];
    this.internalForumUserList = [];
    this.AllCreatorForumUserList = [];
    this.isReadonly = this.threadInfoModel.id ? true : false;
  }

  ngOnInit() {
    this.internalTypeList.push({ label: 'Public', value: true }, { label: 'Private', value: false });
    this.getCategoryList();
    //this.getTopicList();
    this.getForumUserInfoList();
    this.getCreatorUserInfoList();
    this.route.snapshot.params['id'] ? this.getThreadInfo(parseInt(this.route.snapshot.params['id'])) : null;
  }

  getCategoryList() {
    this.forumService.getCategoryList().subscribe((listInfo) => {
      listInfo.forEach(element => {
        this.internalCategoryList.push({ label: element.title, value: element.id });
      });
    });
  }

  getThreadInfo(id: number) {
    this.isReadonly = true;
    this.threadInfoModel.id = id;
    this.forumService.getThreadInfo(id).subscribe((info)=>{
      this.onCalegorySelect(info.forumcategories);
      this.threadInfoModel = info;
      this.threadInfoModel.image = info.image;
      this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
                                <img src=${info.image} alt="">
                              </div>`;
    })
  }

  getTopicList() {
    this.forumService.getTopicInfoList().subscribe((listInfo) => {
      listInfo.forEach(element => {
        this.internalTopicList.push({ label: element.title, value: element.id });
      });
    });
  }

  onCalegorySelect(value) {
    this.getTopicsList(value);
  }

  getTopicsList(value) {
    this.forumService.getCategoryTopicInfoList(value).subscribe((listInfo) => {
      this.internalTopicList = [];
      listInfo.forEach(element => {
        this.internalTopicList.push({ label: element.title, value: element.id });
      });
    });
  }

  saveNewThread(form) {
    if (this.isReadonly) {
      this.forumService.putThreadInfo(this.threadInfoModel).subscribe((info) => {
        this.router.navigate([`/founder/forum-overview`]);
      }, (errorMsg: any) => {
        this.checkForErrors(errorMsg, form);
      });
    }
    else {
      this.forumService.postNewThread(this.threadInfoModel).subscribe((info) => {
        this.router.navigate([`/founder/forum-overview`]);
      }, (errorMsg: any) => {
        this.checkForErrors(errorMsg, form);
      });
    }
  }

  getForumUserInfoList() {
    this.forumService.getForumUserInfoList().subscribe((listInfo) => {
      listInfo.user.forEach(element => {
        this.internalForumUserList.push({ label: element.name, value: element.id });
      });
    });
  }

  getCreatorUserInfoList() {
    this.forumService.getCreatorUserInfoList().subscribe((CreaterlistInfo) => {
      CreaterlistInfo.forEach(element => {
        this.AllCreatorForumUserList.push({ label: element.name, value: element.user_id });
      });
    });
  }

  filesUpdated(files) {
    if (!files || files.length == 0) {
      return;
    }

    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;

    fileReader.addEventListener('loadend', function (loadEvent: any) {
      if (!self.isReadonly) {
        self.threadInfoModel.image = loadEvent.target.result;
        self.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
                          <img src=${loadEvent.target.result} alt="">
                      </div>`;
      }
    });

    fileReader.readAsDataURL(file);
  }

  beforeAddFile(file: File) {
    if (file.type.includes('image')) {
      return true;
    }
    alert('Please upload image only');
    file = null;
    return false;
  }

  removeImage() {
    this.threadInfoModel.image = null;
    this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa"></div>`;
  }

  resetForm(f) {
    this.removeImage();
    f.resetForm();
  }

  onTypeSelect(value) {
    if (this.threadInfoModel.public) {
      this.threadInfoModel.participants = [];
    }
  }

  checkForErrors(errorMsg, form?) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : form.controls['common'].setErrors(newErr);

    });
  }

}
