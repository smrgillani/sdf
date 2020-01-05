import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ParameterInfo, RatingModel, EmployeeRateInfo } from '../../../projects/models/rating-model';
import { EmployeeRatingService } from '../../../projects/employee-rating.service';

@Component({
  selector: 'app-task-attributes',
  templateUrl: './task-attributes.component.html',
  styleUrls: ['../employee-rating.component.scss']
})
export class TaskAttributesComponent implements OnInit {

  @Input() currentParameterInfoList: ParameterInfo[];
  @Input() employeeRatings: RatingModel[];
  @Input() taskId: number;
  @Input() empId: number;
  @Input() rated_to: string;

  @Output() isSubmitted = new EventEmitter<boolean>();

  employeeRateInfo: EmployeeRateInfo;

  updatedParameterInfoList: EmployeeRateInfo;
  parameterInfoList: ParameterInfo[]

  constructor(private employeeRatingService: EmployeeRatingService) { 
    this.employeeRateInfo = new EmployeeRateInfo();
    this.updatedParameterInfoList = new EmployeeRateInfo();
  }

  ngOnInit() {
    this.setParameterInfoList();
  }

  setParameterInfoList() {
    this.parameterInfoList = this.currentParameterInfoList.map(x => Object.assign({}, x))
    if(this.employeeRatings && this.employeeRatings.length > 0) {
      this.employeeRatings.forEach((element, index)=>{
        let itemIndex = this.parameterInfoList.findIndex(a=>a.id == element.parameter);
        this.parameterInfoList[itemIndex].rating = element.rating;
      });
    }
    else {
      this.parameterInfoList.forEach((element, index)=>{
        element.rating = 1;
      });
    }
  }

  postRateEmployee() {
    if (this.rated_to == 'backer') {
      this.updatedParameterInfoList.project = this.taskId;
    }
    else {
      this.updatedParameterInfoList.task = this.taskId;
    }
    this.updatedParameterInfoList.user2 = this.empId;
    this.updatedParameterInfoList.rated_to = this.rated_to;
    this.parameterInfoList.forEach((value)=>{
      this.updatedParameterInfoList.employee_ratings.push({rating: value.rating, parameter: value.id })
    });
    this.employeeRatingService.postRateEmployee(this.updatedParameterInfoList).subscribe((ratedInfo)=>{
      this.updatedParameterInfoList = new EmployeeRateInfo();
      this.isSubmitted.emit(true);
    });
  }

}
