

'use strict';
import {Component, Input, NgZone, ComponentFactory, ViewEncapsulation, ComponentRef,
   ViewContainerRef, ViewChild, ComponentFactoryResolver, Inject,
  ReflectiveInjector, OnInit, NgModule, ModuleWithProviders, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './financesoutline.component.html',
  styleUrls: [
    './financesoutline.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('pageState', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('* => visible', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'scale(0.1)', offset: 0}),
          style({opacity: 1, transform: 'scale(0.7)', offset: 1.0})
        ]))
      ]),
      transition('visible => *', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'scale(0.7)', offset: 0}),
          style({opacity: 0, transform: 'scale(0.1)', offset: 1.0})
        ]))
      ])
    ])
  ],
})

export class FinancesOutlineComponent implements OnInit {
  pageState: string;
  targetUrl: string;
  endingIndex = 0;
  editedPage = false;
  formulasSelectClass = 'hide';
  projectId: number;
  questionId: number;

  menus = [
    { title : 'Operation Management', icon : 'btn-operation-bg', url : 'operation-management', bg : 'bg-trans', enabled : true},
    { title : 'Finances Outline', icon : 'btn-finances-bg', url : 'finances-outline', bg : 'bg-trans', enabled : true},
    { title : 'Sales Strategy', icon : 'btn-sales-bg', url : 'sales-strategy', bg : 'bg-trans', enabled : true},
    { title : 'Marketing Plan', icon : 'btn-marketing-bg', url : 'marketing-plan', bg : 'bg-trans', enabled : true},
    { title : 'Next Stage', icon : 'btn-nextstage-bg', url : 'next-stage', bg : 'bg-trans', enabled : true},
  ];


  constructor( private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.questionId = 17; // code for questionId is not implemented
    });
  }

  ngOnInit() {
    this.pageState = 'visible';
  }

  public animationDone(event) {
    if (event.triggerName === 'pageState' && event.toState === 'hidden') {
      this.router.navigate([this.targetUrl]);
    }
  }

  onPrev(endingIndex: number) {

  }

  onNext(endingIndex: number) {

  }

  navigateTo(myvar: any) {
    
  }


}
