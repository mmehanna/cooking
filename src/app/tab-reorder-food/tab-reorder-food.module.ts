import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabReorderFoodPage } from './tab-reorder-food.page';

import { Tab2PageRoutingModule } from './tab-reorder-food-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, Tab2PageRoutingModule], declarations: [TabReorderFoodPage]
})
export class Tab2PageModule {
}
