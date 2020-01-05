import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModalRef, NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { HireEmployeeModel } from 'app/projects/models/HireEmployeeModel';
import { ScheduleInterviewModel } from 'app/projects/models/ScheduleInterviewModel';
import { PublishJobModel } from 'app/projects/models/PublishJobModel';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { ChatService } from 'app/collaboration/chat.service';
import { StageStorage as InterviewAppliedService } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-backer-direct-hire-response',
  templateUrl: './backer-direct-hire-response.component.html',
  styleUrls: ['./backer-direct-hire-response.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig, InterviewAppliedService]
})
export class BackerDirectHireResponseComponent implements OnInit {

  pageSize = 5;
  count: number;
  private employees: HireEmployeeModel[];
  searchText: '';
  scheduleOn: string;
  scheduleInterviewData: ScheduleInterviewModel;
  stage: string;
  flagHired: boolean = false;
  private hireEmployeeFilters: PublishJobModel;
  @Input() projectId: number;
  popUpForDocuSignModalRef: NgbModalRef;
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForAddEmailMessage') popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') popUpForCommonMessage;
  errorMessage: string;

  constructor(private paginationMethods: PaginationMethods,
    private recruitmentService: RecruitmentService,
    private interviewAppliedService: InterviewAppliedService,
    config: NgbRatingConfig,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) { 
      config.max = 5;
      config.readonly = true;
    }

  ngOnInit() {
  }

  getNewEmpoloyeeList(newPage) {
    if (newPage) {
      this.recruitmentService.directHireJobPostingListForBacker(newPage, this.pageSize, this.searchText, this.projectId)
        .subscribe((empJob: HireEmployeeModel[]) => {
          this.employees = empJob['results'];
          this.count = empJob['count'];
        });
    }
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getNewEmpoloyeeList(1);
    }

  }

  getProfile(empId: any) {
    this.router.navigate(['backer/my-projects/' + this.projectId + '/recruitment/' + empId + '/profile']);
  }

}
