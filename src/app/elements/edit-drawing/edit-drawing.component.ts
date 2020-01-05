import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { JwtHelper } from 'angular2-jwt';
import { WebSocketService } from 'app/common/services/webSocket.service';
import { DiagramSection } from './edit-drawing-toolbar/edit-drawing-toolbar.component';
import { DocumentsService } from '../../projects/documents.service';
import { CURSOR_COLORS } from '../../collaboration/collaboration.constants';
import * as _ from 'lodash';

declare const require: any;
const mx = require('mxgraph')({
  mxImageBasePath: 'assets/img',
  mxBasePath: 'assets',
  mxLoadResources: false,
});

const availableFigures = [
  {
    type: 'square',
    img: '/assets/img/box_tool.png',
    width: 80,
    height: 80,
    style: 'shape=rectangle;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'circle',
    img: '/assets/img/circle_tool.png',
    width: 80,
    height: 80,
    style: 'shape=ellipse;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'ellipse',
    img: '/assets/img/ellipse_tool.png',
    width: 80,
    height: 50,
    style: 'shape=ellipse;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'triangle',
    img: '/assets/img/triangle_tool.png',
    width: 80,
    height: 80,
    style: 'shape=triangle;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'rectangle',
    img: '/assets/img/rectangle_tool.png',
    width: 80,
    height: 50,
    style: 'shape=rectangle;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'rounded-rectangle',
    img: '/assets/img/rounded_tool.png',
    width: 80,
    height: 50,
    style: 'shape=rectangle;rounded=1;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'hexagon',
    img: '/assets/img/polygon_tool.png',
    width: 80,
    height: 70,
    style: 'shape=hexagon;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  }, {
    type: 'line',
    img: '/assets/img/str_line_tool.png',
    width: 50,
    height: 1,
    style: 'shape=line;endArrow=open;fillColor=#ffffff;strokeColor=#4342E6;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center',
  },
];

const availableZooms = [
  {display: '10%', delta: 0.1},
  {display: '25%', delta: 0.25},
  {display: '33%', delta: 0.33},
  {display: '50%', delta: 0.5},
  {display: '75%', delta: 0.75},
  {display: '100%', delta: 1},
  {display: '125%', delta: 1.25},
  {display: '150%', delta: 1.5},
  {display: '200%', delta: 2},
];


enum DiagramObjectType {
  FONT = 'font',
  FIGURE = 'figure',
  LINE = 'line',
  IMAGE = 'image',
}

const allowedToolbarSections = {
  font: [
    DiagramSection.FONT,
    DiagramSection.FILL,
    DiagramSection.BORDER,
  ],
  figure: [
    DiagramSection.FILL,
    DiagramSection.BORDER,
  ],
  line: [
    DiagramSection.BORDER,
  ],
  image: [
    DiagramSection.DELETE,
  ],
};

interface MxPointInterface {
  x: number;
  y: number;
}

interface MxGeometryInterface {
  x: number;
  y: number;
  height: number;
  width: number;
  sourcePoint?: MxPointInterface;
  targetPoint?: MxPointInterface;
  points?: MxPointInterface[];
}

interface DiagramCursorCell {
  cell: any;
  x: number;
  y: number;
  height: number;
  width: number;
}

interface DiagramCursor {
  userId: number;
  firstName: string;
  lastName: string;
  cells: DiagramCursorCell[];
  color: string;
}


/**
 * Edit Drawing component for creating and drawing diagrams.
 *
 * @input enabled - sets ability to change giagram, default true
 * @output forceSave - event triggers for force saving of diagram
 *
 * Usage:
 * <app-edit-drawing [enabled]="enabled"
 *                   [(ngModel)]="answer.drawing"
 *                   (forceSave)="onForceSave()"></app-edit-drawing>
 */
@Component({
  selector: 'app-edit-drawing',
  templateUrl: './edit-drawing.component.html',
  styleUrls: ['./edit-drawing.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditDrawingComponent),
      multi: true,
    },
  ],
})
export class EditDrawingComponent implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy, OnInit {
  editorId: string;
  changeLogOpened = false;
  changeViewerParticipants: any;
  toolbarPosition = {
    x: 0,
    y: 0,
  };
  enabledSections: DiagramSection[] = [];
  zoom = availableZooms;
  zoomIndex = 5;

  // For figures panel
  isPanelVisible = false;
  isFiguresVisible = false;
  figures = availableFigures;

