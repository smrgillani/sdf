import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { AttachmentMessageModel } from 'app/collaboration/models';

@Component({
  selector: 'app-file-upload-source',
  templateUrl: './file-upload-source.component.html',
  styleUrls: ['./file-upload-source.component.scss'],
})
export class FileUploadSourceComponent implements OnInit {
  sourceText = '';
  dropZoneChartTemplate = this.getTemplate('Click here to upload file');
  private sourceAttachment: AttachmentMessageModel;

  @Input() private set errors(value: string[]) {
    const content = value && value.length ? `During upload following errors occurred: ${value.join(', ')}` : 'Click here to upload file';
    this.dropZoneChartTemplate = this.getTemplate(content);
  }
  @Output() private fileUploaded = new EventEmitter<AttachmentMessageModel>();

  ngOnInit() {
    this.sourceAttachment = new AttachmentMessageModel();
  }

  sourceFilesUpdated(files) {
    const file: File = files.reverse()[0];
    const fileReader: FileReader = new FileReader();
    const self = this;

    const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
    const filename = file.name;

    this.dropZoneChartTemplate = this.getTemplate('Uploading...');

    // set icon on basis of fileType
    fileReader.addEventListener('loadend', function (loadEvent: any) {
      self.sourceAttachment.file = loadEvent.target.result;
      self.sourceAttachment.msg = self.sourceText;
      self.sourceAttachment.type = fileType;
      self.sourceAttachment.title = filename;
      self.fileUploaded.emit(self.sourceAttachment);
    });

    fileReader.readAsDataURL(file);
  }

  private getTemplate(content) {
    return `<div class="file-droppa-document-image file-droppa-passport">${content}</div>`;
  }
}
