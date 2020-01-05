import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import { OrderService } from 'app/founder/order-service/services/order.service';
import { RateSlabModel } from 'app/founder/order-service/models/rate-slab-model';
import { RateSlabComponent } from 'app/founder/order-service/rate-slab/rate-slab.component';
import { BreakUpComponent } from 'app/founder/order-service/break-up/break-up.component';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-updated-new-service',
  templateUrl: './updated-new-service.component.html',
  styleUrls: ['./updated-new-service.component.scss'],
})
export class UpdatedNewServiceComponent implements OnInit {
  subjectList: SelectItem[] = [];
  urgencyList: SelectItem[] = [];
  extensivenessList: SelectItem[] = [];
  myNewServiceForm: FormGroup;
  expertiseList: SelectItem[] = [
    {value: 'novice', label: 'Novice'},
    {value: 'intermediate', label: 'Intermediate'},
    {value: 'expert', label: 'Expert'},
  ];
  isSubmitted = false;
  dropZoneChartTemplate = '<div class="file-droppa-document-image file-droppa-passport"></div>';
  is_fileSizeExceed = false;
  errorObject: any;
  modalRef: NgbModalRef;
  extensivenessDescription: string;
  private rateSlabModel = new RateSlabModel();
  private currentSize = 0;
  private readonly projectId: number;
  noSufficientBalanceError = false;
  otherErrMsg:string;

