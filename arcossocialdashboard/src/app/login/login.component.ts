import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../common/local-storage.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg: string;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,
    private localStorageService: LocalStorageService) {
    
    this.errorMsg = null;

    this.loginForm = this.fb.group({
      userCode: ['', Validators.required],
      password: ['', Validators.required],
      keepConnected : [false]
    });
  }

  ngOnInit(): void {
    this.checkKeepConnected();
  }

  submitLogin() {
    if(this.loginForm.valid) {
      const cryptedPassword = btoa(this.loginForm.value["password"]);
      this.loginService
        .executeLogin(this.loginForm.value["userCode"], cryptedPassword)
        .subscribe(
          data => this.saveDataAndRedirect(data["token"]),
          err => {
            this.localStorageService.clear();
            this.errorMsg = err.error.message
          });
    }
  }

  saveDataAndRedirect(token: string) {
    this.localStorageService.setToken(token);
    const keepConnected = this.loginForm.value["keepConnected"];
    this.localStorageService.setKeepConnected(keepConnected);
    this.localStorageService.setUserCode(this.loginForm.value["userCode"]);
    this.localStorageService.setPassword(this.loginForm.value["password"]);
    this.localStorageService.setToken(token);
    this.router.navigate(['main/helps']);
  }

  checkKeepConnected() {
    const keepConnected = this.localStorageService.keepConnected;
    const userCode = this.localStorageService.userCode;
    const password = this.localStorageService.password;
    if(keepConnected && userCode && password) {
      this.loginForm.patchValue({
        keepConnected: keepConnected,
        userCode: userCode,
        password: atob(password)
      });
      this.submitLogin();
    } else {
      this.localStorageService.clear();
    }
  }

  isUATEnvironment() {
    return !environment.production;
  }

}