  editedStyle = {};
  isHandToolActive = false;
  changeViewerCursors: DiagramCursor[] = [];

  private isMouseDown = false;
  private scrollStartX: number;
  private scrollStartY: number;
  private scrollLeft: number;
  private scrollTop: number;
  private diagram: any;
  private changeViewer: any;
  private cursorColors: string[];
  private cursors: DiagramCursor[] = [];
  private applyingChanges = false;
  private undoManager: any;
  private wsSubscription: Subscription;
  private userID: number;
  private readonly wsURLPath = `/task-document/`;
  private readonly jwtHelper: JwtHelper = new JwtHelper();

  @Input() enabled = true;
  @Input() private readonly documentId: number;
  @Input() docInfo: any;
  @Input() private readonly isCollab = false;
  @Output() private readonly forceSave = new EventEmitter();

  @ViewChild('mxEditorOverlay') private mxEditorOverlay: ElementRef;

  get visibleCursors() {
    return this.cursors.filter(item => item.userId !== this.userID);
  }

  constructor(
    private ws: WebSocketService,
    private documentsService: DocumentsService,
  ) {
    this.editorId = 'mx-editor-' + Math.floor(Math.random() * 100000);

    // Changes some default colors
    mx.mxConstants.HANDLE_FILLCOLOR = '#99ccff';
    mx.mxConstants.HANDLE_STROKECOLOR = '#0088cf';
    mx.mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
    mx.mxConstants.OUTLINE_COLOR = '#00a8ff';
    mx.mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#99ccff';
    mx.mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#00a8ff';
    mx.mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
    mx.mxConstants.EDGE_SELECTION_COLOR = '#00a8ff';
    mx.mxConstants.DEFAULT_VALID_COLOR = '#00a8ff';
    mx.mxConstants.LABEL_HANDLE_FILLCOLOR = '#cee7ff';
    mx.mxConstants.GUIDE_COLOR = '#0088cf';
    mx.mxConstants.HIGHLIGHT_OPACITY = 30;
    mx.mxConstants.HIGHLIGHT_SIZE = 8;
    mx.mxConstants.STYLE_ALIGN = mx.mxConstants.ALIGN_RIGHT;
  }

