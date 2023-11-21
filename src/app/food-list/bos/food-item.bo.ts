import { FoodModel } from "../../_clients/models/food.model";
import { UUID } from "angular2-uuid";

export class FoodItemBo implements FoodModel {
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
