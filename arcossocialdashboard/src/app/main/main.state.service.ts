import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Entity } from './models/entity';
import { Help } from './models/help';
import { MainState } from './models/mainstate';
import { StaticData } from './models/staticData';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class MainStateService {

  state: BehaviorSubject<MainState> = null;
  stateModel: MainState;

  constructor() {
    this.state = new BehaviorSubject(new MainState(null));
    this.stateModel = this.initializeMainState()
    this.state.next(this.stateModel);
  }

  initializeMainState(): MainState {
    const stateModel = new MainState(null);
    stateModel.loading = false;
    stateModel.user = new User();
    stateModel.helpsCounter = 0;
    return stateModel;
  }

  setLoading(loading: boolean) {
    this.stateModel.loading = loading;
    this.updateState();
  }

  setUser(user: User) {
    this.stateModel.user = user;
    this.updateState();
  }

  setHelpType(helpType: StaticData) {
    this.stateModel.helpType = helpType;
    this.updateState();
  }

  setEntity(entity: StaticData) {
    this.stateModel.entity = entity;
    this.updateState();
  }

  setHelps(helps: Help[]) {
    this.stateModel.helps = helps;
    this.updateState();
  }

  setHelpsCounter(helpsCounter: number) {
    this.stateModel.helpsCounter = helpsCounter;
    this.updateState();
  }

  setSelectedHelp(selectedHelp: Help) {
    this.stateModel.selectedHelp = selectedHelp;
    this.updateState();
  }

  updateState() {
    const state = new MainState(this.stateModel);
    this.state.next(state);
  }

}
