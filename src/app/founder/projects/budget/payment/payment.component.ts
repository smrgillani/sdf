import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { Location } from '@angular/common';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { PaymentInfoModel } from 'app/projects/models/payment-info-model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PaginationMethods],
})
export class PaymentComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  paymentInfoList: PaymentInfoModel[];
  pageSize = 5;
  count: number;
  searchText: '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
    private paginationMethods: PaginationMethods,
  ) {
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
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
      const expected_funds: number = this.project.expected_funds && this.project.expected_funds !== '' ? parseFloat(this.project.expected_funds.replace(/[$,]/g, '')) : 0;
      const receive_funds: number = this.project.receive_funds && this.project.receive_funds !== '' ? parseFloat(this.project.receive_funds.replace(/[$,]/g, '')) : 0;
      const expences: number = this.project.expences && this.project.expences !== '' ? parseFloat(this.project.expences.replace(/[$,]/g, '')) : 0;
      this.project.my_fund_percent = (expected_funds !== 0 && receive_funds !== 0) ? (receive_funds / expected_funds) * 100 : 0;
      this.project.my_expences_percent = (receive_funds !== 0 && expences !== 0) ? (expences / receive_funds) * 100 : 0;
    });
  }

  valueChange() {
    if (this.searchText.length > 2 || this.searchText === '') {
      this.getPaymentInfo(1);
    }
  }

  getPaymentInfo(newPage) {
    if (newPage) {
      this.projectsService.getPaymentlist(newPage, this.pageSize, this.searchText, this.projectId).subscribe((infoList) => {
        this.paymentInfoList = infoList['results'];
        this.count = infoList['count'];
      });
    }
  }

  navigateToThumsRating(id) {
    this.router.navigate([id], {relativeTo: this.route});
  }
}
