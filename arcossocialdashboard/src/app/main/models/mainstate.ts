import { User } from './user';

export class MainState {
    user: User;
    loading: boolean;

    constructor(state: MainState) {
        if(!state) return;

        this.user = state.user
        this.loading = state.loading;
        
    }
}