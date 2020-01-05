import { Component, OnInit, Input } from '@angular/core';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import { FormsModule } from '@angular/forms';
import {SelectItem} from 'primeng/primeng';
import { TradingService } from 'app/projects/trading.service';
import { ProjectLaunchingSoonInfo } from 'app/projects/models/trading-model';

@Component({
  selector: 'app-project-launching-soon',
  templateUrl: './project-launching-soon.component.html',
  styleUrls: ['./project-launching-soon.component.scss'],
  providers: [PaginationMethods]

})
export class ProjectLaunchingSoonComponent implements OnInit {
  searchText: '';
  pageSize = 5;
  count: number;
  projectLaunchingSoonInfoList: ProjectLaunchingSoonInfo[] = [];
  @Input() tradingType: string;
  
  constructor(private tradingService: TradingService) { }

  ngOnInit() {
  }
  valueChange()
  {
      if(this.searchText.length>2 || this.searchText=='')
      {
        this.getProjectLaunchingSoonList(1);
      }
     
  }
  getProjectLaunchingSoonList(newPage) {
     if (newPage) {
       this.tradingService.projectLaunchingSoonList(newPage, this.pageSize, this.searchText, this.tradingType)
       .subscribe((listInfo:any) => {
           this.projectLaunchingSoonInfoList = listInfo['results'];
           this.count = listInfo['count'];
         });
     }
   }
}
