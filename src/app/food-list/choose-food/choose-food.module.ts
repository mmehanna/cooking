import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChooseFoodPage } from './choose-food.page';
import { Tab1PageRoutingModule } from './choose-food-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule
  ],
  declarations: [ChooseFoodPage]
})
export class ChooseFood {}