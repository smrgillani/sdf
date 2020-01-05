import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { StageStorage as EmployeeService } from 'app/employeeprofile/stage-storage.service';
import { ProjectCreatorInfo, BonusRequestInfo, HikeRequestInfo, QuitJobInfo } from 'app/employeeprofile/models/project-creator-info.model';

@Component({
  selector: 'app-creator-list',
  templateUrl: './creator-list.component.html',
  styleUrls: ['./creator-list.component.scss'],
  providers: [PaginationMethods]
})
export class CreatorListComponent implements OnInit {

  founderList: ProjectCreatorInfo[] = [];
  searchText: '';
  pageSize;// = 5;
  count: number;
  isCollapsedArray: boolean[] = [];
  @ViewChild('popUpForBonus') popUpForBonus;
  @ViewChild('popUpForHike') popUpForHike;
  @ViewChild('popUpForQuitJob') popUpForQuitJob;
  @ViewChild('popUpForReject') popUpForReject;
  popUpForShowInterestModalRef: NgbModalRef;
  bonusRequestInfo: BonusRequestInfo;
  hikeRequestInfo: HikeRequestInfo;
  quitJobInfo: QuitJobInfo;
  errorMsg: string;

  constructor(private _location: Location,
    private modalService: NgbModal,
    private employeeService: EmployeeService) {
    this.bonusRequestInfo = new BonusRequestInfo();
    this.hikeRequestInfo = new HikeRequestInfo();
  }

  ngOnInit() {
    //this.employeeService.getFounderList()
    this.getFounderList();
  }

  getFounderList() {
    this.employeeService.getFounderList(1, this.pageSize, this.searchText).subscribe((infoList) => {
      this.founderList = infoList;
      this.founderList.forEach((item, index) => {
        this.isCollapsedArray[index] = true;
      });

      console.log('founderList:', this.founderList);
    });
  }

  toggleAccordian(e, x) {
    let lastopen = this.isCollapsedArray[x];
    this.founderList.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
    this.isCollapsedArray[x] = !lastopen;

  }

  openBonusPopUp(owner_id, project_id) {
    this.errorMsg = '';
    this.bonusRequestInfo = new BonusRequestInfo();
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForBonus, {
      windowClass: 'interviewmodel modal-dialog-centered'
    });

    this.bonusRequestInfo.creator = owner_id;
    this.bonusRequestInfo.project = project_id;
    this.bonusRequestInfo.bonus.currency = 'USD';
  }

  requestBonus() {
    this.bonusRequestInfo.create_date = new Date();
    const data: any = this.bonusRequestInfo;
    data.create_date = moment(this.bonusRequestInfo.create_date).format('YYYY-MM-DD');

    console.log('requestBonus data:', data);

    this.employeeService.postBounusRequest(data).subscribe((obj) => {
      console.log('requestBonus success:', obj);
      this.popUpForShowInterestModalRef.close();
    }, (error) => {
      console.log('requestBonus error:', error);
      this.errorMsg = error[0];
      setTimeout(() => {
        this.errorMsg = '';
      }, 2000)
    });
  }

  openQuitJob(owner_id, project_id){
    this.errorMsg = '';
    this.quitJobInfo = new QuitJobInfo();
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForQuitJob, {
      windowClass: 'interviewmodel modal-dialog-centered'
    });
    this.quitJobInfo.creator = owner_id;
    this.quitJobInfo.reason = '';
    this.quitJobInfo.project = project_id;
  }

  requestQuitJob()
  {
    this.quitJobInfo.create_date = new Date();
    const data: any = this.quitJobInfo;
    data.create_date = moment(this.quitJobInfo.create_date).format('YYYY-MM-DD');

    console.log('requestQuitJob data:', data);

    this.employeeService.postQuitJobRequest(data).subscribe((obj) => {
      console.log('requestQuitJob success:', obj);
      this.popUpForShowInterestModalRef.close();
    }, (error) => {
      console.log('requestQuitJob error:', error);
      this.errorMsg = error[0];
      setTimeout(() => {
        this.errorMsg = '';
      }, 2000)
    });
  }

  openHikePopUp(owner_id, project_id) {
    this.errorMsg = '';
    this.hikeRequestInfo = new HikeRequestInfo();
    this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForHike, {
      windowClass: 'interviewmodel modal-dialog-centered'
    });
    this.hikeRequestInfo.creator = owner_id;
    this.hikeRequestInfo.hike.currency = 'USD';
    this.hikeRequestInfo.project = project_id;
  }

  requestHike() {
    this.hikeRequestInfo.create_date = new Date();
    const data: any = this.hikeRequestInfo;
    data.create_date = moment(this.hikeRequestInfo.create_date).format('YYYY-MM-DD');

    console.log('requestHike data:', data);

    this.employeeService.postHikeRequest(data).subscribe((obj) => {
      console.log('requestHike success:', obj);
      this.popUpForShowInterestModalRef.close();
    }, (error) => {
      console.log('requestHike error:', error);
      this.errorMsg = error[0];
      setTimeout(() => {
        this.errorMsg = '';
      }, 2000)
    });
  }

}
