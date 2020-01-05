import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { ActionButtonsModel } from 'app/block-explore/block-explores/models/action-button-model';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  providers: [PaginationMethods]
})
export class ActionButtonsComponent implements OnInit {

  actionButtonListInfo: ActionButtonsModel[];
  searchText: '';
  pageSize = 5;
  count: number;

  constructor(private blockService: BlockService, private route: ActivatedRoute,
    private router: Router) { 
      this.actionButtonListInfo = [];
    }

  ngOnInit() {
    this.getActionButtonList();
  }

  getActionButtonList(newPage?) {
    //if (newPage) {
      this.blockService.getActionButtonsListInfo(newPage, this.pageSize, this.searchText).subscribe((infoList) => {
        this.actionButtonListInfo = infoList;
      });
    //}
  }

  valueChange() {
    //this.errorMessage = undefined;
  }

}
