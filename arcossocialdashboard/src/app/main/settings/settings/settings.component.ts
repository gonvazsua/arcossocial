import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainStateService } from '../../main.state.service';
import { Entity } from '../../models/entity';
import { StaticData } from '../../models/staticData';
import { SettingsService } from '../settings.service';

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

  helpTypes: StaticData;
  helpTypeForm: FormGroup;
  selectedHelpType: {label: string, value: string};
  helpTypeErrors: string[];

  constructor(private mainState: MainStateService, private fb: FormBuilder, private settingsService: SettingsService) {
    this.entityForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.entityErrors = [];
    this.helpTypeForm = this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => {
      this.entities = state.entities;
      this.helpTypes = state.helpType;
    });
  }

  setSelectedEntity(entity: Entity) {
    this.selectedEntity = entity;
  }

  setActiveSelectedEntity(active: boolean) {
    this.mainState.setLoading(true);
    this.selectedEntity.isActive = active;
    this.settingsService.updateEntity(this.selectedEntity).subscribe(updatedEntity => this.mainState.setEntities(this.entities));
    setTimeout(() => {this.mainState.setLoading(false)}, 1500);
  }

  validateAndSaveEntity() {
    this.mainState.setLoading(true);
    this.entityErrors = [];
    if(!this.isValidEntityCode()) {
      this.entityErrors.push('El código de entidad seleccionado ya existe');
      this.mainState.setLoading(false);
      return;
    }
    this.saveNewEntity();
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

  setSelectedHelpType(helpTypeValue) {
    this.selectedHelpType = helpTypeValue;
  }

  removeSelectedHelpTypeValue() {
    const newValues = this.helpTypes.values.filter(v => v.value !== this.selectedHelpType.value);
    this.helpTypes.values = newValues;
    this.saveHelpType();
  }

  saveHelpType() {
    this.mainState.setLoading(true);
    this.settingsService.saveHelpType(this.helpTypes).subscribe(
      ht => {
        this.mainState.setHelpType(this.helpTypes);
        this.helpTypeForm.reset();
      }
    );
    setTimeout(() => {this.mainState.setLoading(false)}, 1500);
  }

  validateAndSaveHelpType() {
    this.mainState.setLoading(true);
    this.helpTypeErrors = [];
    if(!this.isValidHelpType()) {
      this.helpTypeErrors.push('El valor seleccionado está duplicado');
      this.mainState.setLoading(false);
      return;
    }
    this.helpTypes.values.push(this.helpTypeForm.value);
    this.saveHelpType();
  }

  isValidHelpType() {
    return this.helpTypes.values.filter(v => v.value === this.helpTypeForm.get('value').value).length === 0;
  }

}
