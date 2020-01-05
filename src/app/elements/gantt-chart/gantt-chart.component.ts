import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import {MilestonesService} from 'app/projects/milestones.service';

import {WorkItemDragEvent, Work} from './interfaces';
import {
  DayLabelGenerator,
  HourLabelGenerator,
  MonthLabelGenerator,
} from './label-generators';


/**
 * Gantt Chart view.
 * Shows abstract "work" items.
 *
 * @input dataSource - collection of "works"
 * @input mode - time scale mode, can be on of 'day', 'week', 'month' or 'year'
 * @input itemMode - work item mode, can be 'view' and 'edit'
 *
 * @output openWork - event, triggered when a work going to be opened
 * @output editWork - event, triggered when edit button pressed
 * @output showWorkActivity - event, triggered when task activity button pressed
 * @output selectedWorkChange - event, triggered when work selection change
 */
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: [
    './gantt-chart.component.scss'
  ]
})
export class GanttChartComponent implements OnInit, AfterViewInit {
  @Input()
  set dataSource(dataSource: Work[]) {
    this._dataSource = dataSource;
    this.updateScale();
  };
  get dataSource(): Work[] {
    return this._dataSource;
  }

  @Input()
  set mode(mode: 'day' | 'week' | 'month' | 'year') {
    this._mode = mode;
    this.updateScale();
  }
  get mode(): 'day' | 'week' | 'month' | 'year' {
    return this._mode || 'week';
  }

  @Input() allowEdit = false;

  @Output() openWork: EventEmitter<Work> = new EventEmitter();
  @Output() editWork: EventEmitter<Work> = new EventEmitter();
  @Output() showWorkActivity: EventEmitter<Work> = new EventEmitter();
  @Output() selectedWorkChange: EventEmitter<Work> = new EventEmitter();

  protected _dataSource: Work[];
  protected _mode: 'day' | 'week' | 'month' | 'year';
  scaleModes: any;
  scale: number;
  startDate: Date;
  endDate: Date;
  xLabels: any[];
  dragging = false;
  selectedWork: Work = null;
  editingWork: WorkItemDragEvent = null;
  delta = 0;

  chartElement: HTMLElement;

  constructor(
    private milestonesService: MilestonesService
  ) {
    this.scaleModes = {
      day: {
        title: 'Day',
        unit: 'hours',
        range: 24,
        xLabels: [new HourLabelGenerator(), new DayLabelGenerator('MMM D')]
      },
      week: {
        title: 'Week',
        unit: 'days',
        range: 7,
        xLabels: [new DayLabelGenerator('MMM D')]
      },
      month: {
        title: 'Month',
        unit: 'days',
        range: 31,
        xLabels: [new DayLabelGenerator(), new MonthLabelGenerator()]
      },
      year: {
        title: 'Year',
        unit: 'days',
        range: 366,
        xLabels: [new MonthLabelGenerator('MMM')]
      }
    };
  }

  ngOnInit() {
    this.startDate = _.min(_.map(this.dataSource, 'startDate'));
    this.endDate = _.max(_.map(this.dataSource, 'endDate'));
    this.updateScale();
  }

  ngAfterViewInit() {
    this.chartElement = document.getElementById('gantt-chart-body');
  }

  getWorkLength(work: Work) {
    const days = this.getTimeDiff(work.startDate, work.endDate) + 1;
    return days * this.scale;
  }

  getTimeOffset(time?: Date) {
    const days = this.getTimeDiff(this.startDate, time || new Date());
    return `${days * this.scale}%`;
  }

  getTimeDiff(start: Date, end: Date): number {
    return moment(end).diff(start, this.scaleModes[this.mode].unit);
  }

  getXLabels(generator) {
    return generator.getLabels(this.startDate, this.endDate);
  }

  updateScale() {
    const scaleMode = this.scaleModes[this.mode];
    const visibleStartDate = new Date();
    const visibleEndDate = moment(visibleStartDate).add(
      scaleMode.range, scaleMode.unit
    ).toDate();

    this.startDate = _.min(_.map(this.dataSource, 'startDate').concat([visibleStartDate]));
    const endDate = _.max(_.map(this.dataSource, 'endDate').concat([visibleEndDate]));
    this.endDate = moment(endDate).add(1, scaleMode.unit).toDate();
    this.scale = 100 / this.getTimeDiff(visibleStartDate, visibleEndDate);
  }

  // @HostListener('mouseup', ['$event'])
  // onMouseUp(event: MouseEvent) {
  //   this.dragging = false;

  //   if (this.editingWork) {
  //     this.milestonesService.get(this.editingWork.work['milestone'] as HasId).subscribe();
  //     this.dataSource = _.orderBy(this.dataSource, 'order')
  //     this.updateScale();
  //     this.editingWork = null;
  //   }

  //   this.delta = 0;
  // }

  // @HostListener('mousedown', ['$event'])
  // onMouseDown(event: MouseEvent) {
  //   if (!this.editingWork) {
  //     this.dragging = true;
  //   }
  // }

  // @HostListener('mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   if (this.editingWork) {
  //     this.delta += 100 * event.movementX / (this.chartElement.clientWidth * this.scale);

  //     if (this.delta > 1 || this.delta < -1) {
  //       if (this.editingWork.type !== 'endDate') {
  //         this.editingWork.work.startDate = moment(this.editingWork.work.startDate).add(
  //           this.delta, this.scaleModes[this.mode].unit
  //         ).toDate();
  //       }

  //       if (this.editingWork.type !== 'startDate') {
  //         this.editingWork.work.endDate = moment(this.editingWork.work.endDate).add(
  //           this.delta, this.scaleModes[this.mode].unit
  //         ).toDate();
  //       }

  //       this.delta = 0;
  //     }
  //   }

  //   if (this.dragging) {
  //     const scrollLeft = this.chartElement.scrollLeft - event.movementX;
  //     this.chartElement.scrollLeft = scrollLeft > 0 ? scrollLeft : 0;
  //   }
  // }

  // @HostListener('dragstart')
  // onDragStart() {
  //   return false;
  // }

  // onMilestoneDragStart(editingWork: WorkItemDragEvent) {
  //   this.editingWork = editingWork;
  // }

  onOpenWork(work: Work) {
    this.openWork.next(work);
  }

  onEditWork(work: Work) {
    this.editWork.next(work);
  }

  onShowWorkActivity(work: Work) {
    this.showWorkActivity.next(work);
  }

  onSelectionChange(work: Work, selected: boolean) {
    this.selectedWork = selected ? work : null;
    this.selectedWorkChange.next(this.selectedWork);
  }
}
