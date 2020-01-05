import {Pipe, PipeTransform} from '@angular/core';

import ProjectModel from 'app/projects/models/ProjectModel';

//Currently not using this as search operation is done through web services
/**
 * Filter projects by stage.
 *
 * Usage:
 *   {{projects | filterProjectStage:'startup'}}
 */
@Pipe({
  name: 'filterProjectStage'
})
export class FilterProjectStagePipe implements PipeTransform {
  transform(projects: ProjectModel[], stage: '' | 'idea' | 'startup') {
    if (stage) {
      return projects.filter((project) => project.stage === stage);
    }
    return projects;
  }
}
