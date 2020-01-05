
export class PopoverPosition {
  popoverFloating: string;
  constructor(){}
  setPopoverFloatPositionAndShowPopover(popover, positionDesktop: string, positionTablet: string, positionMobile: string) {
    if (window.innerWidth > 991) {
      this.popoverFloating = positionDesktop;
    } else if (window.innerWidth <= 991 && window.innerWidth >= 500) {
      this.popoverFloating = positionTablet;
    } else {
      this.popoverFloating = positionMobile;
    }
    setTimeout(() => { popover.open(); }, 0);
  }
}
