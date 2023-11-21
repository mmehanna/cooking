import { UUID } from "angular2-uuid";

export interface FoodModel {
  id: UUID;
  label: string;
  imgUrl: string;
  description: string;
}

