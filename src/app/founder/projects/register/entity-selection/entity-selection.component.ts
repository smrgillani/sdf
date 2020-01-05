import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ProjectRegisterService } from 'app/projects/register.service';
import {ProjectsService} from 'app/projects/projects.service';
//import { extend } from '@firebase/util';
import { Location } from '@angular/common';

@Component({
  templateUrl: './entity-selection.component.html',
  styleUrls: ['./entity-selection.component.scss']
})
export class ProjectEntitySelectionComponent implements OnInit {

  entities:{id:number,title:string,amount:number,description:string}[];
  projectId:number;
  constructor(
      private registerService: ProjectRegisterService,
      private projectsService: ProjectsService,
      private router:Router,
      private route:ActivatedRoute,
      private _location: Location,
    ) { }

  ngOnInit() {
    this.registerService.getEntityList().subscribe((ent:any)=>{
        this.entities = ent;
    });

    //getting the project id from route parameters
    this.route.params.subscribe((params)=>{
        this.projectId = params['id'];
        // console.log('this.projectId: ', this.projectId);
    });
  }

  onSelectEntity(entity:any){
      // console.log('On select entity..');
      //save the selected entity for project in database and then redirected back to project register overview.
      this.projectsService.update({
        id: this.projectId,
        registration_type: entity.id
      }).subscribe(() => {
        this.router.navigate(['register'], {relativeTo: this.route.parent});
      });

  }
}
