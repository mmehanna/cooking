import {Component, OnInit} from '@angular/core';
import {formatDate} from "@angular/common";
import {PlateService} from "../services/plate.service";
import {Subscription} from "rxjs";
import {listFoodsForTargetedDateModel} from "../../_clients/models/list-foods-for-targeted-date.model";
import {CalendarEvent} from "angular-calendar";

@Component({
  selector: 'app-reorder',
  templateUrl: 'plates-for-the-day.page.html',
  styleUrls: ['plates-for-the-day.page.scss']
})
export class PlatesForTheDayPage implements OnInit {
  public linkFoodListToDates: listFoodsForTargetedDateModel[];
  private subscription = new Subscription();
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(
    public foodService: PlateService
  ) {
  }

  ngOnInit(): void {
    this.foodService.getPlates().subscribe(plates => {
      this.events = plates.map(plate => ({
        start: new Date(plate.date),
        title: plate.name,
        color: {primary: '#ad2121', secondary: '#FAE3E3'}
      }));
    });
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

  onDateChange(event: any): void {
    const date = event.detail.value.split('T')[0];
    //this.loadDishes(date);
  }

  // loadDishes(date: string): void {
  //   this.dishService.getDishesForDate(date).subscribe(dishes => {
  //     this.events = dishes.map(dish => ({
  //       start: new Date(dish.date),
  //       title: dish.name,
  //       color: { primary: '#ad2121', secondary: '#FAE3E3' }
  //     }));
  //   });
  // }
}
