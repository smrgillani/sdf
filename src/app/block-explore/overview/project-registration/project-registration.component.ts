import { Component, OnInit } from '@angular/core';
import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectRegisterModule } from 'app/founder/projects/register/register.module';
import { PaginationMethods } from 'app/elements/pagination/paginationMethods';

@Component({
  selector: 'app-project-registration',
  templateUrl: './project-registration.component.html',
  styleUrls: ['./project-registration.component.scss'],
  providers: [PaginationMethods]
})
export class ProjectRegistrationComponent implements OnInit {

  projectRegInfoList: ProjectRegisterModule[];
  searchText: '';
  pageSize = 5;
  count: number;

  constructor(private blockService: BlockService, private route: ActivatedRoute,
    private router: Router) { 
      this.projectRegInfoList = []
    }

  ngOnInit() {
    this.getProjectRegList();
  }

  getProjectRegList(newPage?) {
    //if (newPage) {
      this.blockService.getProjectRegistrationListInfo(newPage, this.pageSize, this.searchText).subscribe((infoList) => {
        this.projectRegInfoList = infoList;
        //this.projectRegInfoList = infoList.results;
        //this.count = infoList.count;
      });
    //}
  }

  valueChange() {
    //this.errorMessage = undefined;
  }

}
