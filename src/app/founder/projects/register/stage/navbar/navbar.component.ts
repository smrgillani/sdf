import { Component, OnInit,EventEmitter, Input,  Output } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {REGISTER_STAGES} from '../../register.constants';
import { RegistrationStageStorage } from 'app/founder/projects/register/questionnaire/RegistrationStageStorage';
import { RegistrationStageNotifications } from 'app/founder/projects/register/stage/StagesNotifications';


@Component({
  selector: 'app-founder-register-bubble-toolbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [RegistrationStageNotifications]
})
export class RegisterNavBarComponent implements OnInit {
  @Input() currentStage: string;
  // @Output() onClicked = new EventEmitter<string>();
  @Input() projectId: number;
  isMenuExpanded = false;
  stages: any[];
  activeStageName: string;
  uncompletedStage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stageStorage: RegistrationStageStorage,
    private registerPopover: RegistrationStageNotifications
  ) {
      this.activeStageName = route.snapshot.data['stage'];
      this.stages = REGISTER_STAGES;
  }

  ngOnInit() {
    this.fetchStages();
    this.stageStorage.loadStagesEvent.subscribe(() => {
      this.fetchStages();
    });
  }

  backToEntitySelection(){
    this.router.navigate([`/founder/projects/${this.projectId}/register/entity`], {relativeTo: this.route.parent});
  }

  navigateToIfComplete(stage, i, popover) {
    this.registerPopover.checkStageCompletion(stage, i)
      .subscribe(
        (menu) => {
          this.navigateTo(menu);
        },
        (uncompleteStage) => {
          popover.open();
          this.uncompletedStage = uncompleteStage;
        },
        () => {}
      );
  }

  navigateTo(menu: any) {
    if (menu.enabled) {
      this.router.navigate(['register', menu.url], {relativeTo: this.route.parent});
    }
  }

  fetchStages() {
    for (const stage of this.stages) {
      stage.state = this.stageStorage.getStageState(stage.url, this.projectId);
    }
  }

  // onNext() {
  //   this.onClicked.emit('next');
  // }

  // onBack() {
  //   this.onClicked.emit('back');
  // }

  // onHome() {
  //   this.onClicked.emit('home');
  // }

  toggleState() {
    this.isMenuExpanded = this.isMenuExpanded === false;
  }
}
