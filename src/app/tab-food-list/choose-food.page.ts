import { Component } from '@angular/core';
import { FoodService } from "../_services/food.service";
import { UUID } from "angular2-uuid";
import { ReorderFoodPage } from "../reorder-food/reorder-food.page";

@Component({
  selector: 'app-tab1',
  templateUrl: 'choose-food.page.html',
  styleUrls: ['choose-food.page.scss'],
})

export class ChooseFoodPage {
  constructor(private foodService : FoodService) {}

  public foodList = this.foodService.getFoods();
  component = ReorderFoodPage;

  public toggleFoodSelection(id: UUID) {
    this.foodService.toggleFoodSelection(id);
  }

}
