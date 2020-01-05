import { Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NgbRatingConfig, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ProjectsService } from 'app/projects/projects.service';

@Component({
  selector: 'app-search-company-compare',
  templateUrl: './search-company-compare.component.html',
  styleUrls: ['./search-company-compare.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchCompanyCompareComponent),
    multi: true,
  }, NgbRatingConfig],
})
export class SearchCompanyCompareComponent implements OnInit {
  popUpForShowInterestModalRef: NgbModalRef;
  selectedCompanies = [];
  searchText = '';
  manualCompanyAdded = false;
  manualCompanyName = '';
  showCompare = false;
  isOnlyBack = false;
  isTicker = false;
  addingManually = false;
  searchResult = [];
  private _timeout: any;
  private productSubmit = false;

  @Input() readOnly = false;

  @ViewChild('popUpForShowInterestMessage') private popUpForShowInterestMessage;

  constructor(
    private projectService: ProjectsService,
    config: NgbRatingConfig,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {}

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    if (currentValue) {
      this.selectedItems(currentValue);
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

  compareCompanies() {
    this.showCompare = true;
  }

  removeCompany(prod_index) {
    if (this.selectedCompanies[prod_index].isCustomCompany === true) {
      this.manualCompanyAdded = false;
    }

    this.selectedCompanies.splice(prod_index, 1);
  }

  modelChange() {
    if (this.selectedCompanies.length >= 3) {
      this.searchResult = null;
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
        this.projectService.companySearch(this.searchText, this.isTicker).subscribe((data) => {
          this.searchResult = data.company;
        });
      }, 500);
    } else {
      this.searchResult = null;
      this._timeout = null;
    }
  }

  returnSelectedCompany(company) {
    if (company) {
      this.projectService.getSingleCompanyById(company.permid).subscribe((singleCompany) => {
        this.selectedCompanies.push(singleCompany.company_features[0]);
        this.searchResult = null;
        this.searchText = '';
      }, (error) => {
        console.log(error);
      });
    }
  }

  saveCustomCompany() {
    if (this.manualCompanyName !== '' /*&& this.manualCompanyImg != ''*/) {
      this.selectedCompanies.push({
        isCustomCompany: true,
        isCompanyAdded: false,
        // thumbnailImage: this.manualProductImg,
        // name: this.manualCompanyName,
        activity_status: '',
        fax_number: '',
        founding_date: new Date(),
        holding_classification: '',
        hq_address: '',
        hq_phone_number: '',
        ipo_date: new Date(),
        organization_name: this.manualCompanyName,
        registered_address: '',
        registered_phone_number: '',
        // attributes: false,
        // gender: '',
        // age: 0
      });
      this.addingManually = false;
      this.manualCompanyAdded = true;
    } else {
      return false;
    }
  }

  checkIsTickerChange() {
    this.searchText = '';
    this.searchResult = null;
  }

  removeAdditionalField_(className: any) {
    var navbar = document.querySelector(className);
    navbar.remove();
  }

  updateCompany() {
    const matchIndex = this.selectedCompanies.findIndex(x => x.isCustomCompany === true);

    this.productSubmit = true;
    this.selectedCompanies[matchIndex].isCompanyAdded = matchIndex > -1;

    const data = {
      productcompare_answer: this.selectedCompanies,
    };

    this.onModelChange(data);
    this.onChange(data);
    this.isOnlyBack = true;
  }

  editIfCustom() {
    const matchIndex = this.selectedCompanies.findIndex(x => x.isCustomCompany === true);

    this.selectedCompanies[matchIndex].isCompanyAdded = matchIndex === -1;

    this.isOnlyBack = false;
  }

  private selectedItems(currentValue) {
    currentValue.productcompare_answer.forEach(element => {
      if (element.isCustomCompany) {
        element.founding_date ? element.founding_date = moment(element.founding_date).toDate() : new Date();
        element.ipo_date ? element.ipo_date = moment(element.ipo_date).toDate() : new Date();
      }
      this.selectedCompanies.push(element);
    });

    this.showCompare = true;
    this.isOnlyBack = true;
    this.selectedCompanies.length >= 3 ? this.manualCompanyAdded = true : this.manualCompanyAdded = false;
  }
}
