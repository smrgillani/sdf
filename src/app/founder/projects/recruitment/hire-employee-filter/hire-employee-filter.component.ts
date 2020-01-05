import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecruitmentService } from 'app/projects/recruitment.service';
import { RecruitmentFilterModel, RecruitmentRole, RecruitmentExpertise } from 'app/projects/models/RecruitmentFilterModel';
import { PublishJobModel } from 'app/projects/models/PublishJobModel';
import { Subscription } from "rxjs/Subscription";
import { flatten } from '@angular/compiler';

@Component({
  selector: 'app-hire-employee-filter',
  templateUrl: './hire-employee-filter.component.html',
  styleUrls: [
    '~@angular/material/prebuilt-themes/deeppurple-amber.css',
    './hire-employee-filter.component.css'
  ]
})

export class HireEmployeeFilterComponent implements OnInit, OnDestroy {
  departments: any;
  roles: any = [];
  expertise: any = [];
  availability: any;
  hourlyBudget: any;
  experience: any;
  private filterCriteria: PublishJobModel;
  flagRoles: boolean = true;
  flagExpertise: boolean = true;
  flagGetJobDetails: boolean = false;

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
  hireEmployeeFiltersSubscription: Subscription = new Subscription();
  constructor(private recruitmentService: RecruitmentService) {
    this.filterCriteria = new PublishJobModel();
    this.filterCriteria.department = [];
    this.filterCriteria.role = [];
    this.filterCriteria.expertise = [];
    this.filterCriteria.availability = [];
    this.filterCriteria.experience = [];
    this.filterCriteria.hourlybudget = [];
  }

  ngOnInit() {
    this.hireEmployeeFiltersSubscription = this.recruitmentService.hireEmployeeFilters
      .subscribe(
        (obj) => {
          if (obj != undefined) {
            this.filterCriteria = obj;
          }
        }
      );
  }

  clearFilter() {
    this.filterCriteria = new PublishJobModel();
    this.filterCriteria.department = null;
    this.filterCriteria.role = null;
    this.filterCriteria.expertise = null;
    this.filterCriteria.availability = null;
    this.filterCriteria.experience = null;
    this.filterCriteria.hourlybudget = null;
    
    if (this.departments != null && this.departments.length > 0) {
      for (var i = 0; i < this.departments.length; i++) {
        this.departments[i].checked = false;
      }
    }

    if (this.roles != null && this.roles.length > 0) {
      for (var i = 0; i < this.roles.length; i++) {      
        this.roles[i].checked = false;
      }
    }

    if (this.expertise != null && this.expertise.length > 0) {
      for (var i = 0; i < this.expertise.length; i++) {
        this.expertise[i].checked = false;
      }
    }

    if (this.availability != null && this.availability.length > 0) {
      for (var i = 0; i < this.availability.length; i++) {    
        this.availability[i].checked = false;
      }
    }

    if (this.hourlyBudget != null && this.hourlyBudget.length > 0) {
      for (var i = 0; i < this.hourlyBudget.length; i++) {
        this.hourlyBudget[i].checked = false;
      }
    }

    if (this.experience != null && this.experience.length > 0) {
      for (var i = 0; i < this.experience.length; i++) {
        this.experience[i].checked = false;
      }
    }

    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);

