import { TransactionAmountInfo } from "app/common/models/transaction-model";

export class ProjectCreatorInfo {
    owner_id: number;
    owner_name: string;
    projects: EmployeeOnGoingProject[] = [];
}

export class CreatorInfo {
    owner_id: number;
    owner_name: string;
    projects: EmployeeOnGoingProject[] = [];
}

export class EmployeeOnGoingProject {
    id: number;
    title: string;
}

export class BonusRequestInfo {
    bonus: TransactionAmountInfo = new TransactionAmountInfo();
    status: string;
    create_date: Date;
    project: number;
    creator: number;
    employee: number;
    id: number;
    selected: boolean;
}

export class HikeRequestInfo {
    hike: TransactionAmountInfo = new TransactionAmountInfo();
    status: string;
    create_date: Date;
    project: number;
    creator: number;
    employee: number;
    id: number;
    selected: boolean;
}

export class QuitJobInfo {
    reason: string = '';
    notice_period:number;
    status: string;
    create_date: Date;
    project: number;
    creator: number;
    employee: number;
    id: number;
    selected: boolean;
}