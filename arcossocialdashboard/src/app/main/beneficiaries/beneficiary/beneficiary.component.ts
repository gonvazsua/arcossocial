import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PermissionService } from 'src/app/common/permission.service';
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
  selectedBeneficiary: Beneficiary;


  constructor(private fb: FormBuilder, public mainState: MainStateService, public beneficiaryService: BeneficiaryService,
    public permissions: PermissionService) {
    this.beneficiarySearchForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state =>  {
      this.updatePageCounter(state.beneficiariesCounter);
      this.initSelectMaterialize();
      this.selectedBeneficiary = state.selectedBeneficiary;
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

    var elems = document.querySelectorAll('.modal');
    const optionsModal = {dismissible: false};
    var instances = M.Modal.init(elems, optionsModal);
    
  }  

  updatePageCounter(totalData: number){
    const pageSize = parseInt(environment.pageSize);
    if(totalData < pageSize) {
      this.pagesCounter = 1;
    } else {
      const pagesDecimal = totalData / pageSize;
      this.pagesCounter = Math.trunc(pagesDecimal) + 1;
    }
  }

  resetForm() {
    this.initSelectMaterialize();
    this.beneficiarySearchForm.reset();
    this.pagesCounter = 0;
    this.mainState.setSelectedBeneficiary(null);
    this.mainState.setBeneficiariesCounter(0);
    this.mainState.setBeneficiaries(null);
    this.beneficiarySearch.resetValues();
    this.selectedBeneficiaryForm = null;
  }

  setSelectedBeneficiary(beneficiary: Beneficiary) {
    this.mainState.setSelectedBeneficiary(beneficiary);
  }

  closeModalBeneficiary(event) {
    if(!event) return;
    const modal = document.querySelector('#beneficiaryFormModal');
    const modalInstance = M.Modal.getInstance(modal);
    modalInstance.close();
    this.searchBeneficiaries(true);
  }

  nextPage() {
    this.beneficiarySearchForm.get('pageNumber').setValue(this.beneficiarySearchForm.get('pageNumber').value + 1);
    this.searchBeneficiaries(false);
  }

  previousPage() {
    this.beneficiarySearchForm.get('pageNumber').setValue(this.beneficiarySearchForm.get('pageNumber').value - 1);
    this.searchBeneficiaries(false);
  }

  reactivateBeneficiary() {
    this.mainState.setLoading(true);
    this.selectedBeneficiary.isActive = true;
    this.beneficiaryService.updateBeneficiary(this.selectedBeneficiary).subscribe(beneficiary => {
      this.mainState.setLoading(false);
    });
    setTimeout(() => { this.mainState.setLoading(false); }, 5000);
  }

  deactivateBeneficiary() {
    this.mainState.setLoading(true);
    this.selectedBeneficiary.isActive = false;
    this.beneficiaryService.updateBeneficiary(this.selectedBeneficiary).subscribe(beneficiary => {
      this.mainState.setLoading(false);
    });
    setTimeout(() => { this.mainState.setLoading(false); }, 5000);
  }

}
