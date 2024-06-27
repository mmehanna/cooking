import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PlatesListPage} from "./plates-list.page";
import {PlateListRoutingModule} from "./plates-list-routing.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    PlateListRoutingModule
  ],
  declarations: [PlatesListPage]
})
export class PlatesListModule {
}
