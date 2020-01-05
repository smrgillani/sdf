import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import LaunchTypeModel from '../../../../projects/models/LaunchTypeModel';


@Component({
  selector: 'app-launch-success',
  templateUrl: './launched.component.html',
  styleUrls: ['./launched.component.scss']
})
export class FounderProjectLaunchedComponent implements OnInit {
  @Input() platform:LaunchTypeModel;
  projectId: number;

  constructor(private router: Router,
    private route: ActivatedRoute) { 

    }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
    });
  }

  goToManageFund(){
    this.router.navigate([`/founder/projects/${this.projectId}/managefund`]);
  }
}