export class ProjectRegistrationModel {
	constructor() {
		this.data = new RegistrationInfo();
	}
    package: string;
	ownerName: string;
	registration_type: string;
	ownerId: number
	project_Stage: string;
	project_Title: string;
	_projectId: number;
	data: RegistrationInfo;
}

export class RegistrationInfo {
	status: string;
	registration_date: Date;
}