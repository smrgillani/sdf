import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-projectregistered',
  templateUrl: './projectregistered.component.html',
  styleUrls: ['./projectregistered.component.scss']
})
export class ProjectregisteredComponent implements OnInit {

  projectId:number;
  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
        this.projectId = params['id'];
    });
  }

  openNotarize() {
    this.router.navigate([`/founder/projects/${this.projectId}/notarization`]);
  }

  // backToProjectListing(){
  //   this.router.navigate(['/founder/projects']);
  // }

}
