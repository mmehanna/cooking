import {map, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {UUID} from "angular2-uuid";

import {FoodItemBo} from "../bos/food-item.bo";
import {FoodClient} from "../../_clients/food.client";
import {FoodModel} from "../../_clients/models/food.model";
import {listFoodsForTargetedDateModel} from "../../_clients/models/list-foods-for-targeted-date.model";
import {LinkFoodListIdToSelectedDateDto} from "../choose-food-page/dtos/link-food-list-id-to-selected-date.dto";
import {FoodForCreationDto} from "../choose-food-page/dtos/food-for-creation.dto";

@Injectable({providedIn: 'root'})
export class FoodService {
  public foodArray: FoodItemBo[] = []
  public food: any;
  public date: string;
  private foodListTrigger$ = new Subject();

  constructor(private foodClient: FoodClient) {
  }

  public refreshFoodList() {
    this.foodListTrigger$.next(null);
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

  public linkFoodListToDate(date: string, foodListIdToSelectedDateDto: LinkFoodListIdToSelectedDateDto): Observable<string> {
    return this.foodClient.linkFoodListToDate(date, foodListIdToSelectedDateDto);
  }

  public listFoodsForTargetedDate(targetedDate: string): Observable<listFoodsForTargetedDateModel[]> {
    return this.foodClient.listFoodsForTargetedDate(targetedDate);
  }

  public createFood(food: FoodForCreationDto): Observable<FoodForCreationDto> {
    return this.foodClient
      .createFood(food)
      .pipe(
        tap(() => {
          this.refreshFoodList();
        })
      )
  }

  public getFoodDetails(foodId: UUID): Observable<FoodForCreationDto> {
    return this.foodClient.getFoodDetails(foodId);
  }

}


