import { Component, OnInit, Input, AfterViewInit,AfterViewChecked, ElementRef, ViewChild, Renderer2, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HostListener } from "@angular/core";
import { RoleService } from 'app/core/role.service';
import Roles from 'app/core/models/Roles.enum';

@Component({
  selector: 'app-presentation-input',
  templateUrl: './presentation-input.component.html',
  styleUrls: ['./presentation-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PresentationInputComponent),
    multi: true
  }]
})

export class PresentationInputComponent implements OnInit, AfterViewInit, AfterViewChecked {
  screenHeight:any;
  screenWidth:any;
  @Input() readOnly: boolean = true;
  selectedTheme: string = 'beige';
  collapseSidebar:boolean=true;
  /**
   * Emitter that trigger after some generated data event interaction
   * @param forceSave
   */
  @Output() forceSave = new EventEmitter();

  @ViewChild('sliderElement') sliderElement: ElementRef;
  @ViewChild('sliderWrapElement') sliderWrapElement: ElementRef;
  showTextEditor: boolean = false;
  isBacker: boolean = true;
  content: any;
  internalContent: string;
  totalSectionCount: number = 1;
  currentPostionIndex: number = 0;
  zoomvalue:any;
  screenMainHeight:any;
  screenMainWidth:any;
  // { label: 'Default', value: 'default' },
  themeList = [
    { label: 'Night', value: 'night' },
    { label: 'Beige', value: 'beige' },
    { label: 'Sky', value: 'sky' }
  ]

