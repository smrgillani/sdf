import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  forwardRef,
  Renderer2,
  OnInit,
  OnChanges, OnDestroy, AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { JwtHelper } from 'angular2-jwt';
import { vdCanvasUpdate, UPDATE_TYPE } from './vd-canvas-update.model';
import { vdCanvasService } from './vd-canvas.service';
import { Subscription } from 'rxjs/Subscription';
import { vdCanvasTextToolbarSettings } from './vd-canvas-text-toolbar.component';
import { WebSocketService } from 'app/common/services/webSocket.service';

interface EventPositionPoint {
  x: number;
  y: number;
}

export interface VdCanvasOptions {
  batchUpdateTimeoutDuration?: number;
  imageUrl?: string;
  aspectRatio?: number;
  strokeColor?: string;
  lineWidth?: number;
  drawButtonEnabled?: boolean;
  drawButtonClass?: string;
  drawButtonText?: string;
  clearButtonEnabled?: boolean;
  clearButtonClass?: string;
  clearButtonText?: string;
  undoButtonEnabled?: boolean;
  undoButtonClass?: string;
  undoButtonText?: string;
  redoButtonEnabled?: boolean;
  redoButtonClass?: string;
  redoButtonText?: string;
  saveDataButtonEnabled?: boolean;
  saveDataButtonClass?: string;
  saveDataButtonText?: string;
  colorPickerEnabled?: boolean;
  shouldDownloadDrawing?: boolean;
  startingColor?: string;
  canvasCurser: any;
}

@Component({
  selector: 'app-vd-canvas',
  templateUrl: './vd-canvas.component.html',
  styleUrls: ['./vd-canvas.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VdCanvasComponent),
      multi: true,
    },
  ],
})
export class VdCanvasComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {
  diagram: any;
  fontSize: string;
  fontFamily: string;
  enableCanvasText = false;
  canvasTextSettings: vdCanvasTextToolbarSettings;
  pencilActive = true;
  brushActive = false;
  enableEraser = false;
  eraserColor = '#ffffff';
  canvasCurser = document.createElement('canvas');
  @Input() viewOnly = false;
  @Input() isCollab = false;
  @Input() options: VdCanvasOptions;

  // Number of ms to wait before sending out the updates as an array
  @Input() batchUpdateTimeoutDuration = 100;

  @Input() imageUrl: string;
  @Input() aspectRatio: number;

  @Input() drawButtonClass: string;
  @Input() clearButtonClass: string;
  @Input() undoButtonClass: string;
  @Input() redoButtonClass: string;
  @Input() saveDataButtonClass: string;

  @Input() drawButtonText = '';
  @Input() clearButtonText = '';
  @Input() undoButtonText = '';
  @Input() redoButtonText = '';
  @Input() saveDataButtonText = '';

  @Input() drawButtonEnabled = true;
  @Input() clearButtonEnabled = true;
  @Input() undoButtonEnabled = false;
  @Input() redoButtonEnabled = false;
  @Input() saveDataButtonEnabled = false;

  @Input() shouldDownloadDrawing = true;

  @Input() colorPickerEnabled = false;

  @Input() lineWidth = 1;
  @Input() strokeColor = 'rgb(216, 184, 0)';

  @Input() startingColor = '#fff';

  @Output() onClear = new EventEmitter<any>();
  @Output() onUndo = new EventEmitter<any>();
  @Output() onRedo = new EventEmitter<any>();
  @Output() onBatchUpdate = new EventEmitter<vdCanvasUpdate[]>();
  @Output() onImageLoaded = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<string | Blob>();
  @Output() forceSave = new EventEmitter();

  @ViewChild('canvas') canvas: ElementRef;

  @Input() documentid: number;

  context: CanvasRenderingContext2D;

  private _imageElement: HTMLImageElement;

  private _shouldDraw = false;
  private _canDraw = true;

  private _clientDragging = false;

  private _lastUUID: string;
  private _lastPositionForUUID: Object = {};

  private _undoStack: string[] = []; // Stores the value of start and count for each continuous stroke
  private _redoStack: string[] = [];
  private _drawHistory: vdCanvasUpdate[] = [];
  private _batchUpdates: vdCanvasUpdate[] = [];
  private _updatesNotDrawn: any = [];

  private _updateTimeout: any;

  private _canvasServiceSubscriptions: Subscription[] = [];

  mouseEventPosition: EventPositionPoint;

  wsSubscription: Subscription;
  wsURLPath = '/task-document/';
  applyingChanges = false;
  jwtHelper: JwtHelper = new JwtHelper();

  userID: number;

  constructor(
    private _canvasService: vdCanvasService,
    private renderer: Renderer2,
    private ws: WebSocketService) {
  }

  /*
    Control value accessor interface application
  */
  writeValue(value: string) {
    this.diagram = value;
  }

  onChange = (_) => { };
  onTouched = () => { };

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Initialize the canvas drawing context. If we have an aspect ratio set up, the canvas will resize
   * according to the aspect ratio.
   */
  ngOnInit(): void {
    if (this.isCollab) {
      const jwt = localStorage.getItem('token');
      const jwtDetails = this.jwtHelper.decodeToken(jwt);
      this.userID = jwtDetails.user_id;
    }
    this._initInputsFromOptions(this.options);
    this._initCanvasEventListeners();
    this._initCanvasServiceObservables();
    this.context = this.canvas.nativeElement.getContext('2d');
    this._calculateCanvasWidthAndHeight();
    this._shouldDraw = !this.viewOnly;
    this.brushSizeUpdate();
  }