    this.filterCriteria.department = [];
    this.filterCriteria.role = [];
    this.filterCriteria.expertise = [];
    this.filterCriteria.availability = [];
    this.filterCriteria.experience = [];
    this.filterCriteria.hourlybudget = [];
  }

  getDepartments() {
    if (this.departments) {
      for (let i = 0; i < this.departments.length; i++) {
        let index = this.filterCriteria.department.findIndex(a => a == this.departments[i].id)
        if (index > -1) {
          this.departments[i].checked = true;
        }
      }
    }
    else {
      this.recruitmentService.getDepartmentFilters().subscribe(
        (response: RecruitmentFilterModel) => {
          this.departments = response;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
    }
  }

  onDepartmentChecked(value: boolean, deptId: number) {
    // if checkbox checked then push into filterCriteria.department
    // if checkbox unchecked then slice into filterCriteria.department
    // reset the roles as per department selection
    // reset roles from filterCriteria.roles
    // reset the expertise as per department selection
    // reset expertise from filterCriteria.expertise

    let deptIndex = this.departments.findIndex(a => a.id == deptId);
    if (deptIndex > -1) {
      this.departments[deptIndex].checked = value;
    }

    let self = this;
    let index = this.filterCriteria.department.findIndex(a => a == deptId);
    let tempRole: any;
    tempRole = this.departments.filter((a) => a.id == deptId)
      .map(x => {
        return x.role.map(r => {
          r.checked = false;
          return r;
        });
      });

    if (value) {
      if (index < 0) {
        this.filterCriteria.department.push(deptId);
        this.roles.push.apply(this.roles, tempRole[0]);
      }
    }
    else {
      if (index != -1) {
        this.filterCriteria.department.splice(index, 1);

        //clear roles from filterCriteria
        if (tempRole == undefined || tempRole.length == 0) {
          this.roles = [];
          this.filterCriteria.role = [];
        }
        else {
          this.roles = this.roles.filter(function (el) {
            return tempRole[0].indexOf(el) < 0;
          });

          this.filterCriteria.role = this.filterCriteria.role.filter(function (x) {
            return self.roles.findIndex(a => a.id == x) > -1;
          });
        }
        //clear expertise from filterCriteria
        let tempExpertise: any;
        tempExpertise = this.roles.filter((a) => self.filterCriteria.role.findIndex(f => f == a.id) > -1)
          .map(x => {
            return x.expertise
          });

        this.expertise = [];
        if (tempExpertise == undefined || tempExpertise.length == 0) {
          this.filterCriteria.expertise = [];
        }
        else {
          for (let i = 0; i < tempExpertise.length; i++) {
            const element = tempExpertise[i];
            for (let j = 0; j < element.length; j++) {
              const exp = element[j];
              if (this.expertise.findIndex(a => a.id == exp.id) < 0) {;
                this.expertise.push(exp);
              }
            }
          }
          this.filterCriteria.expertise = this.filterCriteria.expertise.filter(function (x) {
            return self.expertise.findIndex(a => a.id == x) > -1;
          });
        }
        if (this.expertise != undefined && this.expertise.length != 0) {
          this.flagExpertise = false;
        }
        else {
          this.flagExpertise = true;
        }
      }
    }

    if (this.roles != undefined && this.roles.length != 0) {
      this.flagRoles = false;
    }
    else {
      this.flagRoles = true;
    }
    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getRole() {
    if (this.roles) {
      for (let i = 0; i < this.roles.length; i++) {
        let index = this.filterCriteria.role.findIndex(a => a == this.roles[i].id)
        if (index > -1) {
          this.roles[i].checked = true;
        }
      }
    }
  }

  onRoleChecked(value: boolean, roleId: number) {
    // if checkbox checked then push into filterCriteria.role
    // if checkbox unchecked then slice into filterCriteria.role
    // reset the expertise as per roles selection

    let roleIndex = this.roles.findIndex(a => a.id == roleId);
    if (roleIndex > -1) {
      this.roles[roleIndex].checked = value;
    }

    let index = this.filterCriteria.role.findIndex(a => a == roleId);

    if (value) {
      if (index < 0) {
        this.filterCriteria.role.push(roleId);
      }
    }
    else {
      if (index != -1) {
        this.filterCriteria.role.splice(index, 1);
      }
    }
    let self = this;
    let tempExpertise: any;
    tempExpertise = this.roles.filter((a) => self.filterCriteria.role.findIndex(f => f == a.id) > -1)
      .map(x => {
        return x.expertise
      });

    this.expertise = [];
    if (tempExpertise == undefined || tempExpertise.length == 0) {
      this.filterCriteria.expertise = [];
    }
    else {
      for (let i = 0; i < tempExpertise.length; i++) {
        const element = tempExpertise[i];
        for (let j = 0; j < element.length; j++) {
          const exp = element[j];
          if (this.expertise.findIndex(a => a.id == exp.id) < 0) {
            this.expertise.push(exp);
          }
        }
      }

      this.filterCriteria.expertise = this.filterCriteria.expertise.filter(function (x) {
        return self.expertise.findIndex(a => a.id == x) > -1;
      });
    }

    if (this.expertise != undefined && this.expertise.length != 0) {
      this.flagExpertise = false;
    }
    else {
      this.flagExpertise = true;
    }
    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getExperties() {
    if (this.expertise) {
      for (let i = 0; i < this.expertise.length; i++) {
        let index = this.filterCriteria.expertise.findIndex(a => a == this.expertise[i].id)
        if (index > -1) {
          this.expertise[i].checked = true;
        }
      }
    }
  }

  onExpertiseChecked(value: boolean, expertiseId: number) {
    let expertiseIndex = this.expertise.findIndex(a => a.id == expertiseId);
    if (expertiseIndex > -1) {
      this.expertise[expertiseIndex].checked = value;
    }

    let index = this.filterCriteria.expertise.findIndex(a => a == expertiseId);
    if (value) {
      if (index < 0) {
        this.filterCriteria.expertise.push(expertiseId);
      }
    }
    else {
      if (index != -1) {
        this.filterCriteria.expertise.splice(index, 1);
      }
    }

    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getAvailability() {
    if (this.availability) {
      for (let i = 0; i < this.availability.length; i++) {
        let index = this.filterCriteria.availability.findIndex(a => a == this.availability[i].id)
        if (index > -1) {
          this.availability[i].checked = true;
        }
      }
    }
    else {
      this.recruitmentService.getAvailabilityFilters().subscribe(
        (response: RecruitmentFilterModel) => {
          this.availability = response;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
    }
  }

  onAvailabilityChecked(value: boolean, availabilityId: number) {
    let availabilityIndex = this.availability.findIndex(a => a.id == availabilityId);
    if (availabilityIndex > -1) {
      this.availability[availabilityIndex].checked = value;
    }

    let index = this.filterCriteria.availability.findIndex(a => a == availabilityId);
    if (value) {
      if (index < 0) {
        this.filterCriteria.availability.push(availabilityId);
      }
    }
    else {
      if (index != -1) {
        this.filterCriteria.availability.splice(index, 1);
      }
    }

    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getexperience() {
    if (this.experience) {
      for (let i = 0; i < this.experience.length; i++) {
        let index = this.filterCriteria.experience.findIndex(a => a == this.experience[i].id)
        if (index > -1) {
          this.experience[i].checked = true;
        }
      }
    }
    else {
      this.recruitmentService.getExperienceFilters().subscribe(
        (response: RecruitmentFilterModel) => {
          this.experience = response;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
    }
  }
  onExperienceChecked(value: boolean, experienceId: number) {
    let experienceIndex = this.experience.findIndex(a => a.id == experienceId);
    if (experienceIndex > -1) {
      this.experience[experienceIndex].checked = value;
    }

    let index = this.filterCriteria.experience.findIndex(a => a == experienceId);
    if (value) {
      if (index < 0) {
        this.filterCriteria.experience.push(experienceId);
      }
    }
    else {
      if (index != -1) {
        this.filterCriteria.experience.splice(index, 1);
      }
    }

    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }

  getHourlyBudget() {
    if (this.hourlyBudget) {
      for (let i = 0; i < this.hourlyBudget.length; i++) {
        let index = this.filterCriteria.hourlybudget.findIndex(a => a == this.hourlyBudget[i].id)
        if (index > -1) {
          this.hourlyBudget[i].checked = true;
        }
      }
    }
    else {
      this.recruitmentService.getHourlyBudgetFilters().subscribe(
        (response: RecruitmentFilterModel) => {
          this.hourlyBudget = response;
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        }
      );
    }
  }
  onHourlyBudgetChecked(value: boolean, hourlyBudgetId: number) {

    let hourlyBudgetIndex = this.hourlyBudget.findIndex(a => a.id == hourlyBudgetId);
    if (hourlyBudgetIndex > -1) {
      this.hourlyBudget[hourlyBudgetIndex].checked = value;
    }

    let index = this.filterCriteria.hourlybudget.findIndex(a => a == hourlyBudgetId);
    if (value) {
      if (index < 0) {
        this.filterCriteria.hourlybudget.push(hourlyBudgetId);
      }
    }
    else {
      if (index != -1) {
        this.filterCriteria.hourlybudget.splice(index, 1);
      }
    }

    //Set updated value to service
    this.recruitmentService.hireEmployeeFilters.next(this.filterCriteria);
  }
  ngOnDestroy() {
    this.hireEmployeeFiltersSubscription.unsubscribe();
  }
}