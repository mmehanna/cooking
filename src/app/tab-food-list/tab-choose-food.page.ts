import { Component } from '@angular/core';
import { FoodService } from "../_services/food.service";
import { UUID } from "angular2-uuid";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab-choose-food.page.html',
  styleUrls: ['tab-choose-food.page.scss'],
})

export class TabChooseFoodPage {
  constructor(private foodService : FoodService) {}

  public foodList = this.foodService.getFoods();


  public toggleFoodSelection(id: UUID) {
    this.foodService.toggleFoodSelection(id);
  }

}
