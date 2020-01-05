import {
    Component,
    Output,
    EventEmitter, OnInit, ViewChild, ElementRef, Input
} from '@angular/core';

@Component({
    selector: 'vd-canvas-brush-toolbar',
    template: `

<div class="form-inline">     
Brush Size:  <select [(ngModel)]="brushSize" (ngModelChange)="onChange()" class="form-control" >
        <option class='option' *ngFor='let option of brushsizes' [ngValue]="option.value">{{option.text}}</option>
    </select>      
        </div>
    `,
    styles: [`
    select {height: auto !important;padding: 3px;margin-left: 4px; display: inline-block;
        width: auto;
        vertical-align: middle;  }
    `]
})
export class vdCanvasBrushToolbarComponent implements OnInit{
    @Output() onBrushToolbarSettingsChange = new EventEmitter<number>();
    @Input() brushSize:number;

    brushsizes:{value:number,text:string}[]=[
        {value:2,text:'2'},
        {value:4,text:'4'},
        {value:6,text:'6'},
        {value:8,text:'8'},
        {value:10,text:'10'},
        {value:12,text:'12'},
        {value:14,text:'14'},
        {value:16,text:'16'},
        {value:18,text:'18'}
    ];

    constructor(){
    }

    ngOnInit(){
        this.onBrushToolbarSettingsChange.emit(this.brushSize);
    }

    onChange(){
        this.onBrushToolbarSettingsChange.emit(this.brushSize);
    }
}