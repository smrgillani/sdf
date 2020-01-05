export interface SingleProduct {
  age: string;
  attributes: string;
  brandName: string;
  bundle: boolean;
  categoryNode: string;
  categoryPath: string;
  color: string;
  customerRating: string;
  gender: string;
  itemId?: number;
  largeImage?: string;
  mediumImage?: string;
  msrp: number;
  name: string;
  numReviews: number;
  price: number;
  shortDescription: string;
  thumbnailImage: string;
  isCustomProduct?: boolean;
  isProductAdded?: boolean;
}