  /**
   * Recalculate the width and height of the canvas after the view has been fully initialized
   */
  ngAfterViewInit(): void {
    this._calculateCanvasWidthAndHeight();
    this._drawStartingColor();
  }

  /**
   * This method reads the options which are helpful since they can be really long when specified in HTML
   * This method is also called everytime the options object changes
   * For security reasons we must check each item on its own since if we iterate the keys
   * we may be injected with malicious values
   *
   * @param {VdCanvasOptions} options
   * @private
   */
  private _initInputsFromOptions(options: VdCanvasOptions) {
    if (options) {
      if (!this._isNullOrUndefined(options.batchUpdateTimeoutDuration)) {
        this.batchUpdateTimeoutDuration = options.batchUpdateTimeoutDuration;
      }
      if (!this._isNullOrUndefined(options.imageUrl)) {
        this.imageUrl = options.imageUrl;
        this._loadImage();
      }
      if (!this._isNullOrUndefined(options.aspectRatio)) {
        this.aspectRatio = options.aspectRatio;
      }
      if (!this._isNullOrUndefined(options.drawButtonClass)) {
        this.drawButtonClass = options.drawButtonClass;
      }
      if (!this._isNullOrUndefined(options.clearButtonClass)) {
        this.clearButtonClass = options.clearButtonClass;
      }
      if (!this._isNullOrUndefined(options.undoButtonClass)) {
        this.undoButtonClass = options.undoButtonClass;
      }
      if (!this._isNullOrUndefined(options.redoButtonClass)) {
        this.redoButtonClass = options.redoButtonClass;
      }
      if (!this._isNullOrUndefined(options.saveDataButtonClass)) {
        this.saveDataButtonClass = options.saveDataButtonClass;
      }
      if (!this._isNullOrUndefined(options.drawButtonText)) {
        this.drawButtonText = options.drawButtonText;
      }
      if (!this._isNullOrUndefined(options.clearButtonText)) {
        this.clearButtonText = options.clearButtonText;
      }
      if (!this._isNullOrUndefined(options.undoButtonText)) {
        this.undoButtonText = options.undoButtonText;
      }
      if (!this._isNullOrUndefined(options.redoButtonText)) {
        this.redoButtonText = options.redoButtonText;
      }
      if (!this._isNullOrUndefined(options.saveDataButtonText)) {
        this.saveDataButtonText = options.saveDataButtonText;
      }
      if (!this._isNullOrUndefined(options.drawButtonEnabled)) {
        this.drawButtonEnabled = options.drawButtonEnabled;
      }
      if (!this._isNullOrUndefined(options.clearButtonEnabled)) {
        this.clearButtonEnabled = options.clearButtonEnabled;
      }
      if (!this._isNullOrUndefined(options.undoButtonEnabled)) {
        this.undoButtonEnabled = options.undoButtonEnabled;
      }
      if (!this._isNullOrUndefined(options.redoButtonEnabled)) {
        this.redoButtonEnabled = options.redoButtonEnabled;
      }
      if (!this._isNullOrUndefined(options.saveDataButtonEnabled)) {
        this.saveDataButtonEnabled = options.saveDataButtonEnabled;
      }
      if (!this._isNullOrUndefined(options.colorPickerEnabled)) {
        this.colorPickerEnabled = options.colorPickerEnabled;
      }
      if (!this._isNullOrUndefined(options.lineWidth)) {
        this.lineWidth = options.lineWidth;
      }
      if (!this._isNullOrUndefined(options.strokeColor)) {
        this.strokeColor = options.strokeColor;
      }
      if (!this._isNullOrUndefined(options.shouldDownloadDrawing)) {
        this.shouldDownloadDrawing = options.shouldDownloadDrawing;
      }
      if (!this._isNullOrUndefined(options.startingColor)) {
        this.startingColor = options.startingColor;
      }
    }
  }

  private _isNullOrUndefined(property: any): boolean {
    return property === null || property === undefined;
  }

  /**
   * Init global window listeners like resize and keydown
   * @private
   */
  private _initCanvasEventListeners(): void {
    window.addEventListener('resize', this._redrawCanvasOnResize.bind(this), false);
    window.addEventListener('keydown', this._canvasKeyDown.bind(this), false);
  }

  /**
   * Subscribes to new signals in the canvas service and executes methods accordingly
   * Because of circular publishing and subscribing, the canvas methods do not use the service when
   * local actions are completed (Ex. clicking undo from the button inside this component)
   * @private
   */
  private _initCanvasServiceObservables(): void {
    this._canvasServiceSubscriptions.push(this._canvasService.canvasDrawSubject$
      .subscribe(updates => this.drawUpdates(updates)));
    this._canvasServiceSubscriptions.push(this._canvasService.canvasClearSubject$
      .subscribe(() => this.clearCanvas()));
    this._canvasServiceSubscriptions.push(this._canvasService.canvasUndoSubject$
      .subscribe(() => this.undo()));
    this._canvasServiceSubscriptions.push(this._canvasService.canvasRedoSubject$
      .subscribe(() => this.redo()));
  }

