import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainStateService } from '../../main.state.service';
import { User } from '../../models/user';
import { UserService } from '../user.service';

declare const M: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userSearchForm: FormGroup;
  pagesCounter: number;

  constructor(private fb: FormBuilder, public mainState: MainStateService, private userService: UserService) {
    this.userSearchForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state =>  {
      this.updatePageCounter(state.usersCounter);
      this.initSelectMaterialize();
    });
  }

  initSelectMaterialize() {
    //Select component materialize css
    var selects = document.querySelectorAll('select');
    var selectsInstances = M.FormSelect.init(selects, '');

    var elems = document.querySelectorAll('.modal');
    const optionsModal = {dismissible: false};
    var instances = M.Modal.init(elems, optionsModal);    
  }    

  ngAfterViewInit() {
    this.initSelectMaterialize();
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

  initializeForm() {
    return this.fb.group({
      userCode: [],
      fullName: [],
      entityCode: [],
      isActive: [],
      pageNumber: [1]
    });
  }

  searchUsers(isNewSearch) {
    if(isNewSearch) {
      this.userSearchForm.get('pageNumber').setValue(1);
    }
    this.pagesCounter = 0;
    this.mainState.setSelectedUser(null);
    this.mainState.setLoading(true);
    const parameters = this.userSearchForm.value;
    const _counter = this.userService.countUsers(parameters);
    const _search = this.userService.searchUsers(parameters);
    forkJoin([_counter, _search]).subscribe(
      result => {
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        this.updatePageCounter(result[0]);
        this.mainState.setUsersCounter(result[0]);
        this.mainState.setUsers(result[1]);
      },
      error => {
        console.log(error);
        setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        this.updatePageCounter(0);
        this.mainState.setUsersCounter(0);
        this.mainState.setUsers([]);
      }
    );
  }

  setSelectedUser(user: User) {
    this.mainState.setSelectedUser(user);
  }

  resetForm() {
    this.initSelectMaterialize();
    this.userSearchForm.reset();
    this.pagesCounter = 0;
    this.mainState.setSelectedUser(null);
    this.mainState.setUsersCounter(0);
    this.mainState.setUsers(null);
  }

  nextPage() {
    this.userSearchForm.get('pageNumber').setValue(this.userSearchForm.get('pageNumber').value + 1);
    this.searchUsers(false);
  }

  previousPage() {
    this.userSearchForm.get('pageNumber').setValue(this.userSearchForm.get('pageNumber').value - 1);
    this.searchUsers(false);
  }

  deactivateUser() {

  }

  closeModalUser($event) {
    if(!event) return;
    const modal = document.querySelector('#userFormModal');
    const modalInstance = M.Modal.getInstance(modal);
    modalInstance.close();
  }

}
