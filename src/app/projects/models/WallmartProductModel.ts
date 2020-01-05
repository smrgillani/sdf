
export default class WallmartProductModel{
    product_id:string;
    itemId: number;
    name:string;
    price:number;
    shortDescription:string;
    thumbnailImage:string;
    mediumImage:string;
    largeImage:string;

    /*Operational fields*/
    quantity:number;
    isSelected:boolean;


    gender:string;
    categoryNode:string;
    msrp:number;
    attributes:boolean;
    color:string;
    brandName:string;
    numReviews:number;
    bundle:boolean;
    customerRating:number;
    categoryPath:string;
    age:number;
}