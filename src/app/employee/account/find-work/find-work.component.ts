import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { FindWorkFilters } from 'app/employeeprofile/models/find-work-filters';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ChatService } from 'app/collaboration/chat.service';

@Component({
  selector: 'app-find-work',
  templateUrl: './find-work.component.html',
  styleUrls: ['./find-work.component.scss'],
  providers: [PaginationMethods],
})
export class FindWorkComponent implements OnInit {
  pageSize = 5;
  count: number;
  findWorkFilters: FindWorkFilters = new FindWorkFilters();
  jobData: any[];
  myApplyJob: any[];
  filteropen = true;
  jobposting = true;
  popUpForShowInterestModalRef: NgbModalRef;
  errorMessage: string;

  @ViewChild('popUpForAddEmailMessage') private popUpForAddEmailMessage;
  @ViewChild('popUpForCommonMessage') private popUpForCommonMessage;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private modalService: NgbModal,
    private findWorkService: StageStorage,
  ) { }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.kyb_left_height();
    if (window.innerWidth < 992) {
      this.filteropen = false;
      this.jobposting = false;
    } else {
      this.filteropen = true;
      this.jobposting = true;
    }
  }

  ngOnInit() {
    this.findWorkService.getAvailabilityDetails().subscribe((emp) => {
      if (!emp.is_completed) {
        this.router.navigate(['./employee/account/profile']);
      } else {
        this.getJobApply();
        if (window.innerWidth < 992) {
          this.filteropen = false;
          this.jobposting = false;
        } else {
          this.filteropen = true;
          this.jobposting = true;
        }
      }
    });
  }

  filterOpenPanel() {
    if (window.innerWidth < 992) {
      this.filteropen = !this.filteropen;
    }
  }

  postingOpenPanel() {
    if (window.innerWidth < 992) {
      this.jobposting = !this.jobposting;
    }
  }

  selectedFilters(event: any) {
    this.findWorkFilters = event;
    this.getJobList(1);
  }

  getJobList(newPage) {
    if (newPage) {
      this.findWorkService.getJobList(
        newPage, this.pageSize, this.findWorkFilters.categories, this.findWorkFilters.expertise, this.findWorkFilters.experience,
        this.findWorkFilters.sub_categories, this.findWorkFilters.hourlybudget, this.findWorkFilters.availability,
      ).subscribe((empJobList: any[]) => {
        this.jobData = empJobList['results'];
        this.count = empJobList['count'];
      });
    }
  }

  scheduledInterview(jobId: number) {
    this.router.navigate([`${jobId}/apply-job`], {relativeTo: this.route.parent});
  }

  projectMessage(projectId) {
    this.errorMessage = '';
    this.chatService.postDirectRoom(projectId).subscribe(result => {
      const data = result.json();
      this.router.navigate(['../', 'chat-rooms', data['room']['_id']], {relativeTo: this.route.parent});
    }, (error) => {
      if (error['email'] === 'Email is Required.') {
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForAddEmailMessage, {backdrop: false});
      } else if (error['_body']) {
        this.errorMessage = error['_body'];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      } else {
        this.errorMessage = error[0];
        this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForCommonMessage, {backdrop: false});
      }
    });
  }

  goToAccount() {
    this.popUpForShowInterestModalRef.close();
    this.router.navigate(['founder/account/edit']);
  }

  private getJobApply() {
    this.findWorkService.getJobApply().subscribe((myApplyJob: any[]) => {
      this.myApplyJob = myApplyJob;
    });
  }
}
