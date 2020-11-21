import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { HelpComponent } from './main/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavigationComponent,
    LoadingComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenIntecerptorService, multi: true },
    LoginService, LocalStorageService, 
    AuthguardService, MainStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
