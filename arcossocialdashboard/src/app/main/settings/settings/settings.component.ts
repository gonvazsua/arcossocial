import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainStateService } from '../../main.state.service';
import { Entity } from '../../models/entity';
import { StaticData } from '../../models/staticData';
import { UserService } from '../../users/user.service';
import { SettingsService } from '../settings.service';

declare const M: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  entities: Entity[];
  selectedEntity: Entity;
  entityForm: FormGroup;
  entityErrors: string[];
  successActiveUsers: boolean;

  constructor(private mainState: MainStateService, private fb: FormBuilder, private settingsService: SettingsService, private userService: UserService) {
    this.entityForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.entityErrors = [];
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => {
      this.entities = state.entities;
    });
  }

  setSelectedEntity(entity: Entity) {
    this.selectedEntity = entity;
    if(entity) {
      this.entityForm.patchValue({
        code: this.selectedEntity.code,
        name: this.selectedEntity.name
      });
    } else {
      this.entityForm.reset();
    }
    M.updateTextFields();
  }

  setActiveSelectedEntity(active: boolean) {
    this.mainState.setLoading(true);
    this.selectedEntity.isActive = active;
    this.settingsService.updateEntity(this.selectedEntity).subscribe(updatedEntity => {
      this.mainState.setEntities(this.entities);
      this.userService.setActivateUsersByEntityCode(this.selectedEntity.code, active).subscribe(
        result => { this.successActiveUsers = true },
        error => {}
      )
    });
    setTimeout(() => {this.mainState.setLoading(false)}, 2000);
    setTimeout(() => this.successActiveUsers = false, 10000);
  }

  validateAndSaveEntity() {
    this.mainState.setLoading(true);
    this.entityErrors = [];
    if(!this.selectedEntity && !this.isValidEntityCode()) {
      this.entityErrors.push('El código de entidad seleccionado ya existe');
      this.mainState.setLoading(false);
      return;
    }
    if(!this.selectedEntity) {
      this.saveNewEntity();
    } else {
      this.updateEntity();
    }
  }

  isValidEntityCode() {
    return this.entities.filter(e => e.code === this.entityForm.get('code').value).length === 0;
  }

  saveNewEntity() {
    let entity: Entity = this.entityForm.value;
    entity.isActive = true;
    this.settingsService.saveEntity(entity).subscribe(
      savedEntity => {
        this.entities.push(savedEntity);
        this.mainState.setEntities(this.entities);
        this.mainState.setLoading(false);
        this.entityForm.reset();
      },
      err => {
        this.entityErrors.push(err.error.message);
        this.mainState.setLoading(false);
      }
    );
  }

  updateEntity() {
    let entity = this.entityForm.value;
    entity._id = this.selectedEntity._id;
    entity.creationDate = this.selectedEntity.creationDate ? new Date(this.selectedEntity.creationDate).getTime() : null;
    entity.isActive = this.selectedEntity.isActive;
    this.settingsService.updateEntity(entity).subscribe(
      savedEntity => {
        this.selectedEntity = savedEntity;
        const newEntities = this.entities.filter(e => e.code !== savedEntity.code);
        newEntities.push(savedEntity);
        this.mainState.setEntities(newEntities);
        this.mainState.setLoading(false);
        this.entityForm.reset();
      },
      err => {
        this.entityErrors.push(err.error.message);
        this.mainState.setLoading(false);
      }
    );
  }

}
