import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Bounds, CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Message } from 'primeng/primeng';
import { ProjectsService } from 'app/projects/projects.service';
import ProjectModel from 'app/projects/models/ProjectModel';

@Component({
  selector: 'app-project-photo',
  templateUrl: './project-photo.component.html',
  styleUrls: ['./project-photo.component.scss'],
})
export class ProjectPhotoComponent implements OnInit {
  data: any = {};
  cropperSettings: CropperSettings;
  profileErrors: object = {};
  msgs1: Message[] = [];
  private project = new ProjectModel();
  private ideaId: number;

  @ViewChild(ImageCropperComponent) private cropper: ImageCropperComponent;

  constructor(
    private location: Location,
    private projectsService: ProjectsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.cropperSettings = new CropperSettings();

    this.cropperSettings.dynamicSizing = true;
    this.cropperSettings.croppedWidth = 116;
    this.cropperSettings.croppedHeight = 116;
    this.cropperSettings.rounded = true;
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 1;

    this.ideaId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
  }

  ngOnInit() {
    this.getProject();
  }

  /**
   * Callback called after photo was cropped
   *
   * @param bounds - photo bounds after photo crop
   */
  cropped(bounds: Bounds) {
    this.project.photo_bounds = {
      x: bounds.left,
      y: bounds.top,
      width: bounds.width,
      height: bounds.height,
    };

    this.project.photo = this.data.original.src;
    this.project.photo_crop = this.data.image;
  }

  /**
   * Callback called after new photo was chosen
   */
  imageChangeListener($event) {
    this.cropper.setImage($event);
  }

  backToEdit() {
    this.location.back();
  }

  updateProjectPhoto() {
    this.projectsService.update({
      id: this.project.id,
      photo: this.project.photo, photo_bounds: this.project.photo_bounds,
      photo_crop: this.project.photo_crop,
    }).subscribe((obj) => {
      console.log(obj);
      this.location.back();
    }, (error) => {
      console.log(error);
      this.profileErrors = error;
    });
  }

  @HostListener('window:keyup', ['$event'])
  private onKeyUp(event: any) {
    const key = event.target.name;
    if (key && this.profileErrors.hasOwnProperty(key)) {
      delete (this.profileErrors[key]);
    }
  }

  private getProject() {
    this.projectsService.get(this.ideaId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
        if (project && project.photo_crop) {
          const image: HTMLImageElement = new Image();
          image.src = project.photo_crop;
          // work arround for now as user.photo is not working
          // using cropped imaged here on load, so setting x and y as 0
          const bounds = new Bounds(
            0, //   user.photo_bounds['x'],
            0, //   user.photo_bounds['y'],
            project.photo_bounds['width'],
            project.photo_bounds['height'],
          );
          image.addEventListener('load', () => {
            this.cropper.setImage(image, bounds);
          });
        }
      });
  }
}
