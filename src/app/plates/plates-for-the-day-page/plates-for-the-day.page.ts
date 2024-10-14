import {Component, OnInit} from '@angular/core';
import {formatDate} from "@angular/common";
import {Subscription} from "rxjs";

import {CalendarEvent} from "angular-calendar";
import {PlateService} from "../services/plate.service";
import {listPlatesForTargetedDateModel} from "../../_clients/models/list-plates-for-targeted-date.model";
import {AlertController} from "@ionic/angular";

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
    public plateService: PlateService,
    private platesService: PlateService,
    private alertController: AlertController
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

    // S'abonner aux changements de la liste des plats
    this.platesService.platesList$.subscribe((plates) => {
      this.linkPlateListToDates = plates;
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

  public onDateChange(event: any): void {
    const date = event.detail.value.split('T')[0];
  }

  public async deletePlateForDay(targetedDate: string) {
    console.log(targetedDate);
    console.log("dans le viewModel: " + targetedDate);
    console.log(this.linkPlateListToDates);
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete all plates for this day?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.platesService.deletePlateForDay(targetedDate).subscribe(
              () => {
                // Remove the plate from the list after deletion
                this.linkPlateListToDates = this.linkPlateListToDates.filter(
                  (plate) => plate.date !== targetedDate
                );
              },
              (error) => {
                console.error('Error deleting plate:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
