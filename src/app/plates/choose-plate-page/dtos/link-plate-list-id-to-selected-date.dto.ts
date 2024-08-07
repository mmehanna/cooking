export class LinkPlateListIdToSelectedDateDto {
  plateListId = [];

  constructor(foodListId: string[]) {
    this.plateListId = foodListId;
  }

  toJson() {
    return this.plateListId;
  }
}

