export class ToDoTaskModel {
    id: number;
    is_recurring: boolean;
    task: string;
    remind_on : Date;
    due_date: Date;
    snooze_option: string;
    snooze_time: string;
    repeat: boolean;
    //day: string;
}

export class ToDoListModel {

constructor() {
    this.repeat_days = [];
    this.repeat_months = [];
    this.frequency_time = [];
    //this.frequency = new SelectItem();
}

    id: number;
    //repeat_days: SelectItem[];
    repeat_days:number[]
    //repeat_months: SelectItem[];
    repeat_months: number[];
    task: string;
    task_description: string;
    remind: string;
    remind_me: string;
    start_on: Date;
    end_on: Date;//due_date or due_on
    frequency: number;
    //frequency: SelectItem;
    let_system_do_it: boolean;
    snooze_option: string;
    snooze_time: string;
    project: number;
    frequency_time: FrequencyTime[];

    //remindList = new Map<string, string>([['Daily', enumRemind.Daily.toString()], ['Weekly', enumRemind.Weekly.toString()], ['Monthly', enumRemind.Monthly.toString()], ['Yearly', enumRemind.Yearly.toString()]]);
    //remindList = [enumRemind.Daily, enumRemind.Weekly, enumRemind.Monthly, enumRemind.Yearly];
    remindList = [{value: 'Daily', key: enumRemind.Daily}, {value: 'Weekly', key: enumRemind.Weekly}, {value: 'Monthly', key: enumRemind.Monthly}, {value: 'Yearly', key: enumRemind.Yearly}];
    remindMeList = [{value: 'Between 09:00 - 17:00', key: enumRemindMe["Between 09:00 - 17:00"]}, { value: '24 hours', key: enumRemindMe["24 hours"]}];
    frequencyList = [{id: enumFrequency["1 Time"], label: '1 Time', value: enumFrequency["1 Time"]}, { id: enumFrequency["2 Time"], label: '2 Time', value: enumFrequency["2 Time"]}, {id: enumFrequency["3 Time"], label: '3 Time', value: enumFrequency["3 Time"]}];
    snoozeList = [{value: 'no', key: 'no'}, { value: 'yes', key: 'yes'}];
    snoozeOptionList = [
        {id: 1, label: '5 min', value: '5 min'}, 
        {id: 2, label: '10 min', value: '10 min'}, 
        {id: 3, label: '15 min', value: '15 min'}, 
        {id: 4, label: '30 min', value: '30 min'}, 
        {id: 5, label: '45 min', value: '45 min'}, 
        {id: 6, label: '1 hour', value: '1 hour'}, 
        {id: 7, label: '2 hours', value: '2 hours'}, 
    ];

    repeat_dayList = [
        {id: enumDays.Monday, title: 'Monday', label: 'Monday', value: enumDays.Monday},
        {id: enumDays.Tuesday, title: 'Tuesday', label: 'Tuesday', value: enumDays.Tuesday},
        {id: enumDays.Wednesday, title: 'Wednesday', label: 'Wednesday', value: enumDays.Wednesday},
        {id: enumDays.Thursday, title: 'Thursday', label: 'Thursday', value: enumDays.Thursday},
        {id: enumDays.Friday, title: 'Friday', label: 'Friday', value: enumDays.Friday},
        {id: enumDays.Saturday, title: 'Saturday', label: 'Saturday', value: enumDays.Saturday},
        {id: enumDays.Sunday, title: 'Sunday', label: 'Sunday', value: enumDays.Sunday},
    ];

    repeat_monthList = [
        {id: enumMonths.January, title: 'January', label: 'January', value: enumMonths.January},
        {id: enumMonths.February, title: 'February', label: 'February', value: enumMonths.February},
        {id: enumMonths.March, title: 'March', label: 'March', value: enumMonths.March},
        {id: enumMonths.April, title: 'April', label: 'April', value: enumMonths.April},
        {id: enumMonths.May, title: 'May', label: 'May', value: enumMonths.May},
        {id: enumMonths.June, title: 'June', label: 'June', value: enumMonths.June},
        {id: enumMonths.July, title: 'July', label: 'July', value: enumMonths.July},
        {id: enumMonths.August, title: 'August', label: 'August', value: enumMonths.August},
        {id: enumMonths.September, title: 'September', label: 'September', value: enumMonths.September},
        {id: enumMonths.October, title: 'October', label: 'October', value: enumMonths.October},
        {id: enumMonths.November, title: 'November', label: 'November', value: enumMonths.November},
        {id: enumMonths.December, title: 'December', label: 'December', value: enumMonths.December},
    ];

    is_complete: boolean;
    never_end: boolean;

}

enum enumRemind {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Yearly = 'yearly'
}

enum enumRemindMe {
    'Between 09:00 - 17:00' = 'between_9_to_17',
    '24 hours' = '24_hours'
}

enum enumFrequency {
    '1 Time' = 1,
    '2 Time',
    '3 Time'
}

enum enumDays {
 Monday = 1,
 Tuesday,
 Wednesday,
 Thursday,
 Friday,
 Saturday,
 Sunday
}

enum enumMonths {
    January = 1,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December
}

export class SelectItem{
    label: string;
    value: any;
    title?: string;
    id: number;
}

export class FrequencyTime {
    id: number;
    time: any;
}
