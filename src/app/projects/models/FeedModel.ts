import FeedInfoModel from "app/projects/models/FeedInfoModel";
import FeedEntryModel from "app/projects/models/FeedEntryModel";

export default class FeedModel {
    status: string;
    feed: FeedInfoModel;
    items:FeedEntryModel[];
}