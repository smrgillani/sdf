export class PublishJobModel 
  {
    id:number;
    title:string;
    project: number;
    description:string;
    date_start: Date;
    date_end: Date;
    department: number[]=[];
    role: number[]=[];
    expertise: number[]=[];
    experience: number[]=[];
    availability: number[]=[];
    hourlybudget: number[]=[];
    status:string;
}