import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { DocumentExplorerItem } from '../DocumentExplorerItem';
import { FolderNavigation } from '../FolderNavigation';


/**
 * Folder navigation dropdown menu.
 * Use FolderNavigation service to get current context of the document explorer.
 *
 * Usage:
 *
 *  <nav>
 *    <app-folder-select></app-folder-select>
 *  </nav>
 */
@Component({
  selector: 'app-folder-select',
  templateUrl: './folder-select.component.html',
  styleUrls: ['./folder-select.component.scss'],
})
export class FolderSelectComponent implements OnInit {
  item: DocumentExplorerItem;
  path: DocumentExplorerItem[];

  constructor(
    private folderNavigation: FolderNavigation
  ) {
    this.path = [];
    this.item = null;
  }

  ngOnInit() {
    this.folderNavigation.opened.subscribe((item: DocumentExplorerItem) => {
      this.item = item;
      this.path = this.folderNavigation.getPath(item);
      this.folderNavigation.update.subscribe(() => {
        this.path = this.folderNavigation.getPath(item);
      });
    });
  }

  navigateTo(item: DocumentExplorerItem) {
    this.folderNavigation.open(item);
  }

  back() {
    if (this.path.length) {
      this.folderNavigation.open(_.last(this.path));
    }
  }
}