  /**
   * Calculate the canvas width and height from it's parent container width and height (use aspect ratio if needed)
   * @private
   */
  private _calculateCanvasWidthAndHeight(): void {
    this.context.canvas.width = this.canvas.nativeElement.parentNode.clientWidth;
    if (this.aspectRatio) {
      this.context.canvas.height = this.canvas.nativeElement.parentNode.clientWidth * this.aspectRatio;
    } else {
      this.context.canvas.height = this.canvas.nativeElement.parentNode.clientHeight;
    }
  }

  /**
   * If an image exists and it's url changes, we need to redraw the new image on the canvas.
   */
  ngOnChanges(changes: any): void {
    if (changes.imageUrl && changes.imageUrl.currentValue !== changes.imageUrl.previousValue) {
      if (changes.imageUrl.currentValue != null) {
        this._loadImage();
      } else {
        this._canDraw = false;
        this._redrawBackground();
      }
    }

    if (changes.options && changes.options.currentValue !== changes.options.previousValue) {
      this._initInputsFromOptions(changes.options.currentValue);
    }

    if (this.isCollab && changes.documentid && changes.documentid.currentValue !== changes.documentid.previousValue) {
      console.log('yakko from onchanges', changes.documentid.currentValue);
      this.updateSocketConnection(changes.documentid.currentValue);
    }
  }

  updateSocketConnection(docId) {
    if (docId) {
      this.wsSubscription = this.ws.connect(`${this.wsURLPath}${docId}`).subscribe((msg) => {
        this.applyingChanges = true;
        const content = JSON.parse(msg.data);
        console.log('content', content);
        const messageType = content['message_type'];
        const message = content['message'];

        if (messageType === 'document_edit') {
          const user = message['user'];
          const dd = JSON.parse(message['delta']);

          if (user !== this.userID) {
            const update = new vdCanvasUpdate(dd['_x'], dd['_y'], dd['_type'], dd['_strokeColor'], dd['_uuid'], dd['_visible']);
            this.updateCanvas(update);
          }
        } else if (messageType === 'new_active_user' || messageType === 'active_user') {
          if (message['user'] !== this.userID) {
            this.ws.updateActiveParticipants(message['user'], 'add');
          }
        } else if (messageType === 'inactive_user') {
          if (message['user'] !== this.userID) {
            this.ws.updateActiveParticipants(message['user'], 'remove');
          }
        }
        // console.log('yakko message', msg);
        // let message = JSON.parse(msg.data)['message'];
        // let who = JSON.parse(message)['who'];
        // let dd = JSON.parse(JSON.parse(message)['delta']);
        // console.log('yakko parsed message', message, who, this.rndID, dd);
        // // console.log('yakko parsed message json', JSON.parse(dd));

        // if (who != this.rndID) {
        //     //update canvas
        //     let update = new vdCanvasUpdate(dd['_x'], dd['_y'], dd['_type'], dd['_strokeColor'], dd['_uuid'], dd['_visible']);
        //     console.log('yakko got the update',dd['_x'],dd._x,update);
        //     this.updateCanvas(update);
        // }
        this.applyingChanges = false;
      });
    }
  }

  /**
   * Load an image and draw it on the canvas (if an image exists)
   * @constructor
   * @param callbackFn A function that is called after the image loading is finished
   * @return Emits a value when the image has been loaded.
   */
  private _loadImage(callbackFn?: any): void {
    this._canDraw = false;
    this._imageElement = new Image();
    this._imageElement.addEventListener('load', () => {
      this.context.save();
      this._drawImage(this.context, this._imageElement, 0, 0, this.context.canvas.width, this.context.canvas.height, 0.5, 0.5);
      this.context.restore();
      this._drawMissingUpdates();
      this._canDraw = true;
      if (callbackFn) {
        callbackFn();
      }
      this.onImageLoaded.emit(true);
    });
    this._imageElement.src = this.imageUrl;
    this.diagram = this.imageUrl;
    this.onChange(this.diagram);
  }

  /**
   * Sends a notification after clearing the canvas
   * This method should only be called from the clear button in this component since it will emit an clear event
   * If the client calls this method he may create a circular clear action which may cause danger.
   */
  clearCanvasLocal(): void {
    this.clearCanvas();
    this.onClear.emit(true);
  }

  /**
   * Clears all content on the canvas.
   */
  clearCanvas(): void {
    this._removeCanvasData();
    this._redoStack = [];
  }

  /**
   * This method resets the state of the canvas and redraws it.
   * It calls a callback function after redrawing
   * @param callbackFn
   * @private
   */
  private _removeCanvasData(callbackFn?: any): void {
    this._clientDragging = false;
    this._drawHistory = [];
    this._undoStack = [];
    this._redrawBackground(callbackFn);
  }

  /**
   * Clears the canvas and redraws the image if the url exists.
   * @param callbackFn A function that is called after the background is redrawn
   * @return Emits a value when the clearing is finished
   */
  private _redrawBackground(callbackFn?: any): void {
    if (this.context) {
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this._drawStartingColor();
      if (this.imageUrl) {
        this._loadImage(callbackFn);
      } else {
        if (callbackFn) {
          callbackFn();
        }
      }
    }
  }

