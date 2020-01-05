export class UpgradeModel {
    id?: number;
    title: string;
    amount: {currency: string; amount: number};
    position_name: string;
    position_number: number;
    days: number;
    acquire_positions: number;
    message: string;
}

export class UpgradePackageModel {
    id: number;
    package: number;
    project: number;
    is_active: boolean;
    expiry_date: Date;
    selected_package?: number;
}
