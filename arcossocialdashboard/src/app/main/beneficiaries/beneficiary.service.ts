import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Beneficiary } from '../models/beneficiary';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  constructor(private http: HttpClient) { }

  findByName(name: string): Observable<Beneficiary[]> {
    let params = new HttpParams().set('fullName', name);
    return this.http.get<Beneficiary[]>(environment.apiUrl + 'beneficiaries', {params});
  }

}
