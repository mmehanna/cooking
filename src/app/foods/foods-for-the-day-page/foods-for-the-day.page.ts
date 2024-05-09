import {Component} from '@angular/core';
import {formatDate} from "@angular/common";
import {FoodService} from "../services/food.service";
import {Subscription} from "rxjs";
import {listFoodsForTargetedDateModel} from "../../_clients/models/list-foods-for-targeted-date.model";

@Component({
  selector: 'app-reorder',
  templateUrl: 'foods-for-the-day.page.html',
  styleUrls: ['foods-for-the-day.page.scss']
})
export class FoodsForTheDayPage {
  public linkFoodListToDates: listFoodsForTargetedDateModel[];
  private subscription = new Subscription();

  constructor(
    public foodService: FoodService
  ) {
  }

  public onSelectDate() {
    if (this.foodService.date) {
      // Convertir la date sélectionnée en une chaîne de caractères avec le format 'YYYY-MM-DD'
      const formattedDate = formatDate(this.foodService.date, 'yyyy-MM-dd', 'en-US');
      console.log(formattedDate);
      this.listFoodsForTargetedDate(formattedDate);
    }
  }

  private listFoodsForTargetedDate(formattedDate: string) {
    const foodListSubscription$ = this.foodService
      .listFoodsForTargetedDate(formattedDate)
      .subscribe((linkFoodListToDates: listFoodsForTargetedDateModel[]) => {
        this.linkFoodListToDates = linkFoodListToDates;
      });
    this.subscription.add(foodListSubscription$);
  }
}
