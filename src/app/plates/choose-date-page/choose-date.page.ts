import {Component} from '@angular/core';
import {PlateService} from "../services/plate.service";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-choose-date-page',
  templateUrl: './choose-date.page.html',
  styleUrls: ['./choose-date.page.scss'],
})
export class ChooseDatePage {
  constructor(public plateService: PlateService,
              private toastController: ToastController,
              private router: Router
  ) {
  }

  public nextPageValidation() {
    if (this.timeValidation() == true) {
      this.router.navigate(['/choose-plate']);
    } else {
      this.dateTimeErrorMessage().then(r => {
      });
    }
  }

  public oneSelectedDate() {
    if (this.plateService.date) {
      this.timeValidation();
    } else {
      this.dateTimeErrorMessage().then(r => {
      });
    }
  }

  private timeValidation(): boolean {
    const dateTime = new Date(this.plateService.date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateTime.getTime() < today.getTime()) {
      this.dateTimeErrorMessage().then(r => {
      });
      return false;
    } else {
      return true;
    }
  }

  private async dateTimeErrorMessage() {
    const toast = await this.toastController.create({
      message: "This date is unavailable.",
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
