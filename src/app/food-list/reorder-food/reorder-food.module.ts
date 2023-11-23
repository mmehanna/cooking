import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReorderFoodPage } from './reorder-food.page';
import { ReorderFoodRoutingModule } from './reorder-food-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReorderFoodRoutingModule
  ],
  declarations: [ReorderFoodPage]
})
export class ReorderFood {
}
