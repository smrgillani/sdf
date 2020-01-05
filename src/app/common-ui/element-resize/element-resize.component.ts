import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-element-resize',
  templateUrl: './element-resize.component.html',
  styleUrls: ['./element-resize.component.scss'],
})
export class ElementResizeComponent {
  isMouseDown = false;
  isTouch = false;
  moved = false;
  private initialOffset: number;
  private initialSize: number;

  @Input() externalSize: number;
  @Input() isVertical = false;
  @Output() resizeBegin = new EventEmitter<void>();
  @Output() resizeEnd = new EventEmitter<boolean>();
  @Output() private sizeChanged = new EventEmitter<number>();

  beginResize(event: MouseEvent) {
    this.initialOffset = this.isVertical ? event.pageY : event.pageX;
    this.isMouseDown = true;
    this.isTouch = false;
    this.moved = false;
    this.resizeBegin.emit();
  }

  beginResizeTouch() {
    this.isMouseDown = true;
    this.isTouch = true;
    this.moved = false;
    this.resizeBegin.emit();
  }

  resize(event: MouseEvent) {
    if (this.isMouseDown && !this.isTouch) {
      if (this.initialSize === undefined) {
        this.initialSize = this.externalSize;
      }

      this.moved = true;

      const eventSize = this.isVertical ? event.pageY : event.pageX;
      const diff = this.initialOffset - eventSize;

      this.sizeChanged.emit(this.initialSize + diff);
    }
  }

  resizeTouch(event: TouchEvent) {
    if (this.isMouseDown) {
      const touch = event.targetTouches[0];

      if (this.initialSize === undefined) {
        this.initialSize = this.externalSize;
      }

      if (!this.moved) {
        this.initialOffset = this.isVertical ? touch.pageY : touch.pageX;
      }

      this.moved = true;

      const eventSize = this.isVertical ? touch.pageY : touch.pageX;
      const diff = this.initialOffset - eventSize;

      this.sizeChanged.emit(this.initialSize + diff);
    }
  }

  endResize(emitMoved = true) {
    this.isMouseDown = false;
    this.isTouch = false;
    this.initialSize = undefined;
    this.initialOffset = undefined;

    if (emitMoved) {
      this.resizeEnd.emit(this.moved);
    } else {
      this.resizeEnd.emit();
    }
  }
}
