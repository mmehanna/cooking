import {Component, OnInit} from '@angular/core';
import {FoodItemBo} from "./bos/food-item.bo";
import {FoodService} from "./services/food.service";
import {firstValueFrom, Subscription} from "rxjs";
import {FoodDetailsModal} from "./food-details-modal/food-details.modal";
import {ModalController, ToastController} from "@ionic/angular";
import {FoodModel} from "../_clients/models/food.model";

@Component({
  selector: 'app-add-foods-with-a-list-page',
  templateUrl: './foods-list.page.html',
  styleUrls: ['./foods-list.page.scss'],
})
export class FoodsListPage implements OnInit {
  private subscription$ = new Subscription();
  public foodList: FoodItemBo[];

  constructor(private foodService: FoodService,
              private modalController: ModalController,
              private toastController: ToastController
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

  public presentDetailEditFoodModal(food: FoodItemBo) {
    this.foodService.editable = true;

    this.modalController.create({
      component: FoodDetailsModal,
      componentProps: {
        foodForEdit: food
      }
    }).then(modal => {
      modal.present().then(r => {
      });
    })
  }

  public presentDetailAddFoodModal() {
    this.foodService.editable = false;

    this.modalController.create({
      component: FoodDetailsModal
    }).then(modal => {
      modal.present().then(r => {
      });
    })
  }

  public async deleteFood(food: FoodModel) {
    try {
      await firstValueFrom(this.foodService.deleteFood(food.id));
      await this.toastController.create({
        message: "Delete successful"
      });
    } catch (err: any) {
      await this.toastController.create({
        message: "Delete unsuccessful"
      });
    }
  }
}
