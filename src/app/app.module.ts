import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule }  from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import Lift from './models/lift.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from './material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IspisPutovanjaComponent } from './ispis-putovanja/ispis-putovanja.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthService } from "./services/auth.service";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IspisZgradaComponent } from './components/ispis-zgrada/ispis-zgrada.component';
import { IspisLiftovaComponent } from './components/ispis-liftova/ispis-liftova.component';
@NgModule({
  declarations: [
    AppComponent,
    IspisPutovanjaComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    IspisZgradaComponent,
    IspisLiftovaComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [Lift,AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
