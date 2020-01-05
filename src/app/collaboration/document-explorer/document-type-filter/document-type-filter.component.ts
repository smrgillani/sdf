import {Component, EventEmitter, Output} from '@angular/core';


@Component({
  template: `
    <div class="document-type-filter">
      <label class="form-control-label">Filter by</label>
      <select [(ngModel)]="documentType"
              (ngModelChange)="change.emit($event)" class="form-control">
        <option value="">All Files</option>
        <option value="document">Text</option>
        <option value="drawing">Diagram</option>
        <option value="spreadsheet">Spreadsheet</option>
      </select>
    </div>
    <div class="filter-icon"></div>
  `,
  styles: [`
    .document-type-filter {
      display: flex;
      align-items: center;
      font-size: 18px;
    }
    .form-control-label {
      color: #4342E6;
      line-height: 22px;
      margin: 0;
      padding-right: 20px;
      white-space: nowrap;
    }
    select.form-control {
      color: #4342E6;
      font-weight: 600;
      border: none;
      border-bottom: 2px solid #4342E6;
      border-radius: 0;
    }
    .filter-icon {
      display: none;
    }
    @media only screen and (max-width: 992px) {
      .document-type-filter {
        display: none;
      }
      .filter-icon {
        height: 24px;
        width: 24px;
        background-image: url('/assets/img/document-explorer/filter.svg');
        background-position: center;
        background-repeat: no-repeat;
        display: block;
      }
    }
  `]
})
export class DocumentTypeFilterComponent {
  @Output() change: EventEmitter<string> = new EventEmitter();

  documentType = '';
}
