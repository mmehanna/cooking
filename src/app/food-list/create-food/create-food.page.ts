import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";

import { FoodModel } from "../../_clients/models/food.model";

@Component({
  selector: 'app-create-food',
  templateUrl: './create-food.page.html',
  styleUrls: ['./create-food.page.scss'],
})

export class CreateFoodPage {
  private food: FoodModel={id: "", label: "", description: "", imgUrl:""};
  public alertButtons = ['Save'];

  public foodForm = this.formBuilder.group({
    foodName: ['',Validators.required],
    foodDescription: ['',Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
  ) { }

}
