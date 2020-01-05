import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  projectId: number;
  constructor(private _location: Location, private router: Router, private route: ActivatedRoute) {
    this.projectId = parseInt(route.snapshot.params['id']);
   }

  ngOnInit() {
  }

}
