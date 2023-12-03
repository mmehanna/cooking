import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { IonModal, ModalController } from "@ionic/angular";

import { FoodModel } from "../../_clients/models/food.model";
import { FoodService } from "../services/food.service";

@Component({
  selector: 'app-create-food',
  templateUrl: './create-food.page.html',
  styleUrls: ['./create-food.page.scss'],
})

export class CreateFoodPage {
  private food: FoodModel={id: "", label: "", description: "", imgUrl:""};
  @ViewChild(IonModal) modal: IonModal;

  public foodForm = this.formBuilder.group({
    foodName: ['',Validators.required],
    foodDescription: ['',Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
              private foodService: FoodService,
              private modalController: ModalController
  ) { }
    public createFood() {
    this.food.label = this.foodForm.get('foodName').value;
    this.food.description = this.foodForm.get('foodDescription').value;

       this.foodService.createFood(this.food).toPromise();
  }

  public closeModal(){
    this.modalController.dismiss();
  }
}
