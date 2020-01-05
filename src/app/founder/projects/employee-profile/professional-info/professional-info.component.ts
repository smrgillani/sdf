import { Component, OnInit, Input } from '@angular/core';
import 'rxjs/Rx'
import { StageStorage } from 'app/employeeprofile/stage-storage.service';
//import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-professional-info',
  templateUrl: './professional-info.component.html',
  styleUrls: ['./professional-info.component.scss']
})
export class ViewProfessionalInfoComponent implements OnInit {
  @Input() professionalInfo;
  @Input() resume;
  envPath: string;
  constructor(private employeeProfileService: StageStorage) { }

  ngOnInit() {

  }

  getResumeBasedOnId() {
    this.employeeProfileService.getResumeBasedOnId(this.resume.id).subscribe((obj) => {
      //this.downloadFile(obj);
      
      //this.openAttachment(obj._body);

      var link=document.createElement('a');
      // const contentDisposition = obj.headers.get('Content-Disposition') || '';
      // const matches = /filename=([^;]+)/ig.exec(contentDisposition);
      // const fileName = (matches[1] || 'untitled').trim();

      //var blob = new Blob([obj], { type: 'contentType;text/csv/pdf/jpg/doc/docx/xls/png;charset=utf-8' });
      //var blob = new Blob([atob(obj._body)], { type: 'contentType;text/csv/pdf/jpg/doc/docx/xls/png;charset=utf-8' });
      var blob = new Blob([obj._body], { type: 'contentType' });
      //var blob = new Blob([obj._body], { type: 'octet/stream' });
      //var blob = new Blob([obj._body], { type: 'text/csv/pdf/jpg/doc/docx/xls/png' });

      // var heard = obj.headers._headers;

      //link.href=window.URL.createObjectURL(obj);
      //link.href=window.URL.createObjectURL(blob);
      link.href = obj._body;//window.URL.createObjectURL(blob,obj._body);
      link.download = this.resume.file_name || "Resume.png";
      link.click();


      /*var blob = this.b64toBlob(obj._body, 'contentType');
      var blobUrl = URL.createObjectURL(blob);
      var link=document.createElement('a');
      link.href=window.URL.createObjectURL(blob,obj._body);
      link.download = this.resume.file_name || "Resume.png";
      link.click();*/
      
      //window.location = blobUrl;

      /** trying ifram using createElement */
      /*var link=document.createElement('iframe');
      var blob = new Blob([obj._body], { type: 'contentType;text/csv/pdf/jpg/doc/docx/xls/png;charset=utf-8' });
      link.src = obj._body;//.href=window.URL.createObjectURL(obj);
      */
    },
      (errorMsg: any) => {
        console.log(errorMsg);
      });
    //getResumeBasedOnId()
  }

  openAttachment(source:any) {
    var win = window.open();
    win.document.write('<iframe src="' + source + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')

  }

  downloadFile(data: Response){
    //var blob = new Blob([data], { type: 'text/csv/pdf/jpg/doc/docx/xls/png' });
    //var blob = new Blob([data], { type: "application/octet-stream"});
    //var blob = new Blob([data], { type: 'contentType'});
    var blob = new Blob([data], { type: (this.resume.file_name || "Resume.png").split('.')[1]});
    var url= window.URL.createObjectURL(blob);
    //var url= window.URL.createObjectURL(data);
    window.open(url);
  }

  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
  
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
  
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
  
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}
