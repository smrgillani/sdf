import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ViewContainerRef,
} from '@angular/core';

import TaskModel from 'app/core/models/TaskModel';
import { DocumentExplorerItem } from 'app/elements/document-explorer/DocumentExplorerItem';
import { DocumentTypeFilterComponent } from './document-type-filter/document-type-filter.component';


export class ProcessItem extends DocumentExplorerItem {
  protected process: TaskModel;
  documentTypeFilter: string;

  get title() {
    return this.process.title;
  }

  get isFolder() {
    return true;
  }

  get resource(): { id } {
    return this.process as { id };
  }

  constructor(process: TaskModel) {
    super();
    this.process = process;
    this.documentTypeFilter = '';
  }

  createToolbarComponent(
    container: ViewContainerRef,
    resolver: ComponentFactoryResolver,
  ): ComponentRef<any> {
    const factory: ComponentFactory<any> = resolver.resolveComponentFactory(DocumentTypeFilterComponent);
    const component = container.createComponent(factory);
    component.instance.change.subscribe((documentType) => {
      this.documentTypeFilter = documentType;
    });
    return component;
  }

  hash() {
    return `process:${this.process.id}`;
  }
}
