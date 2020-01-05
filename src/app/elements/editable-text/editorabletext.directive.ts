import { Directive, ElementRef, AfterViewChecked, Input, HostListener,Renderer2  } from '@angular/core';

@Directive({
  selector: '[myEditorabletext]'
})
export class EditorabletextDirective {
  @Input() myEditorabletext: string;
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  @HostListener('click', ['$event']) onClick($event){
    console.log($event);
      console.info('clicked: ' + $event);
  }

  @HostListener('window:resize') 
  onResize() {
      this.editabltext(this.el.nativeElement, this.myEditorabletext);
  }
  ngAfterViewChecked() {
    // call our matchHeight function here later
    this.editabltext(this.el.nativeElement, this.myEditorabletext);

  }
  editabltext(parent: HTMLElement, className: string) {
    const children = parent.getElementsByClassName(className);
    const span = this.renderer.createElement('span');

    // const parentEle = this.el.nativeElement.parentNode;
    // const refChild = this.el.nativeElement


    // if (!children) return;
    // // step 1b: reset all children height
    // Array.from(children).forEach((x: HTMLElement) => {
    //   x.style.minHeight = 'initial';
    // });
    // //this.renderer.addClass(this.el.nativeElement, 'wild');

    // // step 2a: get all the child elements heights
    // const itemHeights = Array.from(children)
    //     .map(x => x.getBoundingClientRect().height);

    // // step 2b: find out the tallest
    // const maxHeight = itemHeights.reduce((prev, curr) => {
    //     return curr > prev ? curr : prev;
    // }, 0);

    // step 3: update all the child elements to the tallest height
    Array.from(children)
        .forEach((x: HTMLElement) => this.renderer.nextSibling(span));

        
  }
}