import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Message } from 'primeng/primeng';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';
import {UpgradeModel, UpgradePackageModel} from 'app/projects/models/upgrade-model';

import { UnsubscribeNewUpgradeComponent } from './unsubscribe-new-upgrade/unsubscribe-new-upgrade.component';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-upgrade-funding',
  templateUrl: './upgrade-funding.component.html',
  styleUrls: ['./upgrade-funding.component.scss']
})
export class UpgradeFundingComponent implements OnInit {
  projectId: number;
  project: ProjectModel;
  upgradeListing: UpgradeModel[];
  currentPackage: UpgradePackageModel;
  errorMessage: string = '';
  // msgs1: Message[] = [];
  @ViewChild('popUpForShowInterestMessage') popUpForShowInterestMessage;
  popUpForShowInterestModalRef: NgbModalRef;
  selectedPakageMessage: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private _location: Location,
    private growlService:LoaderService,
    private modalService: NgbModal ) {
    this.project = new ProjectModel();
    this.upgradeListing = [];
    this.currentPackage = new UpgradePackageModel();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
      this.getUpgradeListing();
      this.getSubscribePackage();
    });
  }

  loadProject() {
    this.projectsService.get(this.projectId).subscribe((project) => {
      this.project = project;
    });
  }

  getUpgradeListing() {
    this.projectsService.getUpgradeListing().subscribe((upgradeListing) => {
      this.upgradeListing = upgradeListing;
    });
  }

  postSubscribePackage(selectedPackage: UpgradeModel) {
    let data: UpgradePackageModel = new UpgradePackageModel();
    data.project = this.projectId;
    data.package = selectedPackage.id;
    data.is_active = true;
    this.projectsService.postUpgradeSubscribePackage(this.projectId, data).subscribe((obj) => {
      this.currentPackage = obj[0];
      this.getSubscribePackage();
      this.getUpgradeListing();
      this.growlService.growlMessage.next({severity:'success', summary:'Payment successful!!!'});
      // this.msgs1.push({severity:'success', summary:'Payment successful!!!'});
    }, (error) => {
      this.errorMessage = error[0];
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
    });
  }

  getSubscribePackage() {
    this.selectedPakageMessage = '';
    this.projectsService.getSubscribeUpgradeListing(this.projectId).subscribe((subscribePackage) => {
      if(subscribePackage && subscribePackage.length > 0){
        this.currentPackage = subscribePackage[0];
      }
      if (this.upgradeListing && subscribePackage && subscribePackage[0]) {
        const existingPakage = this.upgradeListing.filter(a=>a.id == subscribePackage[0].package);
        this.selectedPakageMessage = `Existing Pakage selected is '${existingPakage[0].title}' with position '${existingPakage[0].position_name}' for ${existingPakage[0].days} days and will expire in ${subscribePackage[0].remaining_days} days.`;
      }
    });
  }

  showPopUpToConfirm(selectedPackage: UpgradeModel) {
    const modalRef = this.modalService.open(UnsubscribeNewUpgradeComponent, {
      windowClass: 'Unsubscribe package modal-dialog-centered'
    });
    modalRef.componentInstance.currentPackage = this.currentPackage;
    this.currentPackage.selected_package = selectedPackage.id;
    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      if(emmitedValue) {
        this.projectsService.putUpgradeSubscribePackage(this.currentPackage, this.projectId).subscribe((obj)=>{
          this.postSubscribePackage(selectedPackage);
        }, (error) => {
          this.errorMessage = error[0];
          this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
        });
      }
    });
  }
}
