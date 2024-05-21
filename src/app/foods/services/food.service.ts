import {map, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";

import {FoodItemBo} from "../bos/food-item.bo";
import {FoodClient} from "../../_clients/food.client";
import {FoodModel} from "../../_clients/models/food.model";
import {listFoodsForTargetedDateModel} from "../../_clients/models/list-foods-for-targeted-date.model";
import {LinkFoodListIdToSelectedDateDto} from "../choose-food-page/dtos/link-food-list-id-to-selected-date.dto";
import {FoodForCreationDto} from "../choose-food-page/dtos/food-for-creation.dto";
import {FoodForUpdateDto} from "../choose-food-page/dtos/food-for-update.dto";

@Injectable({providedIn: 'root'})
export class FoodService {
  public food: any;
  public date: string;
  private foodListTrigger$ = new Subject();
  public editable: boolean;

  constructor(private foodClient: FoodClient) {
  }

  public refreshFoodList() {
    this.foodListTrigger$.next(null);
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

  public getFoodDetails(foodId: string): Observable<any> {
    return this.foodClient.getFoodDetails(foodId);
  }

  public linkFoodListToDate(date: string, foodListIdToSelectedDateDto: LinkFoodListIdToSelectedDateDto): Observable<string> {
    return this.foodClient.linkFoodListToDate(date, foodListIdToSelectedDateDto);
  }

  public listFoodsForTargetedDate(targetedDate: string): Observable<listFoodsForTargetedDateModel[]> {
    return this.foodClient.listFoodsForTargetedDate(targetedDate);
  }

  public createFood(foodFormValue: any): Observable<any> {
    const foodForCreationDto = new FoodForCreationDto(foodFormValue.label, foodFormValue.description);
    return this.foodClient
      .createFood(foodForCreationDto)
      .pipe(
        tap(() => {
          this.refreshFoodList();
        })
      )
  }

  public updateFoodDetails(foodId: string, foodFormValue: any): Observable<any> {
    const foodForUpdateDto = new FoodForUpdateDto(foodFormValue.label, foodFormValue.description);
    return this.foodClient.updateFoodDetails(foodId, foodForUpdateDto);
  }


  public deleteFood(foodId: string): Observable<any> {
    return this.foodClient.deleteFood(foodId).pipe(
      tap(() => {
        this.refreshFoodList();
      })
    )
  }

}


