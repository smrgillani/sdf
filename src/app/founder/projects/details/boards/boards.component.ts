import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from 'app/auth/auth.service';
import {MilestonesService} from 'app/projects/milestones.service';
import MilestoneModel from 'app/projects/models/MilestoneModel';


@Component({
  templateUrl: './boards.component.html',
  styleUrls: [
    './boards.component.scss',
  ],
  providers: [MilestonesService]
})
export class FounderProjectDetailsBoardsComponent implements OnInit {
  @ViewChild(NgbPopover) popover: NgbPopover;

  buttons: any[];
  project_id: number;
  milestones: MilestoneModel[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private milestonesService: MilestonesService,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.project_id = params['id'];
    });

    if (localStorage.getItem('redirect_to_project') === 'true') {
      localStorage.setItem('redirect_to_project', 'false');
      this.location.back();
    } else {
      this.getMilestones();
    }

    this.auth.logoutEvent.subscribe(() => {
      this.clear();
    });
  }

  clear() {
    localStorage.removeItem('localData');
    localStorage.removeItem('localDataSource');
    localStorage.removeItem('localDataResource');
    localStorage.removeItem('project_id');
    localStorage.removeItem('milestone_id');
    localStorage.removeItem('edit_item');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('taskcountByStatus');
    localStorage.removeItem('project_name');
    localStorage.removeItem('tasks_itemid_originid');
  }

  openMilestone(id) {
    this.router.navigate(['.', id], {relativeTo: this.route});
  }

  getMilestones() {
    this.milestonesService.list(this.project_id).subscribe( (resp) => {
        this.milestones = resp;
        this.milestones.sort(this.compare);
    });
  }

  compare(a: MilestoneModel, b: MilestoneModel) {
    if (a.id < b.id) {
      return -1;
    } else {
      return 1;
    }
  }

  /**
   * @method for creating new milestone
   */
  addMilestone() {
    let new_milestone = new MilestoneModel();
    const today = new Date();

    new_milestone = {
      title: `title for project ${this.project_id} for milestone ${this.milestones.length + 1}`,
      description: 'description',
      date_start: today,
      date_end: today,
      project: this.project_id
    } as MilestoneModel;

    this.milestonesService.create(new_milestone)
      .subscribe((resp) => {
        this.milestones.push(resp);
      }
    );
  }
}
