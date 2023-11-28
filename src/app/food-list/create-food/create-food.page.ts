import { Component } from '@angular/core';
import { FormBuilder} from "@angular/forms";

import { FoodService } from "../services/food.service";
import { createFoodDto } from "../../_clients/models/createFood.dto";
@Component({
  selector: 'app-create-food',
  templateUrl: './create-food.page.html',
  styleUrls: ['./create-food.page.scss'],
})

export class CreateFoodPage {
  private food: createFoodDto={id: "", label: "", description: "", imgUrl:"",isSelected:false};

  public foodForm = this.formBuilder.group({
    foodName: [],
    foodDescription: []
  });

  constructor(private foodService: FoodService,
              private formBuilder: FormBuilder
  ) { }

public async saveFood() {
    this.food.label = this.foodForm.get('foodName').value;
    this.food.description = this.foodForm.get('foodDescription').value;

    try {
      await this.foodService.createFood(this.food).toPromise();

    } catch (error) {
      console.error('Erreur lors de la création de l\'aliment', error);
    }
  }
}
