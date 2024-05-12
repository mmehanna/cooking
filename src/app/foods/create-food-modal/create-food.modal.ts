import {Component, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {IonModal, ModalController} from "@ionic/angular";

import {FoodService} from "../services/food.service";
import {FoodItemBo} from "../bos/food-item.bo";

@Component({
  selector: 'create-food-modal',
  templateUrl: './create-food.modal.html',
  styleUrls: ['./create-food.modal.scss'],
})

export class CreateFoodModal {
  @ViewChild(IonModal) modal: IonModal;
  public foodForm = this.formBuilder.group({
    foodName: ['', Validators.required],
    foodDescription: ['', Validators.required]
  });
  private food: FoodItemBo = {id: 0, label: "", description: "", imgUrl: "", isSelected: false};

  constructor(private formBuilder: FormBuilder,
              private foodService: FoodService,
              private modalController: ModalController
  ) {
  }

  public createFood() {
    this.food.label = this.foodForm.get('foodName').value;
    this.food.description = this.foodForm.get('foodDescription').value;

    this.foodService.createFood(this.food).toPromise();
  }

  public closeModal() {
    this.modalController.dismiss();
  }
}
