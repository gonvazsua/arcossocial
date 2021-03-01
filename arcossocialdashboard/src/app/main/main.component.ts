import { Component, OnInit } from '@angular/core';
import { MainStateService } from './main.state.service';
import { Observable, forkJoin } from 'rxjs';
import { MainService } from './main.service';
import { User } from './models/user';
import { StaticData } from './models/staticData';
import { Entity } from './models/entity';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public mainState: MainStateService, private mainService: MainService, private router: Router) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.mainState.setLoading(true);
    const _loggedUser: Observable<User> = this.mainService.getLoggedUser();
    const _helpType: Observable<StaticData> = this.mainService.loadStaticDataByName('HelpType');
    const _entities: Observable<Entity[]> = this.mainService.loadEntities();
    forkJoin([_loggedUser, _helpType, _entities])
      .subscribe(results => {
        const user = results[0];
        if(!user) this.router.navigate(['/login']);
        const helpType = results[1];
        const entities = results[2];
        this.mainState.setUser(user);
        this.mainState.setHelpType(helpType);
        this.mainState.setEntities(entities);
        const userEntity = this.findUserEntity(entities, user.entityCode);
        this.mainState.setUserEntity(userEntity);
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
      });
  } 

  findUserEntity(entities: Entity[], entityCode: string) {
    const userEntities =  entities.filter(e => e.code === entityCode);
    return userEntities.pop();
  }

  isUATEnvironment() {
    return !environment.production;
  }

}
