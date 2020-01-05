import {Directive, ElementRef, Input, OnInit, HostListener} from '@angular/core';

@Directive({ selector: '[appPopoverAutoPosition]' })
export class AppPopoverAutoPositionDirective implements  OnInit {
  constructor() {}
  @Input() popOverName;
  @Input() placement: {desktop: string, tablet: string, mobile: string};

  @HostListener('click') onMouseEnter() {
    this.setPopoverFloatPositionAndShowPopover(this.popOverName);
  }

  setPopoverFloatPositionAndShowPopover(popover) {
    if (window.innerWidth > 991) {
      popover.placement = this.placement.desktop;
    } else if (window.innerWidth <= 991 && window.innerWidth >= 600) {
      popover.placement = this.placement.tablet;
    } else {
      popover.placement = this.placement.mobile;
    }
  }

  ngOnInit() {

  }
}
