import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from "@ionic/angular";
import { Subscription } from "rxjs";

import { FoodService } from "../services/food.service";
import { FoodItemBo } from "../bos/food-item.bo";

@Component({
  templateUrl: 'choose-food.page.html',
  styleUrls: ['choose-food.page.scss'],
})

export class ChooseFoodPage implements OnInit {
  private subscription = new Subscription();
  @ViewChild(IonModal) modal: IonModal;
  public foodList: FoodItemBo[];

  constructor(private foodService: FoodService
  ) {}

  ngOnInit() {
    this.getFoodSubscription();
  }

  private getFoodSubscription() {
    const foodListSubscription$ = this.foodService
      .getFoods()
      .subscribe((foodList: FoodItemBo[]) => {
        this.foodList = foodList;
        console.log(foodList);
      });
    this.subscription.add(foodListSubscription$);
  }

  public toggleFoodSelection(food: FoodItemBo) {
    food.isSelected = !food.isSelected;
    this.foodService.setFoodFromChooseFoods(this.foodList);
  }

}
