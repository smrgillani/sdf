import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {vdCanvasUpdate} from "./vd-canvas-update.model";

export class vdCanvasService {
    private _canvasDrawSubject: Subject<vdCanvasUpdate[]> = new Subject();
    canvasDrawSubject$: Observable<vdCanvasUpdate[]> = this._canvasDrawSubject.asObservable();

    private _canvasClearSubject: Subject<any> = new Subject();
    canvasClearSubject$: Observable<any> = this._canvasClearSubject.asObservable();

    private _canvasUndoSubject: Subject<any> = new Subject();
    canvasUndoSubject$: Observable<any> = this._canvasUndoSubject.asObservable();

    private _canvasRedoSubject: Subject<any> = new Subject();
    canvasRedoSubject$: Observable<any> = this._canvasRedoSubject.asObservable();

    public drawCanvas(updates: vdCanvasUpdate[]): void {
        this._canvasDrawSubject.next(updates);
    }

    public clearCanvas(): void {
        this._canvasClearSubject.next();
    }

    public undoCanvas(): void {
        this._canvasUndoSubject.next();
    }

    public redoCanvas(): void {
        this._canvasRedoSubject.next();
    }
}