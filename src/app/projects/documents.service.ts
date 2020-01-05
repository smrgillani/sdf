import { Injectable } from '@angular/core';
import { RequestOptions, ResponseContentType, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';
import FormData from 'formdata-polyfill/formdata.min';
import { saveAs } from 'file-saver';

import { ApiService } from 'app/core/api/api.service';
import DocumentModel from 'app/core/models/DocumentModel';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/loader.service';

declare const require: any;
const mx = require('mxgraph')({
  mxImageBasePath: 'assets/img',
  mxBasePath: 'assets',
  mxLoadResources: false,
});


/**
 * Service for working with documents.
 */
@Injectable()
export class DocumentsService {
  constructor(
    private api: ApiService,
    private authHttp: AuthHttp,
    private http: HttpClient,
    private loaderService: LoaderService,
  ) {
  }

  /**
   * Get document object.
   * @param documentId
   * @returns observable of object with document name, extension and download path
   */
  get(documentId: number) {
    return this.api.get<DocumentModel>(`idea/task/documents/${documentId}`);
  }

  /**
   * Change document name
   * @param name - new name
   * @param documentId
   * @returns observable
   */
  rename(name: string, documentId: number) {
    return this.api.patch(`idea/task/documents/${documentId}`, {name: name});
  }

  /**
   * Change document name
   * @param name - new name
   * @param documentId
   * @returns observable
   */
  percentageChange(percentage: number, documentId: number) {
    return this.api.patch(`idea/task/documents/${documentId}`, {percentage: percentage});
  }

  /**
   * Delete document
   * @param documentId
   * @returns observable
   */
  delete(documentId: number) {
    return this.api.delete(`idea/task/documents/${documentId}`);
  }

  /**
   * Download document
   * @param url
   * @returns observable
   */
  getDocument(url: string) {
    const options = new RequestOptions({responseType: ResponseContentType.Blob});
    const path = url.replace('/api/v1/', '');
    return this.authHttp.get(`${environment.server}/${path}`, options)
      .map((response) => response.blob());
  }

  convertHtmlToDocx(html: string, filename: string): Observable<any> {
    const data = {
      'apikey': environment.cloudconvertKey,
      'inputformat': 'html',
      'outputformat': 'docx',
      'input': 'raw',
      'wait': true,
      'download': true,
      'file': html,
      'filename': `${filename}.html`,
    };
    const HTTPOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      'responseType': 'blob' as 'json',
    };
    return this.http.post<any>(environment.cloudconvertURL, data, HTTPOptions);
  }

  exportDocument(doc: any) {
    this.loaderService.loaderStatus.next(true);
    let subscription: any;
    const url = doc['document'];

    if (doc['ext'] === 'html') {
      subscription = this.getDocument(url)
        .subscribe((blob: Blob) => {
          const fileReader = new FileReader();
          fileReader.readAsText(blob);

          fileReader.onloadend = (event: ProgressEvent) => {
            let htmlString = event.target['result'];
            if (!htmlString.includes('DOCTYPE html')) {
              htmlString = '<!DOCTYPE html><html>'
                + '<head><meta charset="utf-8"><title></title></head>'
                + '<body>' + htmlString + '</body></html>';
            }
            const convSubscription = this.convertHtmlToDocx(htmlString, doc['name']).subscribe(
              data => {
                saveAs(data, `${doc['name']}.docx`);
                console.log(data);
                this.loaderService.loaderStatus.next(false);
                convSubscription.unsubscribe();
              },
              err => {
                console.log(err);
                this.loaderService.loaderStatus.next(false);
              },
            );
          };

        });

    } else if (doc['ext'] === 'png') {
      subscription = this.getDrawing(url)
        .subscribe((response: any) => {
            this.loaderService.loaderStatus.next(false);
            saveAs(response._body, `${doc['name']}.png`);
            subscription.unsubscribe();
          },
        );
    } else if (doc['ext'] === 'xml') {
      subscription = this.getDrawing(url)
        .subscribe((response: any) => {
            const container = document.createElement('div');
            const graph = new mx.mxGraph(container);
            const parent = graph.getDefaultParent();
            graph.getModel().beginUpdate();
            const xml = response._body;
            const xmlDoc = mx.mxUtils.parseXml(xml);
            const decoder = new mx.mxCodec(xmlDoc);
            const model = decoder.decode(xmlDoc.documentElement);
            const newMxCells = model.getRoot().getChildAt(0);

            graph.getModel().mergeChildren(newMxCells, parent, false);

            const v = graph.insertVertex(graph.getDefaultParent(), null, '', 0, 0, 0, 0);
            graph.removeCells([v]);

            graph.getModel().endUpdate();

            const svg = container.getElementsByTagName('svg')[0];

            // get svg source.
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);

            // add name spaces.
            if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
              source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
              source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            // add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            this.loaderService.loaderStatus.next(false);
            // convert svg source to URI data scheme.
            const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
            const fileDownload = document.createElement('a');
            document.body.appendChild(fileDownload);
            fileDownload.href = url;
            fileDownload.download = `${doc['name']}.svg`;
            fileDownload.click();
            document.body.removeChild(fileDownload);
            subscription.unsubscribe();
          },
        );
    } else {
      subscription = this.getDocument(url)
        .subscribe((blob: Blob) => {
            this.loaderService.loaderStatus.next(false);
            saveAs(blob, `${doc['name']}.${doc['ext']}`);
            subscription.unsubscribe();
          },
        );
    }
  }

  /**
   * Get Drawing
   * @param url
   * @returns observable
   */
  getDrawing(url: string) {
    return this.authHttp.get(`${environment.server}/${url}`)
      .map((response: Response) => response);
  }

  /**
   * Upload document
   * @param document - document body
   * @param documentId
   * @returns observable
   */
  saveDocument(document: FormData, documentId: number) {
    return this.api.patch(`idea/task/documents/${documentId}`, document._blob());
  }

  createDocument(data: FormData) {
    return this.api.post('idea/task/documents', data._blob());
  }

  uploadDocumentFromGoal(data: FormData) {
    return this.api.post('idea/goal/documents', data._blob());
  }

  createOCRDocument(file, handwriting: boolean, isWorkArea: boolean): Observable<any> {
    const data = JSON.stringify({
      image: file,
      handwriting: handwriting,
      workarea: isWorkArea,
    });
    return this.api.post(`ocr/read-image`, data);
  }
}
