import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {CreateFoodPageRoutingModule} from './create-food-routing.module';
import {CreateFoodModal} from './create-food.modal';
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
    CreateFoodModal
  ],
  declarations: [CreateFoodModal]
})
export class CreateFoodPageModule {
}
