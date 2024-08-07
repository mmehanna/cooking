import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ChoosePlatePage} from './choose-plate.page';
import {ChoosePlateRoutingModule} from './choose-plate-routing.module';
import {CreatePlatePageModule} from "../plate-details-modal/plate-details.module";

@NgModule({
  imports: [
    CommonModule,
    ChoosePlateRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreatePlatePageModule
  ],
  declarations: [ChoosePlatePage]
})
export class ChoosePlate {
}
