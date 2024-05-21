import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {CreateFoodPageRoutingModule} from './food-details-routing.module';
import {FoodDetailsModal} from './food-details.modal';
import {Camera} from "@ionic-native/camera/ngx";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateFoodPageRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    Camera
  ],
  exports: [
    FoodDetailsModal
  ],
  declarations: [FoodDetailsModal]
})
export class CreateFoodPageModule {
}
