import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

const availableColors = [
  {name: 'black', hex: '#000000'},
  {name: 'white', hex: '#ffffff'},
  {name: 'red', hex: '#FF0827'},
  {name: 'orange', hex: '#F5A623'},
  {name: 'yellow', hex: '#F8E71C'},
  {name: 'green', hex: '#7ED321'},
  {name: 'blue', hex: '#679BF9'},
  {name: 'dark-blue', hex: '#4342E6'},
  {name: 'transparent', hex: 'transparent'},
];


export enum DiagramSection {
  BORDER = 'border',
  FILL = 'fill',
  FONT = 'font',
  DELETE = 'delete',
}


/**
 * Toolbar component for editing fonts, colors and sizes on diagrams
 *
 * @input editedStyle - style object of editing element
 * @input toolbarPosition - x and y coordinates, where toolbar should be opened
 * @input tool - tool, that should be opened font|figure|color
 *
 * @output styleChanged - event, triggered when style changed
 */
@Component({
  selector: 'app-edit-drawing-toolbar',
  templateUrl: './edit-drawing-toolbar.component.html',
  styleUrls: [
    './edit-drawing-toolbar.component.scss',
  ],
})
export class EditDrawingToolbarComponent implements OnChanges {
  @Input() editingStyle: object;
  @Input() toolbarPosition: object;
  @Input() enabledSections: DiagramSection[];

  @Output() styleChanged: EventEmitter<object> = new EventEmitter();
  @Output() actionOccurred: EventEmitter<string> = new EventEmitter<string>();

  colors = availableColors;
  editingSize = false;
  isColorPickerEnabled = false;
  readonly sections = DiagramSection;
  private editedColor: string;

  ngOnChanges() {
    this.isColorPickerEnabled = false;
  }

  isSectionEnabled(section: DiagramSection) {
    return this.enabledSections.indexOf(section) >= 0;
  }

  deleteElement() {
    this.actionOccurred.emit('delete');
  }

  getSelectedColor(color) {
    this.editingStyle[this.editedColor] = color.hex;
    this.isColorPickerEnabled = false;
    this.styleChanged.emit(this.editingStyle);
  }

  openColorPicker(editedColor) {
    this.editedColor = editedColor;
    this.isColorPickerEnabled = true;
  }

  changeBorderStyle() {
    this.editingStyle['dashed'] = this.editingStyle['dashed'] === '0' ? '1' : '0';
    this.styleChanged.emit(this.editingStyle);
  }

  validateSize(event) {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }

  changeSize(event) {
    if (event.target.value === '') {
      this.editingStyle[event.target.name] = 1;
    }

    this.editingSize = !this.editingSize;
    this.styleChanged.emit(this.editingStyle);
  }

  editSize(elementId: string) {
    this.editingSize = !this.editingSize;
    setTimeout(function () {
      document.getElementById(elementId).focus();
    }, 100);
  }
}
