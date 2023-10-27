import { Component } from '@angular/core';
import { FoodService } from "../_services/food.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab-confirm-food.page.html',
  styleUrls: ['tab-confirm-food.page.scss']
})
export class TabConfirmFoodPage {

  constructor(
    private foodService: FoodService
  ) {}

  foods = this.foodService.getFoods();
}
