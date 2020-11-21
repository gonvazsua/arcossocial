import { Component, OnInit } from '@angular/core';
import { MainStateService } from './main.state.service';
import { Observable, forkJoin } from 'rxjs';
import { MainService } from './main.service';
import { User } from './models/user';
import { StaticData } from './models/staticData';

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
    const _helpType: Observable<StaticData> = this.mainService.loadStaticDataByName('HelpType');
    const _entities: Observable<StaticData> = this.mainService.loadStaticDataByName('Entity');
    forkJoin([_loggedUser, _helpType, _entities])
      .subscribe(results => {
        this.mainState.setUser(results[0]);
        this.mainState.setHelpType(results[1]);
        this.mainState.setEntity(results[2]);
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
      });
  }

}
