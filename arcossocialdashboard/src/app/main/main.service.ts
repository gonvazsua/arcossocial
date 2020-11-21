import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../common/local-storage.service';
import { User } from './models/user';
import { map } from 'rxjs/operators';
import { StaticData } from './models/staticData';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient, private localstorageService: LocalStorageService) { }

  getLoggedUser(): Observable<User> {
    const userCode = this.localstorageService.userCode;
    const params = new HttpParams().set('userCode', userCode);
    return this.http
      .get<User[]>(environment.apiUrl + "users", {params})
      .pipe(map(users => users[0]));
  }

  loadStaticDataByName(name: string): Observable<StaticData> {
    const params = new HttpParams().set('name', name);
    return this.http
      .get<StaticData[]>(environment.apiUrl + "staticData", {params})
      .pipe(map(staticsData => staticsData[0]));
  }

}
