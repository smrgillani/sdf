import {Component, Input, Output, OnInit, EventEmitter, ViewEncapsulation} from '@angular/core';
import {PaginationMethods} from './paginationMethods';


/*
 * Pagination control for tables and lists.
 *
 * @input pageSize - number of items per page
 * @output pageChanged - event, triggers on page change
 * [(page)]="page"
 */
@Component({
  selector: 'app-pagination',
  template: `<ngb-pagination [(collectionSize)]="pagesQuantity" 
            [maxSize]="1" [ellipses]="true" 
            [rotate]="true" [boundaryLinks]="true" 
            (pageChange)="sendPageNumber($event)" 
            [(pageSize)]="pageSize" 
            aria-label="Default pagination"></ngb-pagination>`,
  styleUrls: [
    './pagination.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit {
  @Output() pageChanged = new EventEmitter();
  @Input() pageSize: number;
  @Input() pagesQuantity: number;
  // @Input() pageReset:boolean;
  // page:number = 1;

  constructor(private paginationMethods: PaginationMethods) {}

  sendPageNumber(newPageNumber: any) {
    this.pageChanged.emit(newPageNumber);
  }

  ngOnInit() {
    this.paginationMethods.pageSize = this.pageSize;
  }

  // ngOnChanges(changes: any): void {
  //   debugger;
  //   if (changes != undefined && changes.pageReset != undefined) {
  //     this.page = 1;
  //   }
  // }


}
