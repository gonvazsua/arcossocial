import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BeneficiaryService } from '../../beneficiaries/beneficiary.service';
import { BeneficiarysearchComponent } from '../../beneficiaries/beneficiarysearch/beneficiarysearch.component';
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
  @ViewChild(BeneficiarysearchComponent) beneficiarySearchCmp: BeneficiarysearchComponent;

  selectedBeneficiary: Beneficiary;
  newHelp: Help;
  helpType = new FormControl('', Validators.required);
  notes = new FormControl('', Validators.required);
  error: string;
  successSaved: boolean;
  dateFc = new FormControl('', Validators.required);
  resetBeneficiaryEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(public mainState: MainStateService, private helpService: HelpService) {
    this.newHelp = new Help();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(
      state => {
        this.newHelp.entity = state.userEntity;
        this.newHelp.user = state.user;
      }
    );
    this.initializeHelpTypeSelect();
  }

  ngAfterViewInit() {
    this.initializeHelpTypeSelect();
  }

  initializeHelpTypeSelect() {
    var selects = document.querySelectorAll('select');
    var selectsInstances = M.FormSelect.init(selects, '');
  }

  validateAndSave() {
    //this.mainState.setLoading(true);
    this.newHelp.date = new Date(this.dateFc.value);
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
    if(!this.newHelp.date) {
      this.setError("Seleccione una fecha de alta para la ayuda");
    }
    if(this.error) {
      return;
    }

    this.newHelp.notes = this.notes.value;
    this.newHelp.beneficiary = this.selectedBeneficiary;
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

  clearForm() {
    this.selectedBeneficiary = null;
    this.newHelp.beneficiary = null;
    this.newHelp.date = null;
    this.newHelp.helpType = null;
    this.newHelp.notes = null;
    this.error = null;
    this.notes.reset();
    this.helpType.reset();
    this.dateFc.reset();
    this.initializeHelpTypeSelect();
    this.beneficiarySearchCmp.resetValues();
    (<HTMLInputElement>document.getElementById('helpDate')).value = null;
  }

  closeModal() {
    this.clearForm();
    this.closeModalEvent.emit(true);
    this.successSaved = null;
  }

}
