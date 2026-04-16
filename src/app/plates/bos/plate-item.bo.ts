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
  selectedMealType: 'breakfast' | 'lunch' | 'dinner' = 'dinner';
  isOwner: boolean = true;
  userId: string | null = null;

  constructor(foodModel: PLateModel & { userId?: string | null }) {
    this.id = foodModel.id;
    this.label = foodModel.label;
    this.description = foodModel.description;
    this.imgUrl = foodModel.imgUrl;
    this.category = foodModel.category;
    this.userId = foodModel.userId || null;
  }

  public setOwnership(isOwner: boolean) {
    this.isOwner = isOwner;
  }
}
