import { IngredientModel } from './IngredientModel';

export class PLateModel {
  id: string;
  label: string;
  description: string;
  steps?: string;
  imgUrl: string;
  isSelected = false;
  category: string;
  ingredients?: IngredientModel[];
}
