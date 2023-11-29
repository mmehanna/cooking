import { Injectable } from "@angular/core";
import { map, Observable, startWith, Subject, switchMap, tap } from "rxjs";
import { UUID } from "angular2-uuid";

import { FoodItemBo } from "../bos/food-item.bo";
import { FoodClient } from "../../_clients/food.client";
import { FoodModel } from "../../_clients/models/food.model";

@Injectable({providedIn: 'root'})
export class FoodService {
  public foodArray: FoodItemBo[] = []
  private foodListTrigger$ = new Subject();

  constructor(private foodClient: FoodClient) {
  }

  public refreshFoodList() {
    this.foodListTrigger$.next(null);
  }

  public getFoodFromChooseFoods(): any[] {
    return this.foodArray;
  }

  public setFoodFromChooseFoods(data: any[]): void {
    this.foodArray = data;
  }

  public getFoods(): Observable<FoodItemBo[]> {
    return this.foodListTrigger$
      .pipe(
        startWith(null),
        switchMap(() => {
          return this.foodClient
            .getFoods()
            .pipe(
              map((foodModelList: FoodModel[]) => {
                return foodModelList.map(foodModel => {
                  return new FoodItemBo(foodModel);
                })
              })
            )
        })
      )
  }

  public createFood(food: FoodModel): Observable<FoodModel> {
    return this.foodClient
      .createFood(food)
      .pipe(
        tap(() =>{
          this.refreshFoodList();
        })
      )
  }

  public getFoodDetails(foodId: UUID): Observable<FoodModel> {
    return this.foodClient.getFoodDetails(foodId);
  }
}
