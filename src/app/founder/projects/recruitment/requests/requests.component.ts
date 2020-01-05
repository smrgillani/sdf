import { Component, OnInit } from '@angular/core';
import { StageStorage as EmployeeService } from 'app/employeeprofile/stage-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BonusHikeRejectStatusComponent } from 'app/elements/notifications/bonus-hike-reject-status/bonus-hike-reject-status.component';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
  providers: [EmployeeService]
})
export class RequestsComponent implements OnInit {
  activeId: string;
  nextId: string;
  preventDefault: () => void;
  quitJobRequestId: number;
  hikeRequestId: number;
  bonusRequestId: number;
  projectId: number;
  hikeList: any[];
  bonusList: any[];
  quitJobList: any[];

  constructor(
    private employeeService: EmployeeService, 
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.quitJobRequestId = params.quitjob_requestId;
        this.hikeRequestId = params.hike_requestId;
        this.bonusRequestId = params.bonus_requestId;
        this.projectId = params.projectId;
        this.activeId = params.selected != null ? params.selected : 'tab1';
      }); 
  }

  ngAfterViewInit() {
    if (this.quitJobRequestId > 0 || this.hikeRequestId > 0 || this.bonusRequestId) {
      const modalRef = this.modalService.open(BonusHikeRejectStatusComponent, {
        windowClass: 'interviewmodel modal-dialog-centered',
      });
  
      if (this.bonusRequestId > 0) {     
        this.activeId = 'tab1';
        modalRef.componentInstance.id = this.bonusRequestId;
        modalRef.componentInstance.type = 'Bonus';
      } else if (this.hikeRequestId > 0) {
        this.activeId = 'tab2';
        modalRef.componentInstance.id = this.hikeRequestId;
        modalRef.componentInstance.type = 'Hike';
      } else if (this.quitJobRequestId > 0) {
        this.activeId = 'tab3';
        modalRef.componentInstance.id = this.quitJobRequestId;
        modalRef.componentInstance.type = 'QuitJob';
      }
  
      modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
        if (emmitedValue === true) { }
      });
    }

    this.displayList();
  }

  onTabChange(e: NgbTabChangeEvent) {
    var projectIdStr = this.projectId > 0 ? this.projectId : 'null';
    this.activeId = e.nextId;
    this.router.navigate(['/founder/projects/' + projectIdStr + '/recruitment/requests'], {
      queryParams: { selected: this.activeId },
    });

    this.displayList();
  }

  displayList() {
    if (this.activeId == 'tab1') {
      this.getBonusRequestList();
    } else if (this.activeId == 'tab2') {
      this.getHikeRequestList();
    } else if (this.activeId == 'tab3') {
      this.getQuitJobRequestList();
    } 
  }

  getBonusRequestList() {
    this.employeeService.getBounusRequestList().subscribe((obj) => {
      this.bonusList = obj;
      console.log('bonusList:', this.bonusList);
    });
  }

  getHikeRequestList() {
    this.employeeService.getHikeRequestList().subscribe((obj) => {
      this.hikeList = obj;
      console.log('hikeList:', this.hikeList);
    });
  }

  getQuitJobRequestList() {
    this.employeeService.getQuitJobRequestList().subscribe((obj) => {
      this.quitJobList = obj;
      console.log('quitJobList:', this.quitJobList);
    });
  }

  updateRequestStatus(type: string, status: string, id: number) {
    if (type == 'Bonus') {
      this.employeeService.putBounusRequest({id: id, status: status}).subscribe((obj) => {
        console.log('updateRequestStatus Bonus:', obj);
        this.getBonusRequestList();
      });
    }
    else if (type == 'Hike') {
      this.employeeService.putHikeRequest({id: id, status: status}).subscribe((obj) => {
        console.log('updateRequestStatus Hike:', obj);
        this.getHikeRequestList();
      });
    }
    else if (type == 'QuitJob') {
      this.employeeService.putQuitJobRequest({id: id, status: status, notice_period:0}).subscribe((obj) => {
        console.log('updateRequestStatus QuitJob:', obj);
        this.getQuitJobRequestList();
      });
    }
  }
}
