import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainStateService } from '../main.state.service';
import { HelpService } from './help.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  helpSearchForm: FormGroup;
  pagesCounter: number;

  constructor(private fb: FormBuilder, public mainState: MainStateService, private helpService: HelpService) {
    this.helpSearchForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => this.updatePageCounter(state.helpsCounter));
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

  searchHelps() {
    this.mainState.setLoading(true);
    const _counter = this.helpService.countHelps(this.helpSearchForm.value);
    const _search = this.helpService.searchHelps(this.helpSearchForm.value);
    forkJoin([_counter, _search]).subscribe(
      result => {
        this.updatePageCounter(result[0]);
        this.mainState.setHelpsCounter(result[0]);
        this.mainState.setHelps(result[1]);
        this.mainState.setLoading(false);
      }
    );
    setTimeout(() => {this.mainState.setLoading(false)}, 1500);
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
    this.searchHelps();
  }

  previousPage() {
    this.helpSearchForm.get('pageNumber').setValue(this.helpSearchForm.get('pageNumber').value - 1);
    this.searchHelps();
  }

}
