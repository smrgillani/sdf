import { Component, OnInit } from '@angular/core';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsService} from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss'],
  providers: [PaginationMethods, NgbRatingConfig]
})
export class MakePaymentComponent implements OnInit {
  pageSize = 5;
  count: number;
  paginationReset:boolean = false;
  projectId: number;
  project: ProjectModel;
  constructor(private paginationMethods: PaginationMethods,config: NgbRatingConfig,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService) {

      config.max = 5;
      config.readonly = true;

      this.project = new ProjectModel();
     }

     ngOnInit() {
      this.route.params.subscribe((params) => {
        this.projectId = params['id'];
        this.loadProject();
      });
    }
  
    loadProject() {
      this.projectsService.get(this.projectId).subscribe((project) => {
        this.project = project;
      });
    }
  

}
