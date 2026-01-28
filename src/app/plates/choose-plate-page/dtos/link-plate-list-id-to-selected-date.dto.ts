import { PlateWithMealTypeDto } from './plate-with-meal-type.dto';

export class LinkPlateListIdToSelectedDateDto {
  plateList: PlateWithMealTypeDto[] = [];

  constructor(plateList: PlateWithMealTypeDto[]) {
    this.plateList = plateList;
  }

  toJson() {
    return this.plateList;
  }
}

