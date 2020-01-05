export class ProjectNotarizationModel {
    constructor() {
        this.data = new NotarizeInfo();
    }
    _id: number;
	_username: string;
	data: NotarizeInfo; 
	_notary_registration: string;
	_projectid: number;
}

export class NotarizeInfo {
    end: Date;
    country: string;
    start: Date
    address_line1: string;
    notary_city: string;
    status: string;
    state: string;
    notary_name: string;
    pincode: number;
    address_line2: string;
    city: string;
}
