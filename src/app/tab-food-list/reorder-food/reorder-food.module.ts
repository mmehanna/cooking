import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReorderFoodPage } from './reorder-food.page';

import { Tab2PageRoutingModule } from './reorder-food-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, Tab2PageRoutingModule], declarations: [ReorderFoodPage]
})
export class ReorderFood {
}
