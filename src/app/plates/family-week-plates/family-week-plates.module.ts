import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FamilyWeekPlatesPage} from './family-week-plates.page';
import {FamilyWeekPlatesRoutingModule} from './family-week-plates-routing.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FamilyWeekPlatesRoutingModule,
    TranslateModule,
  ],
  declarations: [FamilyWeekPlatesPage]
})
export class FamilyWeekPlatesModule {
}
