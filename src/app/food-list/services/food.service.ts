import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UUID } from "angular2-uuid";

import { FoodItemBo } from "../bos/food-item.bo";
import { FoodClient } from "../../_clients/food.client";
import { FoodModel } from "../../_clients/models/food.model";
import { createFoodDto } from "../../_clients/models/createFood.dto";

@Injectable({providedIn: 'root'})
export class FoodService {
  public foodArray: FoodItemBo[] = []

  constructor(private foodClient: FoodClient) {
  }

  getFoodFromChooseFoods(): any[] {
    return this.foodArray;
  }
  public setFoodFromChooseFoods(data: any[]): void {
    this.foodArray = data;
  }

  public getFoods(): Observable<FoodItemBo[]> {
    return this.foodClient
      .getFoods()
      .pipe(
        map((foodModelList: FoodModel[]) => {
          return foodModelList.map(foodModel => {
            return new FoodItemBo(foodModel);
          })
        })
      )
  }

  public createFood(food: createFoodDto):Observable<createFoodDto>{
        return this.foodClient.createFood(food);
  }

  public getFoodDetails(foodId: UUID): Observable<FoodModel> {
    return this.foodClient.getFoodDetails(foodId);
  }
}
