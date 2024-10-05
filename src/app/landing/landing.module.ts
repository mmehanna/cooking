import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MenuPageRoutingModule} from './landing-routing.module';

import {LandingPage} from './landing.page';
import {LoginPageModule} from "../login/login.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    LoginPageModule
  ],
  declarations: [LandingPage]
})
export class LandingModule {
}
