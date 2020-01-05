import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { WebCamComponent } from 'ack-angular-webcam';
import { CapturedInfo } from 'app/core/models/id-sign-up-model';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { SignupService } from 'app/auth/signup.service';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'app-id-login',
  templateUrl: './id-login.component.html',
  styleUrls: [
    '../login.component.scss',
    '../login.component.portrait.css',
    './id-login.component.scss']
})
export class IdLoginComponent implements OnInit {
  flagPassportID: boolean = false;
  webCamMissing: boolean = false;
  public webcam;
  private profile: UserProfileModel;
  selectedphoto: any;
  selectedphotoback: any;
  isStage: string = "faceVerification";
  isVerified: boolean = false;
  @Input() idmethod: string = 'passport';
  @Input() id_number: string;
  @Output() idstage: EventEmitter<any> = new EventEmitter<any>();
  makeImage: boolean = false;
  capturedImage: string = '';
  isVerifiedError: boolean = false;
  returnData: any;
  objKeyMessage: any;

  constructor(private signupService: SignupService, private loaderService: LoaderService) { 
    this.profile = new UserProfileModel();
  }

  ngOnInit() {
    console.log("this.idmethod" + this.idmethod);
  }

  onCamSuccess(photo) {
    this.webCamMissing = false;
  }

  onCamError(err) {
    this.webCamMissing = true;
  }

  makeWebCameraPhoto() {
    const that = this;
    this.webcam.getBase64()
      .then((base64) => {
        const image: HTMLImageElement = new Image();
        image.src = base64;
        this.capturedImage = base64;
        this.makeImage = true;

      })
      .catch(e => console.error(e));
  }

  deleteCameraPhoto() {
    //this.signUpInfo.capturedImage = "";
    this.capturedImage = '';

    this.makeImage = false;
  }

  savepic() {
    this.isStage = 'faceVerification';
    this.makeImage = false;
  }


  senddata(): void {
    //this.signUpInfo.capturedInfo.isStage = this.isStage = 'completeState';
    //this.idstage.emit(this.signUpInfo.capturedInfo);
    this.idstage.emit(this.returnData);
  }

  verifyFaceWithDocumentInfo(form) {
    this.signupService.verifyFaceWithDocumentInfo({id_number: this.id_number, candidateImages: this.capturedImage.split(',')[1], referenceImages: null}).subscribe((info) => {
      if(info.status !="Face analysis failed") {
        this.isVerified = true;
        this.isVerifiedError = false;
        this.returnData = info;
        this.returnData.capturedImage = this.capturedImage;
      }
      else {
        this.isVerifiedError = true;
        this.returnData = info;
        this.returnData.capturedImage = this.capturedImage;
      }
         /*console.log(info);
         this.isVerified = true;
         this.returnData = info;
         this.returnData.capturedImage = this.capturedImage;*/
    }, (errorMsg: any) => {
      console.log(errorMsg);
      this.checkForErrors(errorMsg, form);
    });
  }

  checkForErrors(errorMsg, form?) {
    let newErr = {};
    this.objKeyMessage = errorMsg;
    Object.keys(errorMsg).forEach((err) => {
      newErr[err] = true;
      form && form.controls[err] ? form.controls[err].setErrors(newErr)
        : form.controls['non_field_errors'].setErrors(newErr);
    });
  }

}
