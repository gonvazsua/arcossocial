import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

declare const M: any;

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements OnInit {

  private FROM: string = "from";
  private TO: string = "to";

  @Input() inputId: string;
  @Input() iconName: string;
  @Input() label: string;
  @Input() classList: string;
  @Input() fcontrol: FormControl;
  @Input() type: string;

  dateForm: string;
  isValidDateFlag: boolean;

  constructor() {
    this.isValidDateFlag = true;
  }

  ngOnInit(): void {
    this.fcontrol.valueChanges.subscribe(value => {
      if(value === null) this.setInputValue(null);
    });
  }

  updateForm(event) {
    this.isValidDateFlag = true;
    const value = event.target.value;
    if(this.isValidDate(value)) {
      const timestamp = this.getTimestampByDate(value);
      this.fcontrol.setValue(timestamp);
    } else {
      this.setInputValue(null);
      this.isValidDateFlag = false;
      setTimeout(() => { this.isValidDateFlag = true }, 10000);
    }
    
  }

  getTimestampByDate(dateString: string) {

    let timeFormat = null;
    if(this.type === this.FROM) {
      timeFormat = "T00:00:00.000Z";
    } else if(this.type === this.TO) {
      timeFormat = "T23:59:59.000Z";
    } else {
      timeFormat = new Date().toISOString().split('T')[1];
    }
    
    const splitDate = dateString.split("/");
    const isoDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] + timeFormat;
    return Date.parse(isoDate);

  }

  isValidDate(value: string): boolean {
    return moment(value, 'DD/MM/YYYY', true).isValid();
  }

  manageDate(event) {

    let value = event.target.value;
    const lastChar = event.target.value !== null ? event.target.value.substr(event.target.value.length - 1) : null;

    //event.keyCode = 8 means 'delete'
    if(event.keyCode === 8 && (value.length === 2 || value.length === 5)) {
      value += '/';
      this.setInputValue(value);
    } else if(event.keyCode === 8) {
      return;
    }

    if(value.length === 2 || value.length === 5) {
      value += '/';
      this.setInputValue(value);
    }
  }

  setInputValue(value: string) {
    (<HTMLInputElement>document.getElementById(this.inputId)).value = value;
    M.updateTextFields();
  }

}
