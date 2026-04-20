import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import {ChooseDatePageRoutingModule} from './choose-date-routing.module';

import {ChooseDatePage} from './choose-date.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseDatePageRoutingModule,
    TranslateModule
  ],
  declarations: [ChooseDatePage]
})
export class ChooseDatePageModule {
}
