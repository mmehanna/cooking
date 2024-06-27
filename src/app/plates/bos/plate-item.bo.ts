import {FoodModel} from "../../_clients/models/food.model";

export class PlateItemBo implements FoodModel {
  id: string;
  label: string;
  description: string;
  imgUrl: string;
  isSelected: boolean = false;

  constructor(foodModel: FoodModel) {
    this.id = foodModel.id;
    this.label = foodModel.label;
    this.description = foodModel.description;
    this.imgUrl = foodModel.imgUrl;
  }
}
