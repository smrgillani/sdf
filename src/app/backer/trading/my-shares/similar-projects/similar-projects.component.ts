import { Component, OnInit } from '@angular/core';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import {SelectItem} from 'primeng/primeng';
import { SimpleProjectInfo } from 'app/projects/models/trading-model';
import { TradingService } from 'app/projects/trading.service';

@Component({
  selector: 'app-similar-projects',
  templateUrl: './similar-projects.component.html',
  styleUrls: ['./similar-projects.component.scss'],
  providers: [PaginationMethods]
})
export class SimilarProjectsComponent implements OnInit {

  searchText: '';
  pageSize = 5;
  count: number;
  simpleProjectInfoList: SimpleProjectInfo[] = [];

  constructor(private paginationMethods: PaginationMethods,
    private tradingService: TradingService
  ){
  }
  ngOnInit() {
  }
  valueChange()
  {
      if(this.searchText.length>2 || this.searchText=='')
      {
        this.getSimilarProjectList(1);
      }
     
  }
  getSimilarProjectList(newPage) {
     if (newPage) {
       this.tradingService.getSimilarProjectList(newPage, this.pageSize,this.searchText)
       .subscribe((listInfo:any) => {
           this.simpleProjectInfoList = listInfo['results'];
           this.count = listInfo['count'];
         });
     }
   }

}
