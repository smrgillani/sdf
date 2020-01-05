import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition } from '@angular/animations';

import { fadeAnimation, scaleAnimation } from '../../app.animations';
import { ConfirmationService } from 'primeng/primeng';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../projects/projects.service';

const scaleAppearAnimation = [
  state('visible', style({
    opacity: 1,
  })),
  state('*', style({
    opacity: 0,
  })),

  transition('* => visible', [
    scaleAnimation(300, 0, 1),
  ]),
  transition('visible => *', [
    scaleAnimation(300, 1, 0),
  ]),
];

const fadeAppearAnimation = [
  state('visible', style({
    opacity: 1,
  })),
  state('disabled', style({
    opacity: 0.5,
    cursor: 'wait',
  })),
  state('*', style({
    opacity: 0,
  })),

  transition('* => visible', [
    fadeAnimation(500, 0, 1),
  ]),
  transition('visible => *', [
    fadeAnimation(500, 1, 0),
  ]),
];

@Component({
  selector: 'app-founder-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss',
    // './home.component.portrait.css'
  ],
  animations: [
    trigger('titleState', scaleAppearAnimation),
    trigger('buttonState1', fadeAppearAnimation),
    trigger('buttonState2', fadeAppearAnimation),
    trigger('buttonState3', fadeAppearAnimation),
    trigger('buttonState4', fadeAppearAnimation),
    trigger('buttonState5', fadeAppearAnimation),
  ],
  providers: [ConfirmationService, ProjectsService],
})
export class FounderHomeComponent implements OnInit {
  titleState: string;
  buttonState1: string;
  buttonState2: string;
  buttonState3: string;
  buttonState4: string;
  buttonState5: string;
  popoverTimerList = {};
  startPage = 1;
  pageSize = 1;
  accountPopoverMessage: string;
  forumPopoverMessage: string;
  projectPopoverMessage: string;
  popoverFloating: string;

  //isProjectsLoading = false;
  isNewIdeaLoading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private projectService: ProjectsService,
  ) {

  }

  ngOnInit() {
    this.titleState = 'visible';
    this.accountPopoverMessage = 'This feature is not yet implemented';
    this.projectPopoverMessage = 'Please describe your idea first by clicking on Idea';
    this.forumPopoverMessage = this.accountPopoverMessage;
  }

  openProjects(popover: NgbPopover) {
    // if (this.isProjectsLoading) {
    //   return;
    // }
    // this.isProjectsLoading = true;
    // this.buttonState2 = 'disabled';

    this.projectService.projectsCount().subscribe(
      (data: { count: number }) => {
        data.count > 0 ? this.navigateTo('projects') : popover.open();
      },
      (error) => {
        this.buttonState2 = 'visible';
        console.log(error);
      },
    );
  }

  closePopoverpWithDelay(timer: number, popoverId: NgbPopover, timerName): void {
    clearTimeout(this.popoverTimerList[timerName]);
    this.popoverTimerList[timerName] = setTimeout(() => {
      popoverId.close();
    }, timer);
  }

  animationDone(event) {
    if (event.toState === 'visible') {
      if (event.triggerName === 'titleState') {
        this.buttonState1 = 'visible';
      } else if (event.triggerName === 'buttonState1') {
        this.buttonState2 = 'visible';
      } else if (event.triggerName === 'buttonState2') {
        this.buttonState3 = 'visible';
      } else if (event.triggerName === 'buttonState3') {
        this.buttonState4 = 'visible';
      } else if (event.triggerName === 'buttonState4') {
        this.buttonState5 = 'visible';
      }

    }
  }

  navigateTo(url) {
    this.router.navigate([url], {relativeTo: this.route});
  }

  newIdea() {
    if (this.isNewIdeaLoading) {
      return;
    }
    this.isNewIdeaLoading = true;
    this.buttonState1 = 'disabled';
    this.router
      .navigate(['idea/realization', {method: 'new'}], {relativeTo: this.route.parent})
      .catch(() => {
        this.isNewIdeaLoading = false;
        this.buttonState1 = 'visible';
      });
  }
}
