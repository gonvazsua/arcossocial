import { Beneficiary } from './beneficiary';
import { Entity } from './entity';
import { Help } from './help';
import { StaticData } from './staticData';
import { User } from './user';

export class MainState {
    user: User;
    loading: boolean;
    helpType: StaticData;
    entities: Entity[];
    helps: Help[];
    helpsCounter: number;
    selectedHelp: Help;
    userEntity: Entity;
    beneficiaries: Beneficiary[];
    beneficiariesCounter: number;
    selectedBeneficiary: Beneficiary;

    constructor(state: MainState) {
        if(!state) return;

        this.user = state.user
        this.loading = state.loading;
        this.helpType = state.helpType;
        this.entities = state.entities;
        this.helps = state.helps;
        this.helpsCounter = state.helpsCounter;
        this.selectedHelp = state.selectedHelp;
        this.userEntity = state.userEntity;
        this.beneficiaries = state.beneficiaries;
        this.beneficiariesCounter = state.beneficiariesCounter;
        this.selectedBeneficiary = state.selectedBeneficiary;
        
    }
}