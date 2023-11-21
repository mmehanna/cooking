import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodDetailsPage } from "./food-details.page";
import { RecipeDetailPageRoutingModule } from "./food-detail-routing.module";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [FoodDetailsPage],
  imports: [
    CommonModule,
    RecipeDetailPageRoutingModule,
    IonicModule
  ]
})
export class FoodDetailsPageModule { }
