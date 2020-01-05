import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { Location } from '@angular/common';
import { NgbRatingConfig, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from 'app/founder/order-service/services/order.service';
import { NewServiceModel } from 'app/founder/order-service/models/new-service-model';
import { RateSlabComponent } from 'app/founder/order-service/rate-slab/rate-slab.component';
import { RateSlabModel } from 'app/founder/order-service/models/rate-slab-model';
import { BreakUpComponent } from 'app/founder/order-service/break-up/break-up.component';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {

  myNewServiceForm: FormGroup;
  subjectList: SelectItem[] = [
    { value: 'branding', label: 'Branding' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'prototyping', label: 'Prototyping' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'warehousing', label: 'Warehousing' },
    { value: 'customer_service', label: 'Customer Service' }
  ];

  complexityList: SelectItem[] = [];
  workLimitList: SelectItem[] = [];
  rateSlabModel: RateSlabModel;
  // complexityList: SelectItem[] = [
  //   { value: 1, label: '1' },
  //   { value: 2, label: '2' },
  //   { value: 3, label: '3' },
  //   { value: 4, label: '4' },
  //   { value: 5, label: '5' }
  // ];

  // workLimitList: SelectItem[] = [
  //   { value: '100-300', label: '100-300' },
  //   { value: '300-500', label: '300-500' },
  //   { value: '500-700', label: '500-700' },
  //   { value: '700-1000', label: '700-1000' },
  // ];

  issubmitted: boolean = false;
  dropZoneChartTemplate: string;
  is_fileSizeExceed: boolean = false;
  currentSize: number = 0;
  deletedIndex: number[] = [];
  previousFileSize: number = 0;
  projectId: number;

  constructor(private fb: FormBuilder,
    private orderService: OrderService,
    private loaderServcie: LoaderService,
    private _location: Location,
    private modalService: NgbModal,
    private route: ActivatedRoute) {
    this.projectId = parseInt(route.snapshot.params['id']);

    const payable = fb.group({
      amount: [0],
      currency: ['']
    });

    this.myNewServiceForm = fb.group({
      id: [0],
      subject: ['branding', Validators.required],
      title: ['', Validators.required],
      expectations: [''],
      complexity: [1],
      word_limit: [1],
      creator_amount: payable,
      rate_slab: [0],
      project: [this.projectId],
      sample_attachments: fb.array([])
    });

    this.dropZoneChartTemplate = `<div class="file-droppa-document-image file-droppa-passport"></div>`;
    this.rateSlabModel = new RateSlabModel();
    //this.myNewServiceForm.valueChanges.subscribe(console.log);
  }

  get sampleAttForm() {
    return this.myNewServiceForm.get('sample_attachments') as FormArray;
  }

  addSampleAtt(document: string, document_name: string, size: number, ext: string) {
    const attachment = this.fb.group({
      document: [document],
      document_name: [document_name],
      size: [size],
      ext: [ext]
    });
    this.sampleAttForm.push(attachment);
  }

  deleteSampleAtt(i: number) {
    this.sampleAttForm.removeAt(i);
    this.deletedIndex.push(i);
  }

  setFormData() {
    this.myNewServiceForm.setValue({
      id: 0,
      subject: 'branding',
      title: '',
      expectations: '',
      complexity: this.complexityList && this.complexityList.length > 0 ? this.complexityList[0].value : 1,
      word_limit: this.workLimitList && this.workLimitList.length > 0 ? this.workLimitList[0].value : 1,
      creator_amount: {
        amount: 0,
        currency: 'USD'
      },
      rate_slab: 0,
      project: this.projectId,
      sample_attachments: []
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.myNewServiceForm.controls; }

  ngOnInit() {
    this.getWordLimitList();
    this.getComplexityList();
    setTimeout(() => {
      this.setFormData();
      this.getPayable();
    }, 100);
  }

  getWordLimitList() {
    this.orderService.getWordLimitList().subscribe((infoList) => {
      this.workLimitList = [];
      infoList.forEach(element => {
        this.workLimitList.push({ label: element.title, value: element.id });
      });
    }, (error) => {
      console.log(error);
    });
  }

  getComplexityList() {
    this.orderService.getComplexityList().subscribe((infoList) => {
      this.complexityList = [];
      infoList.forEach(element => {
        this.complexityList.push({ label: element.title, value: element.id });
      });
    }, (error) => {
      console.log(error);
    });
  }

  getPayable() {
    // this.orderService.getPayable(this.myNewServiceForm.controls["complexity"].value, this.workLimitList && this.workLimitList.length > 0 ? this.workLimitList[0].value : 1).subscribe((info) => {
    //   this.rateSlabModel = info;
    //   this.myNewServiceForm.controls["rate_slab"].setValue(info.id);
    //   const payable = this.f.creator_amount as FormGroup;
    //   payable.controls['amount'].setValue(info.total_amount.amount);
    // }, (error) => {
    //   this.checkForErrors(error, this.myNewServiceForm);
    // });
  }

  saveNewService(form: FormGroup) {
    this.issubmitted = true;
    if (form.valid && !this.is_fileSizeExceed) {
      this.orderService.postNewService(form.value).subscribe((info) => {
        this.loaderServcie.growlMessage.next({severity:'success', summary:'Payment deducted from your wallet!!!'});
        console.log('yakko info',info);
        this._location.back();
      }, (error) => {
        this.checkForErrors(error, this.myNewServiceForm);
      });
    }
    //console.log(form.value);
  }

  /**
   * This method is called once your drop or select files
   * You can validate and decline or accept file
   *
   * @param file
   * @returns Boolean
   */
  beforeAddFile(file) {
    let fileExt: string = file.name.substring(file.name.toLowerCase().lastIndexOf('.') + 1);
    if (fileExt == 'pdf' || fileExt == 'doc' || fileExt == 'docx') {
      return true;
    }
    return false;
  }

  FilesUpdated(files) {
    const sampleAttachment = this.myNewServiceForm.controls['sample_attachments'] as FormArray;
    sampleAttachment.controls = [];//.setValue([]);

    this.is_fileSizeExceed = false;
    if (files && files.length > 0) {
      this.currentSize = files.map(a => a.size).reduce((sum, current) => sum + current);
      this.is_fileSizeExceed = ((this.currentSize) > 6000000);

      const internalfiles: File[] = files;//files.reverse();

      internalfiles.forEach((file, index, arr) => {
        const fileReader: FileReader = new FileReader();
        const self = this;
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
        fileReader.addEventListener('loadend', function (loadEvent: any) {
          const attachment = self.fb.group({
            document: [loadEvent.target.result],
            document_name: [file.name],
            size: [file.size],
            ext: [fileType]
          });
          self.sampleAttForm.push(attachment);
        });
        fileReader.readAsDataURL(file);
      });
    }
  }

  resetForm() {
    this.myNewServiceForm.reset();
    this.setFormData();
  }

  checkForErrors(errorMsg, form?: FormGroup) {
    let newErr = {};
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr) : console.log(err);
      //: form.controls['common'].setErrors(newErr);        
    });
  }

  rateSlabPopUp(id: number) {
    const modalRef = this.modalService.open(RateSlabComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel'
    });
    modalRef.componentInstance.id = id;
  }

  getBreakUpPopUp() {
    const modalRef = this.modalService.open(BreakUpComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel'
    });
    modalRef.componentInstance.rateSlabModel = this.rateSlabModel;
  }

}
