import { Component, OnDestroy } from '@angular/core';
import { ItemReorderEventDetail } from "@ionic/angular";
import { Subscription } from "rxjs";

import { FoodService } from "../services/food.service";
import { FoodItemBo } from "../bos/food-item.bo";

@Component({
  selector: 'app-reorder',
  templateUrl: 'reorder-food.page.html',
  styleUrls: ['reorder-food.page.scss']
})
export class ReorderFoodPage implements OnDestroy {
  private subscription = new Subscription();
  public foodList: FoodItemBo[];
  public days: string[] = ['Monday','Tuesday','Wednesday',
    'Thursday','Friday','Saturday','Sunday'];
  public alertButtons = ['Save'];

  constructor(
    private foodService: FoodService
  ) {}

   ngOnInit() {
    this.foodList = this.foodService.getFoodFromChooseFoods();
  }

   handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
