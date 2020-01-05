import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ProjectsService } from 'app/projects/projects.service';
import WallmartProductModel from 'app/projects/models/WallmartProductModel';
import { NgbRatingConfig, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SingleProduct } from 'app/projects/models/single-product';

const max_product = 5;

var angular: any;

interface AdditionalField {
  id: string;
  name: string;
}

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchProductComponent),
    multi: true,
  }, NgbRatingConfig],
})
export class SearchProductComponent {
  selectedProducts: SingleProduct[] = [];
  searchText = '';
  productUrl = '';
  addingManually = false;
  manualProductAdded = false;
  manualProductName = '';
  manualProductImg = '';
  showCompare = false;
  allowSubmit = false;
  searchResult: WallmartProductModel[];
  popUpForShowInterestModalRef: NgbModalRef;
  errorMessages = [];
  newAdditionalFieldName = '';
  newAdditionalFieldError = '';
  additionalFields: AdditionalField[] = [];
  private _timeout: any;
  private productSubmit = false;
  private wallmartResponse: { numItems: number, totalResults: number, start: number, products: WallmartProductModel[] };
  private standardFieldsReservedNames = [
    'Brand Name', 'MSRP', 'Price', 'Category Path', 'Category Node', 'Description', 'Color', 'Customer Rating',
    'No. of Reviews', 'Bundle', 'Attributes', 'Gender', 'Age',
  ];

  @Input() readOnly = false;
  @ViewChild('popUpForShowInterestMessage') private popUpForShowInterestMessage;

  constructor(
    private projectService: ProjectsService,
    config: NgbRatingConfig,
    private modalService: NgbModal,
  ) {
    config.max = 5;
    config.readonly = true;
  }

  modelChange() {
    if (this.selectedProducts.length >= max_product) {
      this.searchResult = null;
      this.wallmartResponse = null;
      this.searchText = '';
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
      return false;
    }

    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    if (this.searchText !== '') {
      this._timeout = setTimeout(() => {
        this._timeout = null;
        this.projectService.productSearch(this.searchText).subscribe((data) => {
          this.wallmartResponse = data;
          this.searchResult = this.wallmartResponse.products;
        });
      }, 500);
    } else {
      this.wallmartResponse = null;
      this.searchResult = null;
      this._timeout = null;
    }
  }

  selectProduct(product: WallmartProductModel) {
    if (product) {
      this.projectService.getSingleProductById(product.product_id, false).subscribe(data => {
        const singleProduct = data.product_features[0];

        singleProduct.isProductAdded = true;
        this.selectedProducts.push(singleProduct);

        this.searchResult = null;
        this.wallmartResponse = null;
        this.searchText = '';
        this.allowSubmit = true;
      }, (error) => {
        console.log(error);
      });
    }
  }

  addByProductUrl() {
    const product = new WallmartProductModel();

    if (this.selectedProducts.length >= max_product) {
      this.searchResult = null;
      this.wallmartResponse = null;
      this.searchText = '';
      this.popUpForShowInterestModalRef = this.modalService.open(this.popUpForShowInterestMessage, {backdrop: false});
      return false;
    }

    product.product_id = this.productUrl;

    this.projectService.getSingleProductById(this.productUrl, true).subscribe((data) => {
      if (data.errors) {
        data.errors.forEach((item) => {
          if (item.code === 4002) {
            this.errorMessages.push('Invalid item, item not found for the product url!');
          } else {
            this.errorMessages.push(item.message);
          }
        });

        setTimeout(() => {
          this.errorMessages = [];
        }, 4000);
      } else {
        this.productUrl = '';
        this.selectedProducts.push(data.product_features[0]);
      }
    }, (error) => {
      console.log(error);
    });
  }

  addManually() {
    this.manualProductImg = null;
    this.manualProductName = '';
    this.addingManually = true;
  }

  removeProduct(prod_index) {
    this.selectedProducts.splice(prod_index, 1);

    this.allowSubmit = true;
    this.refreshManualProductsAdding();
  }

  imageChangeListener($event, document: string) {
    this.manualProductImg = $event.src;
  }

  saveCustomProduct() {
    if (this.manualProductName !== '') {
      this.selectedProducts.push({
        isCustomProduct: true,
        isProductAdded: true,
        thumbnailImage: this.manualProductImg,
        name: this.manualProductName,
        brandName: '',
        msrp: 0,
        price: 0,
        categoryPath: '',
        categoryNode: '',
        shortDescription: '',
        color: '',
        customerRating: '0',
        numReviews: 0,
        bundle: false,
        attributes: '',
        gender: '',
        age: '0',
      });

      this.addingManually = false;
      this.allowSubmit = true;
      this.refreshManualProductsAdding();
    } else {
      return false;
    }
  }

  compareProducts() {
    this.showCompare = true;
    this.newAdditionalFieldName = '';
    this.newAdditionalFieldError = '';
  }

  updateProduct() {
    this.productSubmit = true;

    this.selectedProducts.filter(x => x.isCustomProduct === true).forEach(item => {
      item.isProductAdded = true;
    });

    const data = {
      productcompare_answer: this.selectedProducts,
      additional_fields: this.additionalFields,
    };

    this.onModelChange(data);
    this.onChange(data);
    this.allowSubmit = false;
  }

  goBack() {
    this.showCompare = false;
  }

  toggleEditCustomProduct(index) {
    this.selectedProducts[index].isProductAdded = !this.selectedProducts[index].isProductAdded;
  }

  createAdditionalField() {
    this.newAdditionalFieldError = '';

    if (!this.newAdditionalFieldName) {
      this.newAdditionalFieldError = 'Cannot be empty';
      return;
    }

    if (this.additionalFields.find(item => item.name.toLowerCase() === this.newAdditionalFieldName.toLowerCase())) {
      this.newAdditionalFieldError = 'Already exists';
      return;
    }

    if (this.standardFieldsReservedNames.find(item => item.toLowerCase() === this.newAdditionalFieldName.toLowerCase())) {
      this.newAdditionalFieldError = 'Already exists';
      return;
    }

    this.additionalFields.push({
      id: 'additional_field-' + Math.round(Math.random() * 100000000000000),
      name: this.newAdditionalFieldName,
    });

    this.newAdditionalFieldName = '';

    this.updateProduct();
  }

  removeAdditionalField(id: number) {
    this.additionalFields.splice(id, 1);
    this.updateProduct();
  }

  removeAdditionalField_(className: any) {
    var navbar = document.querySelector(className);
    navbar.remove();
  }

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    if (currentValue) {
      currentValue.productcompare_answer.forEach(element => {
        this.selectedProducts.push(element);
      });
      currentValue.additional_fields.forEach(item => {
        this.additionalFields.push(item);
      });

      this.showCompare = true;
      this.allowSubmit = false;
      this.refreshManualProductsAdding();
    }
  }

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  private refreshManualProductsAdding() {
    this.selectedProducts.length >= max_product ? this.manualProductAdded = true : this.manualProductAdded = false;
  }
}
