import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from './common/authguard.service';
import { LoginComponent } from './login/login.component';
import { BeneficiaryComponent } from './main/beneficiaries/beneficiary/beneficiary.component';
import { HelpComponent } from './main/helps/help/help.component';
import { NewhelpComponent } from './main/helps/newhelp/newhelp.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './main/profile/profile.component';
import { SettingsComponent } from './main/settings/settings/settings.component';
import { UserComponent } from './main/users/user/user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent,
    canActivate: [AuthguardService],
    children: [
      { path: 'helps', component: HelpComponent },
      { path: 'beneficiaries', component: BeneficiaryComponent },
      { path: 'users', component: UserComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', component: HelpComponent }
    ],
  },
  { path: '', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
