import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ChooseFoodPage} from './choose-food.page';
import {ChooseFoodRoutingModule} from './choose-food-routing.module';
import {CreateFoodPageModule} from "../food-details-modal/food-details.module";

@NgModule({
  imports: [
    CommonModule,
    ChooseFoodRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateFoodPageModule
  ],
  declarations: [ChooseFoodPage]
})
export class ChooseFood {
}
