import UserProfileModel from 'app/core/models/UserProfileModel';


export class ChatCredentialsModel {
  user_id: string;
  token: string;
}


export class ChatRoomModel {
  room_id: string;
  title: string;
}


export class ChatMessageModel {
  id: string;
  name: string;
  username: string;
  text: string;
  time: Date;
  userId: string;
  user?: UserProfileModel;

  message_type: string;
  attachments: AttachmentMessageModel[];
  is_reply: boolean;
  options: DecisionPollOption[];
  flag: boolean;
  message_by: string;
  agree_count?: number;
  diagree_count?: number;
  editable?: boolean;
  editedBy?: any;
  starred: any[];

  constructor() {
    this.attachments = [];
    this.options = [];
  }
}

export class AttachmentMessageModel {
  text: string;
  author_icon: string;
  message_link: string;
  attachments: AttachmentMessageModel[] = [];
  author_name: string;
  translations: string;
  ts: Date;

  title_link_download: boolean;
  title_link: string;
  description: string;
  title: string; // file name
  type: string; // type of file

  file: string;
  msg: string;

  image_type: string;
  image_preview: string;
  image_url: string;
}

export class DecisionPollOption {
  id: number;
  option: string;
  addOption: boolean;

  percentage: number;
  votes: number;
}

export class RocketChatWebSocketResponse {
  msg: string;
  subs?: string[];
  collection?: string;
  fields?: any;
  id?: string;
  result?: any;
}

export class RocketChatUserInfo {
  active: boolean;
  id: string;
  name: string;
  status: string;
  type: string;
  username: string;
}
