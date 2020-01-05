import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, RequestOptions, ResponseContentType } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import * as wjcGridSheet from 'wijmo/wijmo.grid.sheet';
import { WebSocketService } from 'app/common/services/webSocket.service';

import { DataSvc } from './services/DataSvc';
import { ContextMenuComponent } from './sheet-context-menu/contextmenu.component';
import { BindingFlexSheetBaseComponent } from './flexsheet.base.component';
import { JwtHelper } from 'angular2-jwt';
import { environment } from 'environments/environment';
import { AllowResizing, CellRange, FlexGrid, FormatItemEventArgs } from 'wijmo/wijmo.grid';
import { CURSOR_COLORS } from '../../collaboration/collaboration.constants';
import { WjFlexSheet } from 'wijmo/wijmo.angular2.grid.sheet';
import { Tooltip } from 'wijmo/wijmo';

declare var Dropbox: any;
declare var FilePicker: any;
declare var gapi: any;


interface SpreadsheetCursor {
  firstName: string;
  lastName: string;
  range: CellRange;
  color: string;
}


/**
 * Component example of use
 * <app-spreadsheet [projectId]="projectid" [questionId]="questionId" (forceSave)="onForceSave()"></app-spreadsheet>
 */
@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: [
    './wijmo.min.css',
    './wijmo.theme.office.min.css',
    './spreadsheet.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpreadsheetComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [ContextMenuComponent],
})
export class SpreadsheetComponent extends BindingFlexSheetBaseComponent implements OnDestroy, OnInit, OnChanges, ControlValueAccessor {
  editedPage = false;
  changeLogOpened = false;
  formulasSelectClass = 'hide';
  changeViewerParticipants: any;
  private pageState: string;
  private componentRef: ComponentRef<any>;
  private prev_selection: any = {
    _row: 0,
    _row2: 0,
    _col: 0,
    _col2: 0,
  };
  private wsSubscription: Subscription;
  private userID: number;
  private cursors: { [id: number]: SpreadsheetCursor } = {};
  private cursorColors: string[];
  private readonly wsURLPath = `/task-document/`;
  private readonly jwtHelper: JwtHelper = new JwtHelper();
  private readonly tooltip: Tooltip = new Tooltip();

  @ViewChild('flexSheet') flexSheet: wjcGridSheet.FlexSheet;
  @ViewChild('dynamicContextMenuContainer', {read: ViewContainerRef}) private container: ViewContainerRef;
  @ViewChild('sum') private sumElement: ElementRef;

  @ViewChild('flexSheetChangesViewer') flexSheetChangesViewer: wjcGridSheet.FlexSheet;
  @ViewChild('dynamicContextMenuContainerChangesViewer', {read: ViewContainerRef})
  private dynamicContextMenuContainerChangesViewer: ViewContainerRef;

  /**
   * Get if spreadsheet is read only - View only mode
   * @param isReadOnly
   */
  @Input() isReadOnly? = false;

  @Input() docInfo: any = null;

  /**
   * Get if collaboration changes are allowed on the spreadsheet
   * @param isCollab
   */
  @Input() private isCollab? = false;

  @Input() private projectId?: number;
  @Input() private questionId?: number;
  @Input() private documentId: number;
  @Input() private initialSave: boolean;

  /**
   * Emitter that trigger after some spreadsheet event interaction
   * @param forceSave
   */
  @Output() private forceSave = new EventEmitter();

  constructor(
    @Inject(DataSvc) dataSvc: DataSvc,
    private ngZone: NgZone,
    private ws: WebSocketService,
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private http: Http,
  ) {
    super(dataSvc);
    window.onresize = (e) => {
      // this.ngZone.run(() => {
      //   setTimeout(this.resizeFormulasBarBtn, 3000);
      // });
      // setTimeout(this.resizeFormulasBarBtn, 3000);
    };
  }

