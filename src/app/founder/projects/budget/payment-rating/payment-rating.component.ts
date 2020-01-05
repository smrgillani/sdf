import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { ProjectsService } from 'app/projects/projects.service';

@Component({
  selector: 'app-payment-rating',
  templateUrl: './payment-rating.component.html',
  styleUrls: ['./payment-rating.component.scss'],
  providers: [PaginationMethods]
})
export class PaymentRatingComponent implements OnInit {

  transaction: number;
  projectId: number;
  pageSizeUp = 5;
  countUp: number;
  searchTextUp: '';

  pageSizeDown = 5;
  countDown: number;
  searchTextDown: '';
  rateUp: any;
  rateDown: any;

  constructor(private route: ActivatedRoute, private projectsService: ProjectsService,
    private _location: Location) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.transaction = params['transaction'];
      this.projectId = this.route.parent.params["_value"].id ? parseInt(this.route.parent.params["_value"].id) : 0;
    });
  }

  getPaymentThumbsUp(newPage) {
    if(newPage) {
      this.projectsService.getPaymentThumbsUp(newPage, this.pageSizeUp, this.searchTextUp, this.projectId, this.transaction).subscribe((infoList)=>{
        this.rateUp = infoList["results"];
        this.countUp = infoList["count"];
      });
    }
  }

  getPaymentThumbsDown(newPage) {
    if(newPage) {
      this.projectsService.getPaymentThumbsDown(newPage, this.pageSizeDown, this.searchTextDown, this.projectId, this.transaction).subscribe((infoList)=>{
        this.rateDown = infoList["results"];
        this.countDown = infoList["count"];
      });
    }
  }

}
