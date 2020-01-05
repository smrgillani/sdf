export class FindWorkFilters {
    id:number;//employee id
    title:string;
    description:string;
    // date_start: Date;
    // date_end: Date;
    categories: number[]=[];//as department
    sub_categories: number[]=[];//as  role
    expertise: number[]=[];
    experience: number[]=[];
    availability: number[]=[];
    hourlybudget: number[]=[];
    status:string;
}

export class commonFilters {
    id: number;
    title: string;
    is_active: boolean;
    is_checked: boolean;
}
