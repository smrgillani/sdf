import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { EventInfoModel } from 'app/projects/models/event-info-model';
import { ForumService } from 'app/projects/forum.service';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss']
})
export class AddEventsComponent implements OnInit {

  eventInfo: EventInfoModel;
  objKeyMessage: any;
  dropZoneTemplate: string = `<div class="file-droppa-document-image file-droppa-passport"></div>`;

  constructor(private forumService: ForumService, private _location: Location,
    private router: Router, private route: ActivatedRoute,
    private loaderService: LoaderService) { 
    this.eventInfo = new EventInfoModel();
  }

  ngOnInit() {
    //this.eventInfo.event_date = moment().hour(8).minute(0).second(0).toDate();
    this.eventInfo.event_date = moment().minute(59).second(0).toDate();
    this.eventInfo.event_type = 'private';
  }

  saveNewEvent(form) {
    const data: any = Object.assign({}, this.eventInfo);
    data.event_date = moment(data.event_date).format('YYYY-MM-DD HH:mm');
    this.forumService.postNewEvent(data).subscribe((info) => {
      this.router.navigate([`../list`], {relativeTo: this.route});
    }, (errorMsg: any) => {
      this.checkForErrors(errorMsg, form);
    });
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

  filesUpdated(files) {
    if (!files || files.length == 0) {
      return;
    }

    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;

    fileReader.addEventListener('loadend', function (loadEvent: any) {
      self.eventInfo.image = loadEvent.target.result;
      self.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
                        <img src=${loadEvent.target.result} alt="">
                    </div>`;
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
    this.eventInfo.image = null;
    this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa"></div>`;
  }

  resetForm(f) {
    this.removeImage();
    f.resetForm();
    this.eventInfo.event_date = moment().minute(59).second(0).toDate();
    this.eventInfo.event_type = 'private';
  }
}
