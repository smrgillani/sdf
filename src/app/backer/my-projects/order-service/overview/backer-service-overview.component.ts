import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-backer-service-overview',
  templateUrl: './backer-service-overview.component.html',
  styleUrls: ['./backer-service-overview.component.scss']
})
export class BackerServiceOverviewComponent implements OnInit {

  projectId: number;
  constructor(private _location: Location, private router: Router, private route: ActivatedRoute) {
    this.projectId = parseInt(route.snapshot.params['id']);
   }

  ngOnInit() {
  }
}