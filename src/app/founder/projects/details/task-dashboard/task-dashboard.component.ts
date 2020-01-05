import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';


@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss'],
  animations: [
    trigger('pageState', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('* => visible', [
        animate(500, keyframes([
          style({opacity: 0, transform: 'scale(0.1)', offset: 0}),
          style({opacity: 1, transform: 'scale(0.7)', offset: 1})
        ]))
      ]),
      transition('visible => *', [
        animate(500, keyframes([
          style({opacity: 1, transform: 'scale(0.7)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0})
        ]))
      ])
    ])
  ]

})
export class TaskDashboardComponent implements OnInit {
  project_id: number;
  pageState = 'visible';
  targetUrl: string;
  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
      console.log(this.project_id);
    });
  }

  todolist() {
    this.pageState = 'hidden';
    this.router.navigate(['../todolist'], {relativeTo: this.route});
  }

  milestone(){
    this.pageState = 'hidden';
    //this.router.navigate(['boards'], {relativeTo: this.route});
    this.router.navigate([`founder/projects/${this.project_id}/boards`]);
  }
  // public animationDone(event) {
  //   if (event.triggerName === 'pageState' && event.toState === 'hidden') {
  //     this.router.navigate([this.targetUrl]);
  //   }
  // }
  // navigateTo(url: string) {
  //   this.targetUrl = url;
  //   this.pageState = 'hidden';
  // }

}
