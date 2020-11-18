import { Component, OnInit } from '@angular/core';
import { MainStateService } from './main.state.service';
import { Observable, forkJoin } from 'rxjs';
import { MainService } from './main.service';
import { User } from './models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public mainState: MainStateService, private mainService: MainService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.mainState.setLoading(true);
    const _loggedUser: Observable<User> = this.mainService.getLoggedUser();
    forkJoin([_loggedUser])
      .subscribe(results => {
        this.mainState.setUser(results[0]);
        this.mainState.setLoading(false);
      });
  }

}
