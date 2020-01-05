import { Component, Output, EventEmitter } from "@angular/core";
import { ProjectsService } from "app/projects/projects.service";
import WallmartProductModel from "app/projects/models/WallmartProductModel";


@Component({
    selector: 'app-product-wallmart-search',
    templateUrl: './wallmart-search.component.html',
    styleUrls:['./wallmart-search.component.scss']
})
export class ProductWallmartSearchComponent {

    @Output() onSelectedProduct = new EventEmitter<WallmartProductModel>();
    searchText: string = '';
    _timeout: any;
    wallmartResponse:{numItems:number, totalResults:number, start:number, products:WallmartProductModel[]};
    searchResult: WallmartProductModel[];
showdesc:number=0;
    constructor(
        private projectService: ProjectsService
    ) {

    }

    modelchange() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        if (this.searchText !== '') {
            this._timeout = setTimeout(() => {
                this._timeout = null;
                this.projectService.productSearch(this.searchText).subscribe((data) => {
                    console.log('product search data');
                    this.wallmartResponse = data;
                    this.searchResult = this.wallmartResponse.products;
                    console.log(data);
                });
            }, 500);
        }
        else {
            this.wallmartResponse = null;
            this.searchResult = null;
            this._timeout = null;
        }
    }

    onSelect(product:WallmartProductModel){
        if(this.searchResult.find(f=>f.isSelected)){
            this.searchResult.find(f=>f.isSelected).isSelected = false;
        }

        this.searchResult.find(f=>f.product_id == product.product_id).isSelected = true;
        this.searchResult.find(f=>f.product_id == product.product_id).quantity = 1;
    }

    ReturnSelectedProduct(){
        let product = this.searchResult.find(f=>f.isSelected);
        if(product && product.quantity>0){
            this.onSelectedProduct.emit(product);
            this.searchResult = null;
            this.wallmartResponse = null;
            this.searchText = '';
        }
    }

    showdescfun(prod_id){
        if(this.showdesc!=prod_id){
            this.showdesc=prod_id;
        }else{
            this.showdesc=0;
        }
       
    }
  

}