  ngOnInit() {
    const jwt = localStorage.getItem('token');
    const jwtDetails = this.jwtHelper.decodeToken(jwt);
    this.userID = jwtDetails.user_id;
    this.pageState = 'visible';
    localStorage.setItem('clipboard', '');
    const wijomomark = document.querySelector('[href^="http://wijmo.com/products/wijmo-5/eval/"]');

    if (wijomomark !== null) {
      // (<HTMLElement>wijomomark.parentNode).remove();
      const child = wijomomark.parentNode;
      (<HTMLElement>child).style.bottom = '-9999px';
      wijomomark.remove();
      // wijomomark.innerHTML  = '';
      // const parent = wijomomark.parentNode.parentNode;
      // parent.removeChild(child);
      // wijomomark.parentNode.remove();

    }
    const flexsheet = this.flexSheet;

    const self = this;

    setTimeout(function () {
      console.log('yakkkooo spreadsheet');
      // TODO: create Google account for Saffron application.
      new FilePicker({
        apiKey: environment.googleDriveApiKey, // 'AIzaSyDtTicBZxz-riolXGebZgFyIcUZx3gcC20',
        clientId: environment.googleProviderKey, // '30996275919-k5sa3s0v7f8aeaa6j2e4v0ma0pp5omkp',
        buttonEl: document.getElementById('pick'),
        view: 'spreadsheet', // for image set view as 'image'
        onSelect: function (file) {
          // http request was giving us the cors issue so using xmlHttpRequest to get the image.
          const accessToken = gapi.auth.getToken().access_token;
          const xhr = new XMLHttpRequest();
          xhr.open('GET', file.downloadUrl, true);
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
          xhr.responseType = 'blob';
          xhr.onload = function () {
            // self.fileChosen.emit(xhr.response as File);
            const flexSheet = self.flexSheet;
            const reader = new FileReader();
            reader.onload = function (e) {
              flexSheet.load(reader.result);
              self.onSpreadSheetChange();
              self.forceSave.emit();
            };
            reader.readAsDataURL(xhr.response);
          };
          xhr.send();
        },
      });
    }, 3000);

    // dropbox button configuration
    const options = {
      success: function (file) {
        const requestOptions = new RequestOptions({responseType: ResponseContentType.Blob});
        self.http.get(file[0].link, requestOptions)
          .map((response) => response.blob()).subscribe(data => {
          const flexSheet = self.flexSheet;
          const reader = new FileReader();
          reader.onload = function (e) {
            flexSheet.load(reader.result);
            self.onSpreadSheetChange();
            self.forceSave.emit();
          };
          reader.readAsDataURL(data);
        });
      },
      cancel: function () {},
      linkType: 'direct', // "preview" or "direct"
      multiselect: false, // true or false
      extensions: ['.xls', '.xlsx'],
    };

    if (document.getElementById('dropbox-container')) {
      const button = Dropbox.createChooseButton(options);
      console.log('yakko count', document.getElementById('dropbox-container').childElementCount);
      if (document.getElementById('dropbox-container').childElementCount === 0) {
        document.getElementById('dropbox-container').appendChild(button);
      }
    }

    // Add 'Enter' Key Event Listener to Formula Input form
    const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
    formula_value_ele.addEventListener('keyup', function (event) {
      if (event.which === 13) {
        console.log('event pressed');
        this.blur();
        const selection = {row: 0, col: 0};
        const query = formula_value_ele.value;
        selection.row = flexsheet.rows.length - 1;
        selection.col = 0;
        flexsheet.setCellData(selection.row, selection.col, query);
        let val = parseFloat(flexsheet.getCellValue(selection.row, selection.col, true));

        if (isNaN(val)) {
          val = 0;
        }

        const sumElements = document.querySelectorAll('.spreadsheet-result-show');

        for (let i = 0; i < sumElements.length; i++) {
          sumElements[i].innerHTML = val.toString();
        }

        if (window.innerWidth < 768) {
          formula_value_ele.value = val.toString();
        }

        flexsheet.setCellData(selection.row, selection.col, '');
      }
    });
  }

  ngOnDestroy() {
    if (this.documentId && this.isCollab) {
      console.log('getting disconnected');
      this.ws.connect(`${this.wsURLPath}${this.documentId}`).next('$closecon$');
      this.wsSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isCollab && changes.documentId && changes.documentId.currentValue !== changes.documentId.previousValue) {
      this.updateSocketConnection(changes.documentId.currentValue);
    }
  }

