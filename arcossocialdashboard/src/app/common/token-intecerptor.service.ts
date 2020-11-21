import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenIntecerptorService implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string = this.localStorageService.token;

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          'x-access-token' : token
        }
      });
    }

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status === 403) {
            this.localStorageService.clear();
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
  }

}
