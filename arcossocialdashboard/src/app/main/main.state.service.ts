import { EventEmitter, Injectable } from '@angular/core';
import { MainState } from './models/mainstate';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class MainStateService {

  state: EventEmitter<MainState> = new EventEmitter();
  stateModel: MainState;

  constructor() {
    this.initializeMainState();
  }

  initializeMainState() {
    this.stateModel = new MainState(null);
    this.stateModel.loading = false;
    this.stateModel.user = new User();
    this.state.emit(this.stateModel);
  }

  setLoading(loading: boolean) {
    this.stateModel.loading = loading;
    const state = new MainState(this.stateModel);
    this.state.emit(state);
  }

}
