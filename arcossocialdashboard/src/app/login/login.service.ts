import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  executeLogin(userCode: string, password: string) {
    const body = {userCode: userCode, password: password};
    return this.http.post(environment.apiUrl + 'auth/login', body)
  }

}
