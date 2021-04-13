import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainStateService } from '../../main.state.service';
import { StaticData } from '../../models/staticData';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-uts-management',
  templateUrl: './uts-management.component.html',
  styleUrls: ['./uts-management.component.css']
})
export class UtsManagementComponent implements OnInit {

  utsValues: StaticData;
  selectedUtsValue: {label: string, value: string};
  utsValueForm: FormGroup;
  utsValueErrors: string[];

  constructor(private mainState: MainStateService, private fb: FormBuilder, private settingsService: SettingsService) {
    this.utsValueForm = this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => {
      this.utsValues = state.utsValues;
    });
  }

  setSelectedUtsValue(utsValue) {
    this.selectedUtsValue = utsValue;
  }

  removeSelectedUtsValue() {
    const newValues = this.utsValues.values.filter(v => v.value !== this.selectedUtsValue.value);
    this.utsValues.values = newValues;
    this.saveUtsValue();
  }

  saveUtsValue() {
    this.mainState.setLoading(true);
    this.settingsService.saveUtsValues(this.utsValues).subscribe(
      uv => {
        this.mainState.setUtsValues(this.utsValues);
        this.utsValueForm.reset();
      }
    );
    setTimeout(() => {this.mainState.setLoading(false)}, 1500);
  }

  validateAndSaveUtsValue() {
    this.mainState.setLoading(true);
    this.utsValueErrors = [];
    if(!this.isValidUtsValue()) {
      this.utsValueErrors.push('El valor seleccionado está duplicado');
      this.mainState.setLoading(false);
      return;
    }
    this.utsValues.values.push(this.utsValueForm.value);
    this.saveUtsValue();
  }

  isValidUtsValue() {
    return this.utsValues.values.filter(v => v.value === this.utsValueForm.get('value').value).length === 0;
  }

}
