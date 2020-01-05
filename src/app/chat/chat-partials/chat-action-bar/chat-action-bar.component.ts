import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AttachmentMessageModel, ChatMessageModel, DecisionPollOption } from 'app/collaboration/models';
import { MessageType, messageTypes } from './message-types';
import { DrawingSourceComponent } from '../sources/drawing-source/drawing-source.component';
import { environment } from '../../../../environments/environment';

export interface MessageSentEvent {
  text: string;
  type: string;
  options: DecisionPollOption[];
}

export interface FileSentEvent {
  file: string;
  type: string;
}

declare function startRecording(): any;
declare function stopRecording(): any;
declare function sendRecording(url:string, auth:string): any;

@Component({
  selector: 'app-chat-action-bar',
  templateUrl: './chat-action-bar.component.html',
  styleUrls: ['./chat-action-bar.component.scss'],
})
export class ChatActionBarComponent implements OnInit, OnChanges {
  messageText = '';
  messageAttachment: AttachmentMessageModel = null;
  decisionPollOptions: DecisionPollOption[] = [];
  messageTypes = messageTypes;
  messageType: MessageType;
  inputType: string = null;
  isRecorded = false;
  allowedInputTypes = {
    'text': ['', 'opinion', 'decisions', 'argument', 'gut_feeling', 'assumption', 'thought_experiment', 'hypothesis'],
    'drawing': ['', 'opinion', 'decisions', 'argument', 'gut_feeling'],
    'file-upload': ['', 'opinion', 'decisions', 'argument', 'gut_feeling'],
    'poll': ['decision_poll'],
    'audio': [''],
  };

  @ViewChild(DrawingSourceComponent) private drawingSourceComponent;

  @Input() enableMessageTypes = false;
  @Input() overDoubleWidth = false;
  @Input() editMessage: ChatMessageModel = null;
  @Input() fileUploadErrors: string[] = [];

  @Output() typingOccurred = new EventEmitter<void>();
  @Output() typingStarted = new EventEmitter<void>();
  @Output() typingEnded = new EventEmitter<void>();
  @Output() private messageSent = new EventEmitter<MessageSentEvent>();
  @Output() private fileSent = new EventEmitter<FileSentEvent>();
  @Output() private resetEditMessage = new EventEmitter<void>();

  private get isMessageText() {
    return this.messageText && this.messageText !== '<p><br></p>';
  }

  ngOnInit() {
    if (this.enableMessageTypes) {
      this.messageType = this.messageTypes[0];
    } else {
      this.messageType = {
        name: '',
        icon: '',
        label: '',
        defaultInputType: 'text',
      };
    }

    this.setInputType(this.messageType.defaultInputType, false);

    if (this.editMessage) {
      this.setEditMessage(this.editMessage);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.editMessage && changes.editMessage.currentValue) {
      const editMessage = changes.editMessage.currentValue;
      this.setEditMessage(editMessage);
    }
  }

  setInputType(type: string, resetEditMessage = true) {
    if (this.inputType === type || type === null) {
      this.inputType = null;
    } else {
      this.inputType = type;
    }

    if (resetEditMessage) {
      this.resetEditMessage.emit();
    }

    this.resetValues();
  }

  setMessageType(messageType: MessageType) {
    this.messageType = messageType;
    this.setInputType(messageType.defaultInputType);
  }

  sendMessage(message?: string) {
    if (message || message === '') {
      this.messageText = message;
    }

    if (this.isMessageText || this.inputType === 'drawing') {
      if (this.inputType === 'drawing') {
        this.emitFileSent(this.messageAttachment.file);
      } else if (this.messageType && this.messageType.name === 'decision_poll') {
        if (this.validateDecisionPoll()) {
          this.emitMessageSent();
        }
      } else {
        this.emitMessageSent();
      }

      this.resetValues();
    }
  }

  addPollOption() {
    const option = {
      id: Math.floor(Math.random() * (200 - 20 + 1)),
      option: '',
      addOption: false,
    } as DecisionPollOption;
    this.decisionPollOptions.push(option);
  }

  removePollOption(option: DecisionPollOption) {
    this.decisionPollOptions.splice(this.decisionPollOptions.findIndex(a => a === option), 1);
  }

  sendFile(file: string) {
    this.emitFileSent(file);
    this.resetValues();
  }

  updateDrawing(attachment: AttachmentMessageModel) {
    this.messageAttachment = attachment;

    this.typingOccurred.emit();
  }

  private findMessageTypeByName(messageTypeName: string) {
    return this.messageTypes.find(item => item.name === messageTypeName) || {name: '', icon: '', label: '', defaultInputType: 'text'};
  }

  private emitMessageSent() {
    this.messageSent.emit({
      text: this.messageText,
      type: this.messageType.name,
      options: this.decisionPollOptions,
    });
  }

  private emitFileSent(file: string) {
    this.fileSent.emit({
      file: file,
      type: this.messageType.name,
    });
  }

  private validateDecisionPoll() {
    if (this.decisionPollOptions.length > 0) {
      return !(this.decisionPollOptions.findIndex(a => a.option === '') > -1);
    } else {
      return false;
    }
  }

  private setEditMessage(message: ChatMessageModel) {
    this.messageType = this.findMessageTypeByName(message.message_type);
    this.messageText = message.text;

    if (message.message_type && message.message_type === 'decision_poll') {
      let addOption = true;
      this.decisionPollOptions = [];

      for (const opt of message.options) {
        const option = {
          id: opt.id,
          option: opt.option,
          addOption: addOption,
        } as DecisionPollOption;

        this.decisionPollOptions.push(option);
        addOption = false;
      }

      this.inputType = 'poll';
    } else {
      this.inputType = 'text';
    }
  }

  private resetValues() {
    this.messageText = '';
    this.decisionPollOptions = [];
    this.messageAttachment = null;

    if (this.drawingSourceComponent) {
      this.drawingSourceComponent.clearAttachment();
    }

    if (this.messageType && this.messageType.name === 'decision_poll') {
      for (let index = 0; index < 3; index++) {
        const option = {
          id: Math.floor(Math.random() * (200 - 20 + 1)),
          option: '',
          addOption: index === 0,
        } as DecisionPollOption;
        this.decisionPollOptions.push(option);
      }
    }
  }

  private recordAudio() {
    this.inputType = 'audio';
    startRecording();
  }

  private recordStop() {
    if (stopRecording()){
      this.isRecorded = true;
    } else {
      this.isRecorded = false;
    }
  }

  private sendAudio() {
    var self = this;
    var url = `${environment.server}/chat/upload-audio/`
    var auth = `JWT ${localStorage.getItem('token')}`
    
    sendRecording(url, auth)
      .done(
        function(res){
          self.isRecorded = false;
          self.sendFile(res.audio);
          self.setInputType('');
      }).fail(
        function(res) {
          console.log(res);
          self.setInputType('');
        }
      );
  }
}
