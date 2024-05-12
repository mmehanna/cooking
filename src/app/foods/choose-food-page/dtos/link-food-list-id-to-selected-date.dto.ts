export class LinkFoodListIdToSelectedDateDto {
  foodListId = [];

  constructor(foodListId: string[]) {
    this.foodListId = foodListId;
  }

  toJson() {
    return this.foodListId;
  }
}

