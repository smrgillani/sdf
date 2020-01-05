import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MetricesService } from 'app/projects/metrices.service';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { MetricesModel } from 'app/projects/models/metrices-model';
import {TimeUtils} from '../../../../utils/time-utils';
import {JwtHelper} from 'angular2-jwt';

@Component({
  selector: 'app-worked-on',
  templateUrl: './worked-on.component.html',
  styleUrls: ['./worked-on.component.scss'],
  providers: [PaginationMethods, MetricesService],
})
export class WorkedOnComponent implements OnInit {
  pageSize = 10;
  count: number;
  metricesModel: MetricesModel;
  url: string;
  popUpForShowInterestModalRef: NgbModalRef;
  private searchText: string;
  private projectId: number;
  private type: string;

  selectedProcessId: number;

  mouseflowVideoList: any  = [];

  private readonly jwtHelper: JwtHelper = new JwtHelper();

  @ViewChild('popUpForVideo') private popUpForVideo;

  constructor(
    private paginationMethods: PaginationMethods,
    private route: ActivatedRoute,
    private _location: Location,
    private metricesService: MetricesService,
    private modalService: NgbModal,
  ) {
    this.metricesModel = new MetricesModel();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      this.type = params['type'];
     // this.getCurrentEmployeePayDetails();
    });
  }

  /*getCurrentEmployeePayDetails() {
    const jwt = localStorage.getItem('token');
    const jwtDetails = this.jwtHelper.decodeToken(jwt);
    console.log('jwt detail>>>>>>>',jwtDetails);
    const userID = jwtDetails.user_id;
    this.metricesService.getCurrentEmployeeProfileProcess(userID, this.projectId.toString()).subscribe((data) => {

      this.metricesModel.basicInfo = data;
      data && data.processes.length > 0 ? this.selectedProcessId = data.processes[0].process_id : this.selectedProcessId = 0;
    });
  }*/

  getProcessSelected(process_id) {
    this.selectedProcessId = process_id;
    this.getProcessSelectedList(process_id);
  }

  getProcessSelectedList(newPage) {
    this.metricesService.getProjectMouseFlowList(this.projectId, this.selectedProcessId).subscribe((data) => {
      this.mouseflowVideoList = data.recordings;

      this.mouseflowVideoList.forEach((item, index) => {
        const getStartLocalTime = TimeUtils.getLocalTime(TimeUtils.convertStringToDate(item['created']));
        const getEndLocalTime = TimeUtils.getLocalTime(TimeUtils.convertStringToDate(item['lastActivity']));
        const createdDateStr = TimeUtils.getDateInll(getStartLocalTime).split(',');
        const lastDateStr = TimeUtils.getDateInll(getEndLocalTime).split(',');
        let dateString = createdDateStr[0] + ',' + createdDateStr[1];
        const lastDateString = lastDateStr[0] + ',' +  lastDateStr[1];
        if (dateString !== lastDateString) {
          dateString += ' - ' + lastDateString;
        }
        dateString += ' ';
        dateString += createdDateStr[2].trim().split(' ')[0];
        item['created'] =  dateString;
        item['lastActivity'] =  TimeUtils.getDateInll(getEndLocalTime);
        item['startTime'] = TimeUtils.getTime(getStartLocalTime);
        item['endTime'] = TimeUtils.getTime(getEndLocalTime);
        item['duration'] = TimeUtils.getDurationToHour(item['duration']);
      });

      this.count = data.count;
    });

    /*this.metricesService.getEmployeeProcessList(this.projectId, this.type, newPage, this.pageSize, this.searchText).subscribe((data) => {
      this.metricesModel.ProcessListInfo = data;
      console.log('old data >>>', data);
      this.count = data.count;
    });*/
  }

  /*getProcessSelectedList(newPage) {
    this.metricesService.getEmployeeProcessList(this.projectId, this.type, newPage, this.pageSize, this.searchText)
      .subscribe(data => {
        this.metricesModel.ProcessListInfo = data;
        this.count = data.count;
      });
  }*/

  getWebRTCArchive(id) {
    if (id) {
      this.metricesService.getWebRTCArchive(id)
        .subscribe(obj => {
          this.url = obj;
          this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForVideo, {
            size: 'lg',
            windowClass: 'appoitmentmodel',
          });
        });
    }
  }

  geMouseFlowAuthId(video) {
    if (video.id) {
      this.metricesService.getMouseFlowVideoShareId(video.id).subscribe((obj) => {
        console.log('return shared id>>>', obj);
        // window.open(video.playbackUrl + '?token=' + obj, '_blank');
        this.url = video.playbackUrl + '?token=' + obj;
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForVideo, {
          size: 'lg',
          windowClass: 'appoitmentmodel',
        });
      });
    }
  }
}
