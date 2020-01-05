import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ViewContainerRef
} from '@angular/core';

import DocumentModel from 'app/core/models/DocumentModel';
import {DocumentExplorerItem} from 'app/elements/document-explorer/DocumentExplorerItem';

import {ChatParticipantsComponent} from './chat-participants/chat-participants.component';


export class DocumentItem extends DocumentExplorerItem {
  document: DocumentModel;

  get title(): string {
    return this.document.name;
  }

  get isFolder() {
    return false;
  }

  get resource(): {id} {
    return this.document as {id};
  }

  get type(): string {
    return this.document.doc_type;
  }

  get percentage(): number {
    return this.document.percentage;
  }

  constructor(document: DocumentModel) {
    super();
    this.document = document;
  }

  createToolbarComponent(
    container: ViewContainerRef,
    resolver: ComponentFactoryResolver
  ): ComponentRef<any> {
    const factory: ComponentFactory<any> = resolver.resolveComponentFactory(ChatParticipantsComponent);
    const component = container.createComponent(factory);
    component.instance.process = this.parent.resource;
    return component;
  }

  hash() {
    return `document:${this.document.id}`;
  }
}
