import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-funded-projects',
  templateUrl: './my-funded-projects.component.html',
  styleUrls: ['./my-funded-projects.component.scss']
})
export class MyFundedProjectsComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  constructor() { }

  ngOnInit() {
  }
  valueChange()
  {
      if(this.searchText.length>2 || this.searchText=='')
      {
        this.getNewEmpoloyeeList(1);
      }
     
  }
  getNewEmpoloyeeList(newPage) {
    //../employee-job-list/?professional_details__departments=1&professional_details__expertise=4&professional_details__role=2&professional_details__total_experience=2&professional_details__hourly_charges=2&availability_details__days_per_year=1&availability_details__hours_per_day=7
     if (newPage) {
       // this.recruitmentService.list(newPage, this.pageSize,this.stage,this.searchText)
      //  this.recruitmentService.directHireJobPostingList(newPage,this.pageSize,this.searchText, this.projectId)
      //  .subscribe((empJob:HireEmployeeModel[]) => {
      //      this.employees = empJob['results'];
      //      this.count = empJob['count'];
      //     // this.paginationReset = false;
      //    });
     }
   }

}
