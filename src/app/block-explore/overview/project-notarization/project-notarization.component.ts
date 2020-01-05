import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { ProjectNotarizationModel } from '../../block-explores/models/project-notarization-model';

@Component({
  selector: 'app-project-notarization',
  templateUrl: './project-notarization.component.html',
  styleUrls: ['./project-notarization.component.scss'],
  providers: [PaginationMethods]
})
export class ProjectNotarizationComponent implements OnInit {

  projectNotrizeInfoList: ProjectNotarizationModel[];
  searchText: '';
  pageSize = 5;
  count: number;

  constructor(private blockService: BlockService, private route: ActivatedRoute,
    private router: Router) { 
      this.projectNotrizeInfoList = [];
    }

  ngOnInit() {
    this.getProjectNotarizeList();
  }

  getProjectNotarizeList(newPage?) {
    //if (newPage) {
      this.blockService.getProjectnotarizationListInfo(newPage, this.pageSize, this.searchText).subscribe((infoList) => {
        this.projectNotrizeInfoList = infoList;
      });
    //}
  }

  valueChange() {
    //this.errorMessage = undefined;
  }

}
