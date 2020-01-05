import {Pipe, PipeTransform} from '@angular/core';

import ProjectModel from 'app/projects/models/ProjectModel';


/**
 * Filter only visible projects.
 *
 * Usage:
 *   {{projects | filterVisible}}
 */
@Pipe({
  name: 'filterVisible'
})
export class FilterVisiblePipe implements PipeTransform {
  transform(projects: ProjectModel[]) {
    return projects && projects.filter((project) => project.is_visible);
  }
}
