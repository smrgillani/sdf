import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {trigger, state, style, transition} from '@angular/animations';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from "@angular/forms";
import {fadeAnimation, scaleAnimation} from '../../../app.animations';
import * as moment from 'moment';
import { ProjectsService } from "../../../projects/projects.service";
import ProjectActivityModel from "app/projects/models/ProjectActivityModel";
import LaunchTypeModel from "app/projects/models/LaunchTypeModel";
import ProjectLaunchModel from "../../../projects/models/ProjectLaunchModel";
import { CustomValidators } from "app/core/custom-form-validator";
import ProjectLaunchDetailsModel from "app/projects/models/ProjectLaunchDetailsModel";
import { NgbPopover, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './launch.component.html',
    styleUrls: ['./launch.component.scss']
})
export class FounderProjectLaunchComponent implements OnInit {
    project: ProjectLaunchDetailsModel;
    projectId: number;
    platforms: LaunchTypeModel[];
    selectedPlatform: LaunchTypeModel;
    frmLaunch: FormGroup;
    isLaunched: boolean = false;
    minDateValue:Date = new Date();
    serverSideErrors:any;
    popoverTimerList = {};
    launchValidationMessage:string="";
    launchValidationOkOnly:boolean = true;
    @ViewChild('launchInfo') launchInfo;
    popUpForShowInterestModalRef: NgbModalRef;
    launchTitle: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private projectsService: ProjectsService
    ) {
        this.project = new ProjectLaunchDetailsModel();

        this.frmLaunch = fb.group({
            requiredFundAmount: ['', [Validators.required, CustomValidators.numeric]],
            percentage: ['', [Validators.required, CustomValidators.numeric]],
            dueDate: ['', Validators.required],
            sharePrice: ['', [Validators.required, CustomValidators.numeric]],
            termsAndCondition:[''],
            acceptTerms: ['', [CustomValidators.tickedCheckbox]]
        });
    }
    ngOnInit() {
        this.projectsService.getLaunchingPlatforms()
            .subscribe((platforms: LaunchTypeModel[]) => {
                this.platforms = platforms;
                this.disabledIfAlreadyLaunched();
            });

        this.route.params.subscribe((params) => {
            this.projectId = params['id'];
            this.projectsService.getLaunchData(this.projectId)
                .subscribe((project: ProjectLaunchDetailsModel) => {
                    this.project = project;
                    console.log(this.project);
                    this.disabledIfAlreadyLaunched();
                });
        });
    }

    disabledIfAlreadyLaunched() {
        if (this.platforms && this.project.launch) {
            this.project.launch.forEach(element => {
                if (this.platforms.filter(el => el.id === element.launch).length > 0) {
                    this.platforms.filter(el => el.id === element.launch)[0].already_launched = true;
                }
            });
        }
    }

    getValidationMessage(platform: LaunchTypeModel) {
        if (this.project.launch) {
            if (this.project.launch.filter(l => l.launch === 2).length>0 && platform.id === 2) {
                return 'You already launched with ISX';
            }
            else if (this.project.launch.filter(l => l.launch === 3).length>0 && platform.id === 3) {
                return 'You already launched with LSX';
            }
            else if (this.project.launch.filter(l => l.launch === 2).length>0 && platform.id === 3) {
                // return 'You cannot launch on LSX with ISX';
                return 'Sorry! You cannot launch the project on ISX and LSX both.';
            }
            else if (this.project.launch.filter(l => l.launch === 3).length>0 && platform.id === 2) {
                // return 'You cannot launch on ISX with LSX';
                return 'Sorry! You cannot launch the project on ISX and LSX both.';
            }
            else {
                return null;
            }
        }
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

    closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName): void {
        clearTimeout(this.popoverTimerList[timerName]);
        this.popoverTimerList[timerName] = setTimeout(() => {
          popoverId.close();
        }, timer);
      }
      closepopover(popover: NgbPopover){
        popover.close();
      }
    selectPlatform(platform: LaunchTypeModel, popover: NgbPopover) {
        this.launchValidationMessage = this.getValidationMessage(platform);
        if(this.launchValidationMessage!==null){
            this.launchValidationOkOnly = true;
            this.closePopoverpWithDelay(2000,popover,'noaction');
            popover.open();
        }
        else if (platform && !platform.already_launched) {
            if(platform.id===2 && !this.project.is_registered)
            {
                this.launchValidationOkOnly = false;
                this.launchValidationMessage = 'Sorry! You cannot launch the project on ISX unless have registered the start-up idea.';
                popover.open();
                this.selectedPlatform = null;
            }
            else{
                this.selectedPlatform = platform;
            }
        }
        else {
            this.selectedPlatform = null;
        }
    }

    selectManageFunding(proceed:boolean, managePopover: NgbPopover){
        if(this.project.launch.length===0 && !proceed)
        {
            managePopover.open();
        }
        else{
            //redirect to manage funding page
            this.router.navigate([`/founder/projects/${this.project.id}/managefund`]);
        }
    }    

    backToSelection(popoverclose: any) {
        this.selectedPlatform = null;
        if(popoverclose){
            popoverclose.close();
        }
        this.frmLaunch.reset();
    }

    goToRegister(){
        this.router.navigate([`/founder/projects/${this.project.id}/register`]);
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    launchProject(value: any) {
        if (this.frmLaunch.valid) {
            let data: ProjectLaunchModel = {
                launch: this.selectedPlatform.id,
                fund_amount: value.requiredFundAmount,
                percentage: value.percentage,
                due_date: moment(value.dueDate).format('YYYY-MM-DD'),
                price_per_share: value.sharePrice,
                termsAndCondition: value.termsAndCondition
            };
            console.log(data);
            this.projectsService.saveProjectLaunch(this.projectId, data)
                .subscribe(
                    () => {
                        console.log('Project launched');
                        this.isLaunched = true;
                    },
                    (errMsg: any) => {
                        console.log('aali re aali error aali');
                        console.log(errMsg);
                        this.serverSideErrors = errMsg;
                        setTimeout(()=>{this.serverSideErrors = null},5000);
                    }
                );
        }
        else {
            this.validateAllFormFields(this.frmLaunch);
        }
    }

    getLaunchPopUp(launchPopover) {
        launchPopover.close();
        this.launchTitle = (this.project.launch && this.project.launch.length > 0) ? this.platforms.filter(a=>a.id == this.project.launch[0].launch).map(a=>a.title)[0] : '';
        this.popUpForShowInterestModalRef = this.modalService.open(this.launchInfo, {
            size: 'lg',
            windowClass: 'appoitmentmodel'
        });
    }

    downloadLaunch(id) {
        this.projectsService.downloadLaunch(id, this.project.id).subscribe((obj)=>{

            var link = document.createElement('a');
            link.download = "launched.pdf";
        
            const fileReader = new FileReader();
            var blob = new Blob([obj._body], { type: 'contentType' });
            fileReader.readAsDataURL(blob);
            fileReader.onloadend = (event: ProgressEvent) => {
                if (event.target['result']) {
                link.href = event.target['result'];
        
                link.click();
                }
            };
    
        }, (errorMsg: any) => {
            console.log(errorMsg);
        });
    }
}