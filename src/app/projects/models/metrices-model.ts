export class MetricesModel {
    constructor() {
        this.basicInfo = new MetricesBasicInfo();
    }

    basicInfo: MetricesBasicInfo;
    ProcessListInfo: { 
        count: number; 
        next: string; 
        previous: string; 
        results: MeticesProcessInfo[];
    }
}

export class MetricesBasicInfo {
    id: number;
    employee: string;
    current_designation: string;
    photo: string;
    processes: {
        process_id: number;
        title: string;
    }[] = [];
    rating: number;
}

export class MeticesProcessInfo {
    end_datetime: Date;
    loggedin_hours: string;
    start_datetime: Date;
}
