export class SignedDocumentModel {
	constructor() {
		this.data = new SignedDocumentInfo();
	}
	_id: number;
	_whichType: string;
	_creator_id: number;
	_project_id: number;
	_created_date: string;
	_signed_dicument: string;
	data: SignedDocumentInfo; 
}

export class SignedDocumentInfo {
	creator_name: string;
	project_name: string;
	employee_id: string;
	employee_name: string;
	letter_through: string;
	status: string;
	job_id: string;
	job_name: string;
	backer_id: string;
	backer_name: string;
}