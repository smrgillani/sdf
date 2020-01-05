import {EventEmitter} from '@angular/core';
export class PaginationMethods {
  startPage = 1;
  pageSize: number;
  collectionSize: any;
  allItems: any;

  constructor() {};

  setNewSliceIndexes(itemsCollection: any, startPage: number, pageSize: number) {
    let startIndex: number;
    let endIndex: number;
    startIndex = (startPage - 1) * pageSize;
    endIndex = Math.min((startIndex + pageSize) - 1, itemsCollection.length - 1);
    return {startIndex: startIndex, endIndex: endIndex + 1};
  }

  getItemsPerPage(projectsData: any) {
    this.allItems = projectsData['result'];
    this.collectionSize = projectsData.count;
    if (projectsData) {
      return this.setNewSliceIndexes(projectsData, this.startPage, this.pageSize);
    }
  };


}
