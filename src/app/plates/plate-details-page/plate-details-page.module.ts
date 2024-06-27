import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";

import {PlateDetailsPage} from "./plate-details.page";
import {PlateDetailRoutingModule} from "./plate-detail-routing.module";

@NgModule({
  declarations: [PlateDetailsPage],
  imports: [
    CommonModule,
    IonicModule,
    PlateDetailRoutingModule,
  ]
})
export class PlateDetailsPageModule {
}
