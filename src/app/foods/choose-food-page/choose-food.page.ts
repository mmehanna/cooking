import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
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
              private modalController: ModalController) {
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

  public toggleFoodSelection(food: FoodItemBo) {
    food.isSelected = !food.isSelected;

    console.log(food);
    if (food.isSelected) {
      this.foodListId.foodListId.push(food.id);
    } else {
      this.foodListId.foodListId.pop();
    }

    console.log(this.foodListId);
  }

  public async linkFoodListToDate() {
    try {
      this.foodService.date = formatDate(this.foodService.date, 'yyyy-MM-dd', 'en-US');
      const response = await lastValueFrom(this.foodService.linkFoodListToDate(this.foodService.date, this.foodListId));

      // Log the successful response
      console.log('Successful response:', response);

    } catch (err) {
      // Log the error details, including the response body
      console.error('Error on the service:', err);
      if (err instanceof HttpErrorResponse) {
        console.error('Response body:', err.error);

        // Handle specific validation errorsds
        if (err.status === 400 && err.error && err.error.message) {
          const validationMessages = err.error.message;

          // Display validation messages to the user or handle them appropriately
          console.error('Validation Errors:', validationMessages);

          // Example: Show validation messages to the user (adjust based on your UI framework)
          // this.showErrorMessagesToUser(validationMessages);
        }
      }
    }
  }

  presentCreateFoodModal() {
    this.modalController.create({
      component: FoodDetailsModal
    }).then(modal => {
      modal.present();
    })
  }


  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}

// public toggleFoodSelection(food: FoodItemBo) {
//   food.isSelected = !food.isSelected;
//   this.foodService.setFoodFromChooseFoods(this.foodList);
//   console.log(food);
//   this.foodListId.foodListId.push(food);
// }
