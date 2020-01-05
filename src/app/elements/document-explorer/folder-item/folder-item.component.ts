import {Component, Input} from '@angular/core';
import {DocumentExplorerItem} from '../DocumentExplorerItem';


/**
 * Folder item (icon) for DocumentExplorerComponent.
 *
 * @input folder - navigation item.
 */
@Component({
  selector: 'app-folder-item',
  template: `
    <div class="folder-container">
      <div class="folder-item">
        <div class="title">{{folder.title}}</div>
      </div>
    </div>
  `,
  styles: [`
    .folder-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
    .folder-item {
      display: flex;
      align-items: flex-end;
      background: url('/assets/img/document-explorer/folder.svg') no-repeat center;
      height: 112px;
      width: 140px;
      padding: 12px 9px;
    }
    .title {
      color: #ffffff;
      font-size: 16px;
    }
  `]
})
export class FolderItemComponent {
  @Input() folder: DocumentExplorerItem;
}
