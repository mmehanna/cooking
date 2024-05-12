import {UUID} from "angular2-uuid";

export class FoodForCreationDto {
  id: UUID;
  label: string;
  imgUrl: string;
  description: string;

  constructor(id: UUID, label: string, imgUrl: string, description: string) {
    this.id = id;
    this.label = label;
    this.imgUrl = imgUrl;
    this.description = description;
  }
}

