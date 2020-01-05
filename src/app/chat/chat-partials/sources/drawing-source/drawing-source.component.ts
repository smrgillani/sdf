import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AttachmentMessageModel } from '../../../../collaboration/models';
import { VdCanvasOptions } from '../../../../elements/vd-canvas/vd-canvas.component';
import { vdCanvasService } from '../../../../elements/vd-canvas/vd-canvas.service';

@Component({
  selector: 'app-drawing-source',
  templateUrl: './drawing-source.component.html',
  styleUrls: ['./drawing-source.component.scss'],
  viewProviders: [vdCanvasService],
})
export class DrawingSourceComponent implements OnInit {
  canvasOptions: VdCanvasOptions = {
    drawButtonEnabled: true,
    drawButtonClass: 'drawButtonClass',
    drawButtonText: 'Draw',
    clearButtonEnabled: true,
    clearButtonClass: 'clearButtonClass',
    clearButtonText: 'Clear',
    undoButtonText: 'Undo',
    undoButtonEnabled: true,
    redoButtonText: 'Redo',
    redoButtonEnabled: true,
    colorPickerEnabled: true,
    saveDataButtonEnabled: false,
    saveDataButtonText: 'Save',
    strokeColor: 'rgb(0,0,0)',
    shouldDownloadDrawing: false,
    canvasCurser: 'auto',
  };
  drawingAttachment: AttachmentMessageModel;

  @ViewChild('canvas') private canvas;

  @Output() private forceSave = new EventEmitter<AttachmentMessageModel>();

  ngOnInit(): void {
    this.drawingAttachment = new AttachmentMessageModel();
  }

  onForceSave() {
    this.forceSave.emit(this.drawingAttachment);
  }

  clearAttachment() {
    this.canvas.clearCanvas();
  }
}
