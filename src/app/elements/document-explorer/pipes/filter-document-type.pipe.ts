import {Pipe, PipeTransform} from '@angular/core';

import {DocumentExplorerItem} from '../DocumentExplorerItem';


/**
 * Filter documents by type.
 *
 * Usage:
 *   {{documents | filterDocumentType:'spreadsheet'}}
 */
@Pipe({
  name: 'filterDocumentType'
})
export class FilterDocumentTypePipe implements PipeTransform {
  transform(documents: DocumentExplorerItem[], type: string) {
    if (type) {
      return documents.filter((doc) => doc.type === type);
    }
    return documents;
  }
}
