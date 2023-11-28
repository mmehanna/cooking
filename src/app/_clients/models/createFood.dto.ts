import { UUID } from "angular2-uuid";
import { FoodModel } from "./food.model";

export class createFoodDto{
  id: UUID;
  label: string;
  description: string;
  imgUrl: string;
  isSelected = false;

  constructor(foodModel : FoodModel) {
    this.id = foodModel.id;
    this.label = foodModel.label;
    this.description = foodModel.description;
    this.imgUrl = foodModel.imgUrl;
  }
}
