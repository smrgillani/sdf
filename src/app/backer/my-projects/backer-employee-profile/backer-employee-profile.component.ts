import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {Index as EmployeeProfileInfo} from 'app/employeeprofile/models/index';

@Component({
  selector: 'app-backer-employee-profile',
  templateUrl: './backer-employee-profile.component.html',
  styleUrls: ['./backer-employee-profile.component.scss'],
  providers: [StageStorage]
})
export class BackerEmployeeProfileComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  employeeProfileInfo: EmployeeProfileInfo;
  employeeId: number;
  resume: {id: number; file_name: string};
  qaList: any[] =[
    {
      "panelname": "Basic Info",
      "isCollapsed":true
    },
    {
      "panelname": "Professional Info",
      "isCollapsed":true
    },{
      "panelname": "Past Experience",
      "isCollapsed":true
    },
    {
      "panelname": "Work Sample",
      "isCollapsed":true
    },
    {
      "panelname": "Availabilty",
      "isCollapsed":true
    }
  ]
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private projectsService: ProjectsService,
      private employeeProfileService: StageStorage
    ) { 
  
      this.project = new ProjectModel();
      this.employeeProfileInfo = new EmployeeProfileInfo();
    }
  
    ngOnInit() {
      
      this.route.params.subscribe((params) => {
        this.projectId = params['id'];
        this.employeeId = params['empid'];
        this.loadEmployeeInfo();
      });
    }

    loadEmployeeInfo(){
      this.employeeProfileService.getCompleteEmployeeInfo(this.employeeId).subscribe((obj) => {
        this.employeeProfileInfo.id = obj.id;
        if(obj.id){
          this.resume = obj.resume;
          if(obj.basic_details && obj.basic_details[0]){
            this.employeeProfileInfo.basicInfo = obj.basic_details[0];
          }
          if(obj.professional_details && obj.professional_details[0]){
            this.employeeProfileInfo.professionalInfo = obj.professional_details;//multiple
          }
          if(obj.employment_details && obj.employment_details[0]){
            this.employeeProfileInfo.employmentInfo = obj.employment_details;//multiple
          }
          if(obj.work_details && obj.work_details[0]){
            this.employeeProfileInfo.worksampleInfo = obj.work_details;//multiple
          }
          if(obj.availability_details && obj.availability_details[0]){
            this.employeeProfileInfo.availabilityInfo = obj.availability_details[0];
          }
        }
      });
    }

}