  private _drawStartingColor() {
    this.context.fillStyle = this.startingColor;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  /**
   * Returns a value of whether the user clicked the draw button on the canvas.
   */
  getShouldDraw(): boolean {
    return this._shouldDraw;
  }

  /**
   * Toggles drawing on the canvas. It is called via the draw button on the canvas.
   */
  toggleShouldDraw(): void {
    if (this.pencilActive) {
      this._shouldDraw = !this._shouldDraw;
    } else {
      this._shouldDraw = true;
    }
    this.pencilActive = true;
    this.brushActive = false;
    this.enableEraser = false;
    this.lineWidth = 1;
    this.brushSizeUpdate();

  }

  toggleShouldDrawbrush(): void {
    if (this.brushActive && !this.enableEraser) {
      this._shouldDraw = !this._shouldDraw;
    } else {
      this._shouldDraw = true;
    }
    this.pencilActive = false;
    this.brushActive = true;
    this.enableEraser = false;
    if (this.lineWidth < 2) {
      this.lineWidth = 2;
    }
  }

  toggleShouldErase(): void {
    if (this.enableEraser) {
      this._shouldDraw = !this._shouldDraw;
    } else {
      this._shouldDraw = true;
    }
    this.pencilActive = false;
    this.brushActive = true;
    this.enableEraser = !this.enableEraser;
    //     this.context.canvas.style.cursor="url(/assets/img/loupe.png), auto";
    if (this.lineWidth < 2) {
      this.lineWidth = 2;
    }


  }

  brushSizeUpdate(): void {
    if (this.pencilActive === true && this._shouldDraw) {
      this.context.canvas.style.cursor = 'url(./assets/img/pencil_curser.png) 0 18, auto';
    } else {
      this.canvasCurser.width = this.canvasCurser.height = this.lineWidth;
      const ctx = this.canvasCurser.getContext('2d');

      ctx.beginPath();
      ctx.arc(this.canvasCurser.width / 2, this.canvasCurser.width / 2, this.canvasCurser.width / 2, 0, 2 * Math.PI);
      ctx.stroke();

      this.context.canvas.style
        .cursor = `url(${this.canvasCurser.toDataURL()}) ${this.canvasCurser.height / 2} ${this.canvasCurser.height / 2}, auto`;
    }
  }

  /**
   * Set if drawing is enabled from the client using the canvas
   * @param {boolean} shouldDraw
   */
  setShouldDraw(shouldDraw: boolean): void {
    this._shouldDraw = shouldDraw;
  }

  /**
   * Replaces the drawing color with a new color
   * The format should be ("#ffffff" or "rgb(r,g,b,a?)")
   * This method is public so that anyone can access the canvas and change the stroke color
   *
   * @param {string} newStrokeColor The new stroke color
   */
  changeColor(newStrokeColor: string): void {
    this.strokeColor = newStrokeColor;
  }

  /**
   * This method is invoked by the undo button on the canvas screen
   * It calls the global undo method and emits a notification after undoing.
   * This method should only be called from the undo button in this component since it will emit an undo event
   * If the client calls this method he may create a circular undo action which may cause danger.
   */
  undoLocal(): void {
    this.undo();
    this.onUndo.emit();
  }

  /**
   * This methods selects the last uuid prepares it for undoing (making the whole update sequence invisible)
   * This method can be called if the canvas component is a ViewChild of some other component.
   * This method will work even if the undo button has been disabled
   */
  undo(): void {
    if (!this._undoStack.length) {
      return;
    }

    const updateUUID = this._undoStack.pop();
    this._undoCanvas(updateUUID);
  }

  /**
   * This method takes an UUID for an update, and redraws the canvas by making all updates with that uuid invisible
   * @param {string} updateUUID
   * @private
   */
  private _undoCanvas(updateUUID: string): void {
    this._redoStack.push(updateUUID);

    this._drawHistory.forEach((update: vdCanvasUpdate) => {
      if (update.getUUID() === updateUUID) {
        update.setVisible(false);
      }
    });

    this._redrawHistory();
  }

  /**
   * This method is invoked by the redo button on the canvas screen
   * It calls the global redo method and emits a notification after redoing
   * This method should only be called from the redo button in this component since it will emit an redo event
   * If the client calls this method he may create a circular redo action which may cause danger.
   */
  redoLocal(): void {
    this.redo();
    this.onRedo.emit();
  }

  /**
   * This methods selects the last uuid prepares it for redoing (making the whole update sequence visible)
   * This method can be called if the canvas component is a ViewChild of some other component.
   * This method will work even if the redo button has been disabled
   */
  redo(): void {
    if (!this._redoStack.length) {
      return;
    }

    const updateUUID = this._redoStack.pop();
    this._redoCanvas(updateUUID);
  }

  /**
   * This method takes an UUID for an update, and redraws the canvas by making all updates with that uuid visible
   * @param {string} updateUUID
   * @private
   */
  private _redoCanvas(updateUUID: string): void {
    this._undoStack.push(updateUUID);

    this._drawHistory.forEach((update: vdCanvasUpdate) => {
      if (update.getUUID() === updateUUID) {
        update.setVisible(true);
      }
    });

    this._redrawHistory();
  }

  /**
   * Catches the Mouse and Touch events made on the canvas.
   * If drawing is disabled (If an image exists but it's not loaded, or the user did not click Draw),
   * this function does nothing.
   *
   * If a "mousedown | touchstart" event is triggered, dragging will be set to true and an vdCanvasUpdate object
   * of type "start" will be drawn and then sent as an update to all receiving ends.
   *
   * If a "mousemove | touchmove" event is triggered and the client is dragging, an vdCanvasUpdate object
   * of type "drag" will be drawn and then sent as an update to all receiving ends.
   *
   * If a "mouseup, mouseout | touchend, touchcancel" event is triggered, dragging will be set to false and
   * an vdCanvasUpdate object of type "stop" will be drawn and then sent as an update to all receiving ends.
   *
   */
  canvasUserEvents(event: MouseEvent): void {
    if ((!this._shouldDraw || !this._canDraw) && !this.enableCanvasText) {
      // Ignore all if we didn't click the _draw! button or the image did not load
      return;
    }

    if ((event.type === 'mousemove' || event.type === 'touchmove' || event.type === 'mouseout') && !this._clientDragging) {
      // Ignore mouse move Events if we're not dragging
      return;
    }

    if (event.target === this.canvas.nativeElement) {
      event.preventDefault();
    }

    let update: vdCanvasUpdate;
    let updateType: number;
    const eventPosition: EventPositionPoint = this._getCanvasEventPosition(event);
    this.mouseEventPosition = eventPosition;

    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        this._clientDragging = true;
        this._lastUUID = eventPosition.x + eventPosition.y + Math.random().toString(36);
        updateType = UPDATE_TYPE.start;
        break;
      case 'mousemove':
      case 'touchmove':
        if (!this._clientDragging) {
          return;
        }
        updateType = UPDATE_TYPE.drag;
        break;
      case 'touchcancel':
      case 'mouseup':
      case 'touchend':
      case 'mouseout':
        this._clientDragging = false;
        updateType = UPDATE_TYPE.stop;
        break;
    }

    if (this.enableCanvasText) {
      this.CreateInputText();
      return;
    }

    const color: string = this.enableEraser ? this.eraserColor : this.strokeColor;

    update = new vdCanvasUpdate(eventPosition.x, eventPosition.y, updateType, color, this._lastUUID, true);
    // console.log('yakko event',update);
    // let emitData = {'who':this.rndID,'delta': JSON.stringify(update)};
    if (this.isCollab && this.documentid) {
      const emitData = {
        command: 'edit',
        message: {'user': this.userID, 'delta': JSON.stringify(update)},
      };
      console.log('yakko emit data', emitData);
      this.ws.connect(`${this.wsURLPath}${this.documentid}`).next(JSON.stringify(emitData));
    }
    this.updateCanvas(update);
    this.forceSave.emit();
  }

