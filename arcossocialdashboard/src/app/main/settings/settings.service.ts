import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entity } from '../models/entity';
import { StaticData } from '../models/staticData';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  saveEntity(entity: Entity): Observable<Entity> {
    return this.http.post<Entity>(environment.apiUrl + 'entities', entity);
  }

  updateEntity(entity: Entity): Observable<Entity> {
    return this.http.put<Entity>(environment.apiUrl + 'entities', entity);
  }

  saveHelpType(helpType: StaticData): Observable<StaticData> {
    return this.http.put<StaticData>(environment.apiUrl + 'staticData', helpType);
  }

  saveUtsValues(utsValue: StaticData): Observable<StaticData> {
    return this.http.put<StaticData>(environment.apiUrl + 'staticData', utsValue);
  }

}
