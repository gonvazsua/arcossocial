import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, Observer, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainStateService } from '../../main.state.service';
import { Beneficiary } from '../../models/beneficiary';
import { Entity } from '../../models/entity';
import { BeneficiaryService } from '../beneficiary.service';

declare const M: any;

@Component({
  selector: 'app-beneficiaryform',
  templateUrl: './beneficiaryform.component.html',
  styleUrls: ['./beneficiaryform.component.css']
})
export class BeneficiaryformComponent implements OnInit {

  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter();

  beneficiaryForm: FormGroup;
  error: string[];
  successSaved: boolean;
  loading: boolean;
  userEntity: Entity;
  beneficiary: Beneficiary;

  constructor(private fb: FormBuilder, private beneficiaryService: BeneficiaryService, public mainState: MainStateService) {
    this.beneficiaryForm = this.fb.group({
      id: [''],
      fullName: ['', Validators.required],
      dni: ['', Validators.required],
      address: ['', Validators.required],
      valuationCard: ['', Validators.required],
      valuationDate: [''],
      mateFullName: [''],
      mateDni: [''],
      familySize: ['', Validators.required],
      uts: ['']
    });

    this.error = null;
    this.successSaved = false;
    this.loading = false;
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(mainState => {
      this.beneficiary = mainState.selectedBeneficiary;
      this.userEntity = mainState.userEntity;
      if(this.beneficiary) {
        this.initFormWithValues();
      } else {
        this.clearForm();
      }
    });
  }

  initFormWithValues() {
    this.beneficiaryForm.patchValue({
      id: this.beneficiary._id,
      fullName: this.beneficiary.fullName,
      dni: this.beneficiary.dni,
      address: this.beneficiary.address,
      valuationCard: this.beneficiary.valuationCard ? 'true' : 'false',
      valuationDate: this.beneficiary.valuationDate ? new Date(this.beneficiary.valuationDate).getTime() : null,
      mateFullName: this.beneficiary.mate ? this.beneficiary.mate.fullName : null,
      mateDni: this.beneficiary.mate ? this.beneficiary.mate.dni : null,
      familySize: this.beneficiary.familySize,
      uts: this.beneficiary.uts
    });
    if(this.beneficiary.valuationDate) {
      (<HTMLInputElement>document.getElementById("valuationDate")).value = this.getDateAsString(new Date(this.beneficiary.valuationDate));
    } else {
      (<HTMLInputElement>document.getElementById("valuationDate")).value = '';
    }
    if(this.beneficiary.uts) {
      (<HTMLInputElement>document.getElementById("uts")).value = this.beneficiary.uts;
    } else {
      (<HTMLInputElement>document.getElementById("uts")).value = '';
    }
    M.updateTextFields();
    this.updateSelectField('valuationCard', '');
    this.updateSelectField('uts', '');
  }

  updateSelectField(id: string, value: string): void {
    var select = document.querySelector('#' + id)
    M.FormSelect.init(select, value);
  }

  getDateAsString(date: Date): string {
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if(month < 10){
      return `${day}/0${month}/${year}`;
    }else{
      return `${day}/${month}/${year}`;
    }
  }

  closeModal() {
    this.clearForm();
    this.closeModalEvent.emit(true);
  }

  validateAndSaveBeneficiary() {
    this.error = [];
    if(!this.beneficiaryForm.valid) {
      this.error.push("Los campos Nombre, DNI, Dirección, Carta de valoración y Tamaño de unidad familiar son obligatorios");
      return;
    }
    this.successSaved = false;
    const validValuationCardFields: Observable<Boolean> = this.validateMandatoryFields();
    const validDNIFormat: Observable<Boolean> = this.validateDNIFormat('dni');
    const validDateFormat: Observable<Boolean> = this.validateValuationDateFormat();
    const validMateData: Observable<Boolean> = this.validateMateData();
    const validMateDNIFormat: Observable<Boolean> = this.validateDNIFormat('mateDni');
    const validValuationDate: Observable<Boolean> = this.validateValuationDate();
    let validations = [validValuationCardFields, validDNIFormat, validDateFormat, validMateData, validMateDNIFormat, validValuationDate];

    if(!this.beneficiary) {
      const validDniBeneficiaryExists: Observable<Boolean> = this.validateDniExists(this.beneficiaryForm.get('dni').value);
      validations.push(validDniBeneficiaryExists);
    }

    if(this.beneficiaryForm.get('mateDni').value && !this.beneficiary) {
      const validMateDniExists: Observable<Boolean> = this.validateDniExists(this.beneficiaryForm.get('mateDni').value);
      validations.push(validMateDniExists);
    }

    forkJoin(validations).subscribe(validResults => {
      if(validResults[0] == false) this.error.push("Si se seleccionas carta de valoración, tienes que informar una fecha");
      if(validResults[1] == false) this.error.push("El formato del DNI del beneficiario no es válido. Ejemplo: 12345678A");
      if(validResults[2] == false) this.error.push("Introduce una fecha válida: Formato DD/MM/AAAA");
      if(validResults[3] == false) this.error.push("Introduce el DNI de la pareja");
      if(validResults[4] == false) this.error.push("El formato del DNI de la pareja no es válido. Ejemplo: 12345678A");
      if(validResults[5] == false) this.error.push("La fecha de la carta de valoración tiene que ser anterior o igual a hoy");
      if(validResults.length >= 7) {
        if(validResults[6] == false) this.error.push("Ya existe un beneficiario registrado con ese DNI");
      }
      if(validResults.length == 8) {
        if(validResults[7] == false) this.error.push("Ya existe un beneficiario registrado con el DNI de la pareja");
      }
      if(this.error.length == 0) {
        this.upsertBeneficary();
      }
    });
  }

