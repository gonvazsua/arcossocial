import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainStateService } from '../../main.state.service';
import { HelpService } from './help.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Help } from '../../models/help';
import { Beneficiary } from '../../models/beneficiary';

declare const M: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  helpSearchForm: FormGroup;
  pagesCounter: number;
  selectedBeneficiary: Beneficiary;

  constructor(private fb: FormBuilder, public mainState: MainStateService, private helpService: HelpService) {
    this.helpSearchForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => this.updatePageCounter(state.helpsCounter));
    this.mainState.state.subscribe(state => {
      this.initializeMaterialComponents();
    });
  }

  ngAfterViewInit() {
    this.initializeMaterialComponents();
  }

  initializeForm() {
    return this.fb.group({
      helpType: [],
      dateFrom: [],
      dateTo: [],
      beneficiaryName: [],
      beneficiaryDni: [],
      entityCode: [],
      pageNumber: [1]
    });
  }

  searchHelps(isNewSearch: boolean) {
    if(isNewSearch) {
      this.helpSearchForm.get('pageNumber').setValue(1);
    }
    this.pagesCounter = 0;
    this.mainState.setSelectedHelp(null);
    this.mainState.setLoading(true);
    const parameters = this.buildSearchHelpParameters(this.helpSearchForm.value);
    const _counter = this.helpService.countHelps(this.helpSearchForm.value);
    const _search = this.helpService.searchHelps(this.helpSearchForm.value);
    forkJoin([_counter, _search]).subscribe(
      result => {
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        this.updatePageCounter(result[0]);
        this.mainState.setHelpsCounter(result[0]);
        this.mainState.setHelps(result[1]);
      },
      error => {
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        this.updatePageCounter(0);
        this.mainState.setHelpsCounter(0);
        this.mainState.setHelps([]);
      }
    );
  }

  setValueDate(fieldName, event, isFromDate) {
    if(!event.target.value) this.helpSearchForm.get(fieldName).setValue(null);
    else {
      const isoTime = isFromDate 
        ? "T00:00:00.000Z"
        : "T23:59:59.000Z";
      const splitDate = event.target.value.split("/");
      const isoDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] + isoTime;
      this.helpSearchForm.get(fieldName).setValue(new Date(isoDate).getTime());
    }
    
  }

  updatePageCounter(totalData: number){
    const pageSize = parseInt(environment.pageSize);
    const pagesDecimal = totalData / pageSize;
    this.pagesCounter = Math.trunc(pagesDecimal) + 1;
  }

  nextPage() {
    this.helpSearchForm.get('pageNumber').setValue(this.helpSearchForm.get('pageNumber').value + 1);
    this.searchHelps(false);
  }

  previousPage() {
    this.helpSearchForm.get('pageNumber').setValue(this.helpSearchForm.get('pageNumber').value - 1);
    this.searchHelps(false);
  }

  setSelectedHelp(help: Help) {
    this.mainState.setSelectedHelp(help);
  }

  initializeMaterialComponents() {
    
    //Select component materialize css
    var selects = document.querySelectorAll('select');
    var selectsInstances = M.FormSelect.init(selects, '');

    //Datepicker materialize css
    const options = {
      format: 'dd/mm/yyyy', firstDay: 1,
      i18n: {
              months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
              monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
              weekdays: ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
              weekdaysShort: ["Dom","Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
              weekdaysAbbrev: ["D","L", "M", "M", "J", "V", "S"]
          }
    };
    var dps = document.querySelectorAll('.datepicker');
    var dpsInstances = M.Datepicker.init(dps, options);

    var elems = document.querySelectorAll('.modal');
    const optionsModal = {dismissible: false};
    var instances = M.Modal.init(elems, optionsModal);
    
  }

  closeModalNewHelp(event) {
    if(!event) return;
    const modal = document.querySelector('#newHelpModal');
    const modalInstance = M.Modal.getInstance(modal);
    modalInstance.close();
  }

  resetForm() {
    this.initializeMaterialComponents();
    this.helpSearchForm.reset();
    this.pagesCounter = 0;
    this.mainState.setSelectedHelp(null);
    this.mainState.setHelpsCounter(0);
    this.mainState.setHelps(null);
  }

  buildSearchHelpParameters(formData: any) {
    const parameters = formData;
    if(this.selectedBeneficiary) {
      parameters['beneficiaryDni'] = this.selectedBeneficiary.dni;
    }
    return parameters;
  }

}