  updateCanvas(update: vdCanvasUpdate) {
    // console.log('yakko update aa gaya', update);
    this._draw(update);
    this._prepareToSendUpdate(update, update.getX(), update.getY());
    this.diagram = this.generateCanvasDataUrl();
    this.onChange(this.diagram);
    this.onSave.emit(this.diagram);
  }

  /**
   * Get the coordinates (x,y) from a given event
   * If it is a touch event, get the touch positions
   * If we released the touch, the position will be placed in the changedTouches object
   * If it is not a touch event, use the original mouse event received
   * @param eventData
   * @return {EventPositionPoint}
   * @private
   */
  private _getCanvasEventPosition(eventData: any): EventPositionPoint {
    const canvasBoundingRect = this.context.canvas.getBoundingClientRect();

    let hasTouches = (eventData.touches && eventData.touches.length) ? eventData.touches[0] : null;
    if (!hasTouches) {
      hasTouches = (eventData.changedTouches && eventData.changedTouches.length) ? eventData.changedTouches[0] : null;
    }

    const event = hasTouches ? hasTouches : eventData;

    return {
      x: event.clientX - canvasBoundingRect.left,
      y: event.clientY - canvasBoundingRect.top,
    };
  }

  /**
   * The update coordinates on the canvas are mapped so that all receiving ends
   * can reverse the mapping and get the same position as the one that
   * was drawn on this update.
   *
   * @param {vdCanvasUpdate} update The vdCanvasUpdate object.
   * @param {number} eventX The offsetX that needs to be mapped
   * @param {number} eventY The offsetY that needs to be mapped
   */
  private _prepareToSendUpdate(update: vdCanvasUpdate, eventX: number, eventY: number): void {
    update.setX(eventX / this.context.canvas.width);
    update.setY(eventY / this.context.canvas.height);
    this._prepareUpdateForBatchDispatch(update);
  }


  /**
   * Catches the Key Up events made on the canvas.
   * If the ctrlKey or commandKey(macOS) was held and the keyCode is 90 (z), an undo action will be performed
   * If the ctrlKey or commandKey(macOS) was held and the keyCode is 89 (y), a redo action will be performed
   * If the ctrlKey or commandKey(macOS) was held and the keyCode is 83 (s) or 115(S), a save action will be performed
   *
   * @param event The event that occurred.
   */
  private _canvasKeyDown(event: any): void {
    if (event.ctrlKey || event.metaKey) {
      if (event.keyCode === 90 && this.undoButtonEnabled) {
        event.preventDefault();
        this.undo();
      }
      if (event.keyCode === 89 && this.redoButtonEnabled) {
        event.preventDefault();
        this.redo();
      }
      if (event.keyCode === 83 || event.keyCode === 115) {
        event.preventDefault();
        this.saveLocal();
      }
    }
  }

