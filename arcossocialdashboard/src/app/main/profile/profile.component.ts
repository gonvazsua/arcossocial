import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainStateService } from '../main.state.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  passwordForm: FormGroup;
  error: string[];
  successSaved: boolean;

  constructor(private fb: FormBuilder, private userService: UserService, public mainState: MainStateService) {
    this.passwordForm = this.fb.group({
      currentPassword : ['', Validators.required],
      newPassword : ['', Validators.required],
      confirmPassword: ['', Validators.required],
      userCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mainState.state.subscribe(state => {
      this.passwordForm.get('userCode').setValue(state.user.userCode);
    });
  }

  validateAndSavePassword() {

    this.error = [];
    this.successSaved = false;

    this.mainState.setLoading(true);
    if(!this.newPasswordEquals()) {
      this.error.push('Las contraseñas no coinciden');
      setTimeout(() => {this.mainState.setLoading(false)}, 1000);
      return;
    }
    
    const currentPasswordBase64 = btoa(this.passwordForm.get('currentPassword').value);
    this.userService.checkLogin(this.passwordForm.get('userCode').value, currentPasswordBase64)
      .subscribe(
        valid => this.updatePassword(),
        error =>  {
          this.error.push('La contraseña actual introducida no es correcta')
          setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        });
  }

  updatePassword() {
    this.userService.updatePassword(this.passwordForm.get('userCode').value, this.passwordForm.get('newPassword').value)
      .subscribe(
        result => {
          this.successSaved = true;
          setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        },
        error => {
          this.error.push('Ha habido un error al actualizar su contraseña')
          setTimeout(() => {this.mainState.setLoading(false)}, 1000);
        }
      );
  }

  newPasswordEquals() {
    return this.passwordForm.get('newPassword').value === this.passwordForm.get('confirmPassword').value;
  }

}
