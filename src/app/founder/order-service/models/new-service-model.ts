import { TransactionAmountInfo } from "app/common/models/transaction-model";
import { WorkDocumentModel } from "app/founder/order-service/models/work-document-model";

export class NewServiceModel {
    constructor() { 
        this.sample_attachments = []; 
        this.work_documents = [];
    }

    id: number;
    subject: string;
    request_user: number;
    employee: number;
    title: string;
    expectations: string;
    complexity: number;
    word_limit: string;
    creator_amount: TransactionAmountInfo;
    employee_amount?: TransactionAmountInfo;
    status: string;
    document_name: string;
    document: string;
    payable: number;
    sample_attachments: WorkDocumentModel[];
    work_documents: WorkDocumentModel[];
    create_date: Date;
    action_date: Date;
    rate_slab: number;
    start_date: Date;
    expected_complete_date: Date;
    revised_date: Date;

    work_summary: string;
    special_instructions: string;
    urgency: number;
    expertise: number;
    extensiveness: number;
    project: number;
    is_work_uploaded: boolean;
    conflict_remark: string;
}