  slideThumbnails:any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = this.sliderWrapElement.nativeElement.clientHeight;
    this.screenWidth = this.sliderWrapElement.nativeElement.clientWidth;
    if( this.screenHeight<this.screenWidth)
    {
    this.zoomvalue= (this.screenHeight / this.screenWidth)*1.5;
    }
    else{
      this.zoomvalue= (this.screenWidth / this.screenHeight)*1.5;
    }
}
  constructor(/*el: ElementRef,*/ private renderer: Renderer2,private roleService: RoleService) {
    //this.el = el;
    const role = this.roleService.getCurrentRole();
    // if(Roles.Backer != role){
      this.showTextEditor = true;
      this.isBacker = false;
    // }
  }

  ngOnInit() {

  }

  ngAfterViewChecked(){
    this.onResize();
    this.screenMainHeight = this.sliderWrapElement.nativeElement.clientHeight;
    this.screenMainWidth = this.sliderWrapElement.nativeElement.clientWidth;
  }

  ngAfterViewInit() {

  }

  onChange = (_) => { };
  onTouched = () => { };

  writeValue(currentValue: any) {
    if (currentValue) {
      this.sliderElement.nativeElement.innerHTML = currentValue;
      this.resetAllClassOfSection();
    }
    else {
      this.sliderElement.nativeElement.innerHTML = '';
      this.sliderElement.nativeElement.insertAdjacentHTML('beforeend',
        `<section class="present">
        <div class="kreator-slide-content">
          <p>Hi!</p>
          <p>Welcome to Presentation</p>
        </div>
      </section>
      `);
      //<input type="hidden" id="selectedTheme" class="theamClass" value="default">
      this.resetAllClassOfSection();
    }
  }

  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  collapseSideBar(){
    this.collapseSidebar=!this.collapseSidebar;
    this.onResize();
    if(this.showTextEditor){
      this.saveGeneratedFile();
    }
  }

  saveGeneratedFile() {
    this.content = this.sliderElement.nativeElement.innerHTML;
    this.onModelChange(this.content);
    this.createSidebar();
    //this.onChange(this.returnContentId.nativeElement.innerHTML);
    this.forceSave.emit();
  }

  toggleEditMode(){
    this.showTextEditor=!this.showTextEditor;
    if(this.showTextEditor){
      let d = document.querySelector('.present');
      this.internalContent = d.children[0].innerHTML;
    }
    else{
      this.internalContent = '';
      this.saveGeneratedFile();
    }
    this.onResize();
  }

  addNewSlide() {
    console.log(`add new slide`);
    const element = document.querySelector('.slides');
    let isAdded: boolean = false;
    const count = element.childElementCount;
    for (let index = 0; index < count; index++) {
      this.slideThumbnails = [];
      if (element.children[index].className == 'present') {
        if (isAdded) {
          break;
        }
        element.children[index].className = 'past';
        const newItem = document.createElement("section");

        const newSlideContentItem = document.createElement("div");
        newSlideContentItem.className = 'kreator-slide-content';

        const newItemnode = document.createElement("p");
        const newTextnode = document.createTextNode("Create Slide " + (count + 1));

        newItemnode.appendChild(newTextnode);
        newSlideContentItem.appendChild(newItemnode);

        newItem.className = 'present';
        newItem.appendChild(newSlideContentItem);

        element.insertBefore(newItem, element.children[index + 1]);

        const self = this;

        if(this.showTextEditor){
          let d = document.querySelector('.present');
          this.internalContent = d.children[0].innerHTML;
          // d.classList.add('hide-section');
        }

        self.totalSectionCount += 1;
        self.currentPostionIndex += 1;
        isAdded = true;
        self.saveGeneratedFile();
      }
    }
    //this.createSidebar();
  }

  deleteSlide() {
    const element = document.querySelector('.slides');
    let isDeleted: boolean = false;
    const count = element.childElementCount;
    for (let index = 0; index < count; index++) {
      if (element.children[index].className == 'present') {
        if (isDeleted) {
          break;
        }

        if (this.currentPostionIndex < (count - 1) || this.currentPostionIndex == 0) {
          this.sliderElement.nativeElement.children[index + 1].classList.remove("future");
          this.sliderElement.nativeElement.children[index + 1].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index + 1].classList.remove("past");
          this.sliderElement.nativeElement.children[index + 1].classList.add("present");
        }
        else {
          this.sliderElement.nativeElement.children[index - 1].classList.remove("future");
          this.sliderElement.nativeElement.children[index - 1].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index - 1].classList.remove("past");
          this.sliderElement.nativeElement.children[index - 1].classList.add("present");
          this.currentPostionIndex -= 1;
        }

        element.children[index].remove();
        this.totalSectionCount -= 1;
        this.saveGeneratedFile();
        isDeleted = true;
      }
    }
    //this.createSidebar();
  }

  changeContentDone() {
    this.showTextEditor = false;
    const d = document.querySelector('.present');
    d.classList.remove('hide-section');
    this.saveGeneratedFile();
  }

  onForceSave() {
    const d = document.querySelector('.present');
    d.children[0].innerHTML = this.internalContent;
  }

  slideLeft() {
    if (this.totalSectionCount > 1) {
      if (this.currentPostionIndex > 0) {
        this.currentPostionIndex -= 1
        this.changePastPresentFuture(true);
      }
    }
  }

  slideRight() {
    if (this.totalSectionCount > 1) {
      if (this.currentPostionIndex < (this.totalSectionCount - 1)) {
        this.currentPostionIndex += 1
        this.changePastPresentFuture(false);
      }
    }
  }

  changePastPresentFuture(isleft: boolean) {
    let element = document.querySelector('.slides');
    if (isleft) {
      element.children[this.currentPostionIndex + 1].className = 'future';
      element.children[this.currentPostionIndex].className = 'present';
    }
    else {
      element.children[this.currentPostionIndex - 1].className = 'past';
      element.children[this.currentPostionIndex].className = 'present';
    }
    if(this.showTextEditor){
      let d = document.querySelector('.present');
      this.internalContent = d.children[0].innerHTML;
      // d.classList.add('hide-section');
    }
  }

  moveOnSlideIndex(index:number){
    let element = document.querySelector('.slides');
    const elementCount: number = this.sliderElement.nativeElement.childElementCount;
    this.currentPostionIndex = index;
    for (let i = 0; i < elementCount; i++) {
      if (i == index) {
        this.sliderElement.nativeElement.children[i].classList.remove("future");
        this.sliderElement.nativeElement.children[i].classList.remove("hide-section");
        this.sliderElement.nativeElement.children[i].classList.remove("past");
        this.sliderElement.nativeElement.children[i].classList.add("present");
      }
      else if(i<index){
        this.sliderElement.nativeElement.children[i].classList.remove("present");
        this.sliderElement.nativeElement.children[i].classList.remove("hide-section");
        this.sliderElement.nativeElement.children[i].classList.remove("future");
        this.sliderElement.nativeElement.children[i].classList.add("past");
      }
      else {
        this.sliderElement.nativeElement.children[i].classList.remove("present");
        this.sliderElement.nativeElement.children[i].classList.remove("hide-section");
        this.sliderElement.nativeElement.children[i].classList.remove("past");
        this.sliderElement.nativeElement.children[i].classList.add("future");
      }
    }
    if(this.showTextEditor){
      let d = document.querySelector('.present');
      this.internalContent = d.children[0].innerHTML;
      // d.classList.add('hide-section');
    }
  }

  createSidebar(){
    const elementCount: number = this.sliderElement.nativeElement.childElementCount;
    this.slideThumbnails = [];
    for (let index = 0; index < elementCount; index++) {
      this.slideThumbnails.push(this.sliderElement.nativeElement.children[index].children[0].outerHTML);
    }
  }

  resetAllClassOfSection() {
    const elementCount: number = this.sliderElement.nativeElement.childElementCount;
    this.totalSectionCount = elementCount;
    if (this.sliderElement.nativeElement && elementCount > 0) {
      for (let index = 0; index < elementCount; index++) {
        if (index == 0) {
          this.sliderElement.nativeElement.children[index].classList.remove("future");
          this.sliderElement.nativeElement.children[index].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index].classList.remove("past");
          this.sliderElement.nativeElement.children[index].classList.add("present");
        }
        else {
          this.sliderElement.nativeElement.children[index].classList.remove("present");
          this.sliderElement.nativeElement.children[index].classList.remove("hide-section");
          this.sliderElement.nativeElement.children[index].classList.remove("past");
          this.sliderElement.nativeElement.children[index].classList.add("future");
        }
      }
      if(this.showTextEditor){
        let d = document.querySelector('.present');
        this.internalContent = d.children[0].innerHTML;
      }
    }
    // let element = document.querySelector('.themeClass') as HTMLInputElement;
    // this.selectedTheme = element.value;
    this.createSidebar();
  }

  onThemeChange(value) {
    let element = document.querySelector('.themeClass') as HTMLInputElement;
    element.value = value;
    this.saveGeneratedFile();
  }

  onEditorBlured(quill) {
    console.log('editor blur!');
    this.saveGeneratedFile();
  }

}
