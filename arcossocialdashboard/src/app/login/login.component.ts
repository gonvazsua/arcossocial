import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg: string;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    
    this.errorMsg = null;

    this.loginForm = this.fb.group({
      userCode: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submitLogin() {
    if(this.loginForm.valid) {
      this.loginService
        .executeLogin(this.loginForm.value["userCode"], this.loginForm.value["password"])
        .subscribe(
          data => this.saveTokenAndRedirect(data["token"]),
          err => this.errorMsg = err.error.message);
    }
  }

  saveTokenAndRedirect(token: string) {
    localStorage.setItem("as_token", token);
    this.router.navigate(['/main']);
  }

}
