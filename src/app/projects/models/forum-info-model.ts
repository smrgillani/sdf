export class ForumInfoModel {

    categoryInfoList: CategoryInfo[] = [];
    selectedCategoryId: number;
    selectedTopicId: number;
    topicInfoList: TopicInfo[] = [];
    threadInfoList: ThreadInfo[] = [];
    searchText: string;
    filterType: number;
    isMostView: boolean = false;
}

export class CategoryInfo {
    id: number;
    title: string;
    description: string;
    created_date: Date;
    image: string;//base64 or url link path
    colortext: string;//color code
    thread_count: number;
    posts_count: number;
}

export class TopicInfo {
    id: number;
    title: string;
    description: string;
    created_date: Date;
    image: string;//base64 or url link path
    colortext: string;//color code
    category: number;// id of category
    thread_count: number;
    posts_count: number;
}

export class ThreadInfo {
    id: number;
    owner: OwnerInfo;
    title: string;
    description: string;
    created_date: Date;
    public: boolean = true;
    participants: number[] = [];
    comment_thread: CommentThreadInfo[] = [];
    category_title: string;
    posts_count: number;
    image: string;
    forumcategories: number;
    topics: number;
    is_edit: boolean;
}

export class OwnerInfo {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    photo_crop: string
    user_id: number;
}

export class CommentThreadInfo {
    id: number;
    comment_by: OwnerInfo;
    text: string;
    created_date: Date;
    thread: number; //id of Thread for which replyed.
    subcomments: SubCommentThreadInfo[] = [];
    

    /*id: number;
    comment_by_title: string;
    text: string;
    created_date: Date;
    thread: number; //id of Thread for which replyed.
    subcomments: SubCommentThreadInfo[] = [];
    */
}

export class SubCommentThreadInfo {    
    id: number;
    // comment_by__userprofile__first_name: string;
    // comment_by__userprofile__last_name: string;
    comment_by: OwnerInfo;
    text: string;
    created_date: Date;
    thread: number; //id of Thread for which replyed.
    parent_comment: number;
}

export class ForumUserInfo {
    id: number;
    country: string;
    state: string;
    city: string;
    name: string;
    image: string;
}
