export interface GroceryItemSourceModel {
  plateLabel: string;
  date: string;
  mealType?: string;
}

export interface GroceryListGroupItemModel {
  groceryItemId?: string;
  name: string;
  quantity: string;
  unit: string;
  checked: boolean;
}

export interface GroceryListGroupModel {
  plateLabel: string;
  date: string;
  mealType?: string;
  items: GroceryListGroupItemModel[];
}

export class GroceryItemModel {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  checked: boolean;
  sources?: GroceryItemSourceModel[];
}
