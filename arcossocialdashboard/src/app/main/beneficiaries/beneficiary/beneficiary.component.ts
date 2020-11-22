import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainStateService } from '../../main.state.service';
import { Beneficiary } from '../../models/beneficiary';
import { BeneficiaryService } from '../beneficiary.service';
import { BeneficiarysearchComponent } from '../beneficiarysearch/beneficiarysearch.component';

declare const M: any;

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css']
})
export class BeneficiaryComponent implements OnInit {

  @ViewChild(BeneficiarysearchComponent) beneficiarySearch: BeneficiarysearchComponent

  beneficiarySearchForm: FormGroup;
  pagesCounter: number;
  selectedBeneficiaryForm: Beneficiary;

  constructor(private fb: FormBuilder, public mainState: MainStateService, public beneficiaryService: BeneficiaryService) {
    this.beneficiarySearchForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => this.updatePageCounter(state.helpsCounter));
    this.mainState.state.subscribe(state => {
      this.initSelectMaterialize();
    });
  }

  ngAfterViewInit() {
    this.initSelectMaterialize();
  }

  initializeForm() {
    return this.fb.group({
      valuationCard: [],
      dni: [],
      entityCode: [],
      pageNumber: [1]
    });
  }

  searchBeneficiaries(isNewSearch) {
    if(isNewSearch) {
      this.beneficiarySearchForm.get('pageNumber').setValue(1);
    }
    this.pagesCounter = 0;
    this.mainState.setSelectedBeneficiary(null);
    this.mainState.setLoading(true);
    const parameters = this.buildSearchHelpParameters(this.beneficiarySearchForm.value);
    const _counter = this.beneficiaryService.countBeneficiaries(parameters);
    const _search = this.beneficiaryService.searchBeneficiaries(parameters);
    forkJoin([_counter, _search]).subscribe(
      result => {
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        this.updatePageCounter(result[0]);
        this.mainState.setBeneficiariesCounter(result[0]);
        this.mainState.setBeneficiaries(result[1]);
      },
      error => {
        console.log(error);
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        this.updatePageCounter(0);
        this.mainState.setBeneficiariesCounter(0);
        this.mainState.setBeneficiaries([]);
      }
    );
  }

  buildSearchHelpParameters(formParameters) {
    let parameters = formParameters;
    if(this.selectedBeneficiaryForm) {
      parameters['dni'] = this.selectedBeneficiaryForm.dni;
    }
    return parameters;
  }

  initSelectMaterialize() {
    //Select component materialize css
    var selects = document.querySelectorAll('select');
    var selectsInstances = M.FormSelect.init(selects, '');
  }  

  updatePageCounter(totalData: number){
    const pageSize = parseInt(environment.pageSize);
    const pagesDecimal = totalData / pageSize;
    this.pagesCounter = Math.trunc(pagesDecimal) + 1;
  }

  resetForm() {
    this.initSelectMaterialize();
    this.beneficiarySearchForm.reset();
    this.pagesCounter = 0;
    this.mainState.setSelectedBeneficiary(null);
    this.mainState.setBeneficiariesCounter(0);
    this.mainState.setBeneficiaries(null);
    this.beneficiarySearch.resetValues();
  }

  setSelectedBeneficiary(beneficiary: Beneficiary) {
    this.mainState.setSelectedBeneficiary(beneficiary);
  }

}
