import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { PROFILE_STAGES } from './../../../profile.constants';
import {StageStorage} from 'app/employeeprofile/stage-storage.service'
import {StageNotifications} from 'app/employeeprofile/stage-notifications.service'
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-employee-profile-bubble-toolbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers:[StageNotifications]
})
export class NavbarComponent implements OnInit {

  @Input() currentStage: string;
  @Output() onClicked = new EventEmitter<string>();
  activeStageName: string;
  uncompletedStage: string;
  stages: any[];// = PROFILE_STAGES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stageStorage: StageStorage,
    private profilePopover: StageNotifications,
    private loaderService: LoaderService) { 
      this.activeStageName = route.snapshot.data['stage'];
      this.stages = PROFILE_STAGES;
    }

  ngOnInit() {
    this.fetchStages();
    // this.stageStorage.loadStagesEvent.subscribe(() => {
    //   this.fetchStages();
    // });
  }

  navigateToIfComplete(stage, i, popover) {
    this.profilePopover.chaeckStageCompletion(stage, i)
      .subscribe(
        (menu) => {
          this.navigateTo(menu);
        },
        (uncompleteStage) => {
          popover.open();

          if (this.profilePopover.uncompletedStage == 'basicinfo') {
            this.profilePopover.uncompletedStage = 'Basic Info';
          } 
        },
        () => {}
      );
  }

  fetchStages() {
    for (const stage of this.stages) {
      stage.state = this.stageStorage.getStageState(stage.url);
    }
  }

  navigateTo(menu: any) {
    if (menu.enabled) {
      this.router.navigate([menu.url], {relativeTo: this.route.parent});
    }
  }

}
