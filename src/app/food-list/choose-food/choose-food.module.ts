import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChooseFoodPage } from './choose-food.page';
import { ChooseFoodRoutingModule } from './choose-food-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ChooseFoodRoutingModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ChooseFoodPage]
})
export class ChooseFood {}
