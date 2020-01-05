 import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-founder-project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ProjectListComponent implements OnInit {

  private mockup_data = [
    {
      title: 'Finger-Toothbrush',
      registered: false
    },
    {
      title: 'Electric-Car (Test registered)',
      registered: true
    },
    {
      title: 'Digital Barbie Tamagochi',
      registered: false
    },
    {
      title: 'Celebrity Influencer Hire App',
      registered: false
    }
  ];


  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  navigateToInsidePublic(project: any) {
    this.router.navigate(['inside/public'], {relativeTo: this.activeRoute});
  }
  navigateToInsidePrivate(project: any) {
    this.router.navigate(['inside/private'], {relativeTo: this.activeRoute});
  }
  navigateToRegister(project: any) {
    this.router.navigate(['register'], {relativeTo: this.activeRoute});
  }
  navigateToWork(project: any) {
    this.router.navigate(['desk'], {relativeTo: this.activeRoute});
  }
}
