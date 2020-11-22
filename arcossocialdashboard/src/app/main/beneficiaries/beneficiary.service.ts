import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Beneficiary } from '../models/beneficiary';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  PAGE_SIZE_KEY: string = "pageSize";

  constructor(private http: HttpClient) { }

  findByName(name: string): Observable<Beneficiary[]> {
    let params = new HttpParams().set('fullName', name);
    return this.http.get<Beneficiary[]>(environment.apiUrl + 'beneficiaries', {params});
  }

  countBeneficiaries(parameters): Observable<number> {
    const params = this.getParameters(parameters);
    return this.http.get<number>(environment.apiUrl + 'beneficiaries/count', {params});
  }

  searchBeneficiaries(parameters): Observable<Beneficiary[]> {
    const params = this.getParameters(parameters);
    return this.http.get<Beneficiary[]>(environment.apiUrl + 'beneficiaries', {params});
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
