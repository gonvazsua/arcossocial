import { Help } from './help';
import { StaticData } from './staticData';
import { User } from './user';

export class MainState {
    user: User;
    loading: boolean;
    helpType: StaticData;
    entity: StaticData;
    helps: Help[];
    helpsCounter: number;

    constructor(state: MainState) {
        if(!state) return;

        this.user = state.user
        this.loading = state.loading;
        this.helpType = state.helpType;
        this.entity = state.entity;
        this.helps = state.helps;
        this.helpsCounter = state.helpsCounter;
        
    }
}