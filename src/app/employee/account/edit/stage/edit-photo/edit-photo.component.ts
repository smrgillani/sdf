import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { EmployeeBasicInfo } from 'app/employeeprofile/models/employee-basic-info';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
//import { SharedModule } from 'app/shared/shared.module';
import { Subscription } from "rxjs/Subscription";
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss'],
  //providers:[EmployeeBasicInfo]
})
export class EditPhotoComponent implements OnInit {

  data: any;
  cropperSettings: CropperSettings;
  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;

  basicinfo: EmployeeBasicInfo;
  serverUrlToAppend: string = '';

  constructor(
    private location: Location,
    private employeeStageStorageService: StageStorage,
  ) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.dynamicSizing = true;
    this.cropperSettings.croppedWidth = 116;
    this.cropperSettings.croppedHeight = 116;
    this.cropperSettings.rounded = true;
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.cropperDrawSettings.strokeWidth = 1;
    this.data = {};
    this.serverUrlToAppend = environment.server.replace('/api/v1', '');
  }

  ngOnInit() {
    this.employeeStageStorageService.getBasicInfo(true)
      .subscribe(
        (user) => {
          this.basicinfo = user;

          if (user && user.photo_crop) {
            const image: HTMLImageElement = new Image();
            image.src = user.photo_crop;
            const bounds = new Bounds(
              user.photo_bounds['x'],
              user.photo_bounds['y'],
              user.photo_bounds['width'],
              user.photo_bounds['height']
            );

            image.addEventListener('load', () => {
              this.cropper.setImage(image, bounds);
            });
          }
        }
      );
  }

  /**
   * Callback called after photo was cropped
   *
   * @param bounds - photo bounds after photo crop
   */
  cropped(bounds: Bounds) {
    const photoBounds = {
      x: bounds.left,
      y: bounds.top,
      width: bounds.width,
      height: bounds.height
    };

    this.basicinfo.photo_bounds = photoBounds;
    this.basicinfo.photo = this.data.original.src;
    this.basicinfo.photo_crop = this.data.image;
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event) {
    console.log('image change listener');
    console.log($event);
    this.cropper.setImage($event);
  }

  backToEdit() {
    this.employeeStageStorageService.setBasicInfo(this.basicinfo);
    this.employeeStageStorageService.saveNestedSession();
    this.location.back();
  }
}
