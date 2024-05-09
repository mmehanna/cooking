import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {CreateFoodPageModule} from "./create-food-modal/create-food.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FoodsListPage} from "./foods-list.page";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CreateFoodPageModule
  ],
  declarations: [FoodsListPage]
})
export class FoodsListModule { }
