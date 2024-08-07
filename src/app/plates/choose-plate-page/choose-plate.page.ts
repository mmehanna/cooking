import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {lastValueFrom, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {formatDate} from "@angular/common";
import {PlateService} from "../services/plate.service";
import {PlateItemBo} from "../bos/plate-item.bo";
import {LinkPlateListIdToSelectedDateDto} from "./dtos/link-plate-list-id-to-selected-date.dto";
import {PlateDetailsModal} from "../plate-details-modal/plate-details.modal";

@Component({
  templateUrl: 'choose-plate.page.html',
  styleUrls: ['choose-plate.page.scss'],
})

export class ChoosePlatePage implements OnInit, OnDestroy {
  public plateList: PlateItemBo[];
  private subscription$ = new Subscription();
  private plateListId: LinkPlateListIdToSelectedDateDto = new LinkPlateListIdToSelectedDateDto([]);

  constructor(private plateService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.getPlateSubscription();
  }

  public async togglePlateSelection(plate: PlateItemBo) {
    plate.isSelected = !plate.isSelected;

    if (plate.isSelected) {
      this.plateListId.plateListId.push(plate.id);
    } else {
      console.log("plate is not selected");
      this.plateListId.plateListId.pop();
    }
    if (this.plateListId.plateListId.length > 3) {
      await this.quantityErrorMessage();
    }
  }

  public async linkPlateListToDate() {
    try {
      this.plateService.date = formatDate(this.plateService.date, 'yyyy-MM-dd', 'en-US');
      const response = await lastValueFrom(this.plateService.linkPlateListToDate(this.plateService.date, this.plateListId));

    } catch (err) {
      // Log the error details, including the response body
      console.error('Error on the service:', err);
      if (err instanceof HttpErrorResponse) {
        console.error('Response body:', err.error);

        // Handle specific validation errors
        if (err.status === 400 && err.error && err.error.message) {
          const validationMessages = err.error.message;

          // Display validation messages to the user or handle them appropriately
          console.error('Validation Errors:', validationMessages);
        }
      }
    }
  }

  public presentCreatePlateModal() {
    this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    })
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private getPlateSubscription() {
    const foodListSubscription$ = this.plateService
      .getPlates()
      .subscribe((foodList: PlateItemBo[]) => {
        this.plateList = foodList;
      });
    this.subscription$.add(foodListSubscription$);
  }

  private async quantityErrorMessage() {
    const toast = await this.toastController.create({
      message: "You have exceeded the number of food per day! The number allowed is three.",
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
