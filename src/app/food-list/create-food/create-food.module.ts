import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreateFoodPageRoutingModule } from './create-food-routing.module';
import { CreateFoodPage } from './create-food.page';
import { Camera } from "@ionic-native/camera/ngx";

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
  declarations: [CreateFoodPage]
})
export class CreateFoodPageModule {}
