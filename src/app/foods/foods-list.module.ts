import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FoodsListPage} from "./foods-list.page";
import {FoodListRoutingModule} from "./food-list-routing.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FoodListRoutingModule
  ],
  declarations: [FoodsListPage]
})
export class FoodsListModule { }
