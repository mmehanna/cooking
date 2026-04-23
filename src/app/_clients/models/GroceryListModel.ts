import { GroceryItemModel } from './GroceryItemModel';

export class GroceryListModel {
  id: string;
  weekStartDate: string;
  items: GroceryItemModel[];
}