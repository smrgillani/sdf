import {
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  ViewContainerRef,
} from '@angular/core';


/**
 * Abstract navigation item for DocumentExplorerComponent.
 */
export abstract class DocumentExplorerItem {
  title: string;
  isFolder: boolean;
  resource: { id };
  parent?: DocumentExplorerItem;
  open: EventEmitter<void> = new EventEmitter();
  type: string;
  percentage: number;

  createToolbarComponent(
    container: ViewContainerRef,
    resolver: ComponentFactoryResolver,
  ): ComponentRef<any> {
    return null;
  }

  /**
   * Method 'hash' should be implemented to find item
   * in FolderNavigation hash table.
   *
   * Example:
   *
   *  hash() {
   *    return `some-hash-namespace:${this.resource.id}`;
   *  }
   */
  abstract hash(): string;
}
