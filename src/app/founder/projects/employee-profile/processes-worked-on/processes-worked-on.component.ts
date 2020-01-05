import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbRatingConfig, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import { MetricesService } from 'app/projects/metrices.service';
import { MetricesModel } from 'app/projects/models/metrices-model';
import {Location} from '@angular/common';
import {TimeUtils} from '../../../../utils/time-utils';

@Component({
  selector: 'app-processes-worked-on',
  templateUrl: './processes-worked-on.component.html',
  styleUrls: ['./processes-worked-on.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class ProcessesWorkedOnComponent implements OnInit {
  pageSize = 10;
  count: number;
  paginationReset: boolean = false;
  searchText: string;
  projectId: number;
  employeeId: number;
  project: ProjectModel;
  metricesModel: MetricesModel;
  selectedProcessId: number;
  selectedProcessName: string = null;

  url: string;

  popUpForShowInterestModalRef: NgbModalRef;

  mouseflowVideoList: any  = [];

  @ViewChild('popUpForVideo') popUpForVideo;

  constructor(private paginationMethods: PaginationMethods, config: NgbRatingConfig,
    private route: ActivatedRoute, private router: Router, private _location: Location,
    private projectsService: ProjectsService, private metricesService: MetricesService,
    private modalService: NgbModal) {

    config.max = 5;
    config.readonly = true;
    this.project = new ProjectModel();
    this.metricesModel = new MetricesModel();
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.employeeId = params['empid'];
      this.loadProject();
      this.getCurrentEmployeePayDetails();
    });
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getCurrentEmployeePayDetails() {
    this.metricesService.getCurrentEmployeeProfileProcess(this.employeeId, this.projectId.toString()).subscribe((data) => {

      this.metricesModel.basicInfo = data;
      // data && data.processes.length > 0 ? this.selectedProcessId = data.processes[0].process_id : this.selectedProcessId = 0;
      if (data && data.processes.length > 0) {
        this.selectedProcessId = null;
        this.selectedProcessName = 'All';
      }
      // this.getProcessSelectedList(1);
    });
  }

  getProcessSelected(process_id, process_name) {
    this.selectedProcessId = process_id;
    this.selectedProcessName = process_name;
    this.getProcessSelectedList(process_id);
  }

  /*
  getProcessSelectedList(newPage) {
    this.metricesService.getCurrentEmployeeProcessList(this.employeeId, this.projectId.toString(), this.selectedProcessId, newPage, this.pageSize, this.searchText).subscribe((data) => {
      this.metricesModel.ProcessListInfo = data;
      this.count = data.count;
    });
  }
  */

  getProcessSelectedList(taskId) {
    this.metricesService.getProjectMouseFlowList(this.projectId, taskId).subscribe((data) => {
      const mouseFlowVideo = data.recordings;
      this.count = data.count;
      this.mouseflowVideoList = [];
      mouseFlowVideo.forEach((item, index) => {
        const duration = TimeUtils.getDurationToHour(item['duration']);
        if (duration) {
          this.mouseflowVideoList.push(item);
          const getStartLocalTime = TimeUtils.getLocalTime(TimeUtils.convertStringToDate(item['created']));
          const getEndLocalTime = TimeUtils.getLocalTime(TimeUtils.convertStringToDate(item['lastActivity']));
          const createdDateStr = TimeUtils.getDateInll(getStartLocalTime).split(',');
          const lastDateStr = TimeUtils.getDateInll(getEndLocalTime).split(',');
          let dateString = createdDateStr[0] + ',' + createdDateStr[1];
          const lastDateString = lastDateStr[0] + ',' +  lastDateStr[1];
          if (dateString !== lastDateString) {
            dateString += ' - ' + lastDateString;
          }
          dateString += ' ' + createdDateStr[2].trim().split(' ')[0];
          item['created'] =  dateString;
          item['lastActivity'] =  TimeUtils.getDateInll(getEndLocalTime);
          item['startTime'] = TimeUtils.getTime(getStartLocalTime);
          item['endTime'] = TimeUtils.getTime(getEndLocalTime);
          item['duration'] = duration;
        } else {
          this.count -= 1;
        }

      });

    });

    /* this.metricesService.getEmployeeProcessList(this.projectId, this.type, newPage, this.pageSize, this.searchText).subscribe((data) => {
       this.metricesModel.ProcessListInfo = data;
       console.log('old data >>>', data);
       this.count = data.count;
     });*/
  }

  getWebRTCArchive(id) {
    if (id) {
      this.metricesService.getWebRTCArchive(id).subscribe((obj) => {
        this.url = obj;
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForVideo, {
          size: 'lg',
          windowClass: 'appoitmentmodel'
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
