import {Component} from "@angular/core";
import {PlateService} from "../services/plate.service";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-choose-date-page",
  templateUrl: "./choose-date.page.html",
  styleUrls: ["./choose-date.page.scss"],
})
export class ChooseDatePage {
  public minDate = this.getTodayIsoDate();

  constructor(public plateService: PlateService,
              private toastController: ToastController,
              private router: Router,
              private location: Location,
              private translate: TranslateService
  ) {
  }

  public goBack() {
    this.router.navigate(["/landing"]);
  }

  public nextPageValidation() {
    if (this.timeValidation() == true) {
      this.router.navigate(["/choose-plate"]);
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
      message: this.translate.instant("CHOOSE_DATE.UNAVAILABLE"),
      duration: 3000,
      position: "top"
    });
    await toast.present();
  }

  private getTodayIsoDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    const day = `${today.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
