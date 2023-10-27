import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabChooseFoodPage } from './tab-choose-food.page';

import { Tab1PageRoutingModule } from './tab-choose-food-routing.module';
import { FoodService } from "../_services/food.service";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule
  ],
  declarations: [TabChooseFoodPage]
})
export class Tab1PageModule {}
