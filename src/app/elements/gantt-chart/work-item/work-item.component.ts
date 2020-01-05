import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Work, WorkItemDragEvent } from '../interfaces';


/**
 * Work item view for Gantt Chart.
 *
 * @input work - abstract work, should have title, startDate, endDate and progress fields
 * @input selected - work item selection state
 * @input mode - can be 'view' or 'edit'
 *
 * @output openWork - event, triggered when the work going to be opened
 * @output editWork - event, triggered when edit button pressed
 * @output showWorkActivity - event, triggered when task activity button pressed
 * @output selectedChange - event, triggered when selection change
 * @output dragStart - event, triggered when mouse are captured on the component
 */
@Component({
  selector: 'app-gantt-chart-work-item',
  templateUrl: './work-item.component.html',
  styleUrls: ['./work-item.component.scss'],
})
export class GanttChartWorkItemComponent {
  @Input() work: Work;
  @Input() selected = false;
  @Input() allowEdit = false;

  @Output() openWork: EventEmitter<Work> = new EventEmitter();
  @Output() editWork: EventEmitter<Work> = new EventEmitter();
  @Output() showWorkActivity: EventEmitter<Work> = new EventEmitter();
  @Output() selectedChange: EventEmitter<boolean> = new EventEmitter();
  @Output() dragStart: EventEmitter<WorkItemDragEvent> = new EventEmitter();

  // @HostListener('mousedown', ['$event'])
  // onMouseDown(event) {
  //   if (this.allowEdit) {
  //     let update = 'both';
  //
  //     if (event.target.classList.contains('left')) {
  //       update = 'startDate';
  //     } else if (event.target.classList.contains('right')) {
  //       update = 'endDate';
  //     }
  //
  //     this.dragStart.emit({
  //       work: this.work,
  //       type: update,
  //     } as WorkItemDragEvent);
  //   }
  // }
}
