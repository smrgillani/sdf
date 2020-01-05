import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { ProfileEditSession } from '../edit/ProfileEditSession';

import { AccountService } from '../account.service';
import UserProfileModel from 'app/core/models/UserProfileModel';
import { Message } from 'primeng/primeng';


@Component({
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss'],
  providers: [
    UserProfileModel
  ]
})
export class EditAccountPhotoComponent implements OnInit {
  data: any;
  cropperSettings: CropperSettings;
  @ViewChild(ImageCropperComponent) cropper: ImageCropperComponent;

  msgs1: Message[] = [];

  constructor(
    private location: Location,
    private accountService: AccountService,
    private profileEditSession: ProfileEditSession,
    private user: UserProfileModel,
  ) {
    this.cropperSettings = new CropperSettings();

    this.cropperSettings.dynamicSizing = true;

    this.cropperSettings.croppedWidth = 116;
    this.cropperSettings.croppedHeight = 116;

    this.cropperSettings.rounded = true;
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.cropperDrawSettings.strokeWidth = 1;

    this.data = {};
  }

  ngOnInit() {
    this.profileEditSession.getUser(true)
      .subscribe(
        (user) => {
          this.user = user;
          if (user && user.photo_crop) {
            const image: HTMLImageElement = new Image();
            image.src = user.photo_crop;
            // work arround for now as user.photo is not working
            //using cropped imaged here on load, so setting x and y as 0
            const bounds = new Bounds(
              0, //   user.photo_bounds['x'],
              0, //   user.photo_bounds['y'],
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

    this.user.photo_bounds = photoBounds;
    this.user.photo = this.data.original.src;
    this.user.photo_crop = this.data.image;
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event) {
    this.cropper.setImage($event);
  }

  backToEdit() {
    this.profileEditSession.saveNestedSession();
    this.location.back();
  }
}
