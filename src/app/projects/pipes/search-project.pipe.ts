import {Pipe, PipeTransform} from '@angular/core';

import ProjectModel from 'app/projects/models/ProjectModel';

//Currently not using this as search operation is done through web services
/**
 * Search projects by title.
 *
 * Usage:
 *   {{projects | searchProject:'text'}}
 */
@Pipe({
  name: 'searchProject'
})
export class SearchProjectPipe implements PipeTransform {
  transform(projects: ProjectModel[], text: string) {
    if (text) {
      return projects.filter((project) => project.title.match(text));
    }
    return projects;
  }
}
