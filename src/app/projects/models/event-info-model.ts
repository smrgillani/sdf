export class EventInfoModel {
    //list info
    id: number;
    event_name: string;
    image: string;
    location: string;
    description: string
    event_date: Date;
    created_date: Date;
    event_type: string;
    accepted_count: number;
    not_accepted_count: number;
    owner: number;
    owner_name: string;
    status: string;
    send_invitation: boolean;
    event_invitation_id: number;
}

export class InviteFriendsModel {
    id: number;
    user_id: number;
    name: string;
    photo: string;
    is_checked: boolean = false;
}