  validateValuationDateFormat(): Observable<Boolean> {
    if(this.beneficiaryForm.get('valuationCard').value == 'true') {
      const dateValue = (<HTMLInputElement>document.getElementById('valuationDate')).value;
      const validDate = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(dateValue);
      return of(validDate);
    } 
    return of(true);    
  }

  validateMandatoryFields(): Observable<Boolean> {
    const hasValuationCard = this.beneficiaryForm.get('valuationCard').value == 'true';
    return of((hasValuationCard && this.beneficiaryForm.get('valuationDate').value) || !hasValuationCard);
  }

  validateDNIFormat(fieldName): Observable<Boolean> {
    if(this.beneficiaryForm.get(fieldName).value) {
      const validDni = /^\d{8}[a-zA-Z]$/.test(this.beneficiaryForm.get(fieldName).value);
      return of(validDni);
    }
    return of(true);
  }

  validateMateData(): Observable<Boolean> {
    if(this.beneficiaryForm.get('mateFullName').value && !this.beneficiaryForm.get('mateDni').value) {
      return of(false);
    }
    return of(true);
  }

  validateValuationDate() {
    if(this.beneficiaryForm.get('valuationDate').value) {
      const valDate = new Date(this.beneficiaryForm.get('valuationDate').value);
      var today = new Date();
      return of(valDate <= today);
    }
    return of(true);
  }

  validateDniExists(dni: string): Observable<Boolean> {
    const parameters = {'dni' : dni};
    return this.beneficiaryService.countBeneficiaries(parameters)
      .pipe(
        map(counter => counter == 0 ? true : false)
      );
  }

  updateValuationDate(event) {
    if(event.target.value && event.target.value == 'false') {
      (<HTMLInputElement>document.getElementById("valuationDate")).value = null;
      this.beneficiaryForm.get('valuationDate').setValue(null);
    }
  }

  upsertBeneficary() {
    this.loading = true;
    const beneficiaryToSave = this.buildBeneficiary();
    if(beneficiaryToSave._id) {
      this.updateBeneficiary(beneficiaryToSave);
    } else {
      this.insertBeneficiary(beneficiaryToSave);
    }
  }

  insertBeneficiary(beneficiaryToSave: Beneficiary) {
    this.beneficiaryService.saveBeneficiary(beneficiaryToSave).subscribe(
      beneficiary => {
        this.clearForm();
        this.successSaved = true;
        setTimeout(() => { this.successSaved = false }, 5000);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.error.push(error.error.message);
        this.loading = false;
      }
    );
  }

  updateBeneficiary(beneficiaryToSave: Beneficiary) {
    this.beneficiaryService.updateBeneficiary(beneficiaryToSave).subscribe(
      beneficiary => {
        this.clearForm();
        this.successSaved = true;
        setTimeout(() => { this.successSaved = false }, 5000);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.error.push(error.error.message);
        this.loading = false;
      }
    );
  }

  buildBeneficiary(): Beneficiary {
    let beneficiary: Beneficiary = new Beneficiary();
    beneficiary._id = this.beneficiaryForm.get('id').value;
    beneficiary.fullName = this.beneficiaryForm.get('fullName').value;
    beneficiary.dni = this.beneficiaryForm.get('dni').value;
    beneficiary.address = this.beneficiaryForm.get('address').value;
    beneficiary.valuationCard = this.beneficiaryForm.get('valuationCard').value == 'true';
    beneficiary.valuationDate = this.beneficiaryForm.get('valuationDate').value;
    beneficiary.creationDate = this.beneficiary ? new Date(this.beneficiary.creationDate) : new Date();
    beneficiary.familySize = this.beneficiaryForm.get('familySize').value;
    beneficiary.isActive = true;
    const mate = {
      dni: this.beneficiaryForm.get('mateDni').value,
      fullName : this.beneficiaryForm.get('mateFullName').value
    };
    beneficiary.mate = mate;
    beneficiary.entity = this.beneficiary ? this.beneficiary.entity : this.userEntity;
    beneficiary.uts = this.beneficiaryForm.get('uts').value;
    return beneficiary;
  }

  clearForm() {
    this.beneficiaryForm.reset();
    if((<HTMLInputElement>document.getElementById("valuationDate"))) {
      (<HTMLInputElement>document.getElementById("valuationDate")).value = null;
    }
    this.updateSelectField('uts', '');
    this.updateSelectField('valuationCard', '');
  }

}
