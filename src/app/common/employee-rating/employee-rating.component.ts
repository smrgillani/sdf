import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { EmployeeRatingService } from 'app/projects/employee-rating.service';
import { EmployeeRateInfo, ParameterInfo, CurrentEmployeeRating } from 'app/projects/models/rating-model';

@Component({
  selector: 'app-employee-rating',
  templateUrl: './employee-rating.component.html',
  styleUrls: ['./employee-rating.component.scss'],
})
export class EmployeeRatingComponent implements OnInit {
  selected: number;
  submitrating = true;
  projectTaskList: EmployeeRateInfo[] = [];
  parameterInfoList: ParameterInfo[];
  currentEmployeeRatingInfo: CurrentEmployeeRating;
  rated_to: string;
  private empId = 0;
  private processId = 0;
  private accessId = 0;

  constructor(
    private _location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeRatingService: EmployeeRatingService,
  ) {
    this.empId = this.activatedRoute.snapshot.params['empId'] ? parseInt(this.activatedRoute.snapshot.params['empId'], 10) : 0;
    this.rated_to = this.activatedRoute.snapshot.params['rateFor'];
    this.processId = this.rated_to === 'employee' ? 0 : parseInt(this.activatedRoute.snapshot.params['processId'], 10);
    this.accessId = this.rated_to === 'backer' ? parseInt(this.activatedRoute.snapshot.params['id'], 10) : 0;
    this.currentEmployeeRatingInfo = new CurrentEmployeeRating();
  }

  ngOnInit() {
    if (this.rated_to === 'employee') {
      this.getEmpProjectsTasks();
      this.getEmployeeCurrentRating();
    } else if (this.rated_to === 'backer') {
      this.getBackerProject();
      this.getCreatorCurrentRating();
    } else {
      this.getCreatorProjectTask();
      this.getCreatorCurrentRating();
    }
    this.getParameterInfoList();
  }

  isSubmitted(event) {
    // event ? this.getEmpProjectsTasks() : null;
    if (event) {
      if (this.rated_to === 'employee') {
        this.getEmpProjectsTasks();
        this.getEmployeeCurrentRating();
      } else if (this.rated_to === 'backer') {
        this.getBackerProject();
        this.getCreatorCurrentRating();
      } else {
        this.getCreatorProjectTask();
        this.getCreatorCurrentRating();
      }
    }
    this.getParameterInfoList();
  }

  private getEmpProjectsTasks() {
    this.employeeRatingService.getEmpProjectsTasks(this.empId).subscribe((empInfo) => {
      this.projectTaskList = empInfo;
    });
  }

  private getParameterInfoList() {
    this.employeeRatingService.getParameterInfoList().subscribe((paramInfoList) => {
      this.parameterInfoList = paramInfoList;
    });
  }

  private getEmployeeCurrentRating() {
    this.employeeRatingService.getEmpCurrentRating(this.empId).subscribe((currentEmpInfo) => {
      this.currentEmployeeRatingInfo = currentEmpInfo;
    });
  }

  private getCreatorProjectTask() {
    this.employeeRatingService.getCreatorProjectTask(this.processId).subscribe((info) => {
      // this.projectTaskList = info;
      this.projectTaskList = [];
      const data: EmployeeRateInfo = new EmployeeRateInfo();
      data.id = info[0].id;
      data.title = info[0].title;
      this.projectTaskList.push(data);
      const subdata: any = info[0].subtasks;
      this.projectTaskList[0].subtasks.push(subdata);
    });
  }

  private getBackerProject() {
    this.employeeRatingService.getBackerProject(this.accessId).subscribe((info) => {
      // this.projectTaskList = info;
      this.projectTaskList = [];
      const data: EmployeeRateInfo = new EmployeeRateInfo();
      data.id = info[0].id;
      data.title = info[0].title;
      this.projectTaskList.push(data);
      const subdata: any = info[0].subtasks;
      subdata.title = 'Rated against the project';
      this.projectTaskList[0].subtasks.push(subdata);
    });
  }

  private getCreatorCurrentRating() {
    this.employeeRatingService.getCreatorCurrentRating(this.empId, this.rated_to).subscribe((currentEmpInfo) => {
      this.currentEmployeeRatingInfo = currentEmpInfo;
    });
  }
}
