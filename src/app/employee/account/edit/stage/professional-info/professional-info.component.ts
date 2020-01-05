import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
import { EmployeeProfessionalInfo, ListingData, ResumeDetail, SelectItem } from 'app/employeeprofile/models/employee-professional-info';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/loader.service';
import { StageComponent } from '../stage.component';

@Component({
  selector: 'app-professional-info',
  templateUrl: './professional-info.component.html',
  styleUrls: ['./professional-info.component.scss'],
})
export class ProfessionalInfoComponent implements OnInit {
  dropZonePassportTemplate = '<div class="file-droppa-document-image file-droppa-passport"></div>';
  flagResume = false;
  professionalInfo = new EmployeeProfessionalInfo();
  arrayProfessionalInfo: EmployeeProfessionalInfo[] = [];
  highestQualificationList: SelectItem[];
  campusList: SelectItem[];
  programList: SelectItem[];
  complexForm: FormGroup;
  flagOtherUniversity = false;
  flagOtherCampus = false;
  flagToDate = false;
  flagFromDate = false;
  processing = false;
  filteredUniversityList: any[] = [];
  private universityList: ListingData[];
  private resumeDetail = new ResumeDetail();

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private stageStorage: StageStorage,
    private confirmationService: ConfirmationService,
    private loaderService: LoaderService,
    private stageC: StageComponent,
  ) {
    this.complexForm = fb.group({
      'id': [''],
      'tempId': [''],
      'highest_qualification': [],
      'programs': [],
      'campus': [],
      'other_campus': [''],
      'university': [],
      'other_university': [''],
      'from_date': ['', [Validators.required]],
      'to_date': ['', [Validators.required]],
      'present': [''],
    });
  }

  ngOnInit() {
    this.stageStorage.getResume().subscribe(
      (obj: ResumeDetail) => {
        if (obj.resume != null) {
          this.resumeDetail.file_name = obj.file_name;
          this.resumeDetail.resume = obj.resume;
          this.resumeDetail.uploaded = true;
          this.updateDropTemplate(obj.file_name);
        }
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      });

    this.stageStorage.getProfessionalInfo().subscribe(
      (obj: EmployeeProfessionalInfo[]) => {
        if (obj !== undefined && obj.length > 0) {
          this.arrayProfessionalInfo = obj;
        } else {
          this.arrayProfessionalInfo = [];
        }
        this.setValues();
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getHighestQualification().subscribe(
      (obj: ListingData[]) => {
        this.highestQualificationList = [];
        obj.forEach(e => {
          this.highestQualificationList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );

    this.stageStorage.getUniversityList().subscribe(
      (obj: ListingData[]) => {
        this.universityList = obj;
        // for (let index = 0; index < 20; index++) {
        //   this.filteredUniversityList.push(this.universityList[index]);
        // }
        // obj.forEach(e => {
        //   this.universityList.push({
        //     id: e.id, label: e.title, value: e.id
        //   });
        // });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );
  }

  private getCampusList(u_Id) {
    this.stageStorage.getCampusList(u_Id).subscribe(
      (obj: ListingData[]) => {
        this.campusList = [];
        obj.forEach(e => {
          this.campusList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );
  }

  private getProgramList(q_Id) {
    this.stageStorage.getProgramList(q_Id).subscribe(
      (obj: ListingData[]) => {
        this.programList = [];
        obj.forEach(e => {
          this.programList.push({
            id: e.id, label: e.title, value: e.id,
          });
        });
      },
      (errorMsg: any) => {
        console.log(errorMsg);
      },
    );
  }

  onHighestQualificationSelect(_Id) {
    this.professionalInfo.highest_qualification = _Id;
    this.professionalInfo.highest_qualification_name = this.highestQualificationList
      .filter(a => a.id === _Id).map(b => b.label)[0];
    this.getProgramList(this.professionalInfo.highest_qualification);
  }

  private onUniversitySelect(_Id) {
    const fieldName = this.universityList.filter(a => a.id === _Id).map(b => b.title)[0];

    if (fieldName.toLowerCase() === 'other' || fieldName.toLowerCase() === 'others') {
      this.flagOtherUniversity = true;
    } else {
      this.flagOtherUniversity = false;
      this.professionalInfo.university_name = fieldName;
      this.complexForm.controls['other_university'].setValue('');
    }

    this.professionalInfo.university = _Id;
    this.professionalInfo.university_name = fieldName;
    this.getCampusList(this.professionalInfo.university);
  }

  onCampusSelect(selectedId) {
    const otherId = this.campusList.filter(a => a.label.toLowerCase() === 'others' || a.label.toLowerCase() === 'other').map(b => b.id)[0];
    const index = selectedId.findIndex(a => a === otherId);

    if (index > -1) {
      this.flagOtherCampus = true;
    } else {
      this.flagOtherCampus = false;
      this.complexForm.controls['other_campus'].setValue('');
    }

    this.professionalInfo.campus = selectedId;
  }

  onProgramSelect(_Id) {
    this.professionalInfo.programs = _Id;
    const fieldName = this.programList.filter(a => a.id == _Id).map(b => b.label)[0];
    this.professionalInfo.programs_name = fieldName;
  }

  private setValues() {
    this.professionalInfo.university = this.professionalInfo.university !== undefined && this.professionalInfo.university !== null ? this.professionalInfo.university : null;
    const university = this.universityList ? this.universityList.filter(a => a.id === this.professionalInfo.university) : null;

    this.complexForm.setValue({
      'tempId': this.professionalInfo.tempId = (this.professionalInfo.tempId !== undefined && this.professionalInfo.tempId !== null) ? this.professionalInfo.tempId : this.getRandomInt(100, 200),
      'id': this.professionalInfo.id = (this.professionalInfo.id !== undefined && this.professionalInfo.id !== null) ? this.professionalInfo.id : -1,
      'highest_qualification': this.professionalInfo.highest_qualification = this.professionalInfo.highest_qualification !== undefined && this.professionalInfo.highest_qualification !== null ? this.professionalInfo.highest_qualification : null,
      'programs': this.professionalInfo.programs = this.professionalInfo.programs !== undefined && this.professionalInfo.programs !== null ? this.professionalInfo.programs : null,
      'from_date': this.professionalInfo.from_date = this.professionalInfo.from_date !== undefined && this.professionalInfo.from_date !== null ? moment(this.professionalInfo.from_date).toDate() : new Date(),
      'to_date': this.professionalInfo.to_date = this.professionalInfo.to_date !== undefined && this.professionalInfo.to_date !== null ? moment(this.professionalInfo.to_date).toDate() : new Date(),
      'university': (university && university.length > 0) ? university[0] : null,
      'other_university': this.professionalInfo.other_university = this.professionalInfo.other_university !== undefined && this.professionalInfo.other_university !== null ? this.professionalInfo.other_university : '',
      'campus': this.professionalInfo.campus = this.professionalInfo.campus !== undefined && this.professionalInfo.campus !== null ? this.professionalInfo.campus : [],
      'other_campus': this.professionalInfo.other_campus = this.professionalInfo.other_campus !== undefined && this.professionalInfo.other_campus !== null ? this.professionalInfo.other_campus : '',
      'present': this.professionalInfo.present,

    });
    if (this.professionalInfo.highest_qualification) {
      this.onHighestQualificationSelect(this.professionalInfo.highest_qualification);
      this.complexForm.controls['programs'].setValue(this.professionalInfo.programs = this.professionalInfo.programs !== undefined && this.professionalInfo.programs !== null ? this.professionalInfo.programs : null);
    }
    if (this.professionalInfo.university) {
      this.onUniversitySelect(this.professionalInfo.university);
      this.complexForm.controls['campus']
        .setValue(this.professionalInfo.campus = this.professionalInfo.campus !== undefined && this.professionalInfo.campus !== null ? this.professionalInfo.campus : []);
    }
  }

  private getValues(value) {
    if (value.highest_qualification != null) {
      this.professionalInfo.tempId = value.tempId;
      this.professionalInfo.id = value.id;
      this.professionalInfo.highest_qualification = value.highest_qualification;
      this.professionalInfo.programs = value.programs;
      this.professionalInfo.from_date = moment(value.from_date).toDate();
      this.professionalInfo.to_date = moment(value.to_date).toDate();
      this.professionalInfo.university = (value && value.university) ? value.university.id : null;
      this.professionalInfo.other_university = value.other_university;
      this.professionalInfo.campus = value.campus;
      this.professionalInfo.other_campus = value.other_campus;
      this.professionalInfo.present = value.present;
      this.professionalInfo.is_completed = true;

      if (this.flagOtherUniversity) {
        this.professionalInfo.university_name = value.other_university;
      }
    } else {
      this.professionalInfo = new EmployeeProfessionalInfo();
    }
  }

  submitEmploymentInfo(value: any) {
    if (this.stageC.getUserIdFromToken() !== this.stageStorage.employeeInfo.basicInfo.userprofile_id) {
      this.stageC.invalidToken();
      return;
    }
    this.processing = true;
    if (this.validateHighestQualification()) {
      this.complexForm.controls['highest_qualification'].setValidators(Validators.required);
      this.complexForm.controls['highest_qualification'].updateValueAndValidity();
    } else {
      this.complexForm.controls['highest_qualification'].setValidators(null);
      this.complexForm.controls['highest_qualification'].updateValueAndValidity();
    }

    if (this.complexForm.valid && !this.flagFromDate && !this.flagToDate) {
      this.getValues(value);

      if (this.professionalInfo.highest_qualification !== undefined) {
        const professionalInfoMain: any = Object.assign({}, this.professionalInfo);
        professionalInfoMain.from_date = moment(this.professionalInfo.from_date).format('YYYY-MM-DD');

        const fromYear = this.professionalInfo.from_date.getFullYear(); // = this.getYear(professionalInfoMain.from_date);

        if (this.professionalInfo.present) {
          professionalInfoMain.to_date = moment(new Date()).format('YYYY-MM-DD');
          professionalInfoMain.duration = fromYear.toString() + '-Present';
        } else {
          professionalInfoMain.to_date = moment(this.professionalInfo.to_date).format('YYYY-MM-DD');
          professionalInfoMain.duration = fromYear.toString() + '-' + this.professionalInfo.to_date.getFullYear().toString();
        }

        // if id not present in array then post else put
        const index = this.arrayProfessionalInfo
          .findIndex(a => a.id === this.professionalInfo.id && a.tempId === this.professionalInfo.tempId);

        if (index > -1) {
          this.arrayProfessionalInfo[index] = professionalInfoMain; // this.professionalInfo;
          this.professionalInfo = new EmployeeProfessionalInfo();
          this.resetForm();
        } else {
          this.arrayProfessionalInfo.push(professionalInfoMain);
          this.professionalInfo = new EmployeeProfessionalInfo();
          this.resetForm();
        }
      }
      // need to iterate on array and if id present then put else post
      this.stageStorage.postProfessionalInfo(this.arrayProfessionalInfo).subscribe((obj) => {
          this.stageStorage.setProfessionalInfoInfo(this.arrayProfessionalInfo);
          this.processing = false;
          this.router.navigate(['../employmentinfo'], {relativeTo: this.route});
        },
        (errorMsg: any) => {
          this.processing = false;
          console.log(errorMsg);
          this.arrayProfessionalInfo = [];
          this.checkForErrors(errorMsg);
        });
    } else {
      this.validateAllFormFields(this.complexForm);
      this.processing = false;
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({onlySelf: true});
    });
  }

  addMore(_val) {
    this.complexForm.controls['highest_qualification'].setValidators(Validators.required);
    this.complexForm.controls['highest_qualification'].updateValueAndValidity();

    if (this.complexForm.valid && !this.flagFromDate && !this.flagToDate) {
      this.getValues(_val);

      // check for employmentInfo !=undefine then only push
      if (this.professionalInfo.highest_qualification !== undefined) {
        const professionalInfoMain: any = Object.assign({}, this.professionalInfo);
        professionalInfoMain.from_date = moment(this.professionalInfo.from_date).format('YYYY-MM-DD');
        const fromYear = this.professionalInfo.from_date.getFullYear(); // = this.getYear(professionalInfoMain.from_date);

        if (this.professionalInfo.present) {
          professionalInfoMain.to_date = moment(new Date()).format('YYYY-MM-DD');
          professionalInfoMain.duration = fromYear.toString() + '-Present';
        } else {
          professionalInfoMain.to_date = moment(this.professionalInfo.to_date).format('YYYY-MM-DD');
          professionalInfoMain.duration = fromYear.toString() + '-' + this.professionalInfo.to_date.getFullYear().toString();
        }

        // if id not present in array then post else put
        const index = this.arrayProfessionalInfo
          .findIndex(a => a.id === this.professionalInfo.id && a.tempId === this.professionalInfo.tempId);

        if (index > -1) {
          this.arrayProfessionalInfo[index] = professionalInfoMain; // this.professionalInfo;
          this.professionalInfo = new EmployeeProfessionalInfo();
          this.resetForm();
        } else {
          this.arrayProfessionalInfo.push(professionalInfoMain);
          this.professionalInfo = new EmployeeProfessionalInfo();
          this.resetForm();
        }
      }
    } else {
      console.log('validation falied');
      this.validateAllFormFields(this.complexForm);
    }
  }

  private checkForErrors(errorMsg) {
    const newErr = {};

    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      this.complexForm.controls[err] ? this.complexForm.controls[err].setErrors(newErr)
        : this.complexForm.controls['common'].setErrors(newErr);

      console.log(this.complexForm.controls[err].errors[err]);
    });
  }

  resetForm() {
    this.professionalInfo = new EmployeeProfessionalInfo();
    this.complexForm.reset();
    this.complexForm.controls['id'].setValue(-1);
    this.complexForm.controls['tempId'].setValue(this.getRandomInt(100, 200));
    this.complexForm.controls['present'].setValue(false);
    this.complexForm.controls['from_date'].setValue(new Date());
    this.complexForm.controls['to_date'].setValue(new Date());
  }

  editEntry(data) {
    this.professionalInfo = data;
    this.setValues();
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  filesUpdated(files) {
    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
    this.resumeDetail.file_name = file.name;
    this.resumeDetail.uploaded = false;

    // set icon on basis of fileType
    fileReader.addEventListener('loadend', (loadEvent: any) => {
      this.resumeDetail.resume = loadEvent.target.result;
      this.updateDropTemplate(fileType);
    });

    fileReader.readAsDataURL(file);
  }

  private updateDropTemplate(f_type) {
    this.flagResume = true;
    this.dropZonePassportTemplate = `<div class="file-droppa-document-image file-droppa-passport has-file">
    <a class=${f_type}><i class="fa fa-file-text-o" aria-hidden="true"></i></a>
</div>`;
  }

  removeID() {
    this.resumeDetail = new ResumeDetail();
    this.uploadResume();
    this.dropZonePassportTemplate = '<div class="file-droppa-document-image file-droppa-passport"></div>';
    this.flagResume = !this.flagResume;
  }

  uploadResume() {
    this.stageStorage.putResume(this.resumeDetail).subscribe(
      (obj) => {
        this.loaderService.growlMessage.next({severity: 'success', summary: 'Resume update successful!!!'});
        this.resumeDetail.uploaded = true;
        console.log(obj);
      },
      (err: any) => {
        this.loaderService.growlMessage.next({severity: 'error', summary: 'Resume not updated!!!'});
        console.log(err);
      });
  }

  downloadResume() {
    window.location.replace(this.resumeDetail.resume);
  }

  onCheckedItemChanged(value: boolean, from) {
    const _today = new Date();

    if (moment(from.inputFieldValue).toDate() > _today) {
      this.flagFromDate = true;
    } else {
      this.flagFromDate = false;
      this.professionalInfo.present = value;
    }

    if (value) {
      this.complexForm.controls['to_date'].setValue(new Date());
    }
  }

  checkDateValidation(from, to) {
    this.flagToDate = moment(from.inputFieldValue).toDate() > moment(to.inputFieldValue).toDate();

    const _today = new Date();

    this.flagFromDate = moment(from.inputFieldValue).toDate() > _today;
  }

  private deleteRecord(rec) {
    if (rec.id !== -1) {
      this.stageStorage.deleteProfessional(rec).subscribe((obj) => {
          console.log(obj);
        },
        (errorMsg: any) => {
          console.log(errorMsg);
        });
    }

    // remove this rec from array
    const index = this.arrayProfessionalInfo.findIndex(a => a.id === rec.id && a.tempId === rec.tempId);
    this.arrayProfessionalInfo.splice(index, 1);
  }

  deleteEntry(rec) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      accept: () => {
        // Actual logic to perform a confirmation
        this.deleteRecord(rec);
      },
    });
  }

  validateHighestQualification(): boolean {
    return this.arrayProfessionalInfo === undefined || this.arrayProfessionalInfo.length === 0 || this.anyFieldSet();
  }

  private anyFieldSet(): boolean {
    return !!(
      this.complexForm.value.highest_qualification || this.complexForm.value.programs ||
      this.complexForm.value.university
    );
  }

  universityACBlur(ctrl) {
    const universityControl = this.complexForm.controls['university'];

    if (!universityControl.value || !universityControl.value.id) {
      ctrl.inputEL.nativeElement.value = '';
      universityControl.patchValue({'university': ''});
      universityControl.updateValueAndValidity();

      this.professionalInfo.university = null;
      this.professionalInfo.university_name = null;
      this.campusList = [];
    }
  }

  universityACSelect(event) {
    this.onUniversitySelect(event.id);
  }

  search(event) {
    this.filteredUniversityList = [];

    if (!this.universityList) {
      return;
    }

    const filteredData = this.universityList.filter(a => a.title.toLowerCase().includes(event.query.toLowerCase()));
    this.filteredUniversityList = filteredData.slice(0, 50);
  }
}
