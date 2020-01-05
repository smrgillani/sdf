export class ProjectNotarizationModel {

    constructor() {
        this.documents = [];
    }

    id: number;
    project: number;
    transaction_id: string;
    documents: NotarizeDocument[];
    email: string;
    is_draft: boolean;
}

export class NotarizeDocument {
    id: number;
    document: string;
    document_name: string;
    notarization_details: number;
    ext: string;
    size: number;
}

export class NotarizeResponse {

    constructor() {
        this.uploaded_documents = [];
        this.notarised_documents = [];
    }

    id: number;
    project: number;
    transaction_id: string;
    email: string;
    first_name: string;
    last_name: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    start: Date;
    end: Date;
    notary_name: string;
    notary_city: string;
    notary_registration: string;
    uploaded_documents: NotarizeDocument[];
    notarised_documents: NotarizeDocument[];
}