  /**
   * On window resize, recalculate the canvas dimensions and redraw the history
   * @private
   */
  private _redrawCanvasOnResize(): void {
    this._calculateCanvasWidthAndHeight();
    this._redrawHistory();
  }

  /**
   * Redraw the saved history after resetting the canvas state
   * @private
   */
  private _redrawHistory(): void {
    const updatesToDraw = [].concat(this._drawHistory);

    this._removeCanvasData(() => {
      updatesToDraw.forEach((update: vdCanvasUpdate) => {
        this._draw(update, true);
      });
    });

    // this.diagram = this.generateCanvasDataUrl();
    // this.onSave.emit(this.diagram);
  }

  /**
   * Draws an vdCanvasUpdate object on the canvas. if mappedCoordinates? is set, the coordinates
   * are first reverse mapped so that they can be drawn in the proper place. The update
   * is afterwards added to the undoStack so that it can be
   *
   * If the vdCanvasUpdate Type is "drag", the context is used to draw on the canvas.
   * This function saves the last X and Y coordinates that were drawn.
   *
   * @param {vdCanvasUpdate} update The update object.
   * @param {boolean} mappedCoordinates? The offsetX that needs to be mapped
   */
  private _draw(update: vdCanvasUpdate, mappedCoordinates?: boolean): void {
    this._drawHistory.push(update);

    const xToDraw = (mappedCoordinates) ? (update.getX() * this.context.canvas.width) : update.getX();
    const yToDraw = (mappedCoordinates) ? (update.getY() * this.context.canvas.height) : update.getY();

    if (update.getType() === UPDATE_TYPE.drag) {
      const lastPosition = this._lastPositionForUUID[update.getUUID()];

      this.context.save();
      this.context.beginPath();
      this.context.lineWidth = this.lineWidth;

      if (update.getVisible()) {
        this.context.strokeStyle = update.getStrokeColor() || this.strokeColor;
      } else {
        this.context.strokeStyle = 'rgba(0,0,0,0)';
      }
      this.context.lineJoin = 'round';

      this.context.moveTo(lastPosition.x, lastPosition.y);

      this.context.lineTo(xToDraw, yToDraw);
      this.context.closePath();
      this.context.stroke();
      this.context.restore();
    } else if (update.getType() === UPDATE_TYPE.stop && update.getVisible()) {
      this._undoStack.push(update.getUUID());
      delete this._lastPositionForUUID[update.getUUID()];
    }

    if (update.getType() === UPDATE_TYPE.start || update.getType() === UPDATE_TYPE.drag) {
      this._lastPositionForUUID[update.getUUID()] = {
        x: xToDraw,
        y: yToDraw,
      };
    }
  }

  /**
   * Sends the update to all receiving ends as an Event emit. This is done as a batch operation (meaning
   * multiple updates are sent at the same time). If this method is called, after 100 ms all updates
   * that were made at that time will be packed up together and sent to the receiver.
   *
   * @param {vdCanvasUpdate} update The update object.
   * @return Emits an Array of Updates when the batch.
   */
  private _prepareUpdateForBatchDispatch(update: vdCanvasUpdate): void {
    this._batchUpdates.push(update);
    if (!this._updateTimeout) {
      this._updateTimeout = setTimeout(() => {
        this.onBatchUpdate.emit(this._batchUpdates);
        this._batchUpdates = [];
        this._updateTimeout = null;
      }, this.batchUpdateTimeoutDuration);
    }
  };

  /**
   * Draws an Array of Updates on the canvas.
   *
   * @param {vdCanvasUpdate[]} updates The array with Updates.
   */
  drawUpdates(updates: vdCanvasUpdate[]): void {
    if (this._canDraw) {
      this._drawMissingUpdates();
      updates.forEach((update: vdCanvasUpdate) => {
        this._draw(update, true);
      });
    } else {
      this._updatesNotDrawn = this._updatesNotDrawn.concat(updates);
    }
  };

  /**
   * Draw any missing updates that were received before the image was loaded
   *
   */
  private _drawMissingUpdates(): void {
    if (this._updatesNotDrawn.length > 0) {
      const updatesToDraw = this._updatesNotDrawn;
      this._updatesNotDrawn = [];

      updatesToDraw.forEach((update: vdCanvasUpdate) => {
        this._draw(update, true);
      });
    }
  }

