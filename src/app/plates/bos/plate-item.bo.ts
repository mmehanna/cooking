import {PLateModel} from "../../_clients/models/PLateModel";

export class PlateItemBo implements PLateModel {
  id: string;
  label: string;
  description: string;
  imgUrl: string;
  isSelected: boolean = false;
  date: string;
  name: string;
  category: string;

  constructor(foodModel: PLateModel) {
    this.id = foodModel.id;
    this.label = foodModel.label;
    this.description = foodModel.description;
    this.imgUrl = foodModel.imgUrl;
    this.category = foodModel.category;
  }
}
