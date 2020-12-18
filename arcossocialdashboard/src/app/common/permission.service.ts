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

  constructor(private mainState: MainStateService) {
    this.mainState.state.subscribe(state => this.updatePermissions(state));
  }

  updatePermissions(state: MainState) {
    this.isAdmin = this.isUserAdmin(state);
    this.canEditBeneficary = this.checkCanEditBeneficiary(state);
    this.canReactivateBeneficiary = this.checkCanReactivateBeneficiary(state);
    this.canDeactivateBeneficiary = this.checkCanDeactivateBeneficiary(state);
  }

  isUserAdmin(state: MainState): boolean {
    return state.user.isAdmin;
  }

  checkCanEditBeneficiary(state: MainState): boolean {
    return (this.isUserAdmin(state) && state.selectedBeneficiary?.isActive) || state.selectedBeneficiary && state.selectedBeneficiary.entity.code === state.user.entityCode && state.selectedBeneficiary.isActive;
  }

  checkCanReactivateBeneficiary(state: MainState): boolean {
    return (this.isUserAdmin(state) && !state.selectedBeneficiary?.isActive) || state.selectedBeneficiary && state.selectedBeneficiary.entity.code === state.user.entityCode && !state.selectedBeneficiary.isActive;
  }

  checkCanDeactivateBeneficiary(state: MainState): boolean {
    return (this.isUserAdmin(state) && state.selectedBeneficiary?.isActive) || state.selectedBeneficiary && state.selectedBeneficiary.entity.code === state.user.entityCode && state.selectedBeneficiary.isActive;
  }
  
}
