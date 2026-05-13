import { GroceryItemModel, GroceryListGroupModel } from './GroceryItemModel';

export class GroceryListModel {
  id: string;
  weekStartDate: string;
  items: GroceryItemModel[];
  groups?: GroceryListGroupModel[];
}
