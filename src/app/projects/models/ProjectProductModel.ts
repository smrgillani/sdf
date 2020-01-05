export default class ProjectProductModel{
    id:number;
    image:string;
    name:string;
    price:{currency:string,amount:number};
    product_id:number;
    project:number;
    qty:number;
    shortDescription:string;
    total:string;

    constructor(){
        this.price = {currency:'USD',amount:null}
    }
}