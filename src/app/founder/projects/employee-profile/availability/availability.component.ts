import { Component, OnInit, Input } from '@angular/core';
import {EmployeeAvailabilityInfo} from 'app/employeeprofile/models/employee-availability-info'

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {
@Input() availabilityInfo: EmployeeAvailabilityInfo;
  constructor() { }

  ngOnInit() {
  }

}
