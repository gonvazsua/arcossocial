import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainStateService } from '../../main.state.service';
import { User } from '../../models/user';
import { UserService } from '../user.service';

declare const M: any;

@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {

  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter();

  userForm: FormGroup;
  error: string[];
  successSaved: boolean;
  loading: boolean;
  user: User;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, public mainState: MainStateService) {
    this.userForm = this.initUserForm();
    this.passwordForm = this.initPasswordForm();
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => {
      this.user = state.selectedUser;
      if(this.user) {
        this.initFormWithValues();
      } else {
        this.clearForm();
        this.initFormForNewUser();
      }
    });
  }

  initPasswordForm() {
    return this.fb.group({
      newPassword: ['', Validators.required],
      newPasswordConfirm: ['', Validators.required]
    });
  }

  initUserForm() {
    return this.fb.group({
      _id: [],
      userCode: [],
      fullName: ['', [Validators.required]],
      entityCode: ['', [Validators.required]],
      isAdmin: ['', [Validators.required]],
      isActive: ['true', []],
      creationDate: [new Date().getTime(), []],
      password: ['', Validators.required]
    });
  }

  initFormForNewUser() {
    this.userForm.get('isActive').setValue('true');
    this.userForm.get('creationDate').setValue(new Date().getTime());
  }

  closeModal() {
    this.clearForm();
    this.closeModalEvent.emit(true);
  }

  initFormWithValues() {
    this.userForm.patchValue({
      _id: this.user._id,
      userCode: this.user.userCode,
      fullName: this.user.fullName,
      entityCode: this.user.entityCode,
      isAdmin: this.user.isAdmin ? 'true': 'false',
      isActive: this.user.isActive ? 'true': 'false',
      creationDate: this.user.creationDate ? new Date(this.user.creationDate).getTime() : null
    });
    
    M.updateTextFields();
    var selectEntity = document.querySelector('#entityCode');
    var selectEntityInstances = M.FormSelect.init(selectEntity, '');
    var selectAdmin = document.querySelector('#isAdmin');
    var selectAdminInstances = M.FormSelect.init(selectAdmin, '');
  }

  clearForm() {
    this.userForm.reset();
    var selectEntity = document.querySelector('#entityCode');
    var selectEntityInstances = M.FormSelect.init(selectEntity, '');
    var selectAdmin = document.querySelector('#isAdmin');
    var selectAdminInstances = M.FormSelect.init(selectAdmin, '');
    this.passwordForm.reset();
  }

  validateAndSaveUser() {
    this.error = [];
    this.successSaved = false;
    this.loading = true;
    if(this.user) {
      this.updateUser();
    } else {
      this.insertUser();
    }
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe(
      user => {
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

  insertUser() {
    const userToSave: User = this.userForm.value;
    userToSave.password = btoa(this.userForm.value.password);
    this.userService.insertUser(userToSave).subscribe(
      user => {
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

  validateAndUpdatePassword() {
    this.error = [];
    const newPassword = this.passwordForm.get('newPassword').value;
    const newPasswordConfirm = this.passwordForm.get('newPasswordConfirm').value;
    if(!this.isValidPasswordForm(newPassword, newPasswordConfirm)) return;

    this.userService.updatePassword(this.user.userCode, newPassword).subscribe(
      result => {
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

  isValidPasswordForm(newPassword: string, newPasswordConfirm: string): boolean {
    if(newPassword !== newPasswordConfirm) {
      this.error.push('Las contraseñas no coinciden');
      return false;
    }
    return true;
  }

}
