import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { UUID } from "angular2-uuid";
import { FoodInterface } from "../../interfaces/food.interface";
import { FoodService } from "../../_services/food.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'choose-food.page.html',
  styleUrls: ['choose-food.page.scss'],
})

export class ChooseFoodPage implements OnInit, OnDestroy{
  private subscription = new Subscription();
  public foodList: FoodInterface[];

  constructor(private foodService : FoodService) {}

    ngOnInit() {
      const foodListSubscription$ = this.foodService
          .getFoods()
          .subscribe((foodList: FoodInterface[]) => {
            this.foodList = foodList;
          });
      this.subscription.add(foodListSubscription$);
    }

  public toggleFoodSelection(id: UUID) {
    this.foodService.toggleFoodSelection(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
