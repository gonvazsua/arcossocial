import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private router: Router, private localStorageService: LocalStorageService) { }

  canActivate(): boolean{
    let token = this.localStorageService.token;
    if (token == null){
      this.router.navigate(['login']);
      return false
    }
    return true;
  }
}
