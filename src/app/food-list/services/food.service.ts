import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { UUID } from "angular2-uuid";
import { FoodClient } from "../../_clients/food.client";
import { FoodItemBo } from "../bos/food-item.bo";
import { FoodModel } from "../../_clients/models/food.model";

@Injectable({providedIn: 'root'})
export class FoodService {
    constructor(private foodClient: FoodClient) {}

    public getFoods(): Observable<FoodItemBo[]> {
        return this.foodClient
          .getFoods()
          .pipe(
            map((foodModelList: FoodModel[])=> {
              return foodModelList.map(foodModel => {
                return new FoodItemBo(foodModel);
              })
            })
          )
    }

    public getFoodDetails(foodId: UUID): Observable<FoodModel> {
        return this.foodClient.getFoodDetails(foodId);
    }

    public toggleFoodSelection(foodId: UUID) {
        const currentFood = this.getFoodDetails(foodId);
        if (!currentFood) {
            return;
        }
    //   currentFood.isSelected = !currentFood.isSelected;
    }
}
