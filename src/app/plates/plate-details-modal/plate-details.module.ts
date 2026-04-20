import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import {CreatePlatePageRoutingModule} from './plate-details-routing.module';
import {PlateDetailsModal} from './plate-details.modal';
import {Camera} from "@ionic-native/camera/ngx";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePlatePageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
    Camera
  ],
  exports: [
    PlateDetailsModal
  ],
  declarations: [PlateDetailsModal]
})
export class CreatePlatePageModule {
}
