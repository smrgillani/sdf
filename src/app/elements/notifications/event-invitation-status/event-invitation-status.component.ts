import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EventInfoModel } from 'app/projects/models/event-info-model';
import { ForumService } from 'app/projects/forum.service';

@Component({
  selector: 'app-event-invitation-status',
  templateUrl: './event-invitation-status.component.html',
  styleUrls: ['./event-invitation-status.component.scss'],
  providers: [ForumService]
})
export class EventInvitationStatusComponent implements OnInit {

  eventInfo: any;
  @Input() eventId: number;
  eventDate: string;
  eventTime: string;

  constructor(private forumService: ForumService, public activeModal: NgbActiveModal) {
    //this.eventInfo = new EventInfoModel();
  }

  ngOnInit() {
    this.getEventInfo();
  }

  getEventInfo() {
    this.forumService.getEventInfo(this.eventId).subscribe((obj) => {
      this.eventInfo = obj;
      this.eventDate = this.eventInfo.event_details.event_date.split('T')[0];
      this.eventTime = this.eventInfo.event_details.event_date.split('T')[1].split(':00Z')[0];
      console.log('getEventInfo: ', obj);
    });
  }

  updateEventInfoStatus(status: string) {
    this.forumService.updateEventInfoStatus(this.eventId, status).subscribe((obj) => {
      this.activeModal.close();
    });
  }

}
