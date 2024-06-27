import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PlatesForTheDayPage} from './plates-for-the-day.page';
import {PlatesForTheDayRoutingModule} from './plates-for-the-day-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatesForTheDayRoutingModule,
  ],
  declarations: [PlatesForTheDayPage]
})
export class FoodForTheDay {
}
