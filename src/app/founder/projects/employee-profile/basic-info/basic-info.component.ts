import { Component, OnInit, Input } from '@angular/core';
import { EmployeeBasicInfo } from 'app/employeeprofile/models/employee-basic-info'

@Component({
  selector: 'app-view-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class ViewBasicInfoComponent implements OnInit {

  @Input() basicInfo: EmployeeBasicInfo;

  constructor() { }

  ngOnInit() {

  }

}
