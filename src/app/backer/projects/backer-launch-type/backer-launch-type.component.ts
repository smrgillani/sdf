import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

import { ProjectsService } from 'app/projects/projects.service';

import ProjectLaunchDetailsModel from 'app/projects/models/ProjectLaunchDetailsModel';
import LaunchTypeModel from 'app/projects/models/LaunchTypeModel';
import LaunchModel from 'app/projects/models/LaunchModel';
import { CustomValidators } from 'app/core/custom-form-validator';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-backer-launch-type',
  templateUrl: './backer-launch-type.component.html',
  styleUrls: ['./backer-launch-type.component.scss'],
  providers: [
    ProjectsService,
  ],
})
export class BackerLaunchTypeComponent implements OnInit {
  project = new ProjectLaunchDetailsModel();
  platforms: LaunchTypeModel[] = [];
  selectedPlatform: LaunchTypeModel;
  selectedPlatformData: LaunchModel;
  isSuccess = false;
  serverSideErrors: any;
  frmLaunch: FormGroup;
  popoverMessage: string;
  private projectId: number;
  private ndaData: any;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private router: Router,
    private fb: FormBuilder,
    private _location: Location,
    private projectsService: ProjectsService,
  ) {
    this.frmLaunch = fb.group({
      quantity: ['', [Validators.required, CustomValidators.numeric]],
    });
  }

  ngOnInit() {
    this.ndaData = {'id': '', 'description': '', 'creator_email': '', 'docusign_status': ''};

    this.route.params.subscribe((params) => {
      this.projectId = params['id'];

      this.projectsService.getLaunchDataForBacker(this.projectId)
        .subscribe((project: ProjectLaunchDetailsModel) => {
          this.project = project;
          this.projectsService.getLaunchingPlatforms()
            .subscribe((platforms: LaunchTypeModel[]) => {
              this.project.launch.forEach((item) => {
                this.platforms.push(...platforms.filter(x => x.id === item.launch));
              });
            });
        });

      this.fetchNda(this.projectId);
    });
  }

  getIcon(icon: string): string {
    return `/assets/img/project/${icon.toLowerCase()}.png`;
  }

  getColor(platform: string): string {
    let color = '#679BF9';

    switch (platform.toLowerCase()) {
      case 'x':
        color = '#FF6C24';
        break;
      case 'lsx':
        color = '#FE5F5B';
        break;
      case 'isx':
        color = '#00D8C9';
        break;
      default:
        break;
    }

    return color;
  }

  selectPlatform(platform: LaunchTypeModel, managePopover: NgbPopover) {
    this.selectedPlatform = platform;
    if (this.project.launch.filter(f => f.launch === platform.id).length > 0) {
      this.selectedPlatformData = this.project.launch.filter(f => f.launch === platform.id)[0];
    }

    // if (this.ndaData.id === '' || (this.ndaData.docusign_status != 'No Nda' && !this.ndaData.docusign_status['status'])) {
    //     this.selectedPlatform = platform;
    //     if (this.project.launch.filter(f => f.launch === platform.id).length > 0) {
    //         this.selectedPlatformData = this.project.launch.filter(f => f.launch === platform.id)[0];
    //     }
    // }
    // else {
    //     if (this.ndaData.docusign_status == 'No Nda') {
    //         this.router.navigate([`/backer/projects/${this.project.id}/nda`]);
    //     }
    //     else {
    //         this.popoverMessage = 'DocuSign is pending on either side, please check your Email.';
    //         managePopover.open();
    //     }
    // }
  }

  selectManageFunding(managePopover: NgbPopover) {
    if (this.project.manage_fund !== true) {
      this.popoverMessage = 'Seems, there is no funding option provided by founder?';
      managePopover.open();
    } else {
      this.router.navigate([`/backer/projects/${this.project.id}/funding`]);
      // if (this.ndaData.id === '' || (this.ndaData.docusign_status != 'No Nda' && !this.ndaData.docusign_status['status'])) {
      //     //redirect to manage funding page
      //     this.router.navigate([`/backer/projects/${this.project.id}/funding`]);
      // }
      // else {
      //     if (this.ndaData.docusign_status == 'No Nda') {
      //         this.router.navigate([`/backer/projects/${this.project.id}/nda`]);
      //     }
      //     else {
      //         this.popoverMessage = 'DocuSign is pending on either side, please check your Email.';
      //         managePopover.open();
      //     }
      // }
    }
  }

  backToSelection() {
    this.selectedPlatform = null;
    this.isSuccess = false;
    this.frmLaunch.reset();
  }

  launchProject(value: any) {
    if (this.frmLaunch.valid) {
      const data: { project_launch: number, quantity: number } = {
        project_launch: this.selectedPlatformData.id,
        quantity: value.quantity,
      };
      this.projectsService.saveLaunchTypePurchaseData(data)
        .subscribe(
          () => {
            this.loaderService.growlMessage.next({severity: 'success', summary: 'Payment deducted from your wallet!!!'});
            this.isSuccess = true;
          },
          (errMsg: any) => {
            console.log(errMsg);
            this.serverSideErrors = errMsg;
            setTimeout(() => { this.serverSideErrors = null; }, 5000);
          },
        );
    } else {
      this.validateAllFormFields(this.frmLaunch);
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  private fetchNda(projectId: number) {
    this.projectsService.fetchNdaForBacker(projectId)
      .subscribe(
        data => {
          this.ndaData.id = (data.id === undefined) ? '' : data.id;
          if (this.ndaData.id !== '') {
            this.ndaData.description = data.description;
          }
          this.ndaData.docusign_status = data.docusign_status;
        },
        error => {
          alert(error);
        },
      );
  }
}
