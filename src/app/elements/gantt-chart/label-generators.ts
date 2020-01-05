import * as _ from 'lodash';
import * as moment from 'moment';


export class HourLabelGenerator {
  getLabels(start: Date, end: Date) {
    const days = [];
    let time = moment(start).startOf('day');
    while (time.isBefore(end)) {
      days.push(time);
      time = moment(time).add(3, 'hours');
    }
    return _.map(days, (d) => ({
      caption: d.format('HH:mm'),
      time: d.toDate()
    }));
  }
}


export class DayLabelGenerator {
  format: string;

  constructor(format?: 'D' | 'MMM D') {
    this.format = format || 'D';
  }

  getLabels(start: Date, end: Date) {
    const days = [];
    let day = moment(start);
    while (day.isBefore(end)) {
      days.push(day);
      day = moment(day).add(1, 'days');
    }
    return _.map(days, (d) => ({
      caption: d.format(this.format),
      time: d.toDate()
    }));
  }
}


export class WeekLabelGenerator {
  getLabels(start: Date, end: Date) {
    const days = [];
    const shift = (7 - start.getDay()) % 7;
    let day = moment(start).add(shift, 'days');
    while (day.isBefore(end)) {
      days.push(day);
      day = moment(day).add(7, 'days');
    }
    return _.map(days, (d) => ({
      caption: d.format('MMM D'),
      time: d.toDate()
    }));
  }
}


export class MonthLabelGenerator {
  format: string;

  constructor(format?: 'MMM' | 'MMMM') {
    this.format = format || 'MMMM';
  }

  getLabels(start: Date, end: Date) {
    const days = [];
    let day = start.getDate() === 1
      ? moment(start)
      : moment(start).add(1, 'months').startOf('month');
    while (day.isBefore(end)) {
      days.push(day);
      day = moment(day).add(1, 'months');
    }
    return _.map(days, (d) => ({
      caption: d.format(this.format),
      time: d.toDate()
    }));
  }
}
