import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {lastValueFrom, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {formatDate} from "@angular/common";
import {FoodService} from "../services/food.service";
import {FoodItemBo} from "../bos/food-item.bo";
import {LinkFoodListIdToSelectedDateDto} from "./dtos/link-food-list-id-to-selected-date.dto";
import {FoodDetailsModal} from "../food-details-modal/food-details.modal";

@Component({
  templateUrl: 'choose-food.page.html',
  styleUrls: ['choose-food.page.scss'],
})

export class ChooseFoodPage implements OnInit, OnDestroy {
  private subscription$ = new Subscription();
  public foodList: FoodItemBo[];
  private foodListId: LinkFoodListIdToSelectedDateDto = new LinkFoodListIdToSelectedDateDto([]);

  constructor(private foodService: FoodService,
              private modalController: ModalController,
              private toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.getFoodSubscription();
  }

  private getFoodSubscription() {
    const foodListSubscription$ = this.foodService
      .getFoods()
      .subscribe((foodList: FoodItemBo[]) => {
        this.foodList = foodList;
        console.log(foodList);
      });
    this.subscription$.add(foodListSubscription$);
  }

  public async toggleFoodSelection(food: FoodItemBo) {
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
      component: FoodDetailsModal
    }).then(modal => {
      modal.present();
    })
  }

  private async quantityErrorMessage() {
    const toast = await this.toastController.create({
      message: "You have exceeded the number of food per day! The number allowed is three.",
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