  undo() {
    this.flexSheet.undo();
  }

  redo() {
    this.flexSheet.redo();
  }

  flexSheetInit(flexSheet: wjcGridSheet.FlexSheet) {
    super.flexSheetInit(flexSheet);

    // Resize 'ok' btn on the top-right
    // this.resizeFormulasBarBtn();

    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    flexSheet.isTabHolderVisible = true;
    flexSheet.showFilterIcons = true;
    flexSheet.showSort = true;
    flexSheet.allowSorting = true;
    flexSheet.allowResizing = AllowResizing.Both;

    if (this.isReadOnly === true) {
      flexSheet.hostElement.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, true);
    }

    // flexSheet.showFunctionList()

    flexSheet.prepareCellForEdit.addHandler((event) => {
      this.removeComponent();
      this.editedPage = true;
      this.prev_selection = flexSheet.selection;
      const cell_width = flexSheet.getCellBoundingRect(flexSheet.selection._row, flexSheet.selection._col).width;
      const top = event.cells._activeCell.offsetTop + flexSheet.scrollPosition.y - 10;
      const left = event.cells._activeCell.offsetLeft + flexSheet.scrollPosition.x + 30;
      this.createComponent(top, left, cell_width + 20, flexSheet.getCellValue(flexSheet.selection._row, flexSheet.selection._col),
        flexSheet.selection._row, flexSheet.selection._col);
    });
    flexSheet._addBoundRow([], flexSheet.rows.length);

