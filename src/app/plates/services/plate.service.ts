import {map, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";

import {PlateItemBo} from "../bos/plate-item.bo";
import {AuthClient} from "../../_clients/plate.client";
import {FoodModel} from "../../_clients/models/food.model";
import {listFoodsForTargetedDateModel} from "../../_clients/models/list-foods-for-targeted-date.model";
import {LinkPlateListIdToSelectedDateDto} from "../choose-plate-page/dtos/link-plate-list-id-to-selected-date.dto";
import {PlateForCreationDto} from "../choose-plate-page/dtos/plate-for-creation.dto";
import {PlateForUpdateDto} from "../choose-plate-page/dtos/plate-for-update.dto";


@Injectable({providedIn: 'root'})
export class PlateService {
  public food: any;
  public date: string;
  public editable: boolean;
  private foodListTrigger$ = new Subject();

  constructor(private foodClient: AuthClient) {
  }

  public refreshFoodList() {
    this.foodListTrigger$.next(null);
  }

  public getFoods(): Observable<PlateItemBo[]> {
    return this.foodListTrigger$
      .pipe(
        startWith(null),
        switchMap(() => {
          return this.foodClient
            .getFoods()
            .pipe(
              map((foodModelList: FoodModel[]) => {
                return foodModelList.map(foodModel => {
                  return new PlateItemBo(foodModel);
                })
              })
            )
        })
      )
  }

  public getFoodDetails(foodId: string): Observable<any> {
    return this.foodClient.getFoodDetails(foodId);
  }

  public linkFoodListToDate(date: string, foodListIdToSelectedDateDto: LinkPlateListIdToSelectedDateDto): Observable<string> {
    return this.foodClient.linkFoodListToDate(date, foodListIdToSelectedDateDto);
  }

  public listFoodsForTargetedDate(targetedDate: string): Observable<listFoodsForTargetedDateModel[]> {
    return this.foodClient.listFoodsForTargetedDate(targetedDate);
  }

  public createFood(foodFormValue: any): Observable<any> {
    const foodForCreationDto = new PlateForCreationDto(foodFormValue.label, foodFormValue.description);
    return this.foodClient
      .createFood(foodForCreationDto)
      .pipe(
        tap(() => {
          this.refreshFoodList();
        })
      )
  }

  public updateFoodDetails(foodId: string, foodFormValue: any): Observable<any> {
    const foodForUpdateDto = new PlateForUpdateDto(foodFormValue.label, foodFormValue.description);
    return this.foodClient.updateFoodDetails(foodId, foodForUpdateDto);
  }


  public deleteFood(foodId: string): Observable<any> {
    return this.foodClient.deleteFood(foodId).pipe(
      tap(() => {
        this.refreshFoodList();
      })
    )
  }

  public getPlates(): Observable<any> {
    return this.foodClient.getPlates();
  }

}


