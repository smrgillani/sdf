import {Pipe, PipeTransform} from '@angular/core';
import ProjectModel from 'app/projects/models/ProjectModel';
import {PaginationMethods} from 'app/elements/pagination/paginationMethods';
import {SliceIndexModel} from '../elements/pagination/SliceIndexModel';

@Pipe({
  name: 'paginationSlice'
})
export class PaginationPipe implements PipeTransform {
  filteredItems;
  constructor(public paginationMethods: PaginationMethods) {}

  transform(projects: ProjectModel[], sliceIndex: SliceIndexModel, count: number) {
    if (projects) {
      this.paginationMethods.collectionSize = count;
      this.filteredItems = projects.slice(sliceIndex.startIndex, sliceIndex.endIndex);
      return projects;
    }
  }

}