  ngOnInit() {
    if (this.isCollab) {
      const jwt = localStorage.getItem('token');
      const jwtDetails = this.jwtHelper.decodeToken(jwt);
      this.userID = jwtDetails.user_id;
    }

    this.initHandTool();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCollab && changes.documentId && changes.documentId.currentValue !== changes.documentId.previousValue) {
      this.updateSocketConnection(changes.documentId.currentValue);
    }
  }

  ngOnDestroy() {
    if (this.isCollab && this.documentId) {
      this.ws.connect(`${this.wsURLPath}${this.documentId}`).next('$closecon$');
      this.wsSubscription.unsubscribe();
    }
  }

  writeValue(value: string) {
    if (value) {
      this.applyingChanges = true;

      this.loadDiagramXML(this.diagram, value);

      this.applyingChanges = false;
    }
  }

  ngAfterViewInit() {
    const self = this;

    this.diagram = new mx.mxGraph(document.getElementById(this.editorId));
    this.diagram.setEnabled(this.enabled);

    this.changeViewer = new mx.mxGraph(document.getElementById(this.editorId + '-changes'));
    this.changeViewer.setEnabled(false);

    const rubberband = new mx.mxRubberband(this.diagram);
    this.undoManager = new mx.mxUndoManager();

    const listener = function (sender, evt) {
      self.undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    this.diagram.getModel().addListener(mx.mxEvent.UNDO, listener);
    this.diagram.getView().addListener(mx.mxEvent.UNDO, listener);

    this.diagram.getModel().addListener(mx.mxEvent.CHANGE, () => {
      for (const cursor of this.cursors) {
        this.recalculateCursorCells(cursor);
      }

      if (!this.applyingChanges) {
        this.saveDiagramState();
      }
    });

    this.diagram.getSelectionModel().addListener(mx.mxEvent.CHANGE, (ev) => {
      const selection = ev.cells.map(cell => cell.getId()) as number[];
      this.shareSelection(selection);
    });

    // Enables rotation handle
    mx.mxVertexHandler.prototype.rotationEnabled = true;

    // Enables guides
    mx.mxGraphHandler.prototype.guidesEnabled = true;

    // Enables snapping waypoints to terminals
    mx.mxEdgeHandler.prototype.snapToTerminals = true;

    // Disable default context menu
    mx.mxEvent.disableContextMenu(document.getElementById(this.editorId));

    // Larger tolerance and grid for real touch devices
    if (mx.mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
      mx.mxShape.prototype.svgStrokeTolerance = 18;
      mx.mxVertexHandler.prototype.tolerance = 12;
      mx.mxEdgeHandler.prototype.tolerance = 12;
      mx.mxGraph.prototype.tolerance = 12;
      mx.mxConstants.HANDLE_SIZE = 12;
      mx.mxConstants.LABEL_HANDLE_SIZE = 7;
    }

    // One finger pans (no rubberband selection) must start regardless of mouse button
    mx.mxPanningHandler.prototype.isPanningTrigger = function (me) {
      const evt = me.getEvent();

      return (me.getState() == null && !mx.mxEvent.isMouseEvent(evt)) ||
        (mx.mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
          mx.mxEvent.isControlDown(evt) || mx.mxEvent.isShiftDown(evt)));
    };

    /*
      Enables connections in the graph and disables
      reset of zoom and translate on root change
      (ie. switch between XML and graphical mode).
    */
    // this.diagram.setConnectable(true);
    this.diagram.centerZoom = true;
    this.diagram.setPanning(true);

    // if (this.enabled) {
    //   this.diagram.popupMenuHandler.factoryMethod = function (menu, cell) {
    //     if (cell && cell.isVertex) {
    //       menu.addItem('Delete', null, function () {
    //         self.diagram.removeCells([cell]);
    //         self.enab = null;
    //         self.editedStyle = {};
    //         self.onChange(self.getXML());
    //         self.forceSave.emit();
    //       });
    //     }
    //   };
    // }

    this.diagram.addListener(mx.mxEvent.CELLS_MOVED, () => {
      this.onChange(this.getXML());
      this.forceSave.emit();
    });

    this.diagram.addListener(mx.mxEvent.CELL_CONNECTED, () => {
      this.onChange(this.getXML());
      this.forceSave.emit();
    });

    this.diagram.addListener(mx.mxEvent.CELLS_RESIZED, () => {
      this.onChange(this.getXML());
      this.forceSave.emit();
    });

    this.diagram.addListener(mx.mxEvent.DOUBLE_CLICK, function (node, event) {
      if (self.enabled && !event.properties.hasOwnProperty('cell')) {
        const x = event.properties.event.layerX / self.diagram.view.scale;
        const y = event.properties.event.layerY / self.diagram.view.scale;

        self.drawText(x, y);
        self.onChange(self.getXML());
      }
    });

    this.diagram.addListener(mx.mxEvent.CLICK, function (graph, event) {
      const isLeftButtonPressed = event.properties.event.button === 0;

      if (event.properties.hasOwnProperty('cell') && isLeftButtonPressed) {
        const cell = event.properties.cell;
        self.editedStyle = self.parseFigureStyle(cell.style);

        self.openToolbar(cell);

        if (cell.edge) {
          self.enabledSections = allowedToolbarSections[DiagramObjectType.LINE];
        } else {
          if (self.editedStyle.hasOwnProperty('shape')) {
            if (self.editedStyle['shape'] === 'image') {
              self.enabledSections = allowedToolbarSections[DiagramObjectType.IMAGE];
            } else {
              self.enabledSections = allowedToolbarSections[DiagramObjectType.FIGURE];
            }
          } else {
            self.enabledSections = allowedToolbarSections[DiagramObjectType.FONT];
          }
        }
      } else {
        self.enabledSections = [];
        self.editedStyle = {};
      }

      self.onChange(self.getXML());
    });

    // Context menu trigger implementation depending on current selection state
    // combined with support for normal popup trigger.
    let cellSelected = false;
    let selectionEmpty = false;
    let menuShowing = false;

    this.diagram.fireMouseEvent = function (evtName, me, sender) {
      if (evtName === mx.mxEvent.MOUSE_DOWN) {
        // For hit detection on edges
        me = this.updateMouseEvent(me);

        cellSelected = this.isCellSelected(me.getCell());
        selectionEmpty = this.isSelectionEmpty();
        menuShowing = self.diagram.popupMenuHandler.isMenuShowing();
      }
      mx.mxGraph.prototype.fireMouseEvent.apply(this, arguments);
    };

    // Shows popup menu if cell was selected or selection was empty and background was clicked
    this.diagram.popupMenuHandler.mouseUp = function (sender, me) {
      this.popupTrigger = !self.diagram.isEditing() && (this.popupTrigger || (!menuShowing &&
        !self.diagram.isEditing() && !mx.mxEvent.isMouseEvent(me.getEvent()) &&
        ((selectionEmpty && me.getCell() == null && self.diagram.isSelectionEmpty()) ||
          (cellSelected && self.diagram.isCellSelected(me.getCell())))));
      const fnThis = this;
      const args = arguments;
      setTimeout(() => {
        mx.mxPopupMenuHandler.prototype.mouseUp.apply(fnThis, args);
      }, 500);
    };

    this.diagram.addListener(mx.mxEvent.TAP_AND_HOLD, function (sender, evt) {
      if (!mx.mxEvent.isMultiTouchEvent(evt)) {
        const me = evt.getProperty('event');
        const cell = evt.getProperty('cell');

        if (cell === null) {
          const pt = mx.mxUtils.convertPoint(this.container,
            mx.mxEvent.getClientX(me), mx.mxEvent.getClientY(me));
          rubberband.start(pt.x, pt.y);
        } else if (self.diagram.getSelectionCount() > 1 && self.diagram.isCellSelected(cell)) {
          self.diagram.removeSelectionCell(cell);
        }

        // Blocks further processing of the event
        evt.consume();
      }
    });
  }

  openFiguresSelector() {
    this.isFiguresVisible = !this.isFiguresVisible;
    this.isPanelVisible = false;
  }

  activateHandTool() {
    this.isHandToolActive = true;
  }

  deactivateHandTool() {
    this.isHandToolActive = false;
  }

  /**
   * Method for drawing figure on diagram
   *
   * @param figureType: figure type
   **/
  drawFigure(figureType) {
    this.isFiguresVisible = false;
    this.diagram.getModel().beginUpdate();

    const ch = this.diagram.container.clientHeight;
    const figure = this.figures.filter((item) => item.type === figureType)[0];
    this.diagram.insertVertex(this.diagram.getDefaultParent(), null, '', ch / 2, ch / 2, figure.width, figure.height, figure.style);

    this.diagram.getModel().endUpdate();
    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Method for drawing text on diagram
   *
   * @param x: x coordinate for inserting, default is null and get calculated as per center of the screen
   * @param y: y coordinate for inserting, default is null and get calculated as per center of the screen
   **/
  drawText(x = null, y = null) {
    this.isPanelVisible = false;

    // var bounds = this.diagram.getGraphBounds();
    if (x == null) {
      const cw = this.diagram.container.clientWidth;
      x = cw / 2;
    }

    if (y == null) {
      const ch = this.diagram.container.clientHeight;
      y = ch / 2;
    }

    this.diagram.getModel().beginUpdate();

    const text = this.diagram.insertVertex(this.diagram.getDefaultParent(), null, 'Text', x, y, 80, 30,
      'strokeColor=transparent;fillColor=transparent;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center;autosize=1');
    this.diagram.updateCellSize(text);

    this.diagram.getModel().endUpdate();
    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Method for drawing edge on diagram
   **/
  drawEdge() {
    this.isPanelVisible = false;
    this.diagram.getModel().beginUpdate();

    const cell = new mx.mxCell('', new mx.mxGeometry(10, 10, 50, 50), 'edgeStyle=segmentEdgeStyle;curved=0;dashed=0;html=1');

    // const cw = this.diagram.container.clientWidth;
    const ch = this.diagram.container.clientHeight;

    cell.geometry.setTerminalPoint(new mx.mxPoint(ch / 2, ch / 2), true);
    cell.geometry.setTerminalPoint(new mx.mxPoint(ch / 2 + 60, ch / 2), false);
    cell.geometry.relative = true;
    cell.edge = true;

    this.diagram.getDefaultParent().insert(cell, true);

    // hack to update diagram
    const v = this.diagram.insertVertex(this.diagram.getDefaultParent(), null, '', 0, 0, 0, 0);
    this.diagram.removeCells([v]);

    this.diagram.getModel().endUpdate();
    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  /**
   * Callback called changing style of edited figure
   * Updates figure style
   *
   * @param style: Object of changed style
   */
  onStyleChanged(style) {
    this.editedStyle = style;

    this.diagram.getModel().setStyle(
      this.diagram.getSelectionCell(),
      this.stringifyFigureStyle(style),
    );

    this.onChange(this.getXML());
    this.forceSave.emit();
  }

  onToolbarActionOccurred(actionName) {
    if (actionName === 'delete') {
      const cell = this.diagram.getSelectionCell();

      this.diagram.getModel().beginUpdate();

      this.diagram.removeCells([cell]);

      this.diagram.getModel().endUpdate();
      this.onChange(this.getXML());
      this.forceSave.emit();
    }
  }

  /**
   * Callback called after file was choosing
   * Insert image in diagram
   *
   * @param file: file that was chosen;
   */
  onFileChosen(file) {
    const self = this;
    const image = new Image();
    const fileReader: FileReader = new FileReader();

    fileReader.addEventListener('loadend', (loadEvent: any) => {
      image.src = loadEvent.target.result;

      image.addEventListener('load', () => {
        self.diagram.getModel().beginUpdate();
        /*
          Removing ';base64' from base64 string is from documentation
          https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxConstants-js.html
          Find STYLE_IMAGE constant
        */
        self.diagram.insertVertex(self.diagram.getDefaultParent(), null, '', 10, 10, image.width, image.height,
          `shape=image;image=${image.src.replace(';base64', '')};fillColor=transparent;strokeColor=transparent;strokeWidth=1;fontSize=12;fontColor=#4342E6;dashed=0;right=center`,
        );
        self.diagram.getModel().endUpdate();
        self.onChange(self.getXML());
        self.forceSave.emit();
      });
    });

    fileReader.readAsDataURL(file);
  }

  /**
   * Method that draws image on
   *
   * @param event: event from hidden file input
   */
  drawImage(event) {
    if (event.target.files.length) {
      this.onFileChosen(event.target.files[0]);
    }

    this.isPanelVisible = false;
  }

  exportSVG() {
    this.documentsService.exportDocument(this.docInfo);
  }

  /**
   * Method for zooming in diagram
   */
  zoomIn() {
    this.enabledSections = [];
    if (this.zoomIndex + 1 <= this.zoom.length - 1) {
      this.zoomIndex += 1;
      this.diagram.zoomTo(this.zoom[this.zoomIndex].delta);
    }
  }

  /**
   * Method for zooming out diagram
   */
  zoomOut() {
    this.enabledSections = [];
    if (this.zoomIndex > 0) {
      this.zoomIndex -= 1;
      this.diagram.zoomTo(this.zoom[this.zoomIndex].delta);
    }
  }

  /**
   * Method for undo changes
   */
  undo() {
    this.enabledSections = [];
    if (this.undoManager.canUndo()) {
      this.undoManager.redo();
      this.getXML();
      this.forceSave.emit();
    }
  }

  /**
   * Method for redo changes
   */
  redo() {
    this.enabledSections = [];
    if (this.undoManager.canRedo()) {
      this.undoManager.redo();
      this.getXML();
      this.forceSave.emit();
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  openChangeLog() {
    const changes = this.docInfo.changes;
    const nondistinct_changer_list = changes.map(change => change.editing_user.user_id);
    const changers = Array.from(new Set(nondistinct_changer_list));

    // assign a color to each user who has made changes
    this.changeViewerParticipants = [];

    changers.forEach((changer: number) => {
      const availableColors = CURSOR_COLORS.slice(0);
      this._shuffle(availableColors);
      const userChange = changes.find(change => change.editing_user.user_id === changer);
      this.changeViewerParticipants.push({
        user: changer,
        name: userChange.editing_user.name,
        color: availableColors.pop(),
      });
    });

    this.showChanges();
    this.changeLogOpened = true;
  }

  closeChangeLog() {
    this.changeViewer.getModel().clear();
    this.changeLogOpened = false;
  }

  showChanges(timestamp?: string) {
    this.changeViewer.getModel().clear();

    let lastChange;

    if (timestamp) {
      lastChange = this.docInfo.changes.find(change => change.timestamp_changed === timestamp);
    }

    if (!lastChange) {
      lastChange = this.docInfo.changes[this.docInfo.changes.length - 1];
    }

    const delta = JSON.parse(lastChange.delta);
    const xml = delta.xml;
    this.loadDiagramXML(this.changeViewer, xml);

    this.changeViewerCursors = delta.cursors.map((cursor: DiagramCursor) => {
      const changer = this.changeViewerParticipants.find(item => item.user === cursor.userId);
      cursor.color = changer.color;
      return cursor;
    });
  }

  private saveDiagramState() {
    if (this.isCollab) {
      const enc = new mx.mxCodec();
      const node = enc.encode(this.diagram.getModel());
      const xml = mx.mxUtils.getXml(node);
      const cursors = this.cursors.map(cursor => {
        const tmp = _.cloneDeep(cursor);
        tmp.cells.forEach(item => item.cell = undefined);
        tmp.color = undefined;

        return tmp;
      });

      const emitData = {
        command: 'edit',
        message: {
          user: this.userID,
          delta: JSON.stringify({
            cursors: cursors,
            xml: xml,
          }),
        },
      };

      if (this.documentId) {
        this.ws.connect(`${this.wsURLPath}${this.documentId}`).next(JSON.stringify(emitData));
      }
    }
  }

  private shareSelection(range: number[]) {
    if (this.isCollab) {
      const emitData = {
        command: 'cursor',
        message: {
          user: this.userID,
          range,
        },
      };

      if (this.documentId) {
        this.ws.connect(`${this.wsURLPath}${this.documentId}`).next(JSON.stringify(emitData));
      }
    }
  }

  private loadDiagramXML(diagram, value) {
    const parent = diagram.getDefaultParent();
    diagram.getModel().beginUpdate();

    const doc = mx.mxUtils.parseXml(value);
    const decoder = new mx.mxCodec(doc);
    const model = decoder.decode(doc.documentElement);

    const newMxCells = model.getRoot().getChildAt(0);

    // Add new cells
    diagram.getModel().mergeChildren(newMxCells, parent, false);

    // Add edit existing cells
    const newCellIds = [];

    if (newMxCells.children) {
      newMxCells.children.forEach(newMxCell => {
        newCellIds.push(newMxCell.id);
        const matchingCell = parent.children.find(child => child.id === newMxCell.id);

        if (matchingCell) {
          const newMxCellGeo = diagram.getModel().getGeometry(newMxCell);
          diagram.getModel().setGeometry(matchingCell, newMxCellGeo);

          const newMxCellStyle = diagram.getModel().getStyle(newMxCell);
          diagram.getModel().setStyle(matchingCell, newMxCellStyle);

          const newMxCellValue = diagram.getModel().getValue(newMxCell);
          diagram.getModel().setValue(matchingCell, newMxCellValue);
        }
      });
    }

    // Remove any deleted cells
    if (parent.children) {
      parent.children.forEach(child => {
        if (!newCellIds.find(id => id === child.id)) {
          diagram.getModel().remove(child);
        }
      });
    }

    // hack to update diagram
    const v = diagram.insertVertex(diagram.getDefaultParent(), null, '', 0, 0, 0, 0);
    diagram.removeCells([v]);

    diagram.getModel().endUpdate();
  }

  private onChange = (_) => { };
  private onTouched = () => { };

  private initHandTool() {
    const mxEditorOverlayHTMLElement = this.mxEditorOverlay.nativeElement as HTMLElement;

    mxEditorOverlayHTMLElement.addEventListener('mousedown', (e: MouseEvent) => {
      this.isMouseDown = true;

      this.scrollStartX = e.pageX - mxEditorOverlayHTMLElement.offsetLeft;
      this.scrollStartY = e.pageY - mxEditorOverlayHTMLElement.offsetTop;

      const mxEditorSVG = mxEditorOverlayHTMLElement.nextElementSibling as HTMLElement;
      this.scrollLeft = mxEditorSVG.scrollLeft;
      this.scrollTop = mxEditorSVG.scrollTop;
    });
    mxEditorOverlayHTMLElement.addEventListener('touchstart', (e: TouchEvent) => {
      this.isMouseDown = true;

      this.scrollStartX = e.touches[0].pageX - mxEditorOverlayHTMLElement.offsetLeft;
      this.scrollStartY = e.touches[0].pageY - mxEditorOverlayHTMLElement.offsetTop;

      const mxEditorSVG = mxEditorOverlayHTMLElement.nextElementSibling as HTMLElement;
      this.scrollLeft = mxEditorSVG.scrollLeft;
      this.scrollTop = mxEditorSVG.scrollTop;
    });

    mxEditorOverlayHTMLElement.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
    });
    mxEditorOverlayHTMLElement.addEventListener('touchcancel', () => {
      this.isMouseDown = false;
    });

    mxEditorOverlayHTMLElement.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    mxEditorOverlayHTMLElement.addEventListener('touchend', () => {
      this.isMouseDown = false;
    });

    mxEditorOverlayHTMLElement.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.isHandToolActive && this.isMouseDown) {
        e.preventDefault();
        const x = e.pageX - this.mxEditorOverlay.nativeElement.offsetLeft;
        const walkX = x - this.scrollStartX;

        const y = e.pageY - this.mxEditorOverlay.nativeElement.offsetTop;
        const walkY = y - this.scrollStartY;

        const mxEditorSVG = mxEditorOverlayHTMLElement.nextElementSibling as HTMLElement;
        mxEditorSVG.scrollLeft = this.scrollLeft - walkX;
        mxEditorSVG.scrollTop = this.scrollTop - walkY;
      }
    });
    mxEditorOverlayHTMLElement.addEventListener('touchmove', (e: TouchEvent) => {
      if (this.isHandToolActive && this.isMouseDown) {
        e.preventDefault();
        const x = e.touches[0].pageX - this.mxEditorOverlay.nativeElement.offsetLeft;
        const walkX = x - this.scrollStartX;

        const y = e.touches[0].pageY - this.mxEditorOverlay.nativeElement.offsetTop;
        const walkY = y - this.scrollStartY;

        const mxEditorSVG = mxEditorOverlayHTMLElement.nextElementSibling as HTMLElement;
        mxEditorSVG.scrollLeft = this.scrollLeft - walkX;
        mxEditorSVG.scrollTop = this.scrollTop - walkY;
      }
    });
  }

  /**
   * Method for getting diagram xml
   *
   * @return xml of diagram
   **/
  private getXML() {
    const enc = new mx.mxCodec();
    const node = enc.encode(this.diagram.getModel());

    return mx.mxUtils.getXml(node);
  }

  private updateSocketConnection(docId) {
    if (docId) {
      this.wsSubscription = this.ws.connect(`${this.wsURLPath}${docId}`).subscribe((msg) => {
        const content = JSON.parse(msg.data);
        const messageType = content['message_type'];
        const message = content['message'];

        if (messageType === 'document_edit') {
          const user = message['user'];
          const delta = JSON.parse(message['delta']);
          const xml = delta['xml'];

          if (user !== this.userID) {
            this.writeValue(xml);

            if (this.isCollab && this.ws.checkConnected()) {
              this.forceSave.emit();
            }
          }
        } else if (messageType === 'new_active_user' || messageType === 'active_user') {
          if (message['user'] !== this.userID) {
            this.ws.updateActiveParticipants(message['user'], 'add');
          }

          if (message['first_name'] && message['last_name']) {
            this.updateCursorUser(message['user'], message['first_name'], message['last_name']);
          }
        } else if (messageType === 'inactive_user') {
          if (message['user'] !== this.userID) {
            this.ws.updateActiveParticipants(message['user'], 'remove');
            this.removeCursor(message['user']);
          }
        } else if (messageType === 'cursor_position') {
          const cellsIds = message['range'] as number[];
          const cells = cellsIds.filter(cellId => cellId !== null)
            .map(cellId => this.diagram.getModel().getCell(cellId));
          this.updateCursorCells(message['user'], cells);
        }
      });
    }
  }

  private createNewCursor(userID: number) {
    const cursor: DiagramCursor = {
      userId: userID,
      firstName: '',
      lastName: '',
      cells: [],
      color: this.getAvailableCursorColor(),
    };
    this.cursors.push(cursor);

    return cursor;
  }

  private getCursor(userID: number) {
    let cursor = this.cursors.find(item => item.userId === userID);

    if (!cursor) {
      cursor = this.createNewCursor(userID);
    }

    return cursor;
  }

  private updateCursorUser(userID: number, firstName: string, lastName: string) {
    const cursor = this.getCursor(userID);

    cursor.firstName = firstName;
    cursor.lastName = lastName;
  }

  private updateCursorCells(userID: number, cells: any[]) {
    const cursor = this.getCursor(userID);

    cursor.cells = cells.map(cell => ({
      cell: cell,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    }));

    this.recalculateCursorCells(cursor);
  }

  private recalculateCursorCells(cursor: DiagramCursor) {
    const scale = this.diagram.view.scale;

    cursor.cells.forEach(cell => {
      const geo = cell.cell.geometry as MxGeometryInterface;

      if (geo.points) {
        let x, y, biggestX, biggestY;

        // It's a line object
        const points = [geo.sourcePoint, ...geo.points, geo.targetPoint];

        // Find lowest x value and lowest y value
        for (const point of points) {
          if (x === undefined || x > point.x) {
            x = point.x;
          }

          if (biggestX === undefined || biggestX < point.x) {
            biggestX = point.x;
          }

          if (y === undefined || y > point.y) {
            y = point.y;
          }

          if (biggestY === undefined || biggestY < point.y) {
            biggestY = point.y;
          }
        }

        cell.x = x * scale;
        cell.y = y * scale;
        cell.width = (biggestX - x) * scale;
        cell.height = (biggestY - y) * scale;
      } else {
        cell.x = geo.x * scale;
        cell.y = geo.y * scale;
        cell.width = geo.width * scale;
        cell.height = geo.height * scale;
      }

      cell.x -= 5;
      cell.y -= 5;
      cell.width += 10;
      cell.height += 10;
    });
  }

  private removeCursor(userId: number) {
    this.cursors = this.cursors.filter(item => item.userId !== userId);
  }

  private openToolbar(cell) {
    const geo = cell.geometry as MxGeometryInterface;
    const scale = this.diagram.view.scale;

    let x, y;

    if (geo.points) {
      // It's a line object
      const points = [geo.sourcePoint, ...geo.points, geo.targetPoint];

      // Find lowest x value and biggest y value
      for (const point of points) {
        if (x === undefined || x > point.x) {
          x = point.x;
        }

        if (y === undefined || y < point.y) {
          y = point.y;
        }
      }
    } else {
      x = geo.x;
      y = geo.y + geo.height;
    }

    this.toolbarPosition = {
      x: x * scale - this.diagram.container.scrollLeft,
      y: y * scale - this.diagram.container.scrollTop + 15,
    };
  }

  /**
   * Method for parsing string style to object
   *
   * @param style - figure style srting
   * @return parsed object
   */
  private parseFigureStyle(style: string): Object {
    const styleObj = {};

    if (style) {
      style.split(';').forEach((current) => {
        const arr = current.split('=');
        styleObj[arr[0]] = arr[1] || null;
      });
    }

    return styleObj;
  }

  /**
   * Method for creating style string from object
   *
   * @param styleObj - figure style object
   * @return style string
   */
  private stringifyFigureStyle(styleObj: Object): string {
    let style = '';
    for (const key in styleObj) {
      if (styleObj.hasOwnProperty(key)) {
        style += styleObj[key] ? `${key}=${styleObj[key]};` : `${key};`;
      }
    }
    return style;
  }

  private resetAvailableCursorColors() {
    this.cursorColors = CURSOR_COLORS.slice(0);
    this._shuffle(this.cursorColors);
  }

  private getAvailableCursorColor() {
    if (!this.cursorColors || this.cursorColors.length === 0) {
      this.resetAvailableCursorColors();
    }

    return this.cursorColors.pop();
  }

  private _shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // getInsertPoint = function () {
  //   const gs = this.diagram.getGridSize();
  //   const dx = this.diagram.container.scrollLeft / this.diagram.view.scale - this.diagram.view.translate.x;
  //   const dy = this.diagram.container.scrollTop / this.diagram.view.scale - this.diagram.view.translate.y;
  //
  //   return new mx.mxPoint(this.diagram.snap(dx + gs), this.diagram.snap(dy + gs));
  // };

  // getFreeInsertPoint = function () {
  //   const view = this.diagram.view;
  //   const bds = this.diagram.getGraphBounds();
  //   const pt = this.getInsertPoint();
  //
  //   // Places at same x-coord and 2 grid sizes below existing graph
  //   const x = this.diagram.snap(Math.round(Math.max(pt.x, bds.x / view.scale - view.translate.x +
  //     ((bds.width === 0) ? this.diagram.gridSize : 0))));
  //   const y = this.diagram.snap(Math.round(Math.max(pt.y, (bds.y + bds.height) / view.scale - view.translate.y +
  //     ((bds.height === 0) ? 1 : 2) * this.diagram.gridSize)));
  //
  //   return new mx.mxPoint(x, y);
  // };
}
