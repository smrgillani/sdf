import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { RecruitmentFilterModel, RecruitmentRole, RecruitmentExpertise } from 'app/projects/models/RecruitmentFilterModel';
import { PublishJobModel } from 'app/projects/models/PublishJobModel';
import { Subscription } from "rxjs/Subscription";
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  departments: any;
  roles: any;
  expertise: any;
  @ViewChild('acc') accordion: NgbAccordion;
  // availability:RecruitmentFilterModel;
  // hourlyBudget:RecruitmentFilterModel;
  // experience:RecruitmentFilterModel;
  availability: any;
  hourlyBudget: any;
  experience: any;
  private jobProfile: PublishJobModel;
  flagRoles: boolean = true;
  flagExpertise: boolean = true;
  flagGetJobDetails: boolean = false;
  flagReset: boolean = false;
  //selectedItemList:any[]=[];
  filterdata: any[] = [
    {
      "title": "Category",
      "isCollapsed": true
    },
    {
      "title": "Sub Category",
      "isCollapsed": true
    }, {
      "title": "Availability",
      "isCollapsed": true
    },
    {
      "title": "Experties",
      "isCollapsed": true
    },
    {
      "title": "Hourly Budget",
      "isCollapsed": true
    }
  ];
  publishJobModelDataSubscription: Subscription = new Subscription();
  postJobClearSubscription: Subscription = new Subscription();
  constructor(private recruitmentService: RecruitmentService) {
    this.jobProfile = new PublishJobModel();
  }
  checkedAvalItem: boolean = false;
  checkedBudgetItem: boolean = false;
  checkedExperienceItem: boolean = false;
  checkedDeptItem: boolean = false;
  checkedRoleItem: boolean = false;
  checkedExpertiseItem: boolean = false;




  ngOnInit() {
    this.publishJobModelDataSubscription = this.recruitmentService.publishJobModelData
      .subscribe(
        (obj) => {

          if (obj != undefined) {
            this.jobProfile = obj;
          }
        }
      );

    this.postJobClearSubscription = this.recruitmentService.postJobClear
      .subscribe(
        (obj) => {

          this.flagReset = obj;
          if (this.flagReset) {
            this.flagRoles = true;
            this.flagExpertise = true;
          }
        }
      );
    //this.getDepartments();
  }

  getDepartments() {
    this.recruitmentService.getDepartmentFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.departments = response;
        for (let i = 0; i < this.departments.length; i++) {
          let index = this.jobProfile.department.findIndex(a => a == this.departments[i].id)
          if (index > -1) {
            this.departments[i].checkedDeptItem = true;
            this.onDepartmentChecked(true, this.departments[i].id);
          }
        }
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
  }

  onDepartmentChecked(value: boolean, deptId: number) {
    for (let i = 0; i < this.departments.length; i++) {
      if (this.departments[i].id == deptId) {
        this.departments[i].checkedDeptItem = value;
      }
      else {
        this.departments[i].checkedDeptItem = false;
      }
    }

    this.jobProfile.department = [];
    this.roles = [];
    this.expertise = [];
    if (value) {
      let tempRole;
      if (this.jobProfile.department.length == 0) {
        this.jobProfile.department.push(deptId);
        tempRole = this.departments.filter((a) => a.id == deptId)
          .map(x => x.role);
        this.roles = tempRole[0];
      }
      else {
        let index = this.jobProfile.department.findIndex(a => a == deptId);
        if (index != -1) {
          this.jobProfile.department.splice(index, 1);
          this.roles = [];
        }
        else {
          this.jobProfile.department.push(deptId);
          tempRole = this.departments.filter((a) => a.id == deptId)
            .map(x => x.role);
          this.roles = tempRole[0];
        }
      }
    }
    
    this.flagExpertise = true;
    if (this.roles.length != 0 || this.roles != undefined) {
      this.flagRoles = false;
    }
    else {
      this.flagRoles = true;
    }
    //Set updated value to service
    this.recruitmentService.publishJobModelData.next(this.jobProfile);
  }

  getRole() {
    //check for this.role    
    // if(this.jobProfile.role.length!=undefined && this.jobProfile.role.length!=0)
    if (this.roles) {
      for (let i = 0; i < this.roles.length; i++) {
        let index = this.jobProfile.role.findIndex(a => a == this.roles[i].id)
        if (index > -1) {
          this.roles[i].checkedRoleItem = true;
          this.onRoleChecked(true, this.roles[i].id);
        }
      }
    }
  }

  onRoleChecked(value: boolean, roleId: number) {
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].id == roleId) {
        this.roles[i].checkedRoleItem = value;
      }
      else {
        this.roles[i].checkedRoleItem = false;
      }
    }

    this.jobProfile.role = [];
    this.expertise = [];
    if (value) {
      let tempExpertise;
      if (this.jobProfile.role.length == 0) {
        this.jobProfile.role.push(roleId);
        tempExpertise = this.roles.filter((a) => a.id == roleId)
          .map(x => x.expertise);
        this.expertise = tempExpertise[0];
      }
      else {
        let index = this.jobProfile.role.findIndex(a => a == roleId);
        if (index != -1) {
          this.jobProfile.role.splice(index, 1);
          this.expertise = [];
        }
        else {
          this.jobProfile.role.push(roleId);
          tempExpertise = this.roles.filter((a) => a.id == roleId)
            .map(x => x.expertise);
          this.expertise = tempExpertise[0];
        }
      }
    }

    if (this.expertise.length != 0 || this.expertise != undefined) {
      this.flagExpertise = false;
    }
    else {
      this.flagExpertise = true;
    }
    //Set updated value to service
    this.recruitmentService.publishJobModelData.next(this.jobProfile);
  }

  getExperties() {
    if (this.expertise) {
      for (let i = 0; i < this.expertise.length; i++) {
        //if we deselect; need to reset; and set only those which is in jobprofile
        this.expertise[i].checkedExpertiseItem = false;
        let index = this.jobProfile.expertise.findIndex(a => a == this.expertise[i].id)
        if (index > -1) {
          this.expertise[i].checkedExpertiseItem = true;
          this.onExpertiseChecked(true, this.expertise[i].id);
        }
      }
    }
  }

  onExpertiseChecked(value: boolean, expertiseId: number) {
    if (this.jobProfile.expertise.length == 0) {
      this.jobProfile.expertise.push(expertiseId);
    }
    else {
      let index = this.jobProfile.expertise.findIndex(a => a == expertiseId);
      if (index != -1) {
        this.jobProfile.expertise.splice(index, 1);
      }
      else {
        this.jobProfile.expertise.push(expertiseId);
      }
    }

    //Set updated value to service
    this.recruitmentService.publishJobModelData.next(this.jobProfile);
  }

  getAvailability() {
    this.recruitmentService.getAvailabilityFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.availability = response;
        for (let i = 0; i < this.availability.length; i++) {
          let index = this.jobProfile.availability.findIndex(a => a == this.availability[i].id)
          if (index > -1) {
            this.availability[i].checkedAvalItem = true;
          }
        }
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
  }

  onAvailabilityChecked(value: boolean, availabilityId: number) {
    for (let i = 0; i < this.availability.length; i++) {
      if (this.availability[i].id == availabilityId) {
        this.availability[i].checkedAvalItem = value;
      }
      else {
        this.availability[i].checkedAvalItem = false;
      }
    }

    this.jobProfile.availability = [];
    if(value)
    {
      if (this.jobProfile.availability.length == 0) {
        this.jobProfile.availability.push(availabilityId);
      }
      else {
        let index = this.jobProfile.availability.findIndex(a => a == availabilityId);
        if (index != -1) {
          this.jobProfile.availability.splice(index, 1);
  
        }
        else {
          this.jobProfile.availability.push(availabilityId);
        }
      }
    }

    //Set updated value to service
    this.recruitmentService.publishJobModelData.next(this.jobProfile);
  }

  getexperience() {
    this.recruitmentService.getExperienceFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.experience = response;
        for (let i = 0; i < this.experience.length; i++) {
          let index = this.jobProfile.experience.findIndex(a => a == this.experience[i].id)
          if (index > -1) {
            this.experience[i].checkedExperienceItem = true;
          }
        }
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
  }
  onExperienceChecked(value: boolean, experienceId: number) {
    for (let i = 0; i < this.experience.length; i++) {
      if (this.experience[i].id == experienceId) {
        this.experience[i].checkedExperienceItem = value;
      }
      else {
        this.experience[i].checkedExperienceItem = false;
      }
    }
    this.jobProfile.experience = [];
    if(value)
    {
      if (this.jobProfile.experience.length == 0) {
        this.jobProfile.experience.push(experienceId);
      }
      else {
        let index = this.jobProfile.experience.findIndex(a => a == experienceId);
        if (index != -1) {
          this.jobProfile.experience.splice(index, 1);
        }
        else {
          this.jobProfile.experience.push(experienceId);
        }
      }
    }
    //Set updated value to service
    this.recruitmentService.publishJobModelData.next(this.jobProfile);
  }

  getHourlyBudget() {
    this.recruitmentService.getHourlyBudgetFilters().subscribe(
      (response: RecruitmentFilterModel) => {
        this.hourlyBudget = response;
        for (let i = 0; i < this.hourlyBudget.length; i++) {
          let index = this.jobProfile.hourlybudget.findIndex(a => a == this.hourlyBudget[i].id)
          if (index > -1) {
            this.hourlyBudget[i].checkedBudgetItem = true;
          }
        }
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      }
    );
  }
  onHourlyBudgetChecked(value: boolean, hourlyBudgetId: number) {
    for (let i = 0; i < this.hourlyBudget.length; i++) {
      if (this.hourlyBudget[i].id == hourlyBudgetId) {
        this.hourlyBudget[i].checkedBudgetItem = value;
      }
      else {
        this.hourlyBudget[i].checkedBudgetItem = false;
      }
    }

    this.jobProfile.hourlybudget = [];
    if(value)
    {
      if (this.jobProfile.hourlybudget.length == 0) {
        this.jobProfile.hourlybudget.push(hourlyBudgetId);
      }
      else {
        let index = this.jobProfile.hourlybudget.findIndex(a => a == hourlyBudgetId);
        if (index != -1) {
          this.jobProfile.hourlybudget.splice(index, 1);
  
        }
        else {
          this.jobProfile.hourlybudget.push(hourlyBudgetId);
        }
      }
    }
    //Set updated value to service
    this.recruitmentService.publishJobModelData.next(this.jobProfile);
  }
  ngOnDestroy() {
    this.publishJobModelDataSubscription.unsubscribe();
  }
}
