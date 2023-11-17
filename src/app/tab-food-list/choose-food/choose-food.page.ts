import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoodService } from "../../_services/food.service";
import { UUID } from "angular2-uuid";
import { ReorderFoodPage } from "../reorder-food/reorder-food.page";
import { Observable } from "rxjs";
import { FoodInterface } from "../../interfaces/food.interface";

@Component({
  selector: 'app-tab1',
  templateUrl: 'choose-food.page.html',
  styleUrls: ['choose-food.page.scss'],
})

export class ChooseFoodPage implements OnInit, OnDestroy{
  private subscription: any;
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
