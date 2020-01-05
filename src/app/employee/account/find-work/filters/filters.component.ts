import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { commonFilters, FindWorkFilters } from '../../../../employeeprofile/models/find-work-filters';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @ViewChild('acc1') accordion: NgbAccordion;
  flagRoles: boolean = true;
  flagExpertise: boolean = true;
  flagGetJobDetails: boolean = false;
  flagReset: boolean = false;
  @Output() selectedemployeeFilters = new EventEmitter<FindWorkFilters>();
  @Input() findWorkFilters: FindWorkFilters = new FindWorkFilters();

  categoryList: commonFilters[] = [];// new commonFilters();
  subcategoryList: commonFilters[] = [];//new commonFilters();
  availabilityList: commonFilters[] = [];//new commonFilters();
  expertiseList: commonFilters[] = [];//new commonFilters();
  experienceList: commonFilters[] = [];//new commonFilters();
  hourlyBugetList: commonFilters[] = [];//new commonFilters();
  serverUrlToAppend: string = '';

  constructor(private route: ActivatedRoute, private filterForEmpService: StageStorage) {
    this.serverUrlToAppend = environment.server.replace('/api/v1', '');
  }

  ngOnInit() {
     this.filterForEmpService.getBasicInfo().subscribe((basicInfo) => {
      if (basicInfo.photo && basicInfo.photo.indexOf('https') < 0) {
            basicInfo.photo = `${this.serverUrlToAppend}${basicInfo.photo}`;
          }
      this.filterForEmpService.getSelfInfo(basicInfo.userprofile_id).subscribe((obj) => {
        let employment_detailsList = obj.employment_details;//.employment_details.map(a=>a.functional_areas);
        if (employment_detailsList && employment_detailsList.length > 0) {
          let departmentIds: number[] = [];//
          let functional_areasIds: number[] = [];
          let roleIds: number[] = [];
          for (let i = 0; i < employment_detailsList.length; i++) {
            if (employment_detailsList[i].departments != undefined && employment_detailsList[i].departments.length > 0) {
              for (let d = 0; d < employment_detailsList[i].departments.length; d++) {
                departmentIds.push(employment_detailsList[i].departments[d].id);
              }
            }
            if (employment_detailsList[i].functional_areas != undefined && employment_detailsList[i].functional_areas.length > 0) {
              for (let f = 0; f < employment_detailsList[i].functional_areas.length; f++) {
                functional_areasIds.push(employment_detailsList[i].functional_areas[f].id);
              }
            }
            if (employment_detailsList[i].role != undefined && employment_detailsList[i].role.length > 0) {
              for (let e = 0; e < employment_detailsList[i].role.length; e++) {
                roleIds.push(employment_detailsList[i].role[e].id);
              }
            }
          }

          this.findWorkFilters.categories = departmentIds.filter((x, i, a) => x && a.indexOf(x) === i);
          this.findWorkFilters.expertise = functional_areasIds.filter((x, i, a) => x && a.indexOf(x) === i);
          this.findWorkFilters.sub_categories = roleIds.filter((x, i, a) => x && a.indexOf(x) === i);
        }

        for (let index = 0; index < obj.availability_details.length; index++) {
          const element = obj.availability_details[index];
          if(element.hours_per_day && element.hours_per_day.id)
          {
            this.findWorkFilters.availability.push(element.hours_per_day.id);    
          }
          if(element.hourly_charges && element.hourly_charges.id)
          {
            this.findWorkFilters.hourlybudget.push(element.hourly_charges.id);    
          }
        }

        for (let index = 0; index < obj.basic_details.length; index++) {
          const element = obj.basic_details[index];
          if(element.total_experience)
          {
            this.findWorkFilters.experience.push(element.total_experience);    
          }
        }

        // this.findWorkFilters.availability.push(obj.availability_details[0].hours_per_day.id);
        // this.findWorkFilters.experience.push(obj.basic_details[0].total_experience);
        // this.findWorkFilters.hourlybudget.push(obj.availability_details[0].hourly_charges.id);

        this.getAllCategory();
        this.getAllSubCategory();
        this.getAllExpertise();
        this.getAllExperience();
        this.getAllHourlyBudget();
        this.getAllAvailability();

        this.selectedemployeeFilters.emit(this.findWorkFilters);
      });
    });   
  }

  getAllCategory() {
    this.filterForEmpService.getAllCategory().subscribe((categoryList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < categoryList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.categories != undefined ? this.findWorkFilters.categories.findIndex(a => a == categoryList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = categoryList[i].id;
        data.is_active = categoryList[i].is_active;
        data.title = categoryList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.categoryList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllSubCategory() {
    this.filterForEmpService.getAllSubCategory().subscribe((subCategoryList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < subCategoryList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.sub_categories != undefined ? this.findWorkFilters.sub_categories.findIndex(a => a == subCategoryList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = subCategoryList[i].id;
        data.is_active = subCategoryList[i].is_active;
        data.title = subCategoryList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.subcategoryList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllExpertise() {
    this.filterForEmpService.getAllExpertise().subscribe((expertiseList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < expertiseList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.expertise != undefined ? this.findWorkFilters.expertise.findIndex(a => a == expertiseList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = expertiseList[i].id;
        data.is_active = expertiseList[i].is_active;
        data.title = expertiseList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.expertiseList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllExperience() {
    this.filterForEmpService.getAllExperience().subscribe((experienceList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < experienceList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.experience != undefined ? this.findWorkFilters.experience.findIndex(a => a == experienceList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = experienceList[i].id;
        data.is_active = experienceList[i].is_active;
        data.title = experienceList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.experienceList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllHourlyBudget() {
    this.filterForEmpService.getAllHourlyBudget().subscribe((hourlyBudgetList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < hourlyBudgetList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.hourlybudget != undefined ? this.findWorkFilters.hourlybudget.findIndex(a => a == hourlyBudgetList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = hourlyBudgetList[i].id;
        data.is_active = hourlyBudgetList[i].is_active;
        data.title = hourlyBudgetList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.hourlyBugetList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  getAllAvailability() {
    this.filterForEmpService.getAllAvailability().subscribe((availabilityList) => {
      let dataList: commonFilters[] = [];
      for (let i = 0; i < availabilityList.length; i++) {
        let index = this.findWorkFilters != undefined && this.findWorkFilters.availability != undefined ? this.findWorkFilters.availability.findIndex(a => a == availabilityList[i].id) : -1;
        let data: commonFilters = new commonFilters();
        data.id = availabilityList[i].id;
        data.is_active = availabilityList[i].is_active;
        data.title = availabilityList[i].title;
        if (index > -1) {
          data.is_checked = true;
        }
        else {
          data.is_checked = false;
        }
        dataList.push(data);
      }
      this.availabilityList = dataList.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  onExpertiseChecked(value: boolean, expertiseId: any) {
    let index = this.expertiseList != undefined && this.expertiseList.length > 0 ? this.expertiseList.findIndex(a => a.id == expertiseId) : -1;
    this.expertiseList[index].is_checked = value;
    if (value) {
      this.findWorkFilters.expertise.push(parseInt(expertiseId));
    }
    else {
      this.findWorkFilters.expertise.splice(this.findWorkFilters.expertise.indexOf(parseInt(expertiseId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onCategoryChecked(value: boolean, categoryId: any) {
    let index = this.categoryList != undefined && this.categoryList.length > 0 ? this.categoryList.findIndex(a => a.id == categoryId) : -1;
    this.categoryList[index].is_checked = value;
    if (value) {
      this.findWorkFilters.categories.push(parseInt(categoryId));
    }
    else {
      this.findWorkFilters.categories.splice(this.findWorkFilters.categories.indexOf(parseInt(categoryId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onSubCategoryChecked(value: boolean, subCategoryId: any) {
    let index = this.subcategoryList != undefined && this.subcategoryList.length > 0 ? this.subcategoryList.findIndex(a => a.id == subCategoryId) : -1;
    this.subcategoryList[index].is_checked = value;
    if (value) {
      this.findWorkFilters.sub_categories.push(parseInt(subCategoryId));
    }
    else {
      this.findWorkFilters.sub_categories.splice(this.findWorkFilters.sub_categories.indexOf(parseInt(subCategoryId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onAvailabilityChecked(value: boolean, availabilityId: any) {
    let index = this.availabilityList != undefined && this.availabilityList.length > 0 ? this.availabilityList.findIndex(a => a.id == availabilityId) : -1;
    this.availabilityList[index].is_checked = value;
    if (value) {
      this.findWorkFilters.availability.push(parseInt(availabilityId));
    }
    else {
      this.findWorkFilters.availability.splice(this.findWorkFilters.availability.indexOf(parseInt(availabilityId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onExperienceChecked(value: boolean, experienceId: any) {
    let index = this.experienceList != undefined && this.experienceList.length > 0 ? this.experienceList.findIndex(a => a.id == experienceId) : -1;
    this.experienceList[index].is_checked = value;
    if (value) {
      this.findWorkFilters.experience.push(parseInt(experienceId));
    }
    else {
      this.findWorkFilters.experience.splice(this.findWorkFilters.experience.indexOf(parseInt(experienceId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  onHourlyBudgetChecked(value: boolean, hourlyBudgetId: any) {
    let index = this.hourlyBugetList != undefined && this.hourlyBugetList.length > 0 ? this.hourlyBugetList.findIndex(a => a.id == hourlyBudgetId) : -1;
    this.hourlyBugetList[index].is_checked = value;
    if (value) {
      this.findWorkFilters.hourlybudget.push(parseInt(hourlyBudgetId));
    }
    else {
      this.findWorkFilters.hourlybudget.splice(this.findWorkFilters.hourlybudget.indexOf(parseInt(hourlyBudgetId)), 1);
    }
    this.selectedFilters(this.findWorkFilters);
  }

  selectedFilters(filter: FindWorkFilters) {
    this.selectedemployeeFilters.emit(this.findWorkFilters);
  }
}