  /**
   * Draws an image on the canvas
   *
   * @param {CanvasRenderingContext2D} context The context used to draw the image on the canvas.
   * @param {HTMLImageElement} image The image to draw.
   * @param {number} x The X coordinate for the starting draw position.
   * @param {number} y The Y coordinate for the starting draw position.
   * @param {number} width The width of the image that will be drawn.
   * @param {number} height The height of the image that will be drawn.
   * @param {number} offsetX The offsetX if the image size is larger than the canvas (aspect Ratio)
   * @param {number} offsetY The offsetY if the image size is larger than the canvas (aspect Ratio)
   */
  private _drawImage(
    context: any, image: any, x: number, y: number, width: number, height: number, offsetX: number, offsetY: number,
  ): void {
    if (arguments.length === 2) {
      x = y = 0;
      width = context.canvas.width;
      height = context.canvas.height;
    }

    offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

    if (offsetX < 0) {
      offsetX = 0;
    }
    if (offsetY < 0) {
      offsetY = 0;
    }
    if (offsetX > 1) {
      offsetX = 1;
    }
    if (offsetY > 1) {
      offsetY = 1;
    }

    const imageWidth = image.width;
    const imageHeight = image.height;
    const radius = Math.min(width / imageWidth, height / imageHeight);
    let newWidth = imageWidth * radius;
    let newHeight = imageHeight * radius;
    let finalDrawX: any;
    let finalDrawY: any;
    let finalDrawWidth: any;
    let finalDrawHeight: any;
    let aspectRatio = 1;

    // decide which gap to fill
    if (newWidth < width) {
      aspectRatio = width / newWidth;
    }
    if (Math.abs(aspectRatio - 1) < 1e-14 && newHeight < height) {
      aspectRatio = height / newHeight;
    }
    newWidth *= aspectRatio;
    newHeight *= aspectRatio;

    // calculate source rectangle
    finalDrawWidth = imageWidth / (newWidth / width);
    finalDrawHeight = imageHeight / (newHeight / height);

    finalDrawX = (imageWidth - finalDrawWidth) * offsetX;
    finalDrawY = (imageHeight - finalDrawHeight) * offsetY;

    // make sure the source rectangle is valid
    if (finalDrawX < 0) {
      finalDrawX = 0;
    }
    if (finalDrawY < 0) {
      finalDrawY = 0;
    }
    if (finalDrawWidth > imageWidth) {
      finalDrawWidth = imageWidth;
    }
    if (finalDrawHeight > imageHeight) {
      finalDrawHeight = imageHeight;
    }

    // fill the image in destination rectangle
    context.drawImage(image, finalDrawX, finalDrawY, finalDrawWidth, finalDrawHeight, x, y, width, height);
  }

  /**
   * The HTMLCanvasElement.toDataURL() method returns a data URI containing a representation of the image in the format
   * specified by the type parameter (defaults to PNG).
   * The returned image is in a resolution of 96 dpi.
   * If the height or width of the canvas is 0, the string "data:," is returned.
   * If the requested type is not image/png, but the returned value starts with data:image/png, then the requested type
   * is not supported.
   * Chrome also supports the image/webp type.
   *
   * @param {string} returnedDataType A DOMString indicating the image format. The default format type is image/png.
   * @param {number} returnedDataQuality A Number between 0 and 1 indicating image quality if the requested type is
   * image/jpeg or image/webp.
   * If this argument is anything else, the default value for image quality is used. The default value is 0.92. Other
   * arguments are ignored.
   */
  generateCanvasDataUrl(returnedDataType: string = 'image/png', returnedDataQuality: number = 1): string {
    return this.context.canvas.toDataURL(returnedDataType, returnedDataQuality);
  }

  /**
   * Generate a Blob object representing the content drawn on the canvas.
   * This file may be cached on the disk or stored in memory at the discretion of the user agent.
   * If type is not specified, the image type is image/png. The created image is in a resolution of 96dpi.
   * The third argument is used with image/jpeg images to specify the quality of the output.
   *
   * @param callbackFn The function that should be executed when the blob is created. Should accept a parameter Blob
   * (for the result).
   * @param {string} returnedDataType A DOMString indicating the image format. The default type is image/png.
   * @param {number} returnedDataQuality A Number between 0 and 1 indicating image quality if the requested type is
   * image/jpeg or image/webp.
   * If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
   */
  generateCanvasBlob(callbackFn: any, returnedDataType: string = 'image/png', returnedDataQuality: number = 1): void {
    this.context.canvas.toBlob((blob: Blob) => {
      if (callbackFn) {
        callbackFn(blob, returnedDataType);
      }
    }, returnedDataType, returnedDataQuality);
  }

  /**
   * Generate a canvas image representation and download it locally
   * The name of the image is canvas_drawing_ + the current local Date and Time the image was created
   * Methods for standalone creation of the images in this method are left here for backwards compatibility
   *
   * @param {string} returnedDataType A DOMString indicating the image format. The default type is image/png.
   * @param {string | Blob} downloadData The created string or Blob (IE).
   */
  downloadCanvasImage(returnedDataType: string = 'image/png', downloadData?: string | Blob): void {
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', downloadData ? <string>downloadData : this.generateCanvasDataUrl(returnedDataType));
    downloadLink.setAttribute('download', 'canvas_drawing_' + new Date().valueOf() + this._generateDataTypeString(returnedDataType));
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // if (window.navigator.msSaveOrOpenBlob === undefined) {
    //       let downloadLink = document.createElement('a');
    //       downloadLink.setAttribute('href', downloadData ? <string>downloadData : this.generateCanvasDataUrl(returnedDataType));
    //       downloadLink.setAttribute('download', "canvas_drawing_" +
    //       new Date().valueOf() + this._generateDataTypeString(returnedDataType));
    //       document.body.appendChild(downloadLink);
    //       downloadLink.click();
    //       document.body.removeChild(downloadLink);
    //   } else {
    //       // IE-specific code
    //       if (downloadData) {
    //           this._saveCanvasBlob(<Blob>downloadData, returnedDataType);
    //       } else {
    //           this.generateCanvasBlob(this._saveCanvasBlob.bind(this), returnedDataType);
    //       }
    //   }
  }

