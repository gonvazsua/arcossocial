import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainStateService } from '../../main.state.service';
import { StaticData } from '../../models/staticData';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-help-type-management',
  templateUrl: './help-type-management.component.html',
  styleUrls: ['./help-type-management.component.css']
})
export class HelpTypeManagementComponent implements OnInit {

  helpTypes: StaticData;
  helpTypeForm: FormGroup;
  selectedHelpType: {label: string, value: string};
  helpTypeErrors: string[];

  constructor(private mainState: MainStateService, private fb: FormBuilder, private settingsService: SettingsService) {
    this.helpTypeForm = this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => {
      this.helpTypes = state.helpType;
    });
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
