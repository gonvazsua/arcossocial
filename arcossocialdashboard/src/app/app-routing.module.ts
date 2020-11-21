import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from './common/authguard.service';
import { LoginComponent } from './login/login.component';
import { HelpComponent } from './main/helps/help/help.component';
import { NewhelpComponent } from './main/helps/newhelp/newhelp.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent,
    canActivate: [AuthguardService],
    children: [
      { path: 'help/new', component: NewhelpComponent },
      { path: 'help', component: HelpComponent },
      { path: '', component: HelpComponent }
    ],
  },
  { path: '', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
