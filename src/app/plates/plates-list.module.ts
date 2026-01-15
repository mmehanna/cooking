import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PlatesListPage} from "./plates-list.page";
import {PlateListRoutingModule} from "./plates-list-routing.module";
import {SharePlateModalComponent} from "./share-plate-modal/share-plate-modal.component";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    PlateListRoutingModule,
    SharedModule
  ],
  declarations: [PlatesListPage, SharePlateModalComponent],
  exports: [SharePlateModalComponent]
})
export class PlatesListModule {
}
