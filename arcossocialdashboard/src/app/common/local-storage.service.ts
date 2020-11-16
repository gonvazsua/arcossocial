import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  keepConnected: boolean;
  userCode: string;
  password: string;
  token: string;

  constructor() {
    this.initializeValues();
  }

  initializeValues() {
    const keepConnected = localStorage.getItem("asKeepConnected");
    if(keepConnected) this.keepConnected = Boolean(keepConnected);

    const userCode = localStorage.getItem("asUserCode");
    if(userCode) this.userCode = userCode;

    const password = localStorage.getItem("asPassword");
    if(password) this.password = password;

    const token = localStorage.getItem("asToken");
    if(token) this.token = token;
  }

  setKeepConnected(keepConnected: boolean) {
    localStorage.setItem("asKeepConnected", String(keepConnected));
  }

  setUserCode(userCode: string) {
    localStorage.setItem("asUserCode", userCode);
  }

  setPassword(password: string) {
    localStorage.setItem("asPassword", btoa(password));
  }
  
  setToken(token: string) {
    localStorage.setItem("asToken", token);
  }

  clear() {
    localStorage.clear()
    this.initializeValues();
  }

}
