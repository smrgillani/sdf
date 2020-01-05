import {
    Component,
    Output,
    EventEmitter, OnInit, ViewChild, ElementRef, Input
} from '@angular/core';

export interface vdCanvasTextToolbarSettings {
    fontSize?:number
    fontFamily?:string
}

@Component({
    selector: 'vd-canvas-text-toolbar',
    template: `
    <div class="form-inline">
    <select [(ngModel)]="settings.fontSize" (ngModelChange)="onChange()" class="form-control" style="width: 50px;">
        <option class='option' *ngFor='let option of fontSizes' [ngValue]="option.value">{{option.text}}</option>
    </select>
    <select [(ngModel)]="settings.fontFamily" (ngModelChange)="onChange()" class="form-control" style="width: 90px;">
        <option class='option' *ngFor='let option of fontFamilies' [ngValue]="option.value">{{option.text}}</option>
    </select>
    </div>
    `,
    styles: [`
    select { height: auto !important;padding: 3px;margin-left: 4px; display: inline-block;
        width: auto;
        vertical-align: middle; }      
           
    `]
})
export class vdCanvasTextToolbarComponent implements OnInit{
    @Output() onToolbarSettingsChange = new EventEmitter<vdCanvasTextToolbarSettings>();
    settings:vdCanvasTextToolbarSettings = {
        fontSize : 16,
        fontFamily : 'Arial'
    };

    fontSizes:{value:number,text:string}[]=[
        {value:14,text:'14'},
        {value:16,text:'16'},
        {value:18,text:'18'},
        {value:20,text:'20'},
        {value:22,text:'22'},
        {value:24,text:'24'},
        {value:26,text:'26'},
        {value:28,text:'28'},
        {value:30,text:'30'}
    ];

    fontFamilies:{value:string,text:string}[]=[
        {value:'Arial',text:'Arial'},
        {value:'Times New Roman',text:'Times New Roman'},
        {value:'Helvetica Neue',text:'Helvetica Neue'},
        {value:'Helvetica',text:'Helvetica'},
    ];

    constructor(){
    }

    ngOnInit(){
        this.onToolbarSettingsChange.emit(this.settings);
    }

    onChange(){
        this.onToolbarSettingsChange.emit(this.settings);
    }
}