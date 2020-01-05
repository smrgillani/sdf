import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorage {
  constructor() { }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  delete(key: string) {
    localStorage.removeItem(key);
  }

  deleteAll() {
    localStorage.clear();
  }
}
