import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPopover, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ProjectsService } from 'app/projects/projects.service';
import { InterestPayModel } from 'app/projects/models/interest-pay-model';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-interest-pay',
  templateUrl: './interest-pay.component.html',
  styleUrls: ['./interest-pay.component.scss'],
  providers: [PaginationMethods]
})
export class InterestPayComponent implements OnInit {

  interestPayInfoList: InterestPayModel[];
  searchText: '';
  count: number;
  pageSize = 5;
  project: number;
  ids: number[] = [];
  popUpForShowInterestModalRef: NgbModalRef;
  @ViewChild('popUpForErrorMessage') popUpForErrorMessage;
  errorMessage: string;
  fundId: number;

  constructor(private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private loaderService:LoaderService,
    private projectsService: ProjectsService) { this.interestPayInfoList = []; }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project = parseInt(params['id']);
      this.fundId = parseInt(params['fundId']);
    });
  }

  getInterestPayList(newPage) {
    if (newPage) {
      this.projectsService.getInterestPayList(newPage, this.pageSize, this.searchText, this.project, this.fundId)
        .subscribe((infoList: InterestPayModel[]) => {
          this.interestPayInfoList = infoList['results'];
          this.count = infoList['count'];
        });
    }
  }

  putInterestPayInfo() {
    this.projectsService.putInterestPayInfo(this.ids, this.project, this.fundId)
      .subscribe((obj: InterestPayModel) => {
        this.ids = [];
        this.loaderService.growlMessage.next({severity:'success', summary:'Payment deducted from your wallet!!!'});
        this.getInterestPayList(1);
      }, (error)=> {
        this.errorMessage = error[0];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForErrorMessage, {backdrop: false});
      });
  }

  setSelectedInterestPay(event) {
    if(event.target.checked) {
      this.ids.push(parseInt(event.target.value));
    }
    else {
      let index = this.ids.findIndex(a=>a == parseInt(event.target.value));
      if (index !== -1) {
          this.ids.splice(index, 1);
      }  
    }
  }

}
