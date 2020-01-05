import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import ProjectModel from 'app/projects/models/ProjectModel';
import { PaymentInfoModel } from 'app/projects/models/payment-info-model';
import { ProjectsService } from 'app/projects/projects.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-budget-payment',
  templateUrl: './budget-payment.component.html',
  styleUrls: ['./budget-payment.component.scss'],
  providers: [PaginationMethods]
})
export class BudgetPaymentComponent implements OnInit {

  projectId: number;
  project: ProjectModel;
  paymentInfoList: PaymentInfoModel[];
  pageSize = 5;
  count: number;
  searchText: '';
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
    private paginationMethods: PaginationMethods) { 
      this.project = new ProjectModel();
      this.paymentInfoList = [];
    }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });
  }

  loadProject() {
    this.projectsService.getForBacker(this.projectId).subscribe((project) => {
      this.project = project;
      let expected_funds: number = this.project.expected_funds && this.project.expected_funds != '' ? parseFloat(this.project.expected_funds.replace(/[$,]/g,'')) : 0;
      let receive_funds: number = this.project.receive_funds && this.project.receive_funds != '' ? parseFloat(this.project.receive_funds.replace(/[$,]/g,'')) : 0;
      let expences: number = this.project.expences && this.project.expences != '' ? parseFloat(this.project.expences.replace(/[$,]/g,'')) : 0;
      this.project.my_fund_percent = (expected_funds != 0 && receive_funds != 0) ? (receive_funds / expected_funds) * 100 : 0;
      this.project.my_expences_percent = (receive_funds != 0 && expences != 0) ? (expences / receive_funds) * 100 : 0;
    });
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText == '') {
      this.getPaymentInfo(1);
    }
  }

  getPaymentInfo(newPage) {
    if(newPage) {
      this.projectsService.getBackerPaymentlist(newPage, this.pageSize, this.searchText, this.projectId).subscribe((infoList)=>{
        this.paymentInfoList = infoList["results"];
        this.count = infoList["count"];
      });
    }
  }  

  likedDisliked(item, thumbsUpDown) {
    this.projectsService.postPaymentThumsUpDown({transaction: item.id, thumbsup : thumbsUpDown}).subscribe((obj) => {
      item.thumbsup_count = obj.thumbsup_count;
      item.thumbsdown_count = obj.thumbsdown_count;
    }, (error) => {
      console.log(error);
    });
  }

}
