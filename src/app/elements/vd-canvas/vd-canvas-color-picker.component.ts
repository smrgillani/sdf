import {
    Component,
    Output,
    EventEmitter, OnInit, ViewChild, ElementRef, Input
} from '@angular/core';

@Component({
    selector: 'vd-canvas-colorpicker',
    host: {
        '(document:mousedown)': 'closeOnExternalClick($event)',
        '(document:touchstart)': 'closeOnExternalClick($event)',
    },
    template: `
    <div class="colorpicker-component">
    <div class="input-group  input-group-sm">
        <input type="text" value="{{selectedColor}}" class="form-control" [style.color]="selectedColor" />
        <span class="input-group-addon" (click)="toggleColorPicker($event)"><i [style.background]="selectedColor"></i></span>
    </div>      
    <div [hidden]="!showColorPicker" class="vd-canvas-colorpicker-wrapper">
        <canvas #canvascolorpicker class="vd-canvas-colorpicker" width="284" height="155" (click)="selectColor($event)"></canvas>
    </div>
</div>
    
    `,
    styles: [`
    .form-control{
        display:none;
    }
    .colorpicker-component
    {
        width:30px;
        position:relative;
    }
    .input-group-addon {
         padding:1px;
    }
    .input-group-addon i { display:block; width:25px; height:20px; }

    .colorpicker-component .vd-canvas-colorpicker
    {
        top: 35px;
        left: 0;
        z-index: 1;
    }
    .vd-canvas-colorpicker {
        padding: 4px;
        background: #000;
        border: 1px solid #afafaf;
    }
    @media (min-width: 401px) { 
        .vd-canvas-colorpicker {
            position: absolute;
            top: 0;
            right: 100%;
        }
    }
    .vd-canvas-colorpicker-input {
        width: 44px;
        height: 44px;
        border: 2px solid black;
        margin: 5px;
    }
    `]
})
export class vdCanvasColorPickerComponent implements OnInit {

    @Input() selectedColor: string = "rgb(0,0,0)";
    @ViewChild('canvascolorpicker') canvas: ElementRef;

    showColorPicker: boolean = false;
    private _context: CanvasRenderingContext2D;

    @Output() onColorSelected = new EventEmitter<string>();

    constructor(private _elementRef: ElementRef) {
    }

    /**
     * Initialize the canvas drawing context. If we have an aspect ratio set up, the canvas will resize
     * according to the aspect ratio.
     */
    ngOnInit() {
        this._context = this.canvas.nativeElement.getContext("2d");
        this.createColorPalette();
    }

    createColorPalette() {
        let gradient = this._context.createLinearGradient(0, 0, this._context.canvas.width, 0);
        gradient.addColorStop(0, "rgb(255,   0,   0)");
        gradient.addColorStop(0.15, "rgb(255,   0, 255)");
        gradient.addColorStop(0.33, "rgb(0,     0, 255)");
        gradient.addColorStop(0.49, "rgb(0,   255, 255)");
        gradient.addColorStop(0.67, "rgb(0,   255,   0)");
        gradient.addColorStop(0.84, "rgb(255, 255,   0)");
        gradient.addColorStop(1, "rgb(255,   0,   0)");
        this._context.fillStyle = gradient;
        this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

        gradient = this._context.createLinearGradient(0, 0, 0, this._context.canvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
        gradient.addColorStop(1, "rgba(0,     0,   0, 1)");
        this._context.fillStyle = gradient;
        this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    }

    closeOnExternalClick(event) {
        if (!this._elementRef.nativeElement.contains(event.target) && this.showColorPicker) {
            this.showColorPicker = false;
        }
    }

    toggleColorPicker(event: any) {
        if (event) {
            event.preventDefault();
        }

        this.showColorPicker = !this.showColorPicker;
    }

    private _getColor(event: any) {
        let canvasRect = this._context.canvas.getBoundingClientRect();
        let imageData = this._context.getImageData(event.clientX - canvasRect.left, event.clientY - canvasRect.top, 1, 1);

        return 'rgb(' + imageData.data[0] + ', ' + imageData.data[1] + ', ' + imageData.data[2] + ')';
    }

    selectColor(event: any) {
        this.selectedColor = this._getColor(event);

        this.onColorSelected.emit(this.selectedColor);
        this.toggleColorPicker(null);
    }
}