
import { Directive,ElementRef,HostListener  } from '@angular/core';

@Directive({
  selector: '[textareahgt]'
})
export class TextareahgtDirective {

  constructor(private el: ElementRef) {
   // el.nativeElement.style.backgroundColor = 'yellow';
   // console.log('trigger');
   
   }
   ngAfterViewChecked() {
    // call our matchHeight function here later
    this.updateHeight(this.el.nativeElement);
  }

   updateHeight(parent: HTMLElement) {
    if(parent){
      parent.style.height = '0px';
      parent.style.height = (parent.scrollHeight + 5) + 'px';
    }
    }
    @HostListener('keyup') onMouseEnter() {
      this.updateHeight(this.el.nativeElement);
    }
   

}
