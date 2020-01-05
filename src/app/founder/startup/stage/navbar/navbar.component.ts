import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import StageState from 'app/questionnaire/StageState';
import {StageStorage} from 'app/questionnaire/StageStorage';
import {STARTUP_STAGES} from '../../startup.constants';
import {StageNotifications} from '../StagesNotifications';


/**
 * Toolbar for navigation between question groups.
 *
 * @input stage - current questionnaire stage
 * @output onClicked - event, triggered on navigation changed
 */
@Component({
  selector: 'app-founder-startup-bubble-toolbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [StageNotifications]
})
export class BubbleNavBarComponent implements OnInit {
  @Input() currentStage: string;
  @Input() projectId: any;
  @Output() onClicked = new EventEmitter<string>();
  isMenuExpanded = false;
  stages: any[];
  activeStageName: string;
  uncompletedStage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stageStorage: StageStorage,
    private ideaPopover: StageNotifications
  ) {
    this.activeStageName = route.snapshot.data['stage'];
    this.stages = STARTUP_STAGES;
  }

  navigateToIfComplete(stage, i, popover) {
    this.ideaPopover.chaeckStageCompletion(stage, i)
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

  ngOnInit() {
    this.fetchStages();
    this.stageStorage.loadStagesEvent.subscribe(() => {
      this.fetchStages();
    });
  }

  fetchStages() {
    for (const stage of this.stages) {
      stage.state = this.stageStorage.getStageState(stage.url, this.projectId);
    }
  }

  onNext() {
    this.onClicked.emit('next');
  }

  onBack() {
    this.onClicked.emit('back');
  }

  onHome() {
    this.onClicked.emit('home');
  }

  navigateTo(menu: any) {
    if (menu.enabled) {
      this.router.navigate([menu.url], {relativeTo: this.route.parent});
    }
  }

  toggleState() {
    this.isMenuExpanded = this.isMenuExpanded === false;
  }
}
