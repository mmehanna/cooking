import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";

import { FoodService } from "../services/food.service";
import { FoodItemBo } from "../bos/food-item.bo";
import { IonModal } from "@ionic/angular";
import { FormBuilder, Validators } from "@angular/forms";
import { FoodModel } from "../../_clients/models/food.model";

@Component({
  templateUrl: 'choose-food.page.html',
  styleUrls: ['choose-food.page.scss'],
})

export class ChooseFoodPage implements OnInit {
  private food: FoodModel={id: "", label: "", description: "", imgUrl:""};
  @ViewChild(IonModal) modal: IonModal;
  private subscription = new Subscription();
  public foodList: FoodItemBo[];

  public foodForm = this.formBuilder.group({
    foodName: ['', Validators.required],
    foodDescription: ['', Validators.required]
  });

  constructor(private foodService: FoodService,
              private formBuilder: FormBuilder,
  ) {}

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
    this.subscription.add(foodListSubscription$);
  }

  public toggleFoodSelection(food: FoodItemBo) {
    food.isSelected = !food.isSelected;
    this.foodService.setFoodFromChooseFoods(this.foodList);
  }


  public async saveFood() {
    this.food.label = this.foodForm.get('foodName').value;
    this.food.description = this.foodForm.get('foodDescription').value;

    try {
      await this.foodService.createFood(this.food).toPromise();
      this.modal.dismiss();

    } catch (error) {
      console.error('Erreur lors de la création de l\'aliment', error);
    }
  }

}
