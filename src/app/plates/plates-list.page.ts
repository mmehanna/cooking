import {Component, OnInit} from '@angular/core';
import {PlateItemBo} from "./bos/plate-item.bo";
import {PlateService} from "./services/plate.service";
import {firstValueFrom, Subscription} from "rxjs";
import {ModalController, ToastController} from "@ionic/angular";
import {FoodModel} from "../_clients/models/food.model";
import {PlateDetailsModal} from "./plate-details-modal/plate-details.modal";

@Component({
  selector: 'app-add-foods-with-a-list-page',
  templateUrl: './plates-list.page.html',
  styleUrls: ['./plates-list.page.scss'],
})
export class PlatesListPage implements OnInit {
  public foodList: PlateItemBo[];
  private subscription$ = new Subscription();

  constructor(private foodService: PlateService,
              private modalController: ModalController,
              private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.getFoodSubscription();
  }

  public presentDetailEditFoodModal(food: PlateItemBo) {
    this.foodService.editable = true;

    this.modalController.create({
      component: PlateDetailsModal,
      componentProps: {
        foodForEdit: food
      }
    }).then(modal => {
      modal.present().then(r => {
      });
    })
  }

  public async presentDetailAddFoodModal() {
    this.foodService.editable = false;

    await this.modalController.create({
      component: PlateDetailsModal
    }).then(modal => {
      modal.present();
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

  private getFoodSubscription() {
    const foodListSubscription$ = this.foodService
      .getFoods()
      .subscribe((foodList: PlateItemBo[]) => {
        this.foodList = foodList;
        console.log(foodList);
      });
    this.subscription$.add(foodListSubscription$);
  }
}
