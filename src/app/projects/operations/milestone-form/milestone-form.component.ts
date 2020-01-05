import { Component, Input, OnInit } from '@angular/core';
import MilestoneModel from 'app/projects/models/MilestoneModel';

/**
 * Form for adding/editing milestone object.
 */
@Component({
  selector: 'app-project-milestone-form',
  templateUrl: './milestone-form.component.html',
  styleUrls: [
    './milestone-form.component.scss',
  ],
})
export class MilestoneFormComponent implements OnInit {
  @Input() milestone: MilestoneModel;
  @Input() private categoryImageList;
  @Input() private projectMilestones;
  @Input() showNextForm;
  placeItAfter = 0;
  iconList = [];
  selectedMilestone: any[];
  milestoneList = [];

  ngOnInit() {
    this.categoryImageList.forEach(element => {
      this.iconList.push({label: element.value, value: element.value});
    });

    this.projectMilestones.forEach(element => {
      this.milestoneList.push({label: element.title, value: element.id});
    });

    if (!this.milestone.place_it_after) {
      this.milestone.place_it_after = this.milestoneList[0].value;
    }

    // To handle nulls in predifined milestones
    if (!this.milestone.icon_category) {
      this.milestone.icon_category = 'default';
      this.milestone.icon_name = 'default.png';
    }

    this.selectedMilestone = this.categoryImageList.find(x => x.value === this.milestone.icon_category);

    this.placeItAfter = this.milestone.place_it_after;
  }

  onStartDateChange(startDate: Date) {
    if (this.milestone.date_end < startDate) {
      this.milestone.date_end = startDate;
    }
  }

  onEndDateChange(endDate: Date) {
    if (this.milestone.date_start > endDate) {
      this.milestone.date_start = endDate;
    }
  }

  onSelectedIconType(value) {
    this.selectedMilestone = this.categoryImageList.filter(a => a.value == value)[0];
  }

  onSelectedAfterMilestone(value) {
    if (this.milestone.place_it_after != this.placeItAfter) {
      this.milestone.isPlaceAfterChanged = true;
      this.milestone.place_it_after = this.placeItAfter;
    }
  }
}