    flexSheet.selectionChanged.addHandler((sheet: WjFlexSheet) => {
      if (this.documentId && this.isCollab && !this.isReadOnly && !this.changeLogOpened) {
        const range = {
          col: sheet.selection.col,
          col2: sheet.selection.col2,
          row: sheet.selection.row,
          row2: sheet.selection.row2,
        };

        const emitData = {
          command: 'cursor',
          message: {'user': this.userID, 'range': JSON.stringify(range)},
        };

        this.ws.connect(`${this.wsURLPath}${this.documentId}`).next(JSON.stringify(emitData));
      }

      setTimeout(() => {
        this.onSpreadSheetChange();
        this.editedPage = true;
        let multi_selection = true;
        const marquee_selector = document.querySelector('.wj-marquee') as HTMLDivElement;
        marquee_selector.className = 'wj-marquee';
        const selection = flexSheet.selection;
        if (selection._row === 0 && selection._row2 === flexSheet.rows.length - 1) {
          if (flexSheet.controlRect.height < flexSheet.rows.length * flexSheet.getCellBoundingRect(0, 0).height) {
            marquee_selector.className += ' add-marquee';
          } else {
            marquee_selector.className += ' add-marquee-below-flexsheet-height';
          }
        }

        // Check if selection is multi or single.
        if (selection._row === selection._row2 && selection._col === selection._col2) {
          multi_selection = false;
        }

        if (selection._col < 0 || selection._col2 < 0 || selection._row < 0 || selection._row2 < 0) {
          return;
        }

        const selecteEle = document.querySelector('.spreadsheet-statusbar-for-sum select') as HTMLSelectElement;
        const params = selecteEle.options[selecteEle.selectedIndex].value.split('...');
        let query = '';

        if (multi_selection) {
          const optionitems = selecteEle.querySelectorAll('option');

          for (let i = 0; i < optionitems.length; i++) {
            optionitems[i].setAttribute('hidden', 'hidden');
          }

          const items = selecteEle.querySelectorAll('option[value$="multi_selection"]');

          for (let i = 0; i < items.length; i++) {
            items[i].removeAttribute('hidden');
          }
        } else {
          const optionitems = selecteEle.querySelectorAll('option');

          for (let i = 0; i < optionitems.length; i++) {
            optionitems[i].removeAttribute('hidden');
          }
        }

        // Create query for multi-selection, single-param formulas, multi-params formulas
        switch (params[1]) {
          case 'multi_selection': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1}:${columns[selection._col]}${selection._row + 1})`;
          }
            break;
          case 'single_param': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1})`;
          }
            break;
          case 'double_param': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1}, _ )`;
          }
            break;
          case 'three_param': {
            query = `=${params[0]}(${columns[selection._col2]}${selection._row2 + 1}, _ , _ )`;
          }
            break;
        }

        this.formulasSelectClass = 'hide';

        const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
        formula_value_ele.value = query;
        let query2 = '';

        if (multi_selection) {
          query2 = `=${params[0]}(`;

          if (selection._row2 > selection._row) {
            const temp = selection._row;
            selection._row = selection._row2;
            selection._row2 = temp;
          }

          if (selection._col2 > selection._col) {
            const temp = selection._col;
            selection._col = selection._col2;
            selection._col2 = temp;
          }

          for (let i = selection._row2; i <= selection._row; i++) {
            for (let j = selection._col2; j <= selection._col; j++) {
              const cellValue = flexSheet.getCellValue(i, j, true);
              const cellData = flexSheet.getCellData(i, j, true);
              query2 += `${cellValue}, `;
            }
          }

          query2 = query2.slice(0, -2);
          query2 += ')';
        } else {
          query2 = query;
        }

        console.log('query2', query2);
        const range = {row: 0, col: 0};
        range.row = flexSheet.rows.length - 1;
        range.col = 0;
        flexSheet.setCellData(range.row, range.col, query2);
        let val = parseFloat(flexSheet.getCellValue(range.row, range.col, true));
        flexSheet.setCellData(range.row, range.col, '');

        if (isNaN(val)) {
          val = 0;
        }

        this.sumElement.nativeElement.innerHTML = val;

        if (window.innerWidth < 768) {
          formula_value_ele.value = `${query.slice(1, -1)}) = ${val.toString()}`;
        }

        if (!(this.prev_selection._row + 1 === flexSheet.selection._row && this.prev_selection._col === flexSheet.selection._col)) {
          this.container.clear();
        }
      }, 100);
    });

    flexSheet.scrollPositionChanged.addHandler(() => {
      this.container.clear();
    });

    flexSheet.cellEditEnding.addHandler((sender, e: any) => {
      // send changes if to speadsheet to other viewing users if in collaboration mode and not read only
      if (this.documentId && this.isCollab && !this.isReadOnly) {
        if (sender.getCellData(e.row, e.col) !== sender.activeEditor.value) {
          const delta = {
            row: e.row,
            col: e.col,
            value: sender.activeEditor.value,
          };

          const emitData = {
            command: 'edit',
            message: {'user': this.userID, 'delta': JSON.stringify(delta)},
          };

          this.ws.connect(`${this.wsURLPath}${this.documentId}`).next(JSON.stringify(emitData));
        }
      }
    });

    flexSheet.formatItem.addHandler((s: FlexGrid, e: FormatItemEventArgs) => {
      if (e.panel === s.cells) {
        let tooltipContent = '';

        for (const userID in this.cursors) {
          if (this.cursors.hasOwnProperty(userID)) {
            const cursor = this.cursors[userID];

            if (
              cursor.range &&
              e.row >= cursor.range.bottomRow && e.row <= cursor.range.topRow &&
              e.col >= cursor.range.leftCol && e.col <= cursor.range.rightCol
            ) {
              if (tooltipContent) {
                tooltipContent += '<br />';
              }

              tooltipContent += `${cursor.firstName} ${cursor.lastName}`;
            }
          }
        }

        if (tooltipContent) {
          this.tooltip.setTooltip(e.cell, tooltipContent);
        }
      }
    });

    // clear all tooltips when updating the view
    flexSheet.updatingView.addHandler(() => {
      this.tooltip.dispose();
    });

    if (this.initialSave) {
      this.onSpreadSheetChange();
      this.forceSave.emit();
    }
  }

  // Load excel file from local computer
  load() {
    const self = this;
    const flexSheet = this.flexSheet,
      fileInput = <HTMLInputElement>document.getElementById('importFile');
    const reader = new FileReader();
    reader.onload = function (e) {
      flexSheet.load(reader.result);
      self.onSpreadSheetChange();
      self.forceSave.emit();
    };
    reader.readAsDataURL(fileInput.files[0]);
  }

  // Show Formulas Select box when click on 'Sigma' button
  showFormulas() {
    this.formulasSelectClass = 'show-as-block';
  }

  onFormulasSelectionChanged() {
    const selectElement = document.querySelector('.spreadsheet-statusbar-for-sum select') as HTMLSelectElement;
    const formula_value_ele = document.querySelector('.formula-value input') as HTMLInputElement;
    const params = selectElement.options[selectElement.selectedIndex].value.split('...');
    switch (params[1]) {
      case 'multi_selection': {
        formula_value_ele.value = `=${params[0]}( _ : _ )`;
      }
        break;
      case 'single_param': {
        formula_value_ele.value = `=${params[0]}( _ )`;
      }
        break;
      case 'double_param': {
        formula_value_ele.value = `=${params[0]}( _ : _ )`;
      }
        break;
      case 'three_param': {
        formula_value_ele.value = `=${params[0]}( _ : _ : _ )`;
      }
        break;
    }
    this.formulasSelectClass = 'hide';
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
    this.flexSheetChangesViewer.clear();
    this.changeLogOpened = false;
  }

  showChanges(timestamp?: string) {
    this.flexSheetChangesViewer.clear();

    this.docInfo.changes.forEach(change => {
      const delta = JSON.parse(change['delta']);

      const matchingParticipant = this.changeViewerParticipants
        .find(userObj => userObj['user'] === change.editing_user.user_id);

      if (!timestamp || change.timestamp_changed < timestamp) {
        this.flexSheetChangesViewer.setCellData(delta.row, delta.col, delta.value);

        const cellRange = new CellRange(delta.row, delta.col, delta.rol, delta.col);
        this.flexSheetChangesViewer.applyCellsStyle({color: matchingParticipant.color}, [cellRange]);
      }
    });
  }

  writeValue(value: string) {
    if (value) {
      this.flexSheet.load(value);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onChange = (_) => {};
  private onTouched = () => {};

  // Code below seems to be unused...
  // Resize 'ok' btn on the top-right
  // private resizeFormulasBarBtn() {
  //   if (!document.querySelector('.spreadsheetcomponent') || !this.flexSheet) {
  //     return;
  //   }
  //   const sheet_width = document.querySelector('.spreadsheetcomponent').clientWidth - this.flexSheet.rowHeaders.width;
  //   const cell_width = this.flexSheet.getCellBoundingRect(0, 0).width;
  //   const spreadsheet_ok_btns = document.querySelectorAll('.spreadsheet-ok-btn');
  //   const result_show_eles = document.querySelectorAll('.spreadsheet-result-show');
  //
  //   for (let i = 0; i < spreadsheet_ok_btns.length; i++) {
  //     const btn = spreadsheet_ok_btns[i] as HTMLDivElement;
  //     const result_elements = result_show_eles[i] as HTMLDivElement;
  //     if (sheet_width % cell_width > cell_width * 0.5) {
  //       btn.style.width = `${sheet_width - Math.floor(sheet_width / cell_width) * cell_width}px`;
  //       result_elements.style.width = `${cell_width}px`;
  //     } else {
  //       btn.style.width = `${cell_width + sheet_width - Math.floor(sheet_width / cell_width) * cell_width}px`;
  //       result_elements.style.width = `${cell_width}px`;
  //       if (window.innerWidth < 500) {
  //         btn.style.width = `${sheet_width - Math.floor(sheet_width / cell_width) * cell_width}px`;
  //       }
  //     }
  //   }
  // }

  // Create context menu for copy, cut, paste operations
  private createComponent(top: number, left: number, width: number, value: number, row: number, col: number) {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(ContextMenuComponent);
    this.componentRef = this.container.createComponent(factory);

    this.componentRef.instance.top = top;
    this.componentRef.instance.left = left;
    this.componentRef.instance.width = width;
    this.componentRef.instance.value = value;
    this.componentRef.instance.row = row;
    this.componentRef.instance.col = col;
    this.componentRef.instance.copyEvent.subscribe(() => this.copyClipboard());
    this.componentRef.instance.pasteEvent.subscribe(() => this.pasteClipboard());
    this.componentRef.instance.cutEvent.subscribe(() => this.cutClipboard());
  }

  private removeComponent() {
    this.container.clear();
  }

  // Spreadsheet Copy, Cut, Paste operations
  private copyClipboard() {
    this.removeComponent();
  }

  private cutClipboard() {
    const clipboard = JSON.parse(localStorage.getItem('clipboard'));
    this.flexSheet.setCellData(clipboard.row, clipboard.col, '');

    this.removeComponent();
  }

  private pasteClipboard() {
    const clipboard = JSON.parse(localStorage.getItem('clipboard'));
    this.flexSheet.setCellData(clipboard.row, clipboard.col, clipboard.value);
    this.removeComponent();
  }

  private onSpreadSheetChange() {
    this.clearCursors();
    const workbook = this.flexSheet.saveAsync();
    const base64 = workbook.save();
    this.onChange(base64);
    this.forceSave.emit();
    this.drawCursors();
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

          if (user !== this.userID) {
            this.flexSheet.setCellData(delta['row'], delta['col'], delta['value'], true);
          }
        } else if (messageType === 'new_active_user' || messageType === 'active_user') {
          if (message['user'] !== this.userID) {
            this.ws.updateActiveParticipants(message['user'], 'add');

            if (message['first_name'] && message['last_name']) {
              this.updateCursorUser(message['user'], message['first_name'], message['last_name']);
            }

            if (message['cursor']) {
              const range = message['cursor'];

              this.updateCursorRange(message['user'], range.row, range.col, range.row2, range.col2);
              this.clearCursors();
              this.drawCursors();

              this.flexSheet.refresh();
            }
          }
        } else if (messageType === 'inactive_user') {
          if (message['user'] !== this.userID) {
            this.ws.updateActiveParticipants(message['user'], 'remove');

            this.removeCursor(message['user']);
            this.clearCursors();
            this.drawCursors();

            this.flexSheet.refresh();
          }
        } else if (messageType === 'cursor_position') {
          if (message['user'] !== this.userID) {
            const range = JSON.parse(message['range']);

            this.updateCursorRange(message['user'], range.row, range.col, range.row2, range.col2);
            this.clearCursors();
            this.drawCursors();

            this.flexSheet.refresh();
          }
        }
      });
    }
  }

  private createNewCursor(userID: number) {
    const cursor: SpreadsheetCursor = {
      firstName: '',
      lastName: '',
      range: null,
      color: this.getAvailableCursorColor(),
    };
    this.cursors[userID] = cursor;

    return cursor;
  }

  private getCursor(userID: number) {
    if (!this.cursors.hasOwnProperty(userID)) {
      this.createNewCursor(userID);
    }

    return this.cursors[userID];
  }

  private updateCursorUser(userID: number, firstName: string, lastName: string) {
    const cursor = this.getCursor(userID);

    cursor.firstName = firstName;
    cursor.lastName = lastName;
  }

  private updateCursorRange(userID: number, row: number, col: number, row2: number, col2: number) {
    const cursor = this.getCursor(userID);

    cursor.range = new CellRange(row, col, row2, col2);
  }

  private removeCursor(userID: number) {
    delete this.cursors[userID];
  }

  private clearCursors() {
    const clearCellRange = new CellRange(0, 0, this.flexSheet.rows.length - 1, this.flexSheet.columns.length - 1);
    this.flexSheet.applyCellsStyle({backgroundColor: '#ffffff'}, [clearCellRange], true);
  }

  private drawCursors() {
    for (const userID in this.cursors) {
      if (this.cursors.hasOwnProperty(userID)) {
        const cursor = this.cursors[userID];

        if (cursor.range) {
          this.flexSheet.applyCellsStyle({backgroundColor: cursor.color}, [cursor.range], true);
        }
      }
    }
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
}
