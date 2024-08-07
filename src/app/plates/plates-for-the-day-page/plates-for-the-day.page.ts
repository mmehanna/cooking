import {Component, OnInit} from '@angular/core';
import {formatDate} from "@angular/common";
import {PlateService} from "../services/plate.service";
import {Subscription} from "rxjs";
import {listPlatesForTargetedDateModel} from "../../_clients/models/list-plates-for-targeted-date.model";
import {CalendarEvent} from "angular-calendar";

@Component({
  selector: 'app-reorder',
  templateUrl: 'plates-for-the-day.page.html',
  styleUrls: ['plates-for-the-day.page.scss']
})
export class PlatesForTheDayPage implements OnInit {
  public linkPlateListToDates: listPlatesForTargetedDateModel[];
  private subscription = new Subscription();
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(
    public plateService: PlateService
  ) {
  }

  ngOnInit(): void {
    this.plateService.getPlates().subscribe(plates => {
      this.events = plates.map(plate => ({
        start: new Date(plate.date),
        title: plate.name,
        color: {primary: '#ad2121', secondary: '#FAE3E3'}
      }));
    });
  }

  public onSelectDate() {
    if (this.plateService.date) {
      const formattedDate = formatDate(this.plateService.date, 'yyyy-MM-dd', 'en-US');
      this.listPlatesForTargetedDate(formattedDate);
    }
  }

  private listPlatesForTargetedDate(formattedDate: string) {
    const foodListSubscription$ = this.plateService
      .listPlatesForTargetedDate(formattedDate)
      .subscribe((linkFoodListToDates: listPlatesForTargetedDateModel[]) => {
        this.linkPlateListToDates = linkFoodListToDates;
      });
    this.subscription.add(foodListSubscription$);
  }

  onDateChange(event: any): void {
    const date = event.detail.value.split('T')[0];
  }
}
