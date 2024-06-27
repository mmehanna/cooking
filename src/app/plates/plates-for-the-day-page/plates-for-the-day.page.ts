import {Component} from '@angular/core';
import {formatDate} from "@angular/common";
import {PlateService} from "../services/plate.service";
import {Subscription} from "rxjs";
import {listFoodsForTargetedDateModel} from "../../_clients/models/list-foods-for-targeted-date.model";

@Component({
  selector: 'app-reorder',
  templateUrl: 'plates-for-the-day.page.html',
  styleUrls: ['plates-for-the-day.page.scss']
})
export class PlatesForTheDayPage {
  public linkFoodListToDates: listFoodsForTargetedDateModel[];
  private subscription = new Subscription();

  constructor(
    public foodService: PlateService
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
