import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Beneficiary } from '../../models/beneficiary';
import { BeneficiaryService } from '../beneficiary.service';

declare const M: any;

@Component({
  selector: 'app-beneficiarysearch',
  templateUrl: './beneficiarysearch.component.html',
  styleUrls: ['./beneficiarysearch.component.css']
})
export class BeneficiarysearchComponent implements OnInit {

  @Input() inputID: string;
  @Input() selectedBeneficiary: Beneficiary;
  @Input() classList: string;
  @Output() beneficiarySelectedEvent: EventEmitter<Beneficiary> = new EventEmitter();

  beneficiary = new FormControl('', Validators.required);
  beneficiaryList : Beneficiary[];

  constructor(private beneficiaryService: BeneficiaryService) {
    this.beneficiaryList = [];
    this.initializeBeneficiarySelect(true);
  }

  ngOnInit(): void {
    this.initializeBeneficiarySelect(true);
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
      if(curr.mate) {
        const mateData = curr.mate.fullName + " - " + curr.mate.dni;
        acum[mateData.toString()] = null;
      }
      return acum;
    }, {});
    var elem = document.querySelector('#'+this.inputID);
    if(isInitialize) {
      M.Autocomplete.init(elem, {data: beneficiaryValues});
    } else {
      let instance = M.Autocomplete.getInstance(elem);
      if(!instance) {
        instance = M.Autocomplete.init(elem, {data: beneficiaryValues});
      }
      instance.updateData(beneficiaryValues);
    }
    
  }

  updateBeneficiary(event) {
    const beneficiaryForm = event.target.value;
    const benefSplit = beneficiaryForm.split("-");
    if(benefSplit.length != 2) {
      this.beneficiary.setValue(null);
      this.selectedBeneficiary = null;
    } else {
      const dni = benefSplit[1].trim();
      const benefList = this.beneficiaryList.filter(b => b.dni === dni || b.mate.dni === dni);
      if(benefList.length !== 1) {
        this.beneficiary.setValue(null);
        this.selectedBeneficiary = null;
      } else {
        this.selectedBeneficiary = benefList.pop();
        this.beneficiarySelectedEvent.emit(this.selectedBeneficiary);
      }
    }
  }

  resetValues() {
    this.beneficiary.reset();
    this.selectedBeneficiary = null;
    this.beneficiaryList = [];
  }

}
