import {Component} from '@angular/core';


/**
 * Container for page header.
 *
 * Usage:
 *  <app-main-container>
 *    <div>Some page content</div>
 *  </app-main-container>
 *
 *  Inherited styles:
 *   - background
 *   - border-color (for inner container)
 *   - min-height
 */
@Component({
  selector: 'app-main-container',
  template: `
    <div class="main-container">
      <div class="main-container-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      display: table;
      width: 100%;
      background: inherit;
      padding: 0 30px 30px 30px;
      border-color: inherit;
      min-height: inherit;
    }
    .main-container-content {
      display: table-cell;
      border-width: 0 1px 1px 1px;
      border-style: solid;
      border-color: inherit;
      min-height: inherit;
    }
    @media (max-width: 500px) {
      .main-container {
        padding: 0 10px 15px 10px;
      }
      .main-container-content {
        border-width: 0;
      }
    }
  `]
})
export class MainContainerComponent {
}
