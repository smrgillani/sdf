import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


/**
 * Date Input.
 * Allow edit date using calendar.
 *
 * @input date - date value
 * @output dateChange - event, triggers on date value change
 */
@Component({
  selector: 'app-date-input',
  template: `
    <div class="date-input" 
         [ngbPopover]="datepicker"
         appPopoverCloseOuterClick
         #p="ngbPopover"
         placement="top">
      <div class="btn" (click)="makeCalendarOpenTrigger(true)">{{viewDate()}}</div>
    </div>
    <ng-template #datepicker>
      <ngb-datepicker #dateCalendar [minDate]="_dummyMinDate" [maxDate]="_dummyMaxDate" (ngModelChange)="closePopover()" [(ngModel)]="dummyDate"></ngb-datepicker>
    </ng-template>
  `,
  styles: [`
    .date-input .btn {
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      text-decoration: underline;
      width: auto;
    }
  `]
})
export class DateInputComponent {
  calendarOpenTrigger = false;

  @Input()
  set date(date: Date) {
    this._date = date;
    this._dummyDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }
  get date(): Date {
    return this._date;
  }
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();

  @ViewChild('p') popover: NgbPopover;
  @ViewChild('dateCalendar') dateCalendar;

  _date: Date;
  _dummyDate: any;
  _dummyMinDate: any;
  _dummyMaxDate: any;


  get dummyDate() {
    return this._dummyDate;
  }

  set dummyDate(dummyDate: any) {
    this._dummyDate = dummyDate;
    const newDate = moment(this._date)
      .year(dummyDate.year)
      .month(dummyDate.month - 1)
      .date(dummyDate.day).toDate();
    this.dateChange.next(newDate);
    this.makeCalendarOpenTrigger(false);
  }

  ngOnInit(){
    if(this.minDate){
      this._dummyMinDate = {
        year: this.minDate.getFullYear(),
        month: this.minDate.getMonth() + 1,
        day: this.minDate.getDate()
      };
    }
    if(this.maxDate){
      this._dummyMaxDate = {
        year: this.maxDate.getFullYear(),
        month: this.maxDate.getMonth() + 1,
        day: this.maxDate.getDate()
      };
    }
  }

  makeCalendarOpenTrigger(isTrue) {
    this.calendarOpenTrigger = isTrue;
  }

  closePopover() {
    if (!this.calendarOpenTrigger) {
      this.popover.close();
    }
  }

  viewDate() {
    return moment(this.date).format('MMMM D, YYYY');
  }
}
