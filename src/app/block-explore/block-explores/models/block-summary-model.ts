export class BlockSummaryModel {
    block_hash: string;
    block_number: number;
    confirmations: string;
    data?: string;
    data_translated: string
    difficulty: number
    gas_limit: number
    gas_used: number
    miner: string;
    no_of_uncle_blocks: number;
    nonce: string;
    parent_hash: string;
    received_time: string;
    size: number;
    state_root_hash: string
    transaction_count: number;
    uncle_hash: string;
}
