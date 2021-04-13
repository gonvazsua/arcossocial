import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login/login.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { LocalStorageService } from './common/local-storage.service';
import { AuthguardService } from './common/authguard.service';
import { NavigationComponent } from './main/navigation/navigation.component';
import { MainStateService } from './main/main.state.service';
import { LoadingComponent } from './main/loading/loading.component';
import { TokenIntecerptorService } from './common/token-intecerptor.service';
import { HelpComponent } from './main/helps/help/help.component';
import { PrettybooleanComponent } from './common/prettyboolean/prettyboolean.component';
import { NewhelpComponent } from './main/helps/newhelp/newhelp.component';
import { BeneficiaryService } from './main/beneficiaries/beneficiary.service';
import { BeneficiarysearchComponent } from './main/beneficiaries/beneficiarysearch/beneficiarysearch.component';
import { BeneficiaryComponent } from './main/beneficiaries/beneficiary/beneficiary.component';
import { BeneficiaryformComponent } from './main/beneficiaries/beneficiaryform/beneficiaryform.component';
import { UserComponent } from './main/users/user/user.component';
import { ProfileComponent } from './main/profile/profile.component';
import { UserService } from './main/users/user.service';
import { UserformComponent } from './main/users/userform/userform.component';
import { SettingsComponent } from './main/settings/settings/settings.component';
import { SettingsService } from './main/settings/settings.service';
import { FooterComponent } from './main/footer/footer.component';
import { DateInputComponent } from './common/date-input/date-input.component';
import { PermissionService } from './common/permission.service';
import { HelpTypeManagementComponent } from './main/settings/help-type-management/help-type-management.component';
import { UtsManagementComponent } from './main/settings/uts-management/uts-management.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavigationComponent,
    LoadingComponent,
    HelpComponent,
    PrettybooleanComponent,
    NewhelpComponent,
    BeneficiarysearchComponent,
    BeneficiaryComponent,
    BeneficiaryformComponent,
    UserComponent,
    ProfileComponent,
    UserformComponent,
    SettingsComponent,
    FooterComponent,
    DateInputComponent,
    HelpTypeManagementComponent,
    UtsManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenIntecerptorService, multi: true },
    LoginService, LocalStorageService, 
    AuthguardService, MainStateService, BeneficiaryService, UserService, SettingsService, PermissionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
