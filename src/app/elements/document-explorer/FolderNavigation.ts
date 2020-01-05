import {EventEmitter, Injectable} from '@angular/core';
import * as _ from 'lodash';

import {DocumentExplorerItem} from './DocumentExplorerItem';


/**
 * Service for saving folder navigation state.
 */
@Injectable()
export class FolderNavigation {
  items: _.Dictionary<DocumentExplorerItem> = {};
  update: EventEmitter<void> = new EventEmitter();
  opened: EventEmitter<DocumentExplorerItem> = new EventEmitter();

  /**
   * Add new item to navigation hash table
   * @param item - navigation item
   */
  addItem(item: DocumentExplorerItem) {
    this.items[item.hash()] = item;
    this.update.emit();
  }

  /**
   * Build path to navigation item.
   * @param item - navigation item
   * @returns list of folder from root to parent
   */
  getPath(item: DocumentExplorerItem): DocumentExplorerItem[] {
    item = this.items[item.hash()];
    if (!item || !item.parent) {
      return [];
    }
    return this.getPath(item.parent).concat(item.parent);
  }

  /**
   * Navigate to the item
   * @param item - navigation item
   */
  open(item: DocumentExplorerItem) {
    item = this.items[item.hash()];
    if (item) {
      this.opened.emit(item);
      item.open.emit();
    }
  }
}
