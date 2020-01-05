export class ActionButtonsModel {
	constructor() {
		this.data = new ActionButtonInfo();
	}
	_id: number;
	_task_id: number;
	_group_id: string;
	_message_type: string;
	_chat_user_id: string;
	data: ActionButtonInfo; 
}

export class ActionButtonInfo {
	user_id: string;
	user_name: string;
	message_id: string;
	message: string;
	task_name: string;
	project_id: string;
	project_name: string;
	options: string;
	voting: string;
	parent_message_id: string;
	agree_count: string;
	disagree_count: string;
	create_datetime: Date;
}