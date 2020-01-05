import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ProjectModel from 'app/projects/models/ProjectModel';
import {FormsModule} from '@angular/forms';
import {Index as EmployeeProfileInfo} from 'app/employeeprofile/models/index';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-snapshort-profile',
  templateUrl: './snapshort-profile.component.html',
  styleUrls: ['./snapshort-profile.component.scss']
})
export class SnapshortProfileComponent implements OnInit {
  id: number;
  projectId: number;
  project: ProjectModel;
  employeeProfileInfo: EmployeeProfileInfo;
  employeeId: number;
  resume: number;
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
  serverUrlToAppend: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private snapshortEmpService: StageStorage) { 
    this.project = new ProjectModel();
    this.employeeProfileInfo = new EmployeeProfileInfo();
    this.serverUrlToAppend = environment.server.replace('/api/v1', '');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];

      this.snapshortEmpService.getBasicInfo().subscribe((obj)=>{
        if (obj.photo && obj.photo.indexOf('https') < 0) {
            obj.photo = `${this.serverUrlToAppend}${obj.photo}`;
          }
        this.employeeId = obj.userprofile_id;
        this.loadEmployeeInfo();
      });
    });
  }

  loadEmployeeInfo(){
    this.snapshortEmpService.getCompleteEmployeeInfo(this.employeeId).subscribe((obj) => {
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
