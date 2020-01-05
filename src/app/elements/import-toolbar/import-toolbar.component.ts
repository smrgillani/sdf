import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from 'environments/environment';

declare var Dropbox: any;
declare var FilePicker: any;
declare var gapi: any;

/**
 * Component for importing files from device/Dropbox/GoogleDrive
 */
@Component({
  selector: 'app-import-toolbar',
  templateUrl: './import-toolbar.component.html',
  styleUrls: ['./import-toolbar.component.scss'],
})
export class ImportToolbarComponent implements OnInit {
  @Input() accept = 'image/*';
  @Output() private fileChosen = new EventEmitter<File>();

  constructor(
    private http: Http,
  ) {}

  ngOnInit() {
    const self = this;

    // dropbox button configuration
    const options = {
      success: function (file) {
        const requestOptions = new RequestOptions({responseType: ResponseContentType.Blob});

        self.http.get(file[0].link, requestOptions)
          .map((response) => response.blob()).subscribe((data) => {
          self.fileChosen.emit(data as File);
        });
      },
      cancel: function () {},
      linkType: 'direct', // "preview" or "direct"
      multiselect: false, // true or false
      extensions: ['.png', '.jpg', '.jpeg', '.jfif', '.exif', '.bmp', '.ppm', '.pgm', '.pbm', '.pnm', '.tiff'],
    };

    const button = Dropbox.createChooseButton(options);
    document.getElementById('dropbox-container').appendChild(button);

    setTimeout(function () {
      // TODO: create Google account for Saffron application.
      const picker = new FilePicker({
        apiKey: environment.googleDriveApiKey,
        clientId: environment.googleProviderKey,
        buttonEl: document.getElementById('pick'),
        view: 'image', // for image set view as 'image'
        onSelect: function (file) {
          // http request was giving us the cors issue so using xmlHttpRequest to get the image.
          const accessToken = gapi.auth.getToken().access_token;
          const fileId = file.id;
          const xhr = new XMLHttpRequest();

          xhr.open('GET', 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media', true);
          xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
          xhr.responseType = 'blob';
          xhr.onload = function () {
            self.fileChosen.emit(xhr.response as File);
          };

          xhr.send();
        },
      });
    }, 3000);
  }

  getLocalFile(event) {
    if (event.target.files.length) {
      this.fileChosen.emit(event.target.files[0]);
    }
  }
}
