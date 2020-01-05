import {Component} from '@angular/core';


/**
 * Container for page header.
 *
 * Usage:
 *  <app-header-container>
 *    <h1>Some Cool Title</h1>
 *    <div class="some-cool-toolbar">...</div>
 *  </app-header-container>
 *
 *  Inherited styles:
 *   - background
 *   - border-color (for inner container)
 *   - min-height
 */
@Component({
  selector: 'app-header-container',
  template: `
    <div class="header-container">
      <div class="header-container-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .header-container {
      display: table;
      width: 100%;
      background: inherit;
      padding: 30px 30px 0 30px;
      border-color: inherit;
      min-height: inherit;
    }
    .header-container-content {
      display: table-cell;
      border-width: 1px 1px 0 1px;
      border-style: solid;
      border-color: inherit;
      min-height: inherit;
    }
    @media (max-width: 500px) {
      .header-container {
        padding: 15px 10px 0 10px;
      }
      .header-container-content {
        border-width: 0px;
      }
    }
  `]
})
export class HeaderContainerComponent {
}