  /**
   * Save the canvas blob (IE) locally
   * @param {Blob} blob
   * @param {string} returnedDataType
   * @private
   */
  private _saveCanvasBlob(blob: Blob, returnedDataType: string = 'image/png'): void {
    window.navigator.msSaveOrOpenBlob(blob, 'canvas_drawing_' + new Date().valueOf() + this._generateDataTypeString(returnedDataType));
  }

  /**
   * This method generates a canvas url string or a canvas blob with the presented data type
   * A callback function is then invoked since the blob creation must be done via a callback
   *
   * @param callback
   * @param {string} returnedDataType
   * @param returnedDataQuality
   */
  generateCanvasData(callback: any, returnedDataType: string = 'image/png', returnedDataQuality: number = 1): void {
    if (callback) {
      callback(this.generateCanvasDataUrl(returnedDataType, returnedDataQuality));
    }
    // if (window.navigator.msSaveOrOpenBlob === undefined) {
    //     callback && callback(this.generateCanvasDataUrl(returnedDataType, returnedDataQuality))
    // } else {
    //     this.generateCanvasBlob(callback, returnedDataType, returnedDataQuality);
    // }
  }

  /**
   * Local method to invoke saving of the canvas data when clicked on the canvas Save button
   * This method will emit the generated data with the specified Event Emitter
   *
   * @param {string} returnedDataType
   */
  saveLocal(returnedDataType: string = 'image/png'): void {
    this.generateCanvasData((generatedData: string | Blob) => {
      this.diagram = generatedData.toString();
      this.onChange(this.diagram);
      this.onSave.emit(generatedData);

      if (this.shouldDownloadDrawing) {
        this.downloadCanvasImage(returnedDataType, generatedData);
      }
    });
  }

  private _generateDataTypeString(returnedDataType: string): string {
    if (returnedDataType) {
      return '.' + returnedDataType.split('/')[1];
    }

    return '';
  }

  /**
   * Unsubscribe from a given subscription if it is active
   * @param {Subscription} subscription
   * @private
   */
  private _unsubscribe(subscription: Subscription): void {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  /**
   * Unsubscribe from the service observables
   */
  ngOnDestroy(): void {
    this._canvasServiceSubscriptions.forEach(subscription => this._unsubscribe(subscription));
    if (this.isCollab && this.documentid) {
      // console.log('getting disconnected');
      this.ws.connect(`${this.wsURLPath}${this.documentid}`).next('$closecon$');
      this.wsSubscription.unsubscribe();
    }
  }

  canvasTextClick() {
    this.enableCanvasText = !this.enableCanvasText;
  }

  onToolbarSettingsChange(settings: vdCanvasTextToolbarSettings) {
    this.canvasTextSettings = settings;
  }

  onBrushToolbarSettingsChange(lineWidth: number) {
    this.lineWidth = lineWidth;
    this.brushSizeUpdate();
  }

  CreateInputText() {
    const drawStatus = this._shouldDraw;
    this._shouldDraw = false;
    const canvasText = this.renderer.createElement('input');
    this.renderer.setAttribute(canvasText, 'type', 'Text');
    this.renderer.setAttribute(canvasText, 'id', 'textCanvas');
    this.renderer.setStyle(canvasText, 'color', this.strokeColor);
    this.renderer.setStyle(canvasText, 'font-family', this.canvasTextSettings.fontFamily);
    this.renderer.setStyle(canvasText, 'font-size', `${this.canvasTextSettings.fontSize}px`);
    this.renderer.setStyle(canvasText, 'top', `${this.mouseEventPosition.y}px`);
    this.renderer.setStyle(canvasText, 'left', `${this.mouseEventPosition.x}px`);
    this.renderer.appendChild(this.canvas.nativeElement.parentElement, canvasText);
    (<HTMLInputElement>canvasText).focus();

    this.renderer.listen(canvasText, 'blur', () => {
      const x = this.mouseEventPosition.x;
      const y = this.mouseEventPosition.y;

      this.context.font = `${this.canvasTextSettings.fontSize}px ${this.canvasTextSettings.fontFamily}`;
      this.context.fillStyle = this.strokeColor;

      this.context.fillText(canvasText.value, x, y);

      const update = new vdCanvasUpdate(x, y, UPDATE_TYPE.stop, this.strokeColor, this._lastUUID, true);

      this._draw(update);
      this._prepareToSendUpdate(update, this.mouseEventPosition.x, this.mouseEventPosition.y);
      this.diagram = this.generateCanvasDataUrl();
      this.onChange(this.diagram);
      this.onSave.emit(this.diagram);

      this.renderer.removeChild(this.canvas.nativeElement.parentElement, canvasText);
      this._shouldDraw = drawStatus;
      this.enableCanvasText = false;
    });
  }
}
