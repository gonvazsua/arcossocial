import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './main/home/home.component';
import { LocalStorageService } from './common/local-storage.service';
import { AuthguardService } from './common/authguard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [LoginService, LocalStorageService, AuthguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
