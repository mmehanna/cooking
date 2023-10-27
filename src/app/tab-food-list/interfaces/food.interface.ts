import { UUID } from "angular2-uuid";
import { FoodDetailsInterface } from "./food-details.interface";

export interface FoodInterface {
  id: UUID,
  label: string;
  isSelected: boolean;
  details: FoodDetailsInterface
}

