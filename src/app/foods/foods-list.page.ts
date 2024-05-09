import { Component, OnInit } from '@angular/core';
import {FoodItemBo} from "./bos/food-item.bo";
import {FoodService} from "./services/food.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-foods-with-a-list-page',
  templateUrl: './foods-list.page.html',
  styleUrls: ['./foods-list.page.scss'],
})
export class FoodsListPage  implements OnInit {
  private subscription$ = new Subscription();
  public foodList: FoodItemBo[];

  constructor(private foodService: FoodService) { }

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
    this.subscription$.add(foodListSubscription$);
  }
}
