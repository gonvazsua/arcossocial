import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BeneficiaryService } from '../../beneficiaries/beneficiary.service';
import { MainStateService } from '../../main.state.service';
import { Beneficiary } from '../../models/beneficiary';
import { Help } from '../../models/help';
import { HelpService } from '../help/help.service';

declare const M: any;

@Component({
  selector: 'app-newhelp',
  templateUrl: './newhelp.component.html',
  styleUrls: ['./newhelp.component.css']
})
export class NewhelpComponent implements OnInit {

  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter();

  newHelp: Help;
  selectedBeneficiary: Beneficiary;
  helpType = new FormControl('', Validators.required);
  beneficiary = new FormControl('', Validators.required);
  notes = new FormControl('', Validators.required);
  beneficiaryList : Beneficiary[];
  error: string;
  successSaved: boolean;

  constructor(public mainState: MainStateService, private beneficiaryService: BeneficiaryService, private helpService: HelpService) {
    this.newHelp = new Help();
    this.beneficiaryList = [];
    this.selectedBeneficiary = null;
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(
      state => {
        this.newHelp.entity = state.userEntity;
        this.newHelp.user = state.user;
      }
    );
    this.initializeHelpTypeSelect();
    this.initializeBeneficiarySelect(true);
  }

  ngAfterViewInit() {
    this.initializeHelpTypeSelect();
  }

  refreshBeneficiaries(event) {
    const beneficiaryName = event.target.value;
    if(beneficiaryName && beneficiaryName.length >= 4) {
      this.beneficiaryService.findByName(beneficiaryName)
        .subscribe(beneficiaries => {
          this.beneficiaryList = beneficiaries
          this.initializeBeneficiarySelect(false);
        });
    }
  }

  initializeBeneficiarySelect(isInitialize: boolean) {
   const beneficiaryValues = this.beneficiaryList.reduce((acum, curr: Beneficiary) => {
      const value = curr.fullName + " - " + curr.dni;
      acum[value.toString()] = null;
      return acum;
    }, {});
    var elem = document.querySelector('#beneficiarySelect');
    if(isInitialize) {
      M.Autocomplete.init(elem, {data: beneficiaryValues});
    } else {
      const instance = M.Autocomplete.getInstance(elem);
      instance.updateData(beneficiaryValues);
    }
    
  }

  initializeHelpTypeSelect() {
    var selects = document.querySelectorAll('select');
    var selectsInstances = M.FormSelect.init(selects, '');
  }

  validateAndSave() {
    //this.mainState.setLoading(true);
    if(this.selectedBeneficiary == null) {
      this.setError("No se ha seleccionado un beneficiario");
    }
    if(!this.helpType.value) {
      this.setError("No se ha seleccionado un tipo de ayuda");
    }
    if(!this.newHelp.user) {
      this.setError("No se ha podido determinar el usuario que da de alta la ayuda");
    }
    if(!this.newHelp.entity) {
      this.setError("No se ha podido determinar la entidad que da de alta la ayuda");
    }
    if(this.error) {
      return;
    }

    this.newHelp.notes = this.notes.value;
    this.newHelp.beneficiary = this.selectedBeneficiary;
    this.newHelp.date = new Date();
    this.newHelp.helpType = this.helpType.value;
    this.helpService.saveHelp(this.newHelp).subscribe(
      saved => {
        this.successSaved = true;
        this.clearForm();
        //setTimeout(() => { this.mainState.setLoading(false) }, 1500);
      },
      error => {
        console.log(error);
        this.setError(error.message);
        //this.mainState.setLoading(false);
      }
    );

  }

  setError(errorText: string) {
    this.error = errorText;
    setTimeout(() => {this.error = null}, 10000);
  }

  updateBeneficiary(event) {
    const beneficiaryForm = event.target.value;
    const benefSplit = beneficiaryForm.split("-");
    if(benefSplit.length != 2) {
      this.beneficiary.setValue(null);
      this.selectedBeneficiary = null;
    } else {
      const dni = benefSplit[1].trim();
      const benefList = this.beneficiaryList.filter(b => b.dni === dni);
      if(benefList.length !== 1) {
        this.beneficiary.setValue(null);
        this.selectedBeneficiary = null;
      } else {
        this.selectedBeneficiary = benefList.pop();
      }
    }
  }

  clearForm() {
    this.selectedBeneficiary = null;
    this.newHelp.beneficiary = null;
    this.newHelp.date = null;
    this.newHelp.helpType = null;
    this.newHelp.notes = null;
    this.beneficiary.reset();
    this.error = null;
    this.notes.reset();
    this.helpType.reset();
    this.beneficiaryList = [];
    this.initializeHelpTypeSelect();
  }

  closeModal() {
    this.clearForm();
    this.closeModalEvent.emit(true);
  }

}
