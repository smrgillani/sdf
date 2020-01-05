import {Component, Input} from '@angular/core';


/**
 * Round button with double borders.
 *
 * @input color - button border and background color
 * @input icon - button icon
 */
@Component({
  selector: 'app-wheel',
  template: `
    <div class="wheel-tire"
         [style.border-color]="color">
      <div class="wheel-hub"
           [style.background-color]="color"
           [style.background-image]="'url(' + icon + ')'">
      </div>
    </div>
  `,
  styleUrls: ['./wheel.component.scss']
})
export class WheelComponent {
  @Input() color: string;
  @Input() icon: string;
}