  @ViewChild('popUpForServicePackage') popUpForServicePackage;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private loaderService: LoaderService,
    private _location: Location,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) {
    this.projectId = parseInt(route.snapshot.params['id']);
    const payable = fb.group({
      amount: [0],
      currency: [''],
    });

    this.myNewServiceForm = fb.group({
      id: [0],
      subject: ['', Validators.required],
      title: ['', Validators.required],
      work_summary: [''],
      special_instructions: [''],
      urgency: [0],
      expertise: ['expert'],
      extensiveness: [0],
      creator_amount: payable,
      rate_slab: [null, Validators.required],
      project: [this.projectId],
      sample_attachments: fb.array([]),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.myNewServiceForm.controls; }

  ngOnInit() {
    this.getSubjectList();
    this.getUrgencytList();
  }

  getExtensivenessBySubjectId(event) {
    this.getExtencivenessList(event.value);
  }

  getPayable() {
    const payable = this.f.creator_amount as FormGroup;
    this.orderService.getPayable(
      this.myNewServiceForm.controls['subject'].value,
      this.myNewServiceForm.controls['urgency'].value,
      this.myNewServiceForm.controls['expertise'].value,
      this.myNewServiceForm.controls['extensiveness'].value,
    ).subscribe((info) => {
      this.rateSlabModel = info;
      this.myNewServiceForm.controls['rate_slab'].setValue(info.id);
      payable.controls['amount'].setValue(info.total_amount.amount);
    }, (error) => {
      this.myNewServiceForm.controls['rate_slab'].setValue(0);
      payable.controls['amount'].setValue(0);
      this.rateSlabModel = new RateSlabModel();
      this.checkForErrors(error, this.myNewServiceForm);
    });
  }

  saveNewService(form: FormGroup) {
    this.isSubmitted = true;
    if (form.valid && !this.is_fileSizeExceed) {
      this.orderService.postNewService(form.value).subscribe((info) => {
        this.loaderService.growlMessage.next({severity: 'success', summary: 'Payment deducted from your wallet!!!'});
        this._location.back();
      }, (error) => {
        console.log('saveNewService error:', error);

        if (error != null && error[0] != null && error[0].indexOf('No sufficient balance') != -1) {
            this.noSufficientBalanceError = true;
            this.otherErrMsg = error[0];
        }

        this.checkForErrors(error, this.myNewServiceForm);
      });
    }
    // console.log(form.value);
  }

  /**
   * This method is called once your drop or select files
   * You can validate and decline or accept file
   *
   * @param file
   * @returns Boolean
   */
  beforeAddFile(file) {
    const fileExt: string = file.name.substring(file.name.toLowerCase().lastIndexOf('.') + 1);
    return !!fileExt;
  }

  filesUpdated(files) {
    const sampleAttachment = this.myNewServiceForm.controls['sample_attachments'] as FormArray;
    sampleAttachment.controls = []; // .setValue([]);

    this.is_fileSizeExceed = false;
    if (files && files.length > 0) {
      this.currentSize = files.map(a => a.size).reduce((sum, current) => sum + current);
      this.is_fileSizeExceed = ((this.currentSize) > 6000000);

      const internalfiles: File[] = files; // files.reverse();

      internalfiles.forEach((file, index, arr) => {
        const fileReader: FileReader = new FileReader();
        const self = this;
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
        fileReader.addEventListener('loadend', function (loadEvent: any) {
          const attachment = self.fb.group({
            document: [loadEvent.target.result],
            document_name: [file.name],
            size: [file.size],
            ext: [fileType],
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

  rateSlabPopUp(id: number) {
    const modalRef = this.modalService.open(RateSlabComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel',
    });
    modalRef.componentInstance.id = id;
  }

  getBreakUpPopUp() {
    const modalRef = this.modalService.open(BreakUpComponent, {
      size: 'lg',
      windowClass: 'appoitmentmodel',
    });
    modalRef.componentInstance.rateSlabModel = this.rateSlabModel;
  }

  getServicePackagePopUp() {
    this.orderService.getExtencivenessInfo(this.myNewServiceForm.controls['extensiveness'].value).subscribe((obj) => {
      this.modalRef = this.modalService.open(this.popUpForServicePackage, {
        windowClass: 'interviewmodel modal-dialog-centered',
      });
      this.extensivenessDescription = obj.description;
    });
  }

  private get sampleAttForm() {
    return this.myNewServiceForm.get('sample_attachments') as FormArray;
  }

  private setFormData() {
    this.myNewServiceForm.setValue({
      id: 0,
      subject: this.subjectList && this.subjectList.length > 0 ? this.subjectList[0].value : 0,
      title: '',
      work_summary: '',
      special_instructions: '',
      urgency: this.urgencyList && this.urgencyList.length > 0 ? this.urgencyList[10].value : 0,
      expertise: 'expert',
      extensiveness: this.extensivenessList && this.extensivenessList.length > 0 ? this.extensivenessList[0].value : 0,
      creator_amount: {
        amount: 0,
        currency: 'USD',
      },
      rate_slab: '',
      project: this.projectId,
      sample_attachments: [],
    });
  }

  private getSubjectList() {
    this.orderService.getSubjectListInfo().subscribe((infoList) => {
      infoList.forEach((element, index, array) => {
        this.subjectList.push({value: element.id, label: element.title});
        if (index === 0) {
          this.myNewServiceForm.controls['subject'].setValue(element.id);
        }
      });
      this.getExtencivenessList(this.subjectList[0].value);
    });
  }

  private getUrgencytList() {
    this.orderService.getUrgencytList().subscribe((infoList) => {
      infoList.forEach((element, index, array) => {
        this.urgencyList.push({value: element.id, label: element.title});
        if (index === 10) {
          this.myNewServiceForm.controls['urgency'].setValue(element.id);
        }
      });
    });
  }

  private getExtencivenessList(subject: number) {
    this.extensivenessList = [];
    this.orderService.getExtencivenessList(subject).subscribe((infoList) => {
      infoList.forEach((element, index) => {
        this.extensivenessList.push({value: element.id, label: element.title});
        if (index === 0) {
          this.myNewServiceForm.controls['extensiveness'].setValue(element.id);
        }
      });
      this.getPayable();
    });
  }

  private checkForErrors(errorMsg, form?: FormGroup) {
    const newErr = {};
    this.errorObject = {};
    this.errorObject = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;

      form && form.controls[err] ? form.controls[err].setErrors(newErr) : console.log(err);
      // : form.controls['common'].setErrors(newErr);
    });
  }
}
