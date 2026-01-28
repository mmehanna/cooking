import {Component, OnInit} from '@angular/core';
import {formatDate} from "@angular/common";
import {Subscription, firstValueFrom} from "rxjs";
import {Router} from "@angular/router";

import {CalendarEvent} from "angular-calendar";
import {PlateService} from "../services/plate.service";
import {listPlatesForTargetedDateModel} from "../../_clients/models/list-plates-for-targeted-date.model";
import {AlertController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-reorder',
  templateUrl: 'plates-for-the-day.page.html',
  styleUrls: ['plates-for-the-day.page.scss']
})
export class PlatesForTheDayPage implements OnInit {
  public linkPlateListToDates: listPlatesForTargetedDateModel[];
  public breakfastPlates: listPlatesForTargetedDateModel[] = [];
  public lunchPlates: listPlatesForTargetedDateModel[] = [];
  public dinnerPlates: listPlatesForTargetedDateModel[] = [];
  private subscription = new Subscription();
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(
    public plateService: PlateService,
    private platesService: PlateService,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
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
    console.log('Date selected in plate service:', this.plateService.date);
    if (this.plateService.date) {
      const formattedDate = formatDate(this.plateService.date, 'yyyy-MM-dd', 'en-US');
      console.log('Formatted date for API call:', formattedDate);
      this.listPlatesForTargetedDate(formattedDate);
    }
  }

  private listPlatesForTargetedDate(formattedDate: string) {
    console.log('Fetching plates for date:', formattedDate);
    const foodListSubscription$ = this.plateService
      .listPlatesForTargetedDate(formattedDate)
      .subscribe((linkFoodListToDates: listPlatesForTargetedDateModel[]) => {
        console.log('Received plates for date:', formattedDate, 'Plates:', linkFoodListToDates);
        this.linkPlateListToDates = linkFoodListToDates;

        // Separate plates by meal type
        this.breakfastPlates = linkFoodListToDates.filter(plate => plate.mealType === 'breakfast');
        this.lunchPlates = linkFoodListToDates.filter(plate => plate.mealType === 'lunch');
        this.dinnerPlates = linkFoodListToDates.filter(plate => plate.mealType === 'dinner' || !plate.mealType);

        console.log('Breakfast plates:', this.breakfastPlates);
        console.log('Lunch plates:', this.lunchPlates);
        console.log('Dinner plates:', this.dinnerPlates);
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

    // Formater la date pour n'avoir que YYYY-MM-DD
    const formattedDate = formatDate(new Date(targetedDate), 'yyyy-MM-dd', 'en-US');

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
          handler: async () => {
            try {
              await firstValueFrom(this.platesService.deletePlateForDay(formattedDate));

              // Show success message
              const successToast = await this.toastController.create({
                message: 'Plates deleted successfully',
                duration: 2000,
                color: 'success'
              });
              await successToast.present();
            } catch (error: any) {
              console.error('Error deleting plate:', error);

              // Check if it's a 404 error (no plates found) and handle appropriately
              if (error.status === 404 || (error.error && error.error.statusCode === 404)) {
                // This means there were no plates to delete, which is fine
                const infoToast = await this.toastController.create({
                  message: 'No plates found for this date.',
                  duration: 2000,
                  color: 'warning'
                });
                await infoToast.present();
              } else {
                // Show error message to user for other types of errors
                const errorToast = await this.toastController.create({
                  message: 'Failed to delete plates. Please try again later.',
                  duration: 3000,
                  color: 'danger'
                });
                await errorToast.present();
              }
            } finally {
              // Attendre un court délai pour permettre au serveur de traiter la suppression
              // avant de recharger les données
              setTimeout(() => {
                // Force a complete refresh of the page to ensure UI is completely up-to-date
                // This ensures that the UI reflects the current server state immediately
                window.location.reload();
              }, 1000); // Attendre 1 seconde pour permettre au serveur de traiter la suppression
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Method to check if there are any plates for the day
  public hasAnyPlates(): boolean {
    return this.breakfastPlates.length > 0 ||
           this.lunchPlates.length > 0 ||
           this.dinnerPlates.length > 0;
  }

  goBack() {
    // Navigate back to the landing page
    this.router.navigate(['/landing']).then();
  }
}
