import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabConfirmFoodPage } from './tab-confirm-food.page';

import { Tab3PageRoutingModule } from './tab-confirm-food-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule
  ],
  declarations: [TabConfirmFoodPage]
})
export class Tab3PageModule {}
