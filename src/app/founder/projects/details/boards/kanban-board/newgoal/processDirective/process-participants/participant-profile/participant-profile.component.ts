import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Index as EmployeeProfileInfo } from 'app/employeeprofile/models/index';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-participant-profile',
  templateUrl: './participant-profile.component.html',
  styleUrls: ['./participant-profile.component.scss'],
  providers: [StageStorage]
})
export class ParticipantProfileComponent implements OnInit {

  employeeProfileInfo: EmployeeProfileInfo;
  @Input() employeeId: number;
  resume: { id: number; file_name: string };
  is_kyc_complete: boolean = false;
  qaList: any[] = [
    {
      "panelname": "Basic Info",
      "isCollapsed": true
    },
    {
      "panelname": "Professional Info",
      "isCollapsed": true
    }, {
      "panelname": "Past Experience",
      "isCollapsed": true
    },
    {
      "panelname": "Work Sample",
      "isCollapsed": true
    },
    {
      "panelname": "Availabilty",
      "isCollapsed": true
    }
  ]

  constructor(public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private employeeProfileService: StageStorage) {
    this.employeeProfileInfo = new EmployeeProfileInfo();
  }

  ngOnInit() {
    this.loadEmployeeInfo();
  }

  loadEmployeeInfo() {
    this.employeeProfileService.getCompleteEmployeeInfo(this.employeeId).subscribe((obj) => {
      this.is_kyc_complete = obj.is_kyc_complete;
      this.employeeProfileInfo.id = obj.id;
      if (obj.id) {
        this.resume = obj.resume;
        if (obj.basic_details && obj.basic_details[0]) {
          this.employeeProfileInfo.basicInfo = obj.basic_details[0];
        }
        if (obj.professional_details && obj.professional_details[0]) {
          this.employeeProfileInfo.professionalInfo = obj.professional_details;//multiple
        }
        if (obj.employment_details && obj.employment_details[0]) {
          this.employeeProfileInfo.employmentInfo = obj.employment_details;//multiple
        }
        if (obj.work_details && obj.work_details[0]) {
          this.employeeProfileInfo.worksampleInfo = obj.work_details;//multiple
        }
        if (obj.availability_details && obj.availability_details[0]) {
          this.employeeProfileInfo.availabilityInfo = obj.availability_details[0];
        }
      }
    });
  }

}
