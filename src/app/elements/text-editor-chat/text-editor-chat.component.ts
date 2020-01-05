import { Component, EventEmitter, forwardRef, Output, Input, AfterViewInit, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';

(window as any).Quill = Quill;
import 'quill-emoji/dist/quill-emoji';

@Component({
  selector: 'app-text-editor-chat',
  templateUrl: './text-editor-chat.component.html',
  styleUrls: ['./text-editor-chat.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextEditorChatComponent),
    multi: true,
  }],
})
export class TextEditorChatComponent implements AfterViewInit, ControlValueAccessor {
  editorId: string;
  private editor: any;
  private content: any;

  @Input() private readOnly = false;
  @Output() private forceSave = new EventEmitter();
  @Output() private sendMessage = new EventEmitter();

  constructor() {
    this.editorId = 'quill-editor-' + Math.floor(Math.random() * 100000);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.sendMessage.emit();
    }
  }

  ngAfterViewInit(): void {
    this.editor = new Quill(`#${this.editorId}`, {
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
          ],
          handlers: {'emoji': function () {}},
        },
        'emoji-toolbar': true,
        'emoji-textarea': true,
        'emoji-shortname': true,
      },
      theme: 'snow',
    });

    this.editor.on('text-change', () => {
      this.content = this.editor.root.innerHTML;
      this.onModelChange(this.editor.root.innerHTML);
      this.forceSave.emit();
    });

    if (this.content) {
      this.editor.pasteHTML(this.content);
    }

    this.editor.enable(!this.readOnly);

    setTimeout(() => {
      this.editor.focus();
    }, 0);
  }

  onModelChange: Function = () => {};

  onModelTouched: Function = () => {};

  writeValue(currentValue: any) {
    this.content = currentValue;
    if (this.editor) {
      if (currentValue) {
        this.editor.pasteHTML(currentValue);
        return;
      }
      this.editor.setText('');
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
}
