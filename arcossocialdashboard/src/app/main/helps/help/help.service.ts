import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Help } from '../../models/help';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  PAGE_SIZE_KEY: string = "pageSize";

  constructor(private http: HttpClient) { }

  searchHelps(parameters): Observable<Help[]> {
    const params = this.getParameters(parameters, environment.pageSize);
    return this.http.get<Help[]>(environment.apiUrl + 'helps', {params});
  }

  countHelps(parameters): Observable<number> {
    const params = this.getParameters(parameters, environment.pageSize);
    return this.http.get<number>(environment.apiUrl + 'helps/count', {params});
  }

  getParameters(parameters, pageSize): HttpParams {
    let params = new HttpParams();
    params = params.set(this.PAGE_SIZE_KEY, pageSize);
    for (var key in parameters) {
      if(parameters[key]) params = params.set(key, parameters[key]);
    }
    return params;
  }

  saveHelp(help: Help) {
    return this.http.post(environment.apiUrl + 'helps', help);
  }

  exportHelps(parameters, totalHelps): Observable<Help[]> {
    let params: HttpParams = this.getParameters(parameters, environment.exportSize);
    const counter = this.calculateNumberHttpCalls(totalHelps, environment.exportSize);
    return new Observable((observer) => {
      Array.from(Array(counter).keys())
        .map(pageNumber => {
          params = params.set('pageNumber', (pageNumber + 1).toString());
          this.http.get<Help[]>(environment.apiUrl + 'helps', {params}).subscribe(helps => observer.next(helps));
        });
    });
  }

  calculateNumberHttpCalls(totalData: number, pageSize: string) {
    const pageSizeInt = parseInt(pageSize);
    const pagesDecimal = totalData / pageSizeInt;
    return Math.trunc(pagesDecimal) + 1;
  }

}
