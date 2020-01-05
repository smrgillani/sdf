import { BlockInfoModel } from "./block-info-model";

export class BlockListinfoModel {
    gas_limit: number;
    block_number: number;
    block_time: number;
    block_list: BlockInfoModel[] = [];
}
