import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { EventInfoModel } from 'app/projects/models/event-info-model';
import { ForumService } from 'app/projects/forum.service';
import * as moment from 'moment';

@Component({
  selector: 'app-update-events',
  templateUrl: './update-events.component.html',
  styleUrls: ['./update-events.component.scss']
})
export class UpdateEventsComponent implements OnInit {
  modalRef: NgbModalRef;
  selectedEvent: EventInfoModel;
  objKeyMessage: any;
  dropZoneTemplate: string = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
  
  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.selectedEvent = JSON.parse(params.selectedEvent) as EventInfoModel;
        this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
            <img src=${this.selectedEvent.image} alt="">
        </div>`;
        
        this.selectedEvent.event_date = new Date(this.selectedEvent.event_date);
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
      self.selectedEvent.image = loadEvent.target.result;
      self.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa">
          <img src=${loadEvent.target.result} alt="">
      </div>`;
    });

    fileReader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedEvent.image = null;
    this.dropZoneTemplate = `<div class="file-droppa-document-image file-droppa"></div>`;
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

  updateEvent(form) {
    const data: any = Object.assign({}, this.selectedEvent);
    data.event_date = moment(data.event_date).format('YYYY-MM-DD HH:mm');
    this.forumService.postNewEvent(data).subscribe((info) => {
      this.router.navigate([`../list`], {relativeTo: this.route});
    }, (errorMsg: any) => {
      this.checkForErrors(errorMsg, form);
    });
  }
}
