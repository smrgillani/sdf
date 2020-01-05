import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

interface SessionEnding {
  timestamp_ended: string;
}

interface EditingUser {
  user_id: number;
  name: string;
}

interface DocumentChange {
  editing_user: EditingUser;
  delta: string;
  timestamp_changed: string;
}

class Session {
  timestampEnded: string;
  changes: DocumentChange[];
  editingUsers: string[];
}

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss'],
})
export class ChangeLogComponent implements OnInit, OnChanges {
  selectedSessionIndex: number = null;
  selectedChangeIndex: number = null;

  sessions: Session[] = [];
  currentChanges: DocumentChange[] = [];
  currentEditingUsers: string[] = [];

  @Input() private sessionEndings?: SessionEnding[];
  @Input() private documentChanges?: DocumentChange[];
  @Output() private changesSelected = new EventEmitter<string>();

  ngOnInit() {
    this.refreshChangeLog();
  }

  ngOnChanges() {
    this.refreshChangeLog();
  }

  selectChanges(sessionIndex: number = null, changeIndex: number = null) {
    let timestamp = null;

    if (sessionIndex !== null) {
      if (changeIndex !== null) {
        timestamp = this.sessions[sessionIndex].changes[changeIndex].timestamp_changed;
      } else {
        timestamp = this.sessions[sessionIndex].timestampEnded;
      }
    } else if (changeIndex !== null) {
      timestamp = this.currentChanges[changeIndex].timestamp_changed;
    }

    this.selectedSessionIndex = sessionIndex;
    this.selectedChangeIndex = changeIndex;
    this.changesSelected.emit(timestamp);
  }

  private refreshChangeLog() {
    if (this.sessionEndings) {
      this.sessions = this.sessionEndings
        .sort((s1, s2) => s1.timestamp_ended >= s2.timestamp_ended ? 1 : -1)
        .map((sessionEnding, index, sessionEndings) => {
          const session = new Session();
          session.timestampEnded = sessionEnding.timestamp_ended;

          const timestampBegin = index !== 0 ? sessionEndings[index - 1].timestamp_ended : null;

          session.changes = this.getDocumentChangesSubset(timestampBegin, session.timestampEnded).reverse();
          const editingUsers = session.changes.map(change => change.editing_user.name);
          session.editingUsers = Array.from(new Set(editingUsers)).sort();

          return session;
        }).reverse();
    }

    if (this.documentChanges) {
      const timestampBegin = this.sessions.length ? this.sessions[0].timestampEnded : null;
      this.currentChanges = this.getDocumentChangesSubset(timestampBegin).reverse();
      const editingUsers = this.currentChanges.map(change => change.editing_user.name);
      this.currentEditingUsers = Array.from(new Set(editingUsers)).sort();
    }
  }

  private getDocumentChangesSubset(timestampBegin: string = null, timestampEnd: string = null) {
    if (timestampEnd && timestampBegin) {
      return this.documentChanges
            .filter(change => change.timestamp_changed > timestampBegin && change.timestamp_changed <= timestampEnd);
    } else if (timestampEnd) {
      return this.documentChanges
            .filter(change => change.timestamp_changed <= timestampEnd);
    } else if (timestampBegin) {
      return this.documentChanges
            .filter(change => change.timestamp_changed > timestampBegin);
    } else {
      return [...this.documentChanges];
    }
  }
}
