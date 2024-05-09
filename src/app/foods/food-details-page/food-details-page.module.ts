import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";

import {FoodDetailsPage} from "./food-details.page";
import {FoodDetailRoutingModule} from "./food-detail-routing.module";

@NgModule({
  declarations: [FoodDetailsPage],
  imports: [
    CommonModule,
    IonicModule,
    FoodDetailRoutingModule,
  ]
})
export class FoodDetailsPageModule {
}
