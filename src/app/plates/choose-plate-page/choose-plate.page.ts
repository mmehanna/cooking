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
  public foodList: PlateItemBo[];
  private subscription$ = new Subscription();
  private foodListId: LinkPlateListIdToSelectedDateDto = new LinkPlateListIdToSelectedDateDto([]);

  constructor(private foodService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.getFoodSubscription();
  }

  public async toggleFoodSelection(food: PlateItemBo) {
    food.isSelected = !food.isSelected;

    if (food.isSelected) {
      console.log("food is selected");
      this.foodListId.foodListId.push(food.id);
      console.log(this.foodListId.foodListId);
    } else {
      console.log("food is not selected");
      this.foodListId.foodListId.pop();
      console.log(this.foodListId.foodListId);
    }
    if (this.foodListId.foodListId.length > 3) {
      await this.quantityErrorMessage();
    }
  }

  public async linkFoodListToDate() {
    try {
      this.foodService.date = formatDate(this.foodService.date, 'yyyy-MM-dd', 'en-US');
      const response = await lastValueFrom(this.foodService.linkFoodListToDate(this.foodService.date, this.foodListId));

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

  public presentCreateFoodModal() {
    this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
    })
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private getFoodSubscription() {
    const foodListSubscription$ = this.foodService
      .getFoods()
      .subscribe((foodList: PlateItemBo[]) => {
        this.foodList = foodList;
        console.log(foodList);
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
