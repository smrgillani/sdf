import { Directive, OnInit, OnDestroy, ElementRef, ComponentRef, ChangeDetectorRef, NgZone, Renderer2 } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverWindow } from '@ng-bootstrap/ng-bootstrap/popover/popover';

@Directive({
  selector: '[appPopoverCloseOuterClick][ngbPopover]'
})
export class AppPopoverCloseOuterClickDirective implements OnInit, OnDestroy {

  listener: () => void;

  constructor(private elementRef: ElementRef, private ngbPopover: NgbPopover,
              private ngZone: NgZone, private cd: ChangeDetectorRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.listener = this.renderer.listen('document', 'click', (event) => {
        this.closePopoverOnClickOutside(event);
      });
    });
  }

  ngOnDestroy() {
    this.listener();
  }

  private closePopoverOnClickOutside(event: MouseEvent): void {
    // Popover is open
    if (this.ngbPopover && this.ngbPopover.isOpen()) {
      // Not clicked on self element
      if (!this.elementRef.nativeElement.contains(event.target)) {
        // Hacking typescript to access private member
        const popoverWindowRef: ComponentRef<NgbPopoverWindow> = (this.ngbPopover as any)._windowRef;
        // If clicked outside popover window
        if (!popoverWindowRef.location.nativeElement.contains(event.target)) {
          this.ngbPopover.close();
          this.cd.detectChanges(); // detect changes
        }
      }
    }
  }

}
