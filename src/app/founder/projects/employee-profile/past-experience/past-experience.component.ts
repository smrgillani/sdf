import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-past-experience',
  templateUrl: './past-experience.component.html',
  styleUrls: ['./past-experience.component.scss']
})
export class PastExperienceComponent implements OnInit {
  @Input() employmentInfo;
  isCollapsedArray: boolean[] = [];
  panelname: string = '';
  currentPastList: any[] = [
    {
      "panelname": "Current Employer",
    },
    {
      "panelname": "Past Employer",
    }]
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.currentPastList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
  }

  toggleAccordian(e, x, p) {
    let lastopen = this.isCollapsedArray[x];
    this.panelname = p;
    this.currentPastList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
    this.isCollapsedArray[x] = !lastopen;

  }

}
