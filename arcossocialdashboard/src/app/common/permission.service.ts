import { Injectable } from '@angular/core';
import { MainStateService } from '../main/main.state.service';
import { MainState } from '../main/models/mainstate';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  isAdmin: boolean;
  canEditBeneficary: boolean;
  canReactivateBeneficiary: boolean;
  canDeactivateBeneficiary: boolean;
  canUpdateUTS: boolean;

  constructor(private mainState: MainStateService) {
    this.mainState.state.subscribe(state => this.updatePermissions(state));
  }

  updatePermissions(state: MainState) {
    this.isAdmin = this.isUserAdmin(state);
    this.canEditBeneficary = this.checkCanEditBeneficiary(state);
    this.canReactivateBeneficiary = this.checkCanReactivateBeneficiary(state);
    this.canDeactivateBeneficiary = this.checkCanDeactivateBeneficiary(state);
    this.canUpdateUTS = this.checkCanUpdateUTS(state);
  }

  isUserAdmin(state: MainState): boolean {
    return state.user.isAdmin;
  }

  isActiveBeneficiary(state: MainState): boolean {
    return state.selectedBeneficiary && state.selectedBeneficiary?.isActive;
  }

  isSameEntity(state: MainState): boolean {
    return state.selectedBeneficiary && state.selectedBeneficiary.entity.code === state.user.entityCode;
  }

  isSSOEntity(state: MainState): boolean {
    return state.selectedBeneficiary && state.user.entityCode === 'SSO';
  }

  checkCanEditBeneficiary(state: MainState): boolean {
    return this.isActiveBeneficiary(state) && (this.isUserAdmin(state) || this.isSameEntity(state) || this.isSSOEntity(state));
  }

  checkCanReactivateBeneficiary(state: MainState): boolean {
    return !this.isActiveBeneficiary(state) && (this.isUserAdmin(state) || this.isSameEntity(state) || this.isSSOEntity(state));
  }

  checkCanDeactivateBeneficiary(state: MainState): boolean {
    return this.isActiveBeneficiary(state) && (this.isUserAdmin(state) || this.isSameEntity(state) || this.isSSOEntity(state));
  }

  checkCanUpdateUTS(state: MainState): boolean {
    return this.isUserAdmin(state) || this.isSSOEntity(state);
  }
  
}
