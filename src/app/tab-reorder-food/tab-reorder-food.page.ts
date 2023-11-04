import { Component } from '@angular/core';
import { FoodService } from "../_services/food.service";
import { ItemReorderEventDetail } from "@ionic/angular";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab-reorder-food.page.html',
  styleUrls: ['tab-reorder-food.page.scss']
})
export class TabReorderFoodPage {

  constructor(
    private foodService: FoodService
  ) {
  }

  foods = this.foodService.getFoods();
  days: string[] = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  public isDisabled = true;
  public alertButtons = ['Save'];

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }


}
