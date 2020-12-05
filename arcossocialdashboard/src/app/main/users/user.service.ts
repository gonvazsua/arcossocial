import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  PAGE_SIZE_KEY: string = "pageSize";

  constructor(private http: HttpClient) { }

  countUsers(parameters): Observable<number> {
    const params = this.getParameters(parameters);
    return this.http.get<number>(environment.apiUrl + 'users/count', {params});
  }

  searchUsers(parameters): Observable<User[]> {
    const params = this.getParameters(parameters);
    return this.http.get<User[]>(environment.apiUrl + 'users', {params});
  }

  insertUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'users', user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(environment.apiUrl + 'users', user);
  }

  getParameters(parameters): HttpParams {
    let params = new HttpParams();
    params = params.set(this.PAGE_SIZE_KEY, environment.pageSize);
    for (var key in parameters) {
      if(parameters[key]) params = params.set(key, parameters[key]);
    }
    return params;
  }
}
