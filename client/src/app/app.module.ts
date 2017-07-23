import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './authentication/login.component';
import { DonorComponent } from './donor/donor.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { DateFormatterPipe } from "./shared/date-formatter.pipe"
import { AuthGaurdService } from './authentication/auth-gaurd.service'

import { SignupComponent } from './authentication/signup.component';

const appRoutes: Routes = [
  {
    path: 'login', // This can be both modal popup and its own page!
    component: LoginComponent
  },
  { 
    path: '',
    pathMatch:'full', 
    redirectTo: '/home' 
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'donor',
    component: DonorComponent,
    canActivate: [ AuthGaurdService ]
  },
  {
    path: 'receiver',
    component: ReceiverComponent,
    canActivate: [ AuthGaurdService ]
  },
  {
    path: 'signup',
    component: SignupComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DonorComponent,
    ReceiverComponent,
    SignupComponent,
    ImageCropperComponent,
    DateFormatterPipe
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BootstrapModalModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LoginComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ 
    DateFormatterPipe,
    AuthGaurdService
  ]
})
export class AppModule { }

