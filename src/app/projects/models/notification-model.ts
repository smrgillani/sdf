export class NotificationModel {
    constructor() { this.interview_details = [];}
    id: number;
    project: number;
    title: string;
    read: boolean;
    read_date: Date;
    created_date: Date;
    to_do_list: number;
    user: number;
    role: string;
    is_chat: boolean;
    hire_details: string;
    is_direct_chat: boolean;
    room_id: string;
    task_extension_request: number;
    interview_details: InterviewDetails[];
    event_invitation_id: number;
    service_extension_request: number;
    service: number;
    is_redirect: boolean;
    bonus_request: number;
    hike_request: number;
    quitjob_request:number;
}

export class InterviewDetails {
    constructor() { this.reschedule_interviews = [];}
    id: number;
    interview_date_time: Date;
    project: number
    owner: number;
    job: number
    employee: number
    job_application: number;
    status: string;
    is_direct_hire: boolean;
    job_title: string;
    job_description: string;
    reschedule_interviews: any[];
}
