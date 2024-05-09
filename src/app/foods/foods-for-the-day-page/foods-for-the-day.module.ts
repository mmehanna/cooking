import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FoodsForTheDayPage} from './foods-for-the-day.page';
import {FoodsForTheDayRoutingModule} from './foods-for-the-day-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodsForTheDayRoutingModule,
  ],
  declarations: [FoodsForTheDayPage]
})
export class FoodForTheDay {
}